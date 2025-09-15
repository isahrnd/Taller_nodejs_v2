"use strict";
/* Silence noisy logs and reset mocks */
// Optional: silence console.error to keep test output clean
const originalError = console.error;
beforeAll(() => {
    // Comment out if you want error output during tests
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.error = jest.fn();
});
afterAll(() => {
    console.error = originalError;
});
beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
});
//# sourceMappingURL=jest.setup.js.map