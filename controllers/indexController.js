const pool = require("../db/pool");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = require("../db/queries");

function renderIndex(req, res) {
    res.render("index", { user: req.user });
}

function renderSignUp(req, res) {
    res.render("sign-up", { errors: null });
}

function renderLogIn(req, res) {
    res.render("log-in", { errors: null });
}

async function renderClubs(req, res) {
    const clubs = await db.getClubs();
    res.render("clubs", { clubs, user: req.user, error: false });
}

async function renderSelectedClub(req, res) {
    const club = await db.getClubById(req.params.id);
    const messages = await db.getClubMessages(req.params.id);
    res.render("club-page", { club, messages });
}

async function createClub(req, res, next) {
    const hashedPassword = await bcrypt.hash(req.body.clubPassword, 10);
    await db.createClub(req.body.clubName, hashedPassword, req.user.user_id);
    res.redirect("/clubs");
}

async function joinClub(req, res) {
    const clubPassword = await db.getClubPassword(req.params.id);
    const result = await bcrypt.compare(
        req.body.clubPasswordJoin,
        clubPassword
    );

    if (result) {
        await db.registerMembership(req.user.user_id, req.params.id);
        return res.redirect(`/clubs/${req.params.id}`);
    }

    const clubs = await db.getClubs();
    return res.render("clubs", {
        clubs,
        user: req.user,
        error: "Wrong password",
    });
}

async function registerUser(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("sign-up", {
                errors: errors.array(),
            });
        }
        const isAdmin = req.body.adminPassword === process.env.ADMIN_PASSWORD;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await db.registerUser(
            req.body.firstName,
            req.body.lastName,
            req.body.username,
            hashedPassword,
            req.body.email,
            isAdmin
        );
        res.redirect("/log-in");
    } catch (err) {
        console.error(err);
        next(err);
    }
}

function logIn(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/clubs",
        failureRedirect: "/log-in",
    })(req, res, next);
}

function logOut(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

module.exports = {
    renderIndex,
    renderSignUp,
    renderLogIn,
    renderClubs,
    renderSelectedClub,
    createClub,
    joinClub,
    registerUser,
    logIn,
    logOut,
};
