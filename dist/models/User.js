"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'stylist', 'client'], default: 'client' },
    status: { type: String, default: 'active' }
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=User.js.map