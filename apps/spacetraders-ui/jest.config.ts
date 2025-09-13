/* eslint-disable */
export default {
  displayName: 'spacetraders-ui',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[tj]s?(x)'],
  rootDir: '.',
  coverageDirectory: '../../coverage/apps/spacetraders-ui',
};


