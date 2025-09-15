export declare const userSchema: {
    register: import("zod").ZodObject<{
        name: import("zod").ZodString;
        email: import("zod").ZodString;
        password: import("zod").ZodString;
    }, import("zod/v4/core/schemas.cjs").$strip>;
    login: import("zod").ZodObject<{
        email: import("zod").ZodString;
        password: import("zod").ZodString;
    }, import("zod/v4/core/schemas.cjs").$strip>;
    updateProfile: import("zod").ZodObject<{
        name: import("zod").ZodOptional<import("zod").ZodString>;
        email: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("zod/v4/core/schemas.cjs").$strip>;
    createUser: import("zod").ZodObject<{
        name: import("zod").ZodString;
        email: import("zod").ZodString;
        password: import("zod").ZodString;
        role: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("zod/v4/core/schemas.cjs").$strip>;
    updateUser: import("zod").ZodObject<{
        name: import("zod").ZodOptional<import("zod").ZodString>;
        email: import("zod").ZodOptional<import("zod").ZodString>;
        role: import("zod").ZodOptional<import("zod").ZodString>;
        status: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("zod/v4/core/schemas.cjs").$strip>;
};
