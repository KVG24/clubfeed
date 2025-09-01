const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const indexRouter = require("./routes/indexRouter");

// Initiate main express app
const app = express();

// Use EJS as views engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Initiate session
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));

// Initiate passport
app.use(passport.session());

// Allow using routes
app.use(express.urlencoded({ extended: false }));

// Routers
app.use("/", indexRouter);

// Live app in localhost
app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("app listening on port 3000!");
});
