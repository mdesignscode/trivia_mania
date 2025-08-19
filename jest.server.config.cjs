const config = {
        transform: {
                '^.+\\.ts$': ['ts-jest', { tsconfig: './tsconfig.json' }],
                '^.+\\.svelte$': ['svelte-jester', { preprocess: true }]
        },
        moduleFileExtensions: ['js', 'ts', 'svelte'],
        testEnvironment: 'jsdom',
        setupFilesAfterEnv: [
                // '<rootDir>/setupTests_backend.ts',
                // '@testing-library/jest-dom'
        ],
        moduleNameMapper: {
                '^currentUser$': '<rootDir>/src/utils/currentUser.ts',
                '^components/(.*)$': '<rootDir>/src/routes/components/$1',
                '^models$': '<rootDir>/src/models/index.ts',
                '^utils/(.*)$': '<rootDir>/src/utils/$1',
                '^store/(.*)$': '<rootDir>/src/utils/store/$1'
        }
};

module.exports = config;

