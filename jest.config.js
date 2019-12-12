module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    NODE_ENV: 'test',
    env: {
      API_PORT: 8000,
      API_HOST: 'localhost',
      API_PROTOCOL: 'http',
      NODE_ENV: 'TEST',
    },
    'ts-jest': {
      babelConfig: true,
    },
  },
  testMatch: ['**/?(*.)(spec|test).(ts|tsx|js|jsx)'],
  verbose: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup/setupTestFramework.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'json', 'js', 'jsx'],
  // moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/setup/stub.css',
  },
  modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
  transformIgnorePatterns: ['/node_modules/(?!@amzn/awsui-).+\\.js$'],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
}
