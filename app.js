const path = require("node:path");
const express = require("express");
const pool = require("./db/pool");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const LocalStrategy = require("passport-local").Strategy;
const indexRouter = require("./routes/indexRouter");
const bcrypt = require("bcryptjs");
const db = require("./db/queries");

// Initiate main express app
const app = express();

// Use EJS as views engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static assets handling
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Initiate session
app.use(
    session({
        store: new pgSession({
            pool: pool,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    })
);

// Initiate passport
app.use(passport.session());

// Allow using routes
app.use(express.urlencoded({ extended: false }));

// Routers
app.use("/", indexRouter);

// Authentication
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await db.getUser(username);

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserId(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Live app in localhost
app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("app listening on port 3000!");
});
