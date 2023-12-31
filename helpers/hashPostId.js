const Sqids = require("sqids").default;

const generatePostId = new Sqids({
  alphabet: "yPHzobkmTfDh9MB0CEcVFN4IAL7X8-s5dOerglpS1wxW3jvnRGQqiUYaJ2K6utZ_",
  minLength: 12,
});
const generatePostSlugAdd = new Sqids({
  alphabet: "jUmC0c1iT2EvlMHnPZth5GwQbW8fSYg7NOBLuxodR6eKDF4zq3askXIyp9VrJA",
  minLength: 8,
});
// should be generated from next auto_increment : SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = "blog" AND TABLE_NAME = "user";
const generateActivation = new Sqids({
  alphabet: "BJ0bpMh7jaRIQgKZwPodx8zVN56svEiAWUCDuScOt2XYnFrk9qTeGy1lmL3H4f",
  minLength: 125,
});
const generateAdditionalFileName = new Sqids({
  alphabet: "XBfRswe7coHzEa1DQ95jVxbI80gkC4hGNn3UmYFdiPTAOMWvlSpyLr-q_2uKtJZ6",
  minLength: 16,
});
const generateForgetPasswordToken = new Sqids({
  alphabet: "-Dgw4XlVvsUyqMeWbTamNcC8LYdrR0EQO953hoHp7xFGBfzikI1SPnjA_6uKJtZ2",
  minLength: 20,
});
module.exports = { generatePostId, generatePostSlugAdd, generateActivation, generateAdditionalFileName, generateForgetPasswordToken };
