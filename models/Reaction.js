const { Schema, Types } = require('mongoose');


// Schema to create a course model
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
  },
    reactionBody: {
      type: String,
      required: true,
      max_length: 280,
  },
    username: {
      type: String,
      required: true,
  },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
      //get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a'),
  }
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

module.exports = reactionSchema;


