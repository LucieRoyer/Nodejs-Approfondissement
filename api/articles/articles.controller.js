const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res, next) {
    try {
      req.body.user = req.user.id;
      const article = await articlesService.create(req.body);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;

      if (req.user.role !== "admin") {
        throw new UnauthorizedError();
      }
      const articleModified = await articlesService.update(id, data);
      res.json(articleModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const id = req.params.id;

      if (req.user.role !== "admin") {
        throw new UnauthorizedError();
      }
      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
