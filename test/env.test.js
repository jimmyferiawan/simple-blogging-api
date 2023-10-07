describe('ENV Variable test', () => {
  test('database Host variable : DB_HOST', () => {
    expect(process.env.DB_HOST).not.toBe(null)
    expect(process.env.DB_HOST).not.toBe('')
  });

  test('database user variable : DB_USER', () => {
    expect(process.env.DB_USER).not.toBe(null)
    expect(process.env.DB_USER).not.toBe('')
  });

  test('database DB name variable : DB_NAME', () => {
    expect(process.env.DB_NAME).not.toBe(null)
    expect(process.env.DB_NAME).not.toBe('')
  });

  test('database DB dialiect variable : DB_NAME', () => {
    expect(process.env.DB_NAME).not.toBe(null)
    expect(process.env.DB_NAME).not.toBe('')
    expect(process.env.DB_NAME).not.toBe('mysql')
  });
  test('App port variable : APP_PORT', () => {
    expect(process.env.APP_PORT).not.toBe(null)
    expect(process.env.APP_PORT).not.toBe('')
  });
});