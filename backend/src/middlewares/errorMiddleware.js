export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(`[Error] ${statusCode}: ${message}`);
  
  res.status(statusCode).json({ 
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: "Route not found" });
};