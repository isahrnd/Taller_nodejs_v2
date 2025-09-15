const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...require("ts-jest").createDefaultPreset().transform,
  },
  setupFiles: ["<rootDir>/jest.setup.js"], 
};
