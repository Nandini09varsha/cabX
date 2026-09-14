export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Server error",
  });
}

export function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}
