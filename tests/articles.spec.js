const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const articlesSchema = require("../api/articles/articles.schema");

describe("tester API articles", () => {
  let token;
  let adminToken;
  const USER_ID = "fake";
  const ADMIN_ID = "pif";

  const MOCK_DATA_CREATED = {
    title: "test",
    content: "ceci est le contenu d'un article test",
    user: USER_ID,
  };
  const MOCK_DATA_UPDATED = {
    title: "test modifié",
    content: "ceci est le contenu modifié d'un article test",
    user: USER_ID,
  };

  beforeEach(() => {
    token = jwt.sign(
      { userId: USER_ID, role: "member" },
      config.secretJwtToken
    );
    adminToken = jwt.sign(
      { userId: ADMIN_ID, role: "admin" },
      config.secretJwtToken
    );
    // mongoose.Query.prototype.find = jest.fn().mockResolvedValue(MOCK_DATA);
    mockingoose(articlesSchema).toReturn(MOCK_DATA_CREATED, "save");
    mockingoose(articlesSchema).toReturn(
      MOCK_DATA_UPDATED,
      "findByIdAndUpdate"
    );
    mockingoose(articlesSchema).toReturn({}, "deleteOne");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });
  test("[Articles] Update Article", async () => {
    const createRes = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    const res = await request(app)
      .put(`/api/articles/${createRes.body._id}`)
      .send(MOCK_DATA_UPDATED)
      .set("x-access-token", token);
    expect(res.status).toBe(401);
  });
  test("[Articles] Update Article with admin", async () => {
    const createRes = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    const res = await request(app)
      .put(`/api/articles/${createRes.body._id}`)
      .send(MOCK_DATA_UPDATED)
      .set("x-access-token", adminToken);
    expect(res.status).toBe(200);
  });

  test("[Articles] Delete Article", async () => {
    const createRes = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    const res = await request(app)
      .delete(`/api/articles/${createRes.body._id}`)
      .set("x-access-token", token);
    expect(res.status).toBe(401);
  });
  test("[Articles] Delete Article with admin", async () => {
    const createRes = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    const res = await request(app)
      .delete(`/api/articles/${createRes.body._id}`)
      .set("x-access-token", adminToken);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
