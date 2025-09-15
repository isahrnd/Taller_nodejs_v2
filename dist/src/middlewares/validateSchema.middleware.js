"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const validateSchema = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            res.status(400).json(error);
        }
    };
};
exports.validateSchema = validateSchema;
//# sourceMappingURL=validateSchema.middleware.js.map