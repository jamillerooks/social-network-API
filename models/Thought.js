const { Schema, model, Types } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
  {
    thoughtId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      max_length: 280
      
    },
 
    createdAt: {
      type: Date,
      default: Date.now,
      //get: createdAtVal => dateFormat(createdAtVal)
  
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema]
  
  },
    
  
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
