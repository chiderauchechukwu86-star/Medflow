const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({ message: `Duplicate value for field: ${field}` });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ID: ${err.value}` });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
};

module.exports = { notFound, errorHandler };
