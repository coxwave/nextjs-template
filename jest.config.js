/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@assets/(.*)': '<rootDir>/assets/$1',
    '@components/(.*)': '<rootDir>/components/$1',
    '@defines/(.*)': '<rootDir>/defines/$1',
    '@lib/(.*)': '<rootDir>/lib/$1',
    '@utils/(.*)': '<rootDir>/utils/$1',
    '@repository/(.*)': '<rootDir>/repository/$1',
  },
  moduleDirectories: ['node_modules'],
};
