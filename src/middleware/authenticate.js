import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    throw createHttpError(401, 'Missing access token');
  }

  const expectedSession = await Session.findOne({
    accessToken: req.cookies.accessToken,
  });

  if (!expectedSession) {
    throw createHttpError(401, 'Session not found');
  }

  const isAccessTokenExpiried =
    new Date() > new Date(expectedSession.accessTokenValidUntil);

  if (isAccessTokenExpiried) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = await User.findById(expectedSession.userId);
  console.log(user);

  if (!user) {
    throw createHttpError(401);
  }
  req.user = user;
  console.log('req.user:', req.user);

  next();
};
