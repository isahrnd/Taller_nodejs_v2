"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../src/index"));
const schemas_1 = require("../../src/schemas");
const zod_1 = require("zod");
const baseUrl = "/api/services";
const testService = {
    "name": "Test Haircut",
    "durationMin": 30,
    "price": 25,
    "status": "active"
};
const updatedService = {
    "name": "Updated Haircut",
    "durationMin": 45,
    "price": 30,
    "status": "active"
};
describe("Service API Integration Flow", () => {
    let serviceId; // will hold the ID of the created service
    const serviceName = "Test Haircut";
    it("GET /services → should return list (initially empty or with data)", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get(baseUrl);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it("POST /services → should create a new service", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post(baseUrl)
            .send(testService);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.name).toBe(serviceName);
        serviceId = res.body._id; // save ID for later tests
    });
    it("GET /services → should include the newly created service", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get(baseUrl);
        expect(res.statusCode).toBe(200);
        const service = res.body.find((s) => s.name === serviceName);
        expect(service).toBeDefined();
        serviceId = service._id; // update in case the first POST response didn’t include id
    });
    it("GET /services/:id → should return the created service", async () => {
        console.log(`Fetching service with ID: ${serviceId}`);
        const res = await (0, supertest_1.default)(index_1.default).get(`${baseUrl}/${serviceId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("_id", serviceId);
        expect(res.body.name).toBe(serviceName);
    });
    it("PUT /services/:id → should update the service", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .put(`${baseUrl}/${serviceId}`)
            .send(updatedService);
        expect([200, 204]).toContain(res.statusCode);
    });
    it("DELETE /services/:id → should delete the service", async () => {
        const res = await (0, supertest_1.default)(index_1.default).delete(`${baseUrl}/${serviceId}`);
        expect([200, 204]).toContain(res.statusCode);
    });
    it("GET /services/:id → should not find deleted service", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get(`${baseUrl}/${serviceId}`);
        expect(res.statusCode).toBe(404);
    });
});
describe("Service Schema Validation", () => {
    it("should fail with multiple invalid inputs", () => {
        const invalidInputs = [
            {}, // completely empty
            { name: "Haircut" }, // missing duration, price, status
            { durationMin: 30, price: 20, status: "active" }, // missing name
            { name: 123, durationMin: 30, price: 20, status: "active" }, // invalid type for name
            { name: "Trim", durationMin: "thirty", price: 20, status: "active" }, // invalid type for duration
            { name: "Shave", durationMin: 30, price: "twenty", status: "active" }, // invalid type for price
            { name: "Wash", durationMin: 30, price: 20, status: 1 }, // invalid type for status
        ];
        invalidInputs.forEach((input) => {
            expect(() => schemas_1.serviceSchema.parse(input)).toThrow(zod_1.ZodError);
        });
    });
});
//# sourceMappingURL=service.test.js.map