import AppError from "../utils/AppError.js";
import knexConnect from "../database/knex/index.js";
import { hash, compare } from "bcrypt";
import { v4 as uuid, validate as isUUID } from "uuid";

class UsersController {
  async index(req, res) {
    const users = await knexConnect("users");

    if (!users) {
      res.json({ message: "List of empty users" });
    }
    res.json(users);
  }

  async create(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Enter all information!", 400);
    }

    const [checkUserExist] = await knexConnect("users").where(
      "email",
      "=",
      email
    );

    if (checkUserExist) {
      throw new AppError("Sorry, this email already in use", 400);
    }

    const user_uuid = uuid();
    const encryptedPassword = await hash(password, 8);

    const user = {
      uuid: user_uuid,
      name,
      email,
      password: encryptedPassword,
    };

    await knexConnect("users").insert(user);
    res.status(201).json({ message: "User created successful!" });
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      throw new AppError("Please enter your user ID!");
    }

    const [user] = await knexConnect("users").where("uuid", "=", id);

    if (!user) {
      throw new AppError("Sorry, user not found!", 400);
    }

    res.json(user);
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, email, password, old_password } = req.body;

    if (!isUUID(id)) {
      throw new AppError("Invalid user ID!", 404);
    }

    if (!name) {
      throw new AppError("Please enter with your name", 400);
    }

    if (!email) {
      throw new AppError("Please enter with valid e-mail", 400);
    }

    const [dbUser] = await knexConnect("users").where("uuid", "=", id);
    const [dbUserEmail] = await knexConnect("users").where("email", "=", email);

    if (!dbUser) {
      throw new AppError("User not found!", 404);
    }

    if (dbUserEmail && dbUserEmail.uuid != id) {
      throw new AppError("Sorry, this e-mail is already in use!", 400);
    }

    const checkPassword = await compare(old_password, dbUser.password);

    if (!checkPassword) {
      throw new AppError("Please, check your old password", 400);
    }

    const encryptedPassword = await hash(password, 8);

    await knexConnect("users").where("uuid", "=", id).update({
      name,
      email,
      password: encryptedPassword,
    });

    res.json({ message: "User updated successful!" });
  }

  async delete(req, res) {
    const { id } = req.params;
    const { email, password } = req.body;

    if (!isUUID(id)) {
      throw new AppError("Invalid user ID!", 400);
    }

    if (!email || !password) {
      throw new AppError("Please enter your email and password", 400);
    }

    const [user] = await knexConnect("users").where("uuid", "=", id);

    if (!user) {
      throw new AppError("User not found!", 400);
    }

    const checkEmail = user.email == email;
    const checkPassword = await compare(password, user.password);
    const checkUserID = (user.id = id);

    if (!checkEmail || !checkPassword || !checkUserID) {
      throw new AppError("Please, correct your data", 400);
    }

    await knexConnect("users").where("uuid", "=", user.id).delete();
    res.json({ message: "User deleted successful!" });
  }
}

export default UsersController;
