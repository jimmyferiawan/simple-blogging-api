const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserController = require("../../controllers/UserController");

describe("UserController", () => {

  const userService = {
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
    findOneByUsername: function(username) {
      return new Promise((resolve, reject) => {
        resolve({
          error: false,
          errMsg: null,
          rc: "00",
          data: {
            username: 'jimmy',
            firstname: 'Jimmy Feriawan',
            middlename: 'Feriawan',
            lastname: '',
            intro: null,
            profile: null
          }
        })
      })
    },
    updateDetailByUsername: function(username, UserReqUpdate) {
      return new Promise((resolve, reject) => {
        resolve({
          httpStatusCode: 200,
          body: {
            error: false,
            errMsg: null,
          },
        })
      })
    }
  };
  const userController = new UserController(userService);
  const res = {
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

  test("Normal POST : sign up user", async () => {
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
    await signUpRouteHandler(req, res, {});
    // console.log("res obj => ", res)
    expect(res.httpStatus).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  test("Normal POST : sign in user", async () => {
    process.env.APP_SECRET = "ksfgbfasj82A83ak839h8_A83nai12jJ293"
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

  test('Normal GET : view User by username', async () => {
    const req = {
      params: {
        username: "jimmy"
      }
    }
    const viewUserHandler = userController.viewUser(userService);
    await viewUserHandler(req, res, {})

    expect(res.httpStatus).toEqual(200)
    expect(res.body.error).toEqual(false)
  });

  test('Normal PUT : update user detail', async () => {
    const req = {
      params: {
        username: "jimmy"
      },
      headers: {
        authorization: "Bearer ashfafsdgkfsdgolmdvnksvkfdsgn"
      },
      body: {
        username: "jimmy",
        firstName: "Jimmy Feriawan",
        middleName: "Feriawan",
        mobile: "081212341230",
        email: "feriawanjimmy@mail.com"
      }
    }
    class Coba{
      isValidAuthBearerHeader(req){
        return true
      }
      authRequestBodyValidation(req){
        return true
      }
      authorizationOwn(req) {
        return true
      }
    }
    const updateUserDetailHandler = userController.updateUserDetail(userService, new Coba());
    await updateUserDetailHandler(req, res, {})

    expect(res.httpStatus).toEqual(200)
    expect(res.body.error).toEqual(false)
  });
});
