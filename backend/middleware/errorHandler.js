export const errorHandler = (err, _req, res, _next) => {
  console.error('ERROR_HANDLER', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong',
    data: {},
  });
};
