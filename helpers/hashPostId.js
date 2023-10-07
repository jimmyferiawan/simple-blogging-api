const Sqids = require("sqids").default;

const generatePostId = new Sqids({
  alphabet: "yPHzobkmTfDh9MB0CEcVFN4IAL7X8-s5dOerglpS1wxW3jvnRGQqiUYaJ2K6utZ_",
  minLength: 12,
});
const generatePostSlugAdd = new Sqids({
  alphabet: "jUmC0c1iT2EvlMHnPZth5GwQbW8fSYg7NOBLuxodR6eKDF4zq3askXIyp9VrJA",
  minLength: 8,
});

module.exports = { generatePostId, generatePostSlugAdd };
