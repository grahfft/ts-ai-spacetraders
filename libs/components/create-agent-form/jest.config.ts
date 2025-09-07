export default {
  displayName: 'create-agent',
  preset: '../../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: { react: { runtime: 'automatic' } },
          target: 'es2020'
        }
      }
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  coverageDirectory: '../../../coverage/libs/components/create-agent-form',
};
