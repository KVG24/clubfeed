const pool = require("../db/pool");
const { validateSignUp } = require("../controllers/validation");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

function renderIndex(req, res) {
    res.render("index");
}

function renderSignUp(req, res) {
    res.render("sign-up", { errors: null });
}

const registerUser = [
    ...validateSignUp,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render("sign-up", {
                    errors: errors.array(),
                });
            }
            const isAdmin =
                req.body.adminPassword === process.env.ADMIN_PASSWORD;
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await pool.query(
                "INSERT INTO users (first_name, last_name, username, password, email, is_Admin) VALUES ($1, $2, $3, $4, $5, $6)",
                [
                    req.body.firstName,
                    req.body.lastName,
                    req.body.username,
                    hashedPassword,
                    req.body.email,
                    isAdmin,
                ]
            );
            res.redirect("/");
        } catch (err) {
            console.error(err);
            next(err);
        }
    },
];

module.exports = {
    renderIndex,
    renderSignUp,
    registerUser,
};
