const nextJest = require('next/jest')

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' })

// Any custom config you want to pass to Jest
const customJestConfig = {
  "setupFilesAfterEnv": [
    "<rootDir>/setupTests_backend.ts"
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
  },
  preset: "ts-jest",
  testEnvironment: "node"
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = createJestConfig(customJestConfig)
