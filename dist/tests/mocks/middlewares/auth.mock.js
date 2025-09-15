"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMock = void 0;
const authMock = (req, _res, next) => {
    const header = req.header('x-test-user');
    try {
        const parsed = header ? JSON.parse(header) : { id: 'u-client', role: 'client' };
        req.user = parsed;
    }
    catch (_e) {
        req.user = { id: 'u-client', role: 'client' };
    }
    next();
};
exports.authMock = authMock;
//# sourceMappingURL=auth.mock.js.map