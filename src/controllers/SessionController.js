import knexConnect from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export class SessionController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knexConnect("users");

    return response.json({ user });
  }
}

export default SessionController;
