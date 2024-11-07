module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['./jestSetup.js'],
    transformIgnorePatterns: [
      'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**', '!**/vendor/**'],
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    modulePathIgnorePatterns: [
      '<rootDir>/amplify/#current-cloud-backend/',
    ],
  };
  