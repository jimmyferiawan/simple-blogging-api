const jwt = require("jsonwebtoken");
const AuthValidationHelper = require("../../helpers/authValidationHelper");

describe("AuthValidationHelper", () => {
  const authValidationHelper = new AuthValidationHelper();
  process.env.APP_SECRET = "ksfgbfasj82A83ak839h8_A83nai12jJ293";

  describe("nullabelValidation(str)", () => {
    test("Normal : check nullabel input string", () => {
      expect(authValidationHelper.nullabelValidation("aaaa")).toBe(true);
    });

    test("Abnormal : null value", () => {
      expect(authValidationHelper.nullabelValidation(null)).toBe(false);
    });

    test("Abnormal : undefined value", () => {
      let djf;
      expect(authValidationHelper.nullabelValidation(djf)).toBe(false);
    });

    test("Abnormal : empty string", () => {
      expect(authValidationHelper.nullabelValidation("")).toBe(false);
    });

    test("Abnormal : given as object", () => {
      expect(authValidationHelper.nullabelValidation({ body: "a" })).toBe(
        false
      );
    });
  });

  describe("bodyPasswordValidation(req)", () => {
    test("Normal : valid password & newPassword field", () => {
      expect(
        authValidationHelper.bodyPasswordValidation({
          body: { password: "123456", newPassword: "654321" },
        })
      ).toBe(true);
    });

    test("Abnormal : empty password", () => {
      expect(
        authValidationHelper.bodyPasswordValidation({
          body: { password: "", newPassword: "654321" },
        })
      ).toBe(false);
    });

    test("Abnormal : empty newPassword", () => {
      expect(
        authValidationHelper.bodyPasswordValidation({
          body: { password: "123456", newPassword: "" },
        })
      ).toBe(false);
    });

    test("Abnormal : empty password & newPassword", () => {
      expect(
        authValidationHelper.bodyPasswordValidation({
          body: { password: "", newPassword: "" },
        })
      ).toBe(false);
    });

    test("Abnormal : null password or newPassword", () => {
      expect(
        authValidationHelper.bodyPasswordValidation({
          body: { newPassword: "654321" },
        })
      ).toBe(false);

      expect(
        authValidationHelper.bodyPasswordValidation({
          body: { password: "654321" },
        })
      ).toBe(false);
    });
  });
  describe("authRequestBodyValidation(req)", () => {
    test("Normal : valid sign up body request", () => {
      let mockReq = {
        body: {
          username: "test",
          firstName: "first name",
          mobile: "mobile",
          email: "mail@mail.com",
        },
      };
      expect(authValidationHelper.authRequestBodyValidation(mockReq)).toBe(
        true
      );
    });

    test("Abnormal : missing mandatory field", () => {
      expect(
        authValidationHelper.authRequestBodyValidation({
          body: {
            firstName: "first name",
            mobile: "081212341234",
            email: "mail@mail.com",
          },
        })
      ).toBe(false);
      expect(
        authValidationHelper.authRequestBodyValidation({
          body: {
            username: "test",
            mobile: "081212341234",
            email: "mail@mail.com",
          },
        })
      ).toBe(false);
      expect(
        authValidationHelper.authRequestBodyValidation({
          body: {
            username: "test",
            firstName: "first name",
            email: "mail@mail.com",
          },
        })
      ).toBe(false);
      expect(
        authValidationHelper.authRequestBodyValidation({
          body: {
            username: "test",
            firstName: "first name",
            mobile: "081212341234",
          },
        })
      ).toBe(false);
    });
  });
  describe("isValidAuthBearerHeader(req)", () => {
    test("Normal : valid Autorization Bearer header", () => {
      let mockReq = {
        headers: {
          authorization: "Bearer adsfhjkdasdsakfbsdffasd",
        },
      };

      expect(authValidationHelper.isValidAuthBearerHeader(mockReq)).toBe(true);
    });

    test("Abnormal : no bearer in Authorization header", () => {
      let mockReq = {
        headers: {
          authorization: "adsfhjkdasdsakfbsdffasd",
        },
      };

      expect(authValidationHelper.isValidAuthBearerHeader(mockReq)).toBe(false);
    });

    test("Abnormal : empty Authorization header value", () => {
      let mockReq = {
        headers: {
          authorization: "",
        },
      };

      expect(authValidationHelper.isValidAuthBearerHeader(mockReq)).toBe(false);
      mockReq.headers.authorization = null;
      expect(authValidationHelper.isValidAuthBearerHeader(mockReq)).toBe(false);
      mockReq.headers.authorization = undefined;
      expect(authValidationHelper.isValidAuthBearerHeader(mockReq)).toBe(false);
    });

    test("Abnormal : empty authorization in headers", () => {
      let mockReq = {
        headers: {
          authorizationa: "adsfhjkdasdsakfbsdffasd",
        },
      };

      expect(authValidationHelper.isValidAuthBearerHeader(mockReq)).toBe(false);
    });
  });

  describe("authorize(req)", () => {
    test("Normal : valid JWT token", () => {
      let mockReq = {
        headers: {
          authorization: "Bearer adsfhjkdasdsakfbsdffasd",
        },
      };

      jwt.verify = function (args1, args2) {
        return true;
      };

      expect(authValidationHelper.authorize(mockReq)).toBe(true);
    });

    test("Abnormal : invalid JWT token", () => {
      let mockReq = {
        headers: {
          authorization: "adsfhjkdasdsakfbsdffasd",
        },
      };

      jwt.verify = function (args1, args2) {
        throw new jwt.JsonWebTokenError("invalid token");
      };
      expect(authValidationHelper.authorize(mockReq)).toBe(false);

      jwt.verify = function (args1, args2) {
        throw new jwt.TokenExpiredError("jwt expired");
      };
      expect(authValidationHelper.authorize(mockReq)).toBe(false);
    });
  });

  describe("authorizationOwn(req)", () => {
    test("Normal : valid JWT token", () => {
      let mockReq = {
        params: {
          username: "jimmy"
        },
        headers: {
          authorization: "Bearer adsfhjkdasdsakfbsdffasd",
        },
      };

      jwt.verify = function (args1, args2, func) {
        func(null, {
          username: "jimmy",
          firstName: "Jimmy Feriawan",
          middleName: "Feriawan",
          lastName: "",
          email: "feriawanjimmy@mail.com",
          mobile: "081212341230",
          iat: 1696908966,
          exp: 1696911966,
        });
      };

      expect(authValidationHelper.authorizationOwn(mockReq)).toBe(true);
    });

    test("Abnormal : updateing another user action", () => {
      let mockReq = {
        params: {
          username: "jimmya"
        },
        headers: {
          authorization: "Bearer adsfhjkdasdsakfbsdffasd",
        },
      };

      jwt.verify = function (args1, args2, func) {
        func(null, {
          username: "jimmy",
          firstName: "Jimmy Feriawan",
          middleName: "Feriawan",
          lastName: "",
          email: "feriawanjimmy@mail.com",
          mobile: "081212341230",
          iat: 1696908966,
          exp: 1696911966,
        });
      };

      expect(authValidationHelper.authorizationOwn(mockReq)).toBe(false);
    });

    test("Abnormal : inavid/expired JWT token", () => {
      let mockReq = {
        params: {
          username: "jimmy"
        },
        headers: {
          authorization: "Bearer adsfhjkdasdsakfbsdffasd",
        },
      };

      jwt.verify = function (args1, args2, func) {
        func(new jwt.JsonWebTokenError("invalid token"), null);
      };
      expect(authValidationHelper.authorizationOwn(mockReq)).toBe(false);
      
      jwt.verify = function (args1, args2, func) {
        func(new jwt.TokenExpiredError("jwt expired"), null);
      };
      expect(authValidationHelper.authorizationOwn(mockReq)).toBe(false);
    });
  });
});
