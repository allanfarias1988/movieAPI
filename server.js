import "express-async-errors";
import express from "express";
import AppError from "./src/utils/AppError.js";
import routes from "./src/routes/index.js";

const app = express();

app.use(express.json());
app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error...",
  });
});

app.listen(3333);
