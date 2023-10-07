const slugify = require('../../helpers/slugify')

describe('title slug generartor test ', () => {
  
  test('Normal: space to -', () => {
    let slugify1 = slugify("hello world")

    expect(slugify1).toBe("hello-world")
  });

  test('Normal: to lowercase', () => {
    let slugify2 = slugify("HellO WorLd K")

    expect(slugify2).toBe("hello-world-k")
  });

  test('Normal: _ to -', () => {
    let slugify3 = slugify("hello_world")

    expect(slugify3).toBe("hello-world")
  });

  test('Abnormal: remove special characters', () => {
    let slugify4 = slugify("hello*$%^world")

    expect(slugify4).toBe("helloworld")
  });
});