import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    globals: {
        'ts-jest': {
            babelConfig: true,
        },
    },
    preset: 'ts-jest',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^~/(.*)$': ['<rootDir>/$1', '<rootDir>/layout/$1'],
        '^vue$': 'vue/dist/vue.common.js',
    },
    moduleFileExtensions: ['ts', 'js', 'vue', 'json', 'gql'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
        '.*\\.(vue)$': 'vue-jest',
        '\\.(gql|graphql)$': 'jest-transform-graphql',
    },
    collectCoverage: false,
    collectCoverageFrom: [
        '<rootDir>/components/**/*.vue',
        '<rootDir>/layouts/**/*.vue',
        '<rootDir>/pages/**/*.vue',
        '<rootDir>/plugins/**/*.ts',
        '<rootDir>/store/**/*.ts',
    ],
    setupFiles: ['./jest.setup.ts'],
};

export default config;
