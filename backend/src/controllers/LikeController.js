const Dev = require("../models/Dev");
const Match = require("../models/Match");

module.exports = {
  async store(req, res) {
    const { user } = req.headers;
    const { devId } = req.params;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      return res.status(400).json({ error: "Dev not exists" });
    }

    if (targetDev.likes.includes(user)) {
      const loggedSocket = req.connectedUsers[user];
      const targetSocket = req.connectedUsers[devId];

      if (loggedSocket) {
        req.io.to(loggedSocket).emit("match", targetDev);

        await Match.create({
          user,
          matchUser: devId,
          how_machteu_me: JSON.stringify(targetDev)
        });
      }
      if (targetSocket) {
        req.io.to(targetSocket).emit("match", loggedDev);

        await Match.create({
          user: devId,
          matchUser: user,
          how_machteu_me: JSON.stringify(loggedDev)
        });
      }
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
