module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: { node: "current" },
      modules: "commonjs"
    }]
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs"
  ],
  assumptions: {
    setPublicClassFields: true
  },
  ignore: [
    "node_modules/(?!(@lit|lit|lit-element|lit-html|@lit-labs|@vaadin|@reduxjs|lit-redux-watch)/.*)"
  ]
}; 