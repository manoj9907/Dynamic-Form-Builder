const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err.message); // Log error for debugging

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    details: err.details || null,
  });
};

module.exports = errorMiddleware;
