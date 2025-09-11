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
router.post("/clubs/create", indexController.createClub);
router.post("/clubs/delete/:id", indexController.deleteClub);
router.get("/clubs/:id", indexController.renderSelectedClub);
router.post("/clubs/join/:id", indexController.joinClub);
router.post("/clubs/:id/post-message", indexController.postMessage);
router.post(
    "/clubs/:club_id/delete-message/:message_id",
    indexController.deleteMessage
);

module.exports = router;
