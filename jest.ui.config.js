import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
        testEnvironment: "jsdom",
        transform: {
                ...tsJestTransformCfg,
        },
        testMatch: [
                '**/tests/**/*.(svelte.ts|svelte)',
        ],
        moduleNameMapper: {
                '^currentUser$': '<rootDir>/src/utils/currentUser.ts',
                '^components/(.*)$': '<rootDir>/src/routes/components/$1',
                '^models$': '<rootDir>/src/models/index.ts',
                '^utils/(.*)$': '<rootDir>/src/utils/$1',
                '^store$': '<rootDir>/src/utils/store/',
        },
        "setupFiles": [
                "<rootDir>/jest.ui.setup.ts",
        ],
        "setupFilesAfterEnv": [
                "<rootDir>/setupTests.ui.ts"
        ],
};

