import { Router } from "express";
import usersRoutes from "./users.routes.js";
import movieNotesRoutes from "./movie.notes.routes.js";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use('/movieNotes', movieNotesRoutes)

export default routes;
