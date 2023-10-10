const errMapping = require("../../helpers/userErrorDef");
const bcrypt = require("bcrypt");
const UserService = require("../../services/UserService");
const { UniqueConstraintError } = require("sequelize");

describe("UserService : initilization", () => {
  test("Abnormal : empry UserModel", () => {
    expect(() => new UserService()).toThrow(Error);
  });
});

describe("UserService : tambahUser(UserData)", () => {
  let mockUserModel = {};

  test("Normal : create new user", async () => {
    let reqBody = {
      username: "jimmy",
      firstName: "Jimmy",
      middleName: "Feriawan",
      mobile: "087784517748",
      email: "feriawanjimmy@mail.com",
      password: "123456",
    };

    mockUserModel.create = function (userData) {
      return new Promise((resolve, reject) => {
        resolve([0]);
      });
    };

    const userService = new UserService(mockUserModel);
    let tambahUser = await userService.tambahUser(reqBody);

    expect(tambahUser.error).toBe(false);
  });

  test("Abnormal : username already exist", async () => {
    let reqBody = {
      username: "jimmy",
      firstName: "Jimmy",
      middleName: "Feriawan",
      mobile: "087784517748",
      email: "feriawanjimmy@mail.com",
      password: "123456",
    };

    mockUserModel.create = function (userData) {
      return new Promise((resolve, reject) => {
        reject(
          new UniqueConstraintError({
            fields: { uq_username: userData.username },
            message: "error",
          })
        );
      });
    };
    const userService = new UserService(mockUserModel);

    return userService
      .tambahUser(reqBody)
      .catch((e) => expect(e.error).toEqual(true));
  });

  // test('Abnormal : username already exist', async () => {

  // });

  // test('Abnormal : email already exist', async () => {

  // });

  // test('Abnormal : mobile already exist', async () => {

  // });

  test("Abnormal : username already exist", async () => {
    let reqBody = {
      username: "jimmy",
      firstName: "Jimmy",
      middleName: "Feriawan",
      mobile: "087784517748",
      email: "feriawanjimmy@mail.com",
      password: "123456",
    };

    mockUserModel.create = function (userData) {
      return new Promise((resolve, reject) => {
        reject(
          new Error("Something error from DB")
        );
      });
    };
    const userService = new UserService(mockUserModel);

    return userService
      .tambahUser(reqBody)
      .catch((e) => expect(e.error).toEqual(true));
  });  
});

describe("UserService : findOneByUsernamePassword(username, password)", () => {
  mockUserModel = {};
  test("Normal : correct username & password ", async () => {
    bcrypt.compareSync = function (plain, hashed) {
      return true;
    };

    mockUserModel.findOne = function (objInput) {
      return new Promise((resolve, reject) => {
        resolve({
          dataValues: {
            id: 2,
            username: "jimmy",
            firstName: "Jimmy Feriawan",
            middleName: "Feriawan",
            lastName: "",
            mobile: "081212341230",
            email: "feriawanjimmy@mail.com",
            passwordHash:
              "$2b$10$VmXt1xEh0rovnKe4gdGFzeoYZ2FH90WhxILpYVRyyu0IXN9IfoqgK",
            registeredAt: new Date("2023-09-30T19:00:16.000Z"),
            lastLogin: null,
            intro: null,
            profile: null,
            emailConfirmed: "N",
          },
        });
      });
    };

    const userService = new UserService(mockUserModel);
    let findOneByUsernamePassword = await userService.findOneByUsernamePassword(
      "jimmy",
      "123456"
    );

    expect(findOneByUsernamePassword.error).toEqual(false);
  });

  test("Abnormal : incorrect username  not found ", async () => {
    bcrypt.compareSync = function (plain, hashed) {
      return false;
    };

    mockUserModel.findOne = function (objInput) {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    };

    const userService = new UserService(mockUserModel);

    try {
      await userService.findOneByUsernamePassword("jimmy", "123456");
    } catch (err) {
      expect(err.error).toEqual(true);
    }
  });

  test("Abnormal : incorrect password ", async () => {
    bcrypt.compareSync = function (plain, hashed) {
      return false;
    };

    mockUserModel.findOne = function (objInput) {
      return new Promise((resolve, reject) => {
        resolve({
          dataValues: {
            id: 2,
            username: "jimmy",
            firstName: "Jimmy Feriawan",
            middleName: "Feriawan",
            lastName: "",
            mobile: "081212341230",
            email: "feriawanjimmy@mail.com",
            passwordHash:
              "$2b$10$VmXt1xEh0rovnKe4gdGFzeoYZ2FH90WhxILpYVRyyu0IXN9IfoqgK",
            registeredAt: new Date("2023-09-30T19:00:16.000Z"),
            lastLogin: null,
            intro: null,
            profile: null,
            emailConfirmed: "N",
          },
        });
      });
    };

    const userService = new UserService(mockUserModel);

    try {
      await userService.findOneByUsernamePassword("jimmy", "123456");
    } catch (err) {
      expect(err.error).toEqual(true);
    }
  });

  test("Abormal : Other database error", async () => {
    mockUserModel.findOne = function (objInput) {
      return new Promise((resolve, reject) => {
        reject(new Error("Someting error"));
      });
    };

    const userService = new UserService(mockUserModel);

    try {
      await userService.findOneByUsernamePassword("jimmy", "123456");
    } catch (err) {
      expect(err.error).toEqual(true);
    }
  });
});

describe("UserService : findOneByUsername(username)", () => {
  let mockUserModel = {};
  test("Normal : username found ", async () => {
    let normal = {};
    normal.findOne = function (reqBody) {
      return new Promise((resolve, reject) => {
        resolve({
          id: 2,
          username: "jimmy",
          firstName: "Jimmy Feriawan",
          middleName: "Feriawan",
          lastName: "",
          mobile: "081212341230",
          email: "feriawanjimmy@mail.com",
          passwordHash:
            "$2b$10$VmXt1xEh0rovnKe4gdGFzeoYZ2FH90WhxILpYVRyyu0IXN9IfoqgK",
          registeredAt: "2023-09-30T19:00:16.000Z",
          lastLogin: null,
          intro: null,
          profile: null,
          emailConfirmed: "N",
        });
      });
    };
    const userService = new UserService(normal);

    try {
      let hasil = await userService.findOneByUsername("jimmy");
      expect(hasil.error).toBe(false);
    } catch (err) {
      console.log(err);
    }
  });

  test("Abnormal : username not found", async () => {
    expect.assertions(1);
    let abnormal = {};

    abnormal.findOne = function (reqBody) {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    };
    const userService = new UserService(abnormal);

    return userService
      .findOneByUsername("jimmy")
      .catch((e) => expect(e.error).toEqual(true));
    // let hasil;
    // try {
    //   hasil = await userService.findOneByUsername("jimmy")
    // } catch(err) {
    //   expect(err.error).toBe(true)
    // }
  });

  test("Abnormal : Other error from database", async () => {
    let normal = {};
    normal.findOne = function (reqBody) {
      return new Promise((resolve, reject) => {
        reject(new Error("Something error"));
      });
    };
    const userService = new UserService(normal);

    try {
      let hasil = await userService.findOneByUsername("jimmy");
    } catch (err) {
      expect(err.error).toBe(true);
    }
  });
});

describe("UserService : updateDetailByUsername(username, UserData)", () => {
  let mockUserModel = {};

  test("Normal : update user detail", async () => {
    mockUserModel.update = function (Userdata, objInput) {
      return new Promise((resolve, reject) => {
        resolve([0]);
      });
    };
    const userService = new UserService(mockUserModel);
    let updateDetailByUsername = await userService.updateDetailByUsername(
      "jimmy",
      {}
    );

    expect(updateDetailByUsername.body.error).toBe(false);
  });

  test("Abnormal : username already used by other user", async () => {
    mockUserModel.update = function (userData, objInput) {
      return new Promise((resolve, reject) => {
        reject({
          name: "SequelizeUniqueConstraintError",
          fields: { uq_username: userData.username },
        });
      });
    };
    const userService = new UserService(mockUserModel);
    try {
      let updateDetailByUsername = await userService.updateDetailByUsername(
        "jimmy",
        {}
      );
    } catch (err) {
      expect(err.body.error).toBe(true);
    }
  });

  test("Abnormal : other erro from database", async () => {
    mockUserModel.update = function (userData, objInput) {
      return new Promise((resolve, reject) => {
        reject(new Error("something was error"));
      });
    };
    const userService = new UserService(mockUserModel);
    try {
      let updateDetailByUsername = await userService.updateDetailByUsername(
        "jimmy",
        {}
      );
    } catch (err) {
      expect(err.body.error).toBe(true);
    }
  });
});

describe("UserService : updateEmailConfirmed(username)", () => {
  let mockUserModel = {};
  test("Normal : update confirmed email to true", async () => {
    mockUserModel.update = function (Userdata, objInput) {
      return new Promise((resolve, reject) => {
        resolve([0]);
      });
    };
    const userService = new UserService(mockUserModel);
    let updateEmailConfirmed = await userService.updateEmailConfirmed("jimmy");

    expect(updateEmailConfirmed.error).toBe(false);
  });

  test("Abnormal : error from DB while trying updating status", async () => {
    mockUserModel.update = function (Userdata, objInput) {
      return new Promise((resolve, reject) => {
        reject(new Error("Something error"));
      });
    };
    const userService = new UserService(mockUserModel);

    try {
      let updateEmailConfirmed = await userService.updateEmailConfirmed(
        "jimmy"
      );
    } catch (err) {
      expect(err.error).toBe(true);
    }
  });
});

describe("UserService : updatePassword(username, newPassword)", () => {
  let mockUserModel = {};
  test("Normal : update new password", async () => {
    mockUserModel.update = function (Userdata, objInput) {
      return new Promise((resolve, reject) => {
        resolve([0]);
      });
    };
    const userService = new UserService(mockUserModel);
    let updatePassword = await userService.updatePassword("jimmy", "123456");

    expect(updatePassword.error).toBe(false);
  });

  test("Abnormal : error from DB when updating password", async () => {
    mockUserModel.update = function (Userdata, objInput) {
      return new Promise((resolve, reject) => {
        reject(new Error("Error"));
      });
    };
    const userService = new UserService(mockUserModel);
    try {
      let updatePassword = await userService.updatePassword("jimmy", "123456");
    } catch (err) {
      expect(err.error).toBe(true);
    }
  });
});
