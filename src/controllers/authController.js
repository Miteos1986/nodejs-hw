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

  const newSession = await createSession(expectedUser._id);

  //console.log('USER:', expectedUser);
  //console.log('SESSION:', newSession);

  setSessionCookies(res, newSession);

  res.status(200).json(expectedUser);
};

export const logoutUser = async (req, res) => {
  //console.log(req.cookies);
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.findOneAndDelete({ _id: sessionId });
  }

  res.clearCookie('sessionId', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};
