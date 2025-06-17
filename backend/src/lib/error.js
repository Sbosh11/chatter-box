export const handleError = (res, error) => {
  console.error("Error:", error);
  res.status(500).json({ message: "Internal server error" });
};
