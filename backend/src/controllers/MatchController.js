const Match = require("../models/Match");

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    const matchs = await Match.find({ user });

    return res.json(matchs);
  },

  async delete(req, res) {
    const { user } = req.headers;
    const { matchUser } = req.params;

    await Match.find({ user, matchUser })
      .remove()
      .exec();

    return res.json();
  }
};
