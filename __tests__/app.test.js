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
});
