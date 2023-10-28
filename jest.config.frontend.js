const nextJest = require('next/jest');

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' });

// Any custom config you want to pass to Jest
const customJestConfig = {
  "resetMocks": false,
  "setupFiles": ["jest-localstorage-mock"],
  "setupFilesAfterEnv": [
    "<rootDir>/setupTests_frontend.ts"
  ],
  "moduleNameMapper": {
    "^@/components/(.*)$": "<rootDir>/app/components/$1",
    "^@/styles/(.*)$": "<rootDir>/app/styles/$1",
    "^@/models/(.*)$": "<rootDir>/models/$1",
    "^@/store/(.*)$": "<rootDir>/app/components/store/$1",
    "^@/api/(.*)$": "<rootDir>/app/api/$1",
    "^@/store(.*)$": "<rootDir>/app/components/store$1",
    "^@/hooks/(.*)$": "<rootDir>/app/hooks/$1",
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
    "^@/context/(.*)$": "<rootDir>/app/context/$1",
    "^setupTests_frontend(.*)$": "<rootDir>/setupTests_frontend$1",
  },
  testEnvironment: "jsdom",
  preset: 'ts-jest',
  moduleDirectories: [
    'node_modules',
    'utils',
  ],
};

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = createJestConfig(customJestConfig);
