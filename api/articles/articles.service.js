const Article = require("./articles.schema");

class ArticlesService {
  //   getAll() {
  //     return Article.find();
  //   }
  async getAllByUserId(userId) {
    return await Article.find({ user: userId }).populate("user", "-password");
  }

  create(data) {
    const article = new Article(data);
    return article.save();
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id) {
    return Article.deleteOne({ _id: id });
  }
}

module.exports = new ArticlesService();
