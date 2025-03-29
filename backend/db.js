const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  namak: String
});

const todoSchema = new Schema({
  title: String,
  status: String,
  date: String,
  priority: String,
  user: {
    type: ObjectId,
    ref: 'User',
  },
});

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);

module.exports = { User, Todo };