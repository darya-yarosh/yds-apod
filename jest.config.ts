import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  collectCoverage: true,
  coverageReporters: ['json', 'html', 'text'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  reporters: [
    "default"
  ],
  moduleNameMapper: {
    "\\.(scss|css|less)$": "<rootDir>/styleMock.ts",
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/fileMock.ts'
  }
};

export default config;