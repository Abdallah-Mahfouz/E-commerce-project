export const globalError = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ msg: "error", err: err.message, stack: err.stack });

  next();
};
