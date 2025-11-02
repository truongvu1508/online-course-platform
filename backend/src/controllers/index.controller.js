/**
 * Controllers folder
 * Place your route controllers here
 */

export const healthCheck = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
};
