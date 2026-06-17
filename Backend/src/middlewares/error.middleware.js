const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Server error",
  });
};

export default errorHandler;