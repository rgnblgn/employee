module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js$": ["babel-jest", {
      configFile: "./babel.config.cjs"
    }]
  },
  moduleFileExtensions: ["js", "json", "node"],
  setupFiles: ["<rootDir>/jest.setup.cjs"],
  transformIgnorePatterns: [
    "/node_modules/(?!(@lit|lit|lit-element|lit-html|@lit-labs|@vaadin|@reduxjs|lit-redux-watch)/.*)"
  ],
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testEnvironmentOptions: {
    customExportConditions: ['browser', 'node'],
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.js",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "text-summary"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}; 