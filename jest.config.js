const { createCjsPreset } = require('jest-preset-angular/presets');

module.exports = {
  ...createCjsPreset(),

  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  testMatch: ['**/*.spec.ts'],

  collectCoverage: true,
  coverageDirectory: 'coverage/dmc-zoom-app',
  coverageReporters: ['lcov', 'text-summary'],

  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@modules/(.*)$': '<rootDir>/src/app/modules/$1',
    '^@environments/(.*)$': '<rootDir>/src/environments/$1',
  },
};
