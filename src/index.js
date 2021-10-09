const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const expressLayouts=require('express-ejs-layouts')
const connectDB = require('../config/connection')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

//load env variables
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

const app = express()

//Passport Config
require("../config/passport")(passport);

// Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates");

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", viewsPath);
app.set("view options", { layout: false });

//Set Public Folder
app.use(express.static(publicDirPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//Express Session
app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Variable
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

//Router
app.use("/app", require("./routes/app"));



const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.ENV} mode on port ${process.env.PORT}`
  );
});

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
