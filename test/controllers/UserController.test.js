const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserController = require("../../controllers/UserController");
const errMapping = require("../../helpers/userErrorDef");

describe("UserController", () => {
  let userService = {
    tambahUser: function (reqBody) {
      return new Promise((resolve, reject) => {
        resolve({
          error: false,
          errData: null,
        });
      });
    },
    findOneByUsernamePassword: function (username, password) {
      return new Promise((resolve, reject) => {
        resolve({
          error: false,
          errMsg: null,
          rc: "00",
          data: {
            username: "jimmy",
            firstName: "Jimmy",
            middleName: "Feriawan",
            lastName: null,
            mobile: "087784517748",
            email: "feriawanjimmy@mail.com",
          },
        });
      });
    },
    findOneByUsername: function (username) {
      return new Promise((resolve, reject) => {
        resolve({
          error: false,
          errMsg: null,
          rc: "00",
          data: {
            username: "jimmy",
            firstname: "Jimmy Feriawan",
            middlename: "Feriawan",
            lastname: "",
            intro: null,
            profile: null,
          },
        });
      });
    },
    updateDetailByUsername: function (username, UserReqUpdate) {
      return new Promise((resolve, reject) => {
        resolve({
          httpStatusCode: 200,
          body: {
            error: false,
            errMsg: null,
          },
        });
      });
    },
  };
  let userController = new UserController(userService);
  let res = {
    httpStatus: 0,
    status: function (inp) {
      this.httpStatus = inp;
      // console.log(this)
      return this;
    },
    body: {},
    send: function (input) {
      this.body = input;
    },
  };

  beforeEach(() => {
    userService = {
      tambahUser: function (reqBody) {
        return new Promise((resolve, reject) => {
          resolve({
            error: false,
            errData: null,
          });
        });
      },
      findOneByUsernamePassword: function (username, password) {
        return new Promise((resolve, reject) => {
          resolve({
            error: false,
            errMsg: null,
            rc: "00",
            data: {
              username: "jimmy",
              firstName: "Jimmy",
              middleName: "Feriawan",
              lastName: null,
              mobile: "087784517748",
              email: "feriawanjimmy@mail.com",
            },
          });
        });
      },
      findOneByUsername: function (username) {
        return new Promise((resolve, reject) => {
          resolve({
            error: false,
            errMsg: null,
            rc: "00",
            data: {
              username: "jimmy",
              firstname: "Jimmy Feriawan",
              middlename: "Feriawan",
              lastname: "",
              intro: null,
              profile: null,
            },
          });
        });
      },
      updateDetailByUsername: function (username, UserReqUpdate) {
        return new Promise((resolve, reject) => {
          resolve({
            httpStatusCode: 200,
            body: {
              error: false,
              errMsg: null,
            },
          });
        });
      },
    };
    res = {
      httpStatus: 0,
      status: function (inp) {
        this.httpStatus = inp;
        // console.log(this)
        return this;
      },
      body: {},
      send: function (input) {
        this.body = input;
      },
    };
    userController = new UserController(userService);
  });

  describe("POST /signup", () => {
    test("Normal : sign up user", async () => {
      const req = {
        body: {
          username: "jimmy",
          firstName: "Jimmy",
          mobile: "087784517748",
          email: "feriawanjimmy@mail.com",
          password: "123456",
        },
      };

      const signUpRouteHandler = userController.signUpUser(userService);
      await signUpRouteHandler(req, res, {});
      // console.log("res obj => ", res)
      expect(res.httpStatus).toEqual(201);
      expect(res.body.error).toEqual(false);
    });

    test("Abnormal : missing mandatory field", async () => {
      // expect.assertions(1);

      const req = {
        body: {
          username: "",
          firstName: "",
          mobile: "",
          email: "",
          password: "",
        },
      };

      const signUpRouteHandler = userController.signUpUser(userService);
      try {
        await signUpRouteHandler(req, res, {});
      } catch (err) {
        expect(res.httpStatus).toBe(400);
        expect(res.body.error).toBe(true);
        expect(res.body.message).toBe(
          "Mandatory field should not be empty"
        );
      }
    });

    test("Abnormal : sign up user username already exist", async () => {
      // expect.assertions(1);
      userService.tambahUser = function (reqBody) {
        return new Promise((resolve, reject) => {
          reject({
            name: "SequelizeUniqueConstraintError",
            fields: { uq_username: reqBody.username },
          });
        });
      };
      const req = {
        body: {
          username: "jimmy",
          firstName: "Jimmy",
          middleName: "Feriawan",
          mobile: "087784517748",
          email: "feriawanjimmy@mail.com",
          password: "123456",
        },
      };

      const signUpRouteHandler = userController.signUpUser(userService);
      try {
        await signUpRouteHandler(req, res, {});
      } catch (err) {
        expect(res.httpStatus).toEqual(401);
        expect(res.body.error).toEqual(true);
        expect(res.body.message).toEqual(
          "Username sudah digunakan, silahkan pilih yang lain"
        );
      }
    });

    test("Abnormal : sign up user error 500", async () => {
      // expect.assertions(1);
      userService.tambahUser = function (reqBody) {
        return new Promise((resolve, reject) => {
          reject({
            error: true,
            errMsg: "Some error occured, please try again later.",
          });
        });
      };
      const req = {
        body: {
          username: "jimmy",
          firstName: "Jimmy",
          middleName: "Feriawan",
          mobile: "087784517748",
          email: "feriawanjimmy@mail.com",
          password: "123456",
        },
      };

      const signUpRouteHandler = userController.signUpUser(userService);
      try {
        await signUpRouteHandler(req, res, {});
      } catch (err) {
        expect(res.httpStatus).toEqual(500);
        expect(res.body.error).toEqual(true);
        expect(res.body.message).toEqual(
          "Some error occured, please try again later."
        );
      }
    });
  });

  describe("POST /signin", () => {
    test("Normal POST : sign in user", async () => {
      process.env.APP_SECRET = "ksfgbfasj82A83ak839h8_A83nai12jJ293";
      const req = {
        body: {
          username: "jimmy",
          password: "1234556",
        },
      };

      const signInHandler = userController.signInUser(userService);
      await signInHandler(req, res, {});

      expect(res.httpStatus).toEqual(200);
      expect(res.body.error).toEqual(false);
    });

    test("Abnormal POST : sign in missing mandatory field", async () => {
      process.env.APP_SECRET = "ksfgbfasj82A83ak839h8_A83nai12jJ293";
      const req = {
        body: {
          username: "",
          password: "1234556",
        },
      };

      const signInHandler = userController.signInUser(userService);
      await signInHandler(req, res, {});

      expect(res.httpStatus).toEqual(400);
      expect(res.body.error).toEqual(true);
    });

    test("Abnormal POST : sign in user wrong username or password", async () => {
      let mockUserService = {};
      mockUserService.findOneByUsernamePassword = function (
        username,
        password
      ) {
        return new Promise((resolve, reject) => {
          reject({
            error: true,
            errMsg: "Wrong Username or Password.",
            rc: "14",
          });
        });
      };
      process.env.APP_SECRET = "ksfgbfasj82A83ak839h8_A83nai12jJ293";
      const req = {
        body: {
          username: "jimmy",
          password: "123455",
        },
      };

      const signInHandler = userController.signInUser(mockUserService);
      // try {
      await signInHandler(req, res, {});
      // } catch (err) {
      expect(res.httpStatus).toEqual(401);
      expect(res.body.error).toEqual(true);
      expect(res.body.message).toEqual("Wrong Username or Password.");
      // }
    });

    test("Abnormal POST : something error from DB", async () => {
      let mockUserService = {};
      mockUserService.findOneByUsernamePassword = function (
        username,
        password
      ) {
        return new Promise((resolve, reject) => {
          reject({
            error: true,
            errMsg: "Something error from DB",
            rc: "99",
          });
        });
      };
      process.env.APP_SECRET = "ksfgbfasj82A83ak839h8_A83nai12jJ293";
      const req = {
        body: {
          username: "jimmy",
          password: "123455",
        },
      };

      const signInHandler = userController.signInUser(mockUserService);
      // try {
      await signInHandler(req, res, {});
      // } catch (err) {
      expect(res.httpStatus).toEqual(500);
      expect(res.body.error).toEqual(true);
      expect(res.body.message).toEqual("Something error from DB");
      // }
    });
  });

  describe("GET /u/:username", () => {
    test("Normal GET : view User by username", async () => {
      const req = {
        params: {
          username: "jimmy",
        },
      };
      const viewUserHandler = userController.viewUser(userService);
      await viewUserHandler(req, res, {});

      expect(res.httpStatus).toEqual(200);
      expect(res.body.error).toEqual(false);
    });

    test("Abnormal GET : username not exist", async () => {
      const NOT_FOUND_MSG = "User not found";
      let mockUserService = {};
      mockUserService.findOneByUsername = function (username) {
        return new Promise((resolve, reject) => {
          reject({
            error: true,
            errMsg: NOT_FOUND_MSG,
            rc: "01",
          });
        });
      };
      const req = {
        params: {
          username: "jimmy",
        },
      };
      const viewUserHandler = userController.viewUser(mockUserService);
      await viewUserHandler(req, res, {});
      expect(res.httpStatus).toEqual(404);
      expect(res.body.message).toEqual(NOT_FOUND_MSG);
      expect(res.body.error).toEqual(true);
    });

    test("Abnormal GET : username not exist", async () => {
      let mockUserService = {};
      mockUserService.findOneByUsername = function (username) {
        return new Promise((resolve, reject) => {
          reject({
            error: true,
            errMsg: "Something error from DB",
            rc: "99",
          });
        });
      };
      const req = {
        params: {
          username: "jimmy",
        },
      };
      const viewUserHandler = userController.viewUser(mockUserService);
      await viewUserHandler(req, res, {});
      expect(res.httpStatus).toEqual(500);
      expect(res.body.message).toEqual("Something error from DB");
      expect(res.body.error).toEqual(true);
    });
  });

  describe("PUT /u/:username", () => {
    const req = {
      params: {
        username: "jimmy",
      },
      headers: {
        authorization: "Bearer ashfafsdgkfsdgolmdvnksvkfdsgn",
      },
      body: {
        username: "jimmy",
        firstName: "Jimmy Feriawan",
        // middleName: "Feriawan",
        mobile: "081212341230",
        email: "feriawanjimmy@mail.com",
      },
    };
    test("Normal PUT : update user detail", async () => {

      class Coba {
        isValidAuthBearerHeader(req) {
          return true;
        }
        authRequestBodyValidation(req) {
          return true;
        }
        authorizationOwn(req) {
          return true;
        }
      }
      const updateUserDetailHandler = userController.updateUserDetail(
        userService,
        new Coba()
      );
      await updateUserDetailHandler(req, res, {});

      expect(res.httpStatus).toEqual(200);
      expect(JSON.stringify(req.body)).toEqual(JSON.stringify(res.body.data));
      expect(res.body.message).toBeDefined()
      expect(res.body.error).toEqual(false);
    });

    test("Abnormal PUT : update user detail, invalis header authorization", async () => {

      class Coba {
        isValidAuthBearerHeader(req) {
          return false;
        }
        authRequestBodyValidation(req) {
          return true;
        }
        authorizationOwn(req) {
          return true;
        }
      }
      const updateUserDetailHandler = userController.updateUserDetail(
        userService,
        new Coba()
      );
      await updateUserDetailHandler(req, res, {});

      expect(res.httpStatus).toEqual(401);
      expect(res.body.error).toEqual(true);
    });

    test("Abnormal PUT : update user detail, username not exist", async () => {
      let mockUserService = {};
      mockUserService.findOneByUsername = function (username) {
        return new Promise((resolve, reject) => {
          reject({
            error: true,
            errMsg: "User not found",
            rc: "01",
          });
        });
      };
      class Coba {
        isValidAuthBearerHeader(req) {
          return true;
        }
        authRequestBodyValidation(req) {
          return true;
        }
        authorizationOwn(req) {
          return true;
        }
      }
      const updateUserDetailHandler = userController.updateUserDetail(
        mockUserService,
        new Coba()
      );
      await updateUserDetailHandler(req, res, {});

      expect(res.httpStatus).toEqual(404);
      expect(res.body.error).toEqual(true);
    });

    test("Abnormal PUT : update user detail, username already exist", async () => {
      // let mockUserService = {}
      userService.updateDetailByUsername = function (username, UserReqUpdate) {
        return new Promise((resolve, reject) => {
          reject({
            httpStatusCode: 400,
            body: {
              error: true,
              errMsg: errMapping.uq_username,
            },
          });
        });
      };
      class Coba {
        isValidAuthBearerHeader(req) {
          return true;
        }
        authRequestBodyValidation(req) {
          return true;
        }
        authorizationOwn(req) {
          return true;
        }
      }
      const updateUserDetailHandler = userController.updateUserDetail(
        userService,
        new Coba()
      );
      await updateUserDetailHandler(req, res, {});

      expect(res.httpStatus).toEqual(400);
      expect(res.body.error).toEqual(true);
    });

    test("Abnormal PUT : update user detail, missing mandatory field", async () => {

      class Coba {
        isValidAuthBearerHeader(req) {
          return true;
        }
        authRequestBodyValidation(req) {
          return false;
        }
        authorizationOwn(req) {
          return true;
        }
      }
      const updateUserDetailHandler = userController.updateUserDetail(
        userService,
        new Coba()
      );
      await updateUserDetailHandler(req, res, {});

      expect(res.httpStatus).toEqual(400);
      expect(res.body.error).toEqual(true);
    });

    test("Abnormal PUT : update user detail, username in path not found", async () => {

      userService.findOneByUsername = function(username) {
        return new Promise((resolve, reject) => {
          reject({
            error: true,
            errMsg: "User not found",
            rc: "99",
          })
        })
      }
      class Coba {
        isValidAuthBearerHeader(req) {
          return true;
        }
        authRequestBodyValidation(req) {
          return true;
        }
        authorizationOwn(req) {
          return true;
        }
      }
      const updateUserDetailHandler = userController.updateUserDetail(
        userService,
        new Coba()
      );
      await updateUserDetailHandler(req, res, {});

      expect(res.httpStatus).toEqual(500);
      expect(res.body.error).toEqual(true);
    });

    test("Abnormal PUT : updating another user detail", async () => {

      class Coba {
        isValidAuthBearerHeader(req) {
          return true;
        }
        authRequestBodyValidation(req) {
          return true;
        }
        authorizationOwn(req) {
          return false;
        }
      }
      const updateUserDetailHandler = userController.updateUserDetail(
        userService,
        new Coba()
      );
      await updateUserDetailHandler(req, res, {});

      expect(res.httpStatus).toEqual(401);
      expect(res.body.error).toEqual(true);
    });
  });
});
