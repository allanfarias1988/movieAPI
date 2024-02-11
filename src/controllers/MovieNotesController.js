import AppError from "../utils/AppError.js";
import knexConnect from "../database/knex/index.js";

class MovieNotesController {
  async index(req, res) {
    const { user_id } = req.query;

    if (!user_id) {
      throw new AppError("Please, enter user ID", 400);
    }

    const allNotes = await knexConnect("movieNotes").where({ user_id });

    if (!allNotes) {
      return res.json("List of empty notes.");
    }

    return res.json(allNotes);
  }

  async create(req, res) {
    const { title, description, rating, tags } = req.body;
    const { user_id } = req.params;

    if (!title || !description || !rating || !tags) {
      throw new AppError("Please, enter all fields", 400);
    }

    const movieNotes = { title, description, rating, user_id };

    const [note_id] = await knexConnect("movieNotes").insert(movieNotes);

    const movieTags = tags.map((name) => {
      return {
        note_id,
        user_id,
        name,
      };
    });

    await knexConnect("movieTags").insert(movieTags);

    res.status(201).json({ message: "Movie note created successful" });
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      throw new AppError("Please, enter note ID", 400);
    }

    const [note] = await knexConnect("movieNotes").where({ id });

    if (!note) {
      throw new AppError("Movie note not found", 404);
    }

    const noteWidthTags = await knexConnect("movieTags")
      .where({ note_id: id })
      .orderBy("name");

    res.status(200).json(noteWidthTags);
  }

  async delete(req, res) {
    const { id } = req.query;

    if (!id) {
      throw new AppError("Please, enter note ID", 400);
    }

    const [note_id] = await knexConnect("movieNotes").where({ id });

    if (!note_id) {
      throw new AppError("Movie note not found", 404);
    }

    await knexConnect("movieNotes").where({ id }).delete();

    res.status(200).json({ message: "Movie note deleted successful" });
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, description, rating } = req.body;

    if (!id) {
      throw new AppError("Please, enter note ID", 400);
    }

    const isValidId = isNaN(Number(id));

    if (isValidId) {
      throw new AppError("Please, enter a valid ID", 400);
    }

    const [note] = await knexConnect("movieNotes").where({ id });

    if (!note) {
      throw new AppError("Movie note not found", 404);
    }

    await knexConnect("movieNotes")
      .where({ id })
      .update({
        title: title ? title : note.title,
        description: description ? description : note.description,
        rating: rating ? rating : note.rating,
      });

    res.status(200).json({ message: "Movie note updated successful" });
  }
}

export default MovieNotesController;
