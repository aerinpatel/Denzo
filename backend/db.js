const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;
// mongoose.connect("mongodb+srv://aerinpatel:aerin1213@cluster0.iqpmi.mongodb.net/denzo", {
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
  date: Date,
  priority: String,
  user: {
    type: ObjectId,
    ref: 'User',
  },
});

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);

module.exports = { User, Todo };