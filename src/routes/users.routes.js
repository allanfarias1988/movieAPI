import { Router } from "express";
import UserController from "../controllers/UsersController.js";

const usersRoutes = Router();
const userController = new UserController();

usersRoutes.get("/", userController.index);
usersRoutes.get("/:id", userController.show);
usersRoutes.post("/", userController.create);
usersRoutes.put("/:id", userController.update);
usersRoutes.delete("/:id", userController.delete);

export default usersRoutes;
