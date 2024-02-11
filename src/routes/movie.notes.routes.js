import { Router } from "express";
import MovieNotesController from "../controllers/MovieNotesController.js";

const movieNotesRoutes = Router();
const movieNotesController = new MovieNotesController();

movieNotesRoutes.post("/:user_id", movieNotesController.create);
movieNotesRoutes.get("/:id", movieNotesController.show);
movieNotesRoutes.get("/", movieNotesController.index);
movieNotesRoutes.put("/:id", movieNotesController.update);
movieNotesRoutes.delete("/:user_id", movieNotesController.delete);

export default movieNotesRoutes;
