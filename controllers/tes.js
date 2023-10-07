const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const authResponse = require("../views/auth");
const generalResponse = require("../views/generalResponse");
const viewResponse = require("../views/viewResponse");
const { responseLogger } = require("../helpers/logger");
const errMapping = require("../helpers/userErrorDef");

class TesController {
  UserService

  constructor(userService) {
    // this.#UserModel = UserModel || null;
    console.log(["userService => ", userService]);
    this.UserService = userService;
  }

  createUser(req, res) {
    console.log(["TesController.this => ", this]);
    res.send("Ok");
  }
}

module.exports = TesController;
