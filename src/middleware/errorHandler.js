export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NOTE_ENV === 'production';

  const status = err.status || 500;
  res.status(status).json({
    message: isProd
      ? 'Something went wrong. Please try again later'
      : err.message,
  });
};
