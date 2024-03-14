import { Router } from "express";
import usersRoutes from "./users.routes.js";
import movieNotesRoutes from "./movie.notes.routes.js";
import sessionRoutes from "./session.routes.js";

const routes = Router();
routes.use("/users", usersRoutes);
routes.use("/movie-notes", movieNotesRoutes);
routes.use("/session", sessionRoutes);

export default routes;
