const { Router } = require("express");
const indexController = require("../controllers/indexController");

const router = Router();

router.get("/", indexController.renderIndex);
router.get("/sign-up", indexController.renderSignUp);
router.post("/sign-up", ...indexController.registerUser);

module.exports = router;
