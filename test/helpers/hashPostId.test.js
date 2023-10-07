const {
  generatePostId,
  generatePostSlugAdd,
} = require("../../helpers/hashPostId");

describe('Post ID generator', () => {
  test('Normal encode : minimal length 12', () => {
    expect(generatePostId.encode([1]).length).toBeGreaterThanOrEqual(12)
  });

  test('Normal encode : encoding result', () => {
    // JCq6zcla5xB9
    expect(generatePostId.encode([1])).toBe('JCq6zcla5xB9')
  });

  test('Normal decode : decoding result', () => {
    // JCq6zcla5xB9
    expect(generatePostId.decode('JCq6zcla5xB9')).toContain(1)
  });
});

describe('Additional Post slug generator', () => {
  test('Normal encode : minimal length 8', () => {
    expect(generatePostSlugAdd.encode([1]).length).toBeGreaterThanOrEqual(8)
  });

  test('Normal encode : encoding result', () => {
    // LC47kDjR
    expect(generatePostSlugAdd.encode([1])).toBe('LC47kDjR')
  });

  test('Normal decode : decoding result', () => {
    // LC47kDjR
    expect(generatePostSlugAdd.decode('LC47kDjR')).toContain(1)
  });
});