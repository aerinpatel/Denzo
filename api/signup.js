import { userSchema } from '../backend/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import dbConnect from '../backend/mongooseConnect';

const userSchemaValidation = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  username: z.string().min(1)
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  await dbConnect();
  const result = userSchemaValidation.safeParse(req.body);
  if (!result.success) {
    res.status(400).send('fail');
    return;
  }
  const { username, email, password } = req.body;
  const salt = await bcrypt.genSalt(5);
  const hashedPassword = await bcrypt.hash(password, salt);

  await userSchema.create({
    name: username,
    email,
    password: hashedPassword,
    namak: salt,
  });
  res.status(200).send('success');
}
