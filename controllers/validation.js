const { body } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 50 characters.";

const validateSignUp = [
    body("firstName")
        .trim()
        .isAlpha()
        .withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 50 })
        .withMessage(`First name ${lengthErr}`)
        .escape(),
    body("lastName")
        .trim()
        .isAlpha()
        .withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 50 })
        .withMessage(`Last name ${lengthErr}`)
        .escape(),
    body("username")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage(`Username ${lengthErr}`)
        .escape(),
    body("password")
        .trim()
        .isLength({ min: 5, max: 255 })
        .withMessage("Password should be minimum 5 characters"),
    body("passwordConfirmation")
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage("Confirmation password don't match"),
    body("email").isEmail().withMessage("Incorrect email format").escape(),
];

module.exports = {
    validateSignUp,
};
