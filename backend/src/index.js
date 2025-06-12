import express from "express";
import authRoutes from "./routes/auth.route.js";
const app = express();

app.use("/api/auth", authRoutes)

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
  
});
