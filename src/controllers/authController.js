import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const expectedUser = await User.findOne({ email });

  if (expectedUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  const session = await createSession(user._id);

  //console.log('USER:', user);
  //console.log('SESSION:', session);

  setSessionCookies(res, session);

  res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const expectedUser = await User.findOne({ email });
  if (!expectedUser) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const comparedPassword = await bcrypt.compare(
    password,
    expectedUser.password,
  );
  if (!comparedPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.findOneAndDelete({ userId: expectedUser._id });

  const session = await createSession(expectedUser._id);

  console.log('USER:', expectedUser);
  console.log('SESSION:', session);

  setSessionCookies(res, session);

  res.status(200).json(expectedUser);
};
