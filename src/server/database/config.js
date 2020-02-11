module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'development.sqlite',
    logging: () => {},
  },
  test: {
    dialect: 'sqlite',
    storage: 'test.sqlite',
  },
  production: {
    dialect: 'sqlite',
    storage: 'production.sqlite',
    logging: () => {},
  },
};
