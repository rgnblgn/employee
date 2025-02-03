export default {
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transform: {
    "^.+\\.js$": [
      "babel-jest",
      {
        rootMode: "upward",
        targets: { node: "current" }
      }
    ]
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@reduxjs|lit-redux-watch|lit|@lit|lit-element|lit-html)/)"
  ],
  setupFiles: ["<rootDir>/jest.setup.cjs"]
}; 