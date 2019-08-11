const express = require("express");
const DevController = require("./controllers/DevController");
const MatchController = require("./controllers/MatchController");
const LikeController = require("./controllers/LikeController");
const DislikeController = require("./controllers/DislikeController");

const routes = express.Router();

routes.get("/devs", DevController.index);
routes.post("/devs", DevController.store);
routes.post("/devs/:devId/likes", LikeController.store);
routes.post("/devs/:devId/dislikes", DislikeController.store);

routes.get("/matchs", MatchController.index);
routes.delete("/matchs/:matchUser", MatchController.delete);

module.exports = routes;
