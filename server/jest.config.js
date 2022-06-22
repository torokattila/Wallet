/* eslint-disable max-len */
/** @ŧype { import('ts-jest/dist/types').InitialOptionsTsJest} */

// @ts-ignore
module.exports = {
    preset: 'ts-jest',
    moduleDirectories: ['node_modules', 'src'],
    moduleFileExtensions: ['js', 'ts', 'json', 'node'],
    reporters: ['default', 'jest-junit'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    collectCoverage: true,
    collectCoverageFrom: [
        './src/(**|!(db|types|enums|config|services|controllers|middlewares))/*.ts',
    ],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
    coverageProvider: 'v8',
    coverageReporters: ['json', 'text', 'lcov', 'clover'],
};
