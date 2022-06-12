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
};
