const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app/app");
const endpointsJSON = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  db.end();
});

describe("NC News API testing", () => {
  describe("GET/api/topics", () => {
    test("returns an array of topics with the properties of slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test("404 error with custom message following user inputting incorrect endpoint url", () => {
      return request(app)
        .get("/api/topisc")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("URL not found");
        });
    });
    describe("GET/api/info", () => {
      test("Returns a json representation of all the endpoints within the api ", () => {
        return request(app)
          .get("/api/")
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(endpointsJSON);
          });
      });
    });
  });
  describe("/api/articles/:article_id", () => {
    test("return correct article when passed an article id ", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "11",
          });
          expect(Object.keys(body.articles)).toHaveLength(9);
        });
    });
    test("for articles with invalid ids we should expect a 404 error", () => {
      return request(app)
        .get("/api/articles/4311462")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
  });
  describe("api/articles", () => {
    test("returns an array of articles with the appropriates", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(13);
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                article_img_url: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                title: expect.any(String),
                topic: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    describe("QUERY/api/articles", () => {
      test("return filter the topic by specified query in this case...only cat topics allowed! ", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then((response) => {
            const articles = response.body.articles;
            expect(articles.length).toBe(1);
            articles.forEach((article) => {
              expect(article.topic).toBe("cats");
            });
          });
      });
      test("sort articles by article id in descending order  ", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("article_id", { descending: true });
          });
      });
      test("be able to specify an article order i.e ascending or descending ", () => {
        return request(app)
          .get("/api/articles?topic=mitch&&sort_by=article_id&&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("article_id", { descending: false });
          });
      });
      test("return 'Query request invalid!' for invalid sort by", () => {
        return request(app)
          .get("/api/articles?sort_by=banana")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Query request is invalid.");
          });
      });
      test("return 'Query request invalid!' for invalid order", () => {
        return request(app)
          .get("/api/articles?order=Goku")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Query request is invalid.");
          });
      });
    });
    test("data should sorted by the date it was created in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ descending: true });
        });
    });
    test("comment count should be different according to the total comments in any given article ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[5].comment_count).toBe("2");
          expect(articles[articles.length - 1].comment_count).toBe("0");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("returns an array of comments with appropriate properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0]).toEqual({
            article_id: 1,
            author: "icellusedkars",
            body: "I hate streaming noses",
            comment_id: 5,
            created_at: "2020-11-03T21:00:00.000Z",
            votes: 0,
          });
        });
    });
    test("comments should return the most recent one first ", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).not.toEqual({
            author: "butter_bridge",
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            comment_id: 2,
            created_at: "2020-10-31T03:03:00.000Z",
            votes: 14,
          });
        });
    });
    test("404 error for endpoint request to non existent articles ", () => {
      return request(app)
        .get("/api/articles/98/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
    test("200 status with an empty array when article exists but has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("400 error for invalid article ID (e.g., 'banana')", () => {
      return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    const newComment = { username: "icellusedkars", body: "It's snowing!" };
    test("returns posted comment with username and body", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.newComment).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              comment_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    test("returns bad request and the status code 400 for usernames not already in the database", () => {
      const newComment = {
        username: "Jacob4181",
        body: "Just let me comment plss",
      };
      return request(app)
        .post(`/api/articles/2/comments`)
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("returns 'Article not found' and the status code 404 for comments made to non existent articles", () => {
      const newComment = {
        username: "Jacob4181",
        body: "Yeah man I love article 5256261",
      };
      return request(app)
        .post(`/api/articles/5256261/comments`)
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article not found");
        });
    });
    test("returns 'Bad request' for comments with wrong keys i.e not username/body", () => {
      const newComment = {
        profilename: "KotlinFan101",
        torso: "Hi hi hi hi ",
      };
      return request(app)
        .post(`/api/articles/2/comments`)
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("returns 'Bad request' when an empty object is sent through", () => {
      return request(app)
        .post(`/api/articles/2/comments`)
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
  });
  describe("PATCH/api/articles/:article_id", () => {
    test("updates article with correct vote count incremented by 100 ", () => {
      const votes = { inc_votes: 100 };
      return request(app)
        .patch("/api/articles/1")
        .send(votes)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            article: [
              {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 200,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              },
            ],
          });
        });
    });
    test("updates article with correct vote count decremented by 73 ", () => {
      const votes = { inc_votes: -73 };
      return request(app)
        .patch("/api/articles/1")
        .send(votes)
        .expect(200)
        .then((response) => {
          const articleTest = response.body.article;
          articleTest.forEach((element) => {
            expect(element.votes).toBe(27);
          });
        });
    });
    test("returns 'Bad request' for incorrect body requests", () => {
      return request(app)
        .patch(`/api/articles/1`)
        .send({ test_votes: false })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("returns 'Article not found' and the status code 404 for articles not in the database", () => {
      return request(app)
        .patch(`/api/articles/42152`)
        .send({ inc_votes: 20 })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("article not found");
        });
    });
    test("returns 'Bad Request' and the status code 400 for an invalid paths", () => {
      return request(app)
        .patch(`/api/articles/banana`)
        .send({ inc_votes: 20 })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });
  describe("DELETE/api/comments/id", () => {
    test("deletes the comment when given and id and responds with status 204", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((response) => {
          expect(response.noContent).toBe(true);
        });
    });
    test("after a comment is deleted we should expect a 404 error code as the comment shouldn't exist", () => {
      return request(app)
        .get("/api/comments/1")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("URL not found");
        });
    });
    test("returns 'Comment not found' when you try to delete a non existent comment", () => {
      return request(app)
        .delete("/api/comments/412")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(`Comment 412 was not found`);
        });
    });
    test("returns 'Bad Request' when trying to delete with a word instead of a number", () => {
      return request(app)
        .delete("/api/comments/dawnblade")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(`Bad Request`);
        });
    });
  });
  describe("GET/api/users", () => {
    test("returns an array of users with the properties avatar url, name and username", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                avatar_url: expect.any(String),
                name: expect.any(String),
                username: expect.any(String),
              })
            );
          });
        });
    });
    test("404 error with custom message following user inputting incorrect endpoint url", () => {
      return request(app)
        .get("/api/userz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("URL not found");
        });
    });
  });
});
