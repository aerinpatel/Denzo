import { userSchema } from '../backend/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../backend/mongooseConnect';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  await dbConnect();
  const { username, email, password } = req.body;
  const response = await userSchema.findOne({ email });
  if (!response) {
    res.status(400).send('user not found');
    return;
  }
  const match = await bcrypt.compare(password, response.password);
  if (!match) {
    res.status(400).send('Password incorrect');
    return;
  }
  const token = jwt.sign({ _id: response._id }, JWT_SECRET);
  res.status(200).json({ token, username });
}
