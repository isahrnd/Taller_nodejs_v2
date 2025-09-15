import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/services/appointment.service.ts',
    'src/controllers/appointment.controller.ts',
    'src/models/Appointment.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/schemas/',
    'src/routes/',
    'src/config/',
    'src/app.ts',
    'src/index.ts',
    'src/models/User.ts',
    'src/models/Service.ts',
    'src/services/user.service.ts',
    'src/services/service.service.ts',
    'src/controllers/user.controller.ts',
    'src/controllers/service.controller.ts',
  ],
  testPathIgnorePatterns: ['<rootDir>/src/tests', '<rootDir>/tests/api'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
};

export default config;
