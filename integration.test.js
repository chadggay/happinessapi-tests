/**
 * Install dependencies before you attempt to run the tests!!
 * ****** run npm i in termnal, under this directory *****
 * Start your server before running the test
 * run npm test when you are ready
 * A report will be automatically generated under this directory
 */
const axios = require("axios");
const { v4: uuid } = require("uuid");
const to = require("./lib/to");
const https = require("https");
const faker = require("faker");
const { DateTime } = require("luxon");

//If you are serving your server on any port other than 3000, change the port here, or alternatively change the url to approriate
const REMOTE_API_URL = `http://localhost:3000`;

const EMAIL_USER_ONE = `${uuid()}@fake-email.com`;
const PASSWORD_USER_ONE = "webcomputing";
let TOKEN_USER_ONE = "";
let FIRST_NAME_USER_ONE = faker.name.firstName();
let LAST_NAME_USER_ONE = faker.name.lastName();
let ADDRESS_USER_ONE = faker.address.streetAddress();
let DOB_USER_ONE = DateTime.fromJSDate(faker.date.past()).toISODate();

const EMAIL_USER_TWO = `${uuid()}@fake-email.com`;
const PASSWORD_USER_TWO = "webcomputing";
let TOKEN_USER_TWO = "";

https.globalAgent.options.rejectUnauthorized = false;
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

/* ======================= Countries ======================= */
describe("countries", () => {
  describe("with no query parmater", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/countries`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a list of all countries", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return an array", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should contain 167 countries", () =>
      expect(response.data.length).toBe(167));
    test("should have first country of Afghanistan", () =>
      expect(response.data[0]).toBe("Afghanistan"));
    test("should have last country of Zimbabwe", () =>
      expect(response.data[166]).toBe("Zimbabwe"));
  });
});

/* ======================= Rankings ======================= */
describe("rankings", () => {
  describe("with invalid query parameter", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(
          `${REMOTE_API_URL}/rankings?country=Australia&year=2020&name=a`
        )
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("country with invalid name", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/rankings?country=Austral1a`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("year with lets in year format", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/rankings?year=twentytwenty`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with no query parameters", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/rankings`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return an array", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return 935 results", () =>
      expect(response.data.length).toBe(935));
    test("should contain correct first country property", () =>
      expect(response.data[0].country).toBe("Finland"));
    test("should contain correct first rank property", () =>
      expect(response.data[0].rank).toBe(1));
    test("should contain correct first score property", () =>
      expect(response.data[0].score).toBe("7.809"));
    test("should contain correct first year property", () =>
      expect(response.data[0].year).toBe(2020));
  });

  describe("with valid country query parameter", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/rankings?country=Australia`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return an array", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return an array", () => expect(response.data.length).toBe(6));
    test("should contain correct first country property", () =>
      expect(response.data[0].country).toBe("Australia"));
    test("should contain correct first rank property", () =>
      expect(response.data[0].rank).toBe(12));
    test("should contain correct first score property", () =>
      expect(response.data[0].score).toBe("7.223"));
    test("should contain correct first year property", () =>
      expect(response.data[0].year).toBe(2020));
  });

  describe("with country that doesn't exist", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/rankings?country=NotARealCountry`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return an array", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return 0 results", () => expect(response.data.length).toBe(0));
  });

  describe("with valid year query parameter", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/rankings?year=2015`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should contain correct first country property", () =>
      expect(response.data[0].country).toBe("Switzerland"));
    test("should contain correct first rank property", () =>
      expect(response.data[0].rank).toBe(1));
    test("should contain correct first score property", () =>
      expect(response.data[0].score).toBe("7.587"));
    test("should contain correct first year property", () =>
      expect(response.data[0].year).toBe(2015));
  });

  describe("with country that doesn't exist", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/rankings?year=2000`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return an array", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return 0 results", () => expect(response.data.length).toBe(0));
  });

  describe("with country and year parameters", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/rankings?&year=2019&country=Australia`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return an array", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return 0 results", () => expect(response.data.length).toBe(1));
    test("should contain correct  country property", () =>
      expect(response.data[0].country).toBe("Australia"));
    test("should contain correct  rank property", () =>
      expect(response.data[0].rank).toBe(11));
    test("should contain correct  score property", () =>
      expect(response.data[0].score).toBe("7.228"));
    test("should contain correct  year property", () =>
      expect(response.data[0].year).toBe(2019));
  });
});

/* ======================= User Registration & Login ======================= */
describe("user", () => {
  describe("registration", () => {
    describe("with missing email", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`${REMOTE_API_URL}/user/register`, {
            password: PASSWORD_USER_ONE,
          })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 400", () =>
        expect(response.status).toBe(400));
      test("should return status text - Bad Request", () =>
        expect(response.statusText).toBe("Bad Request"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with missing password", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`${REMOTE_API_URL}/user/register`, {
            email: EMAIL_USER_ONE,
          })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 400", () =>
        expect(response.status).toBe(400));
      test("should return status text - Bad Request", () =>
        expect(response.statusText).toBe("Bad Request"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with missing email and password", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`${REMOTE_API_URL}/user/register`, {})
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 400", () =>
        expect(response.status).toBe(400));
      test("should return status text - Bad Request", () =>
        expect(response.statusText).toBe("Bad Request"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with valid email and password", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`${REMOTE_API_URL}/user/register`, {
            email: EMAIL_USER_ONE,
            password: PASSWORD_USER_ONE,
          })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 201", () =>
        expect(response.status).toBe(201));
      test("should return status text - Created", () =>
        expect(response.statusText).toBe("Created"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });
  });
});

describe("login", () => {
  describe("with missing email", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`${REMOTE_API_URL}/user/login`, {
          password: PASSWORD_USER_ONE,
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Created", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with missing password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`${REMOTE_API_URL}/user/login`, { email: EMAIL_USER_ONE })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Created", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with non-existing user (email)", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`${REMOTE_API_URL}/user/login`, {
          email: `${uuid()}@fake-email.com`,
          password: PASSWORD_USER_ONE,
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Created", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with invalid password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`${REMOTE_API_URL}/user/login`, {
          email: EMAIL_USER_ONE,
          password: "PASSWORD_USER_ONE",
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Created", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with valid email and password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`${REMOTE_API_URL}/user/login`, {
          email: EMAIL_USER_ONE,
          password: PASSWORD_USER_ONE,
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should contain token property", () =>
      expect(response.data).toHaveProperty("token"));
    test("should contain token_type property", () =>
      expect(response.data).toHaveProperty("token_type"));
    test("should contain expires_in property", () =>
      expect(response.data).toHaveProperty("expires_in"));
    test("should contain correct token_type", () =>
      expect(response.data.token_type).toBe(`Bearer`));
    test("should contain correct expires_in", () =>
      expect(response.data.expires_in).toBe(86400));
  });
});

/* ======================= Factors ======================= */
describe("factors", () => {
  beforeAll(async () => {
    const login = await axios.post(`${REMOTE_API_URL}/user/login`, {
      email: EMAIL_USER_ONE,
      password: PASSWORD_USER_ONE,
    });
    TOKEN_USER_ONE = login.data.token;
  });

  describe("with no authorisation header", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Unauthorized", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should contain specific message for 'Authorization header ('Bearer token') not found", () =>
      expect(response.data.message).toBe(
        "Authorization header ('Bearer token') not found"
      ));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with invalid bearer token", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020`, {
          headers: { Authorization: `Bearer notARealToken` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Unauthorized", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should contain message property", () =>
      expect(response.data.message).toBe("Invalid JWT token"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with malformed bearer token", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020`, {
          headers: { Authorization: `notBearer ` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Unauthorized", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should contain specific message for 'Authorization header is malformed'", () =>
      expect(response.data.message).toBe("Authorization header is malformed"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with valid auth - year that does not exist (2000) in data set", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2000`, {
          headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should be an array result", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return empty array", () =>
      expect(response.data.length).toBe(0));
  });

  describe("with valid auth - year that does exist (2020), country that does not exist (notARealCountry) in data set", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020?country=notARealCountry`, {
          headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should be an array result", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return empty array", () =>
      expect(response.data.length).toBe(0));
  });

  describe("with valid auth - all country factors for provided year", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2018`, {
          headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should be an array result", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return array of 156 results", () =>
      expect(response.data.length).toBe(156));

    test("should contain correct first rank property", () =>
      expect(response.data[0].rank).toBe(1));
    test("should contain correct first country property", () =>
      expect(response.data[0].country).toBe("Finland"));
    test("should contain correct first score property", () =>
      expect(response.data[0].score).toBe("7.632"));
    test("should contain correct first economy property", () =>
      expect(response.data[0].economy).toBe("1.305"));
    test("should contain correct first family property", () =>
      expect(response.data[0].family).toBe("1.592"));
    test("should contain correct first health property", () =>
      expect(response.data[0].health).toBe("0.874"));
    test("should contain correct first freedom property", () =>
      expect(response.data[0].freedom).toBe("0.681"));
    test("should contain correct first generosity property", () =>
      expect(response.data[0].generosity).toBe("0.202"));
    test("should contain correct first trust property", () =>
      expect(response.data[0].trust).toBe("0.393"));
  });

  describe("with valid auth - all country factors for provided year and country", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020?country=Australia`, {
          headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should be an array result", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return array of 1 results", () =>
      expect(response.data.length).toBe(1));

    test("should contain correct first rank property", () =>
      expect(response.data[0].rank).toBe(12));
    test("should contain correct first country property", () =>
      expect(response.data[0].country).toBe("Australia"));
    test("should contain correct first score property", () =>
      expect(response.data[0].score).toBe("7.223"));
    test("should contain correct first economy property", () =>
      expect(response.data[0].economy).toBe("1.310"));
    test("should contain correct first family property", () =>
      expect(response.data[0].family).toBe("1.477"));
    test("should contain correct first health property", () =>
      expect(response.data[0].health).toBe("1.023"));
    test("should contain correct first freedom property", () =>
      expect(response.data[0].freedom).toBe("0.622"));
    test("should contain correct first generosity property", () =>
      expect(response.data[0].generosity).toBe("0.325"));
    test("should contain correct first trust property", () =>
      expect(response.data[0].trust).toBe("0.336"));
  });

  describe("with valid auth - invalid year format", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020a`, {
          headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with valid auth - valid year and invalid country format", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020?country=Austral1a`, {
          headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with valid auth - provided limit of 10", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020?limit=10`, {
          headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should be an array result", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return array of 10 results", () =>
      expect(response.data.length).toBe(10));
  });

  describe("with valid auth - provided limit invalid limit of negative 10", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020?limit=-10`, {
          headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with valid auth - provided limit invalid limit of decimal number", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020?limit=3.14`, {
          headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with valid auth - provided limit invalid limit of letters", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/factors/2020?limit=abc`, {
          headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with valid auth - additional invalid query parameters", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(
          `${REMOTE_API_URL}/factors/2020?region=Australia&limit=10`,
          {
            headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
          }
        )
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });
});

/* ======================= Profile ======================= */
describe("profile", () => {
  beforeAll(async () => {
    const request = await to.object(
      instance.post(`${REMOTE_API_URL}/user/register`, {
        email: EMAIL_USER_TWO,
        password: PASSWORD_USER_TWO,
      })
    );

    const login = await axios.post(`${REMOTE_API_URL}/user/login`, {
      email: EMAIL_USER_TWO,
      password: PASSWORD_USER_TWO,
    });
    TOKEN_USER_TWO = login.data.token;
  });

  describe("retrieval with default profile values", () => {
    describe("with unauthenticated request for non existent user", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/user/${uuid()}@email.com/profile`)
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 404", () =>
        expect(response.status).toBe(404));
      test("should return status text - Not Found", () =>
        expect(response.statusText).toBe("Not Found"));
      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
    });

    describe("with authenticated request for non existent user", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/user/${uuid()}@email.com/profile`, {
            headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 404", () =>
        expect(response.status).toBe(404));
      test("should return status text - Not Found", () =>
        expect(response.statusText).toBe("Not Found"));
      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
    });

    describe("with unauthenticated user default profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`)
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(EMAIL_USER_ONE));
      test("should return null for unset firstName", () =>
        expect(response.data.firstName).toBe(null));
      test("should return null for unset lastName", () =>
        expect(response.data.lastName).toBe(null));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });

    describe("with authenticated matching user default profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`, {
            headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(EMAIL_USER_ONE));
      test("should return null for unset firstName", () =>
        expect(response.data.firstName).toBe(null));
      test("should return null for unset lastName", () =>
        expect(response.data.lastName).toBe(null));
      test("should return null for unset dob", () =>
        expect(response.data.dob).toBe(null));
      test("should return null for unset address", () =>
        expect(response.data.address).toBe(null));
    });

    describe("with authenticated non-matching user default profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`, {
            headers: { Authorization: `Bearer ${TOKEN_USER_TWO}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(EMAIL_USER_ONE));
      test("should return null for unset firstName", () =>
        expect(response.data.firstName).toBe(null));
      test("should return null for unset lastName", () =>
        expect(response.data.lastName).toBe(null));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });
  });

  describe("update of user profile", () => {
    describe("with unauthenticated user", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.put(`${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`, {
            firstName: FIRST_NAME_USER_ONE,
            lastName: LAST_NAME_USER_ONE,
            address: ADDRESS_USER_ONE,
            dob: DOB_USER_ONE,
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 401", () =>
        expect(response.status).toBe(401));
      test("should return status text - Unauthorized", () =>
        expect(response.statusText).toBe("Unauthorized"));
      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with authenticated non-matching user", () => {
      beforeAll(async () => {
        const login = await axios.post(`${REMOTE_API_URL}/user/login`, {
          email: EMAIL_USER_TWO,
          password: PASSWORD_USER_TWO,
        });
        TOKEN_USER_TWO = login.data.token;

        const request = await to.object(
          instance.put(
            `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
            {
              firstName: FIRST_NAME_USER_ONE,
              lastName: LAST_NAME_USER_ONE,
              address: ADDRESS_USER_ONE,
              dob: DOB_USER_ONE,
            },
            {
              headers: { Authorization: `Bearer ${TOKEN_USER_TWO}` },
            }
          )
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 403", () =>
        expect(response.status).toBe(403));
      test("should return status text - Forbidden", () =>
        expect(response.statusText).toBe("Forbidden"));
      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with authenticated matching user", () => {
      beforeAll(async () => {
        const login = await axios.post(`${REMOTE_API_URL}/user/login`, {
          email: EMAIL_USER_ONE,
          password: PASSWORD_USER_ONE,
        });
        TOKEN_USER_ONE = login.data.token;
      });

      describe("with missing body keys", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
              {},
              {
                headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return specific message for 'Request body incomplete: firstName, lastName, dob and address are required.'", () =>
          expect(response.data.message).toBe(
            "Request body incomplete: firstName, lastName, dob and address are required."
          ));
      });

      describe("with invalid firstName", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
              {
                firstName: 123,
                lastName: LAST_NAME_USER_ONE,
                address: ADDRESS_USER_ONE,
                dob: DOB_USER_ONE,
              },
              {
                headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Request body invalid, firstName, lastName and address must be strings only.'", () =>
          expect(response.data.message).toBe(
            "Request body invalid, firstName, lastName and address must be strings only."
          ));
      });

      describe("with invalid lastName", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
              {
                firstName: FIRST_NAME_USER_ONE,
                lastName: 987,
                address: ADDRESS_USER_ONE,
                dob: DOB_USER_ONE,
              },
              {
                headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Request body invalid, firstName, lastName and address must be strings only.'", () =>
          expect(response.data.message).toBe(
            "Request body invalid, firstName, lastName and address must be strings only."
          ));
      });

      describe("with invalid address", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
              {
                firstName: FIRST_NAME_USER_ONE,
                lastName: LAST_NAME_USER_ONE,
                address: true,
                dob: DOB_USER_ONE,
              },
              {
                headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Request body invalid, firstName, lastName and address must be strings only.'", () =>
          expect(response.data.message).toBe(
            "Request body invalid, firstName, lastName and address must be strings only."
          ));
      });

      describe("with invalid date format", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
              {
                firstName: FIRST_NAME_USER_ONE,
                lastName: LAST_NAME_USER_ONE,
                address: ADDRESS_USER_ONE,
                dob: new Date().toISOString(),
              },
              {
                headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input: dob must be a real date in format YYYY-MM-DD.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a real date in format YYYY-MM-DD."
          ));
      });

      describe("with valid formatted non-real date (out of bounds check)", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
              {
                firstName: FIRST_NAME_USER_ONE,
                lastName: LAST_NAME_USER_ONE,
                address: ADDRESS_USER_ONE,
                dob: "2021-13-32",
              },
              {
                headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input: dob must be a real date in format YYYY-MM-DD.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a real date in format YYYY-MM-DD."
          ));
      });

      describe("with valid formatted non-real date (Javascript date rollover check)", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
              {
                firstName: FIRST_NAME_USER_ONE,
                lastName: LAST_NAME_USER_ONE,
                address: ADDRESS_USER_ONE,
                dob: "2021-04-31",
              },
              {
                headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input: dob must be a real date in format YYYY-MM-DD.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a real date in format YYYY-MM-DD."
          ));
      });

      describe("with valid formatted non-real date (non leap-year check)", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
              {
                firstName: FIRST_NAME_USER_ONE,
                lastName: LAST_NAME_USER_ONE,
                address: ADDRESS_USER_ONE,
                dob: "2021-02-29",
              },
              {
                headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
      });

      describe("with valid date in the future", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
              {
                firstName: FIRST_NAME_USER_ONE,
                lastName: LAST_NAME_USER_ONE,
                address: ADDRESS_USER_ONE,
                dob: "2031-05-31",
              },
              {
                headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input, dob must be a date in the past.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a date in the past."
          ));
      });

      describe("with valid date in the past", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`,
              {
                firstName: FIRST_NAME_USER_ONE,
                lastName: LAST_NAME_USER_ONE,
                address: ADDRESS_USER_ONE,
                dob: DOB_USER_ONE,
              },
              {
                headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 200", () =>
          expect(response.status).toBe(200));
        test("should return status text - OK", () =>
          expect(response.statusText).toBe("OK"));
        test("should be an object result", () =>
          expect(response.data).toBeInstanceOf(Object));
        test("should return user email property", () =>
          expect(response.data.email).toBe(EMAIL_USER_ONE));
        test("should return updated firstName", () =>
          expect(response.data.firstName).toBe(FIRST_NAME_USER_ONE));
        test("should return updated lastName", () =>
          expect(response.data.lastName).toBe(LAST_NAME_USER_ONE));
        test("should return updated dob", () =>
          expect(response.data.dob).toBe(DOB_USER_ONE));
        test("should return updated address", () =>
          expect(response.data.address).toBe(ADDRESS_USER_ONE));
      });
    });
  });

  describe("retrieval after update of user profile", () => {
    describe("with unauthenticated user updated profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`)
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(EMAIL_USER_ONE));
      test("should return updated firstName", () =>
        expect(response.data.firstName).toBe(FIRST_NAME_USER_ONE));
      test("should return updated lastName", () =>
        expect(response.data.lastName).toBe(LAST_NAME_USER_ONE));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });

    describe("with authenticated matching user updated profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`, {
            headers: { Authorization: `Bearer ${TOKEN_USER_ONE}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(EMAIL_USER_ONE));
      test("should return updated firstName", () =>
        expect(response.data.firstName).toBe(FIRST_NAME_USER_ONE));
      test("should return updated lastName", () =>
        expect(response.data.lastName).toBe(LAST_NAME_USER_ONE));
      test("should return updated dob", () =>
        expect(response.data.dob).toBe(DOB_USER_ONE));
      test("should return updated address", () =>
        expect(response.data.address).toBe(ADDRESS_USER_ONE));
    });

    describe("with authenticated non-matching user updated profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/user/${EMAIL_USER_ONE}/profile`, {
            headers: { Authorization: `Bearer ${TOKEN_USER_TWO}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(EMAIL_USER_ONE));
      test("should return updated firstName", () =>
        expect(response.data.firstName).toBe(FIRST_NAME_USER_ONE));
      test("should return updated lastName", () =>
        expect(response.data.lastName).toBe(LAST_NAME_USER_ONE));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });
  });
});

/* ======================= Misc ======================= */
describe("Miscellaneous", () => {
  describe("with non-existent route", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/${uuid()}`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 404", () => expect(response.status).toBe(404));
    test("should return status text - Not Found", () =>
      expect(response.statusText).toBe("Not Found"));
  });

  describe("with swagger docs route", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 200", () => expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return Swagger UI", () =>
      expect(response.data).toContain("Swagger UI"));
  });

  describe("with cors header", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 200", () => expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return access-control-allow-origin in headers", () =>
      expect(response.headers).toHaveProperty("access-control-allow-origin"));
  });

  describe("with supressed x-powered-by header", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 200", () => expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should not x-powered-by header property", () =>
      expect(response.headers).not.toHaveProperty("x-powered-by"));
  });
});
