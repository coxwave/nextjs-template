/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@assets/(.*)': '<rootDir>/assets/$1',
    '@src/(.*)': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  globalSetup: './jest/setup.js',
  globalTeardown: './jest/teardown.js',
  testEnvironment: './jest/mongo-environment.js',
};
