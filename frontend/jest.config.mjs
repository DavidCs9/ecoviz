export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^../../../shared/validation$": "<rootDir>/src/__mocks__/shared-validation.js",
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
};
