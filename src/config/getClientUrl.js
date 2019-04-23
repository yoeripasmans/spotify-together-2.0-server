module.exports = () => {
  switch (process.env.APP_ENV) {
  case 'test':
    return 'http://spotify-together.peggy';
  default:
    return 'http://localhost:3000';
  }
};
