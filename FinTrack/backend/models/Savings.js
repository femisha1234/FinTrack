const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
