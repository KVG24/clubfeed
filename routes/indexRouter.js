const { Router } = require("express");
const indexController = require("../controllers/indexController");
const { validateSignUp } = require("../controllers/validation");

const router = Router();

router.get("/", indexController.renderIndex);
router.get("/sign-up", indexController.renderSignUp);
router.post("/sign-up", validateSignUp, indexController.registerUser);
router.get("/log-in", indexController.renderLogIn);
router.post("/log-in", indexController.logIn);
router.get("/log-out", indexController.logOut);
router.get("/clubs", indexController.renderClubs);
router.post("/create-club", indexController.createClub);
router.get("/clubs/:id", indexController.renderSelectedClub);

module.exports = router;
