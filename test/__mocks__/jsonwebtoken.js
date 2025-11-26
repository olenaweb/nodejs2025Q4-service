// Temporary mock for jsonwebtoken to bypass buffer-equal-constant-time issue
module.exports = {
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};
