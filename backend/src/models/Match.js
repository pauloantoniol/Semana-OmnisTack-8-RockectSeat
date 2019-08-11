const { Schema, model } = require("mongoose");

const DevSchema = new Schema(
  {
    user: {
      type: String,
      required: true
    },
    matchUser: {
      type: String,
      required: true
    },
    how_machteu_me: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Match", DevSchema);
