"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = {
    register: (0, zod_1.object)({
        name: (0, zod_1.string)().min(1, "Name is required"),
        email: (0, zod_1.string)().email("Not a valid email address"),
        password: (0, zod_1.string)().min(8, "Password must be at least 8 characters long"),
    }),
    login: (0, zod_1.object)({
        email: (0, zod_1.string)().email("Not a valid email address"),
        password: (0, zod_1.string)().min(8, "Password must be at least 8 characters long"),
    }),
    updateProfile: (0, zod_1.object)({
        name: (0, zod_1.string)().optional(),
        email: (0, zod_1.string)().email("Not a valid email address").optional(),
    }),
    createUser: (0, zod_1.object)({
        name: (0, zod_1.string)().min(1),
        email: (0, zod_1.string)().email(),
        password: (0, zod_1.string)().min(8),
        role: (0, zod_1.string)().optional(),
    }),
    updateUser: (0, zod_1.object)({
        name: (0, zod_1.string)().optional(),
        email: (0, zod_1.string)().email().optional(),
        role: (0, zod_1.string)().optional(),
        status: (0, zod_1.string)().optional(),
    }),
};
//# sourceMappingURL=user.schema.js.map