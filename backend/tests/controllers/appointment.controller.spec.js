"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testApp_1 = require("../utils/testApp");
const services_1 = require("../../src/services");
jest.mock('../../src/services', () => ({
    appointmentService: {
        create: jest.fn(),
        list: jest.fn(),
        getOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    },
}));
describe('AppointmentController.create', () => {
    const app = (0, testApp_1.buildTestApp)();
    const validBody = {
        client_id: 'u-client',
        staff_id: 'u-staff',
        service_id: 'svc-1',
        start_at: new Date('2025-01-01T10:00:00.000Z').toISOString(),
        end_at: new Date('2025-01-01T11:00:00.000Z').toISOString(),
        notes: 'note',
    };
    it('returns 201 on success', async () => {
        services_1.appointmentService.create.mockResolvedValueOnce({ id: 'a1', ...validBody });
        const res = await (0, supertest_1.default)(app)
            .post('/appointments')
            .set('x-test-user', JSON.stringify({ id: 'u-client', role: 'client' }))
            .send(validBody);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ id: 'a1' });
        expect(services_1.appointmentService.create).toHaveBeenCalledTimes(1);
    });
    it('propagates service errors with status', async () => {
        const statuses = [400, 403, 404, 409];
        for (const code of statuses) {
            services_1.appointmentService.create.mockRejectedValueOnce(Object.assign(new Error(`fail ${code}`), { status: code }));
            const res = await (0, supertest_1.default)(app)
                .post('/appointments')
                .set('x-test-user', JSON.stringify({ id: 'u-client', role: 'client' }))
                .send(validBody);
            expect(res.status).toBe(code);
            expect(res.body).toHaveProperty('message');
        }
    });
    it('does not call service if schema invalid', async () => {
        const invalid = { ...validBody };
        delete invalid.client_id;
        const res = await (0, supertest_1.default)(app)
            .post('/appointments')
            .set('x-test-user', JSON.stringify({ id: 'u-client', role: 'client' }))
            .send(invalid);
        expect(res.status).toBe(400);
        expect(services_1.appointmentService.create).toHaveBeenCalledTimes(0);
    });
});
describe('AppointmentController other routes', () => {
    const app = (0, testApp_1.buildTestApp)();
    it('GET /appointments returns 200 with list', async () => {
        services_1.appointmentService.list.mockResolvedValueOnce([]);
        const res = await (0, supertest_1.default)(app)
            .get('/appointments')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439011', role: 'admin' }));
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
    it('GET /appointments propagates service error status', async () => {
        services_1.appointmentService.list.mockRejectedValueOnce(Object.assign(new Error('forbidden'), { status: 403 }));
        const res = await (0, supertest_1.default)(app)
            .get('/appointments')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439011', role: 'client' }));
        expect(res.status).toBe(403);
    });
    it('GET /appointments returns 500 when error has no status', async () => {
        services_1.appointmentService.list.mockRejectedValueOnce(new Error('oops'));
        const res = await (0, supertest_1.default)(app)
            .get('/appointments')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439011', role: 'client' }));
        expect(res.status).toBe(500);
    });
    it('GET /appointments/:id returns 200 for found', async () => {
        services_1.appointmentService.getOne.mockResolvedValueOnce({ id: 'a1' });
        const res = await (0, supertest_1.default)(app)
            .get('/appointments/a1')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439011', role: 'client' }));
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 'a1' });
    });
    it('GET /appointments/:id returns 404 when not found', async () => {
        services_1.appointmentService.getOne.mockResolvedValueOnce(null);
        const res = await (0, supertest_1.default)(app)
            .get('/appointments/unknown')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'admin' }));
        expect(res.status).toBe(404);
    });
    it('GET /appointments/:id propagates error status', async () => {
        services_1.appointmentService.getOne.mockRejectedValueOnce(Object.assign(new Error('forbidden'), { status: 403 }));
        const res = await (0, supertest_1.default)(app)
            .get('/appointments/a1')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'client' }));
        expect(res.status).toBe(403);
    });
    it('GET /appointments/:id returns 500 when error has no status', async () => {
        services_1.appointmentService.getOne.mockRejectedValueOnce(new Error('oops'));
        const res = await (0, supertest_1.default)(app)
            .get('/appointments/a1')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'client' }));
        expect(res.status).toBe(500);
    });
    it('PATCH /appointments/:id returns 404 when service returns null', async () => {
        services_1.appointmentService.update.mockResolvedValueOnce(null);
        const res = await (0, supertest_1.default)(app)
            .patch('/appointments/a1')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439012', role: 'stylist' }))
            .send({ notes: 'x' });
        expect(res.status).toBe(404);
    });
    it('PATCH /appointments/:id returns 200 on success', async () => {
        services_1.appointmentService.update.mockResolvedValueOnce({ id: 'a1', notes: 'x' });
        const res = await (0, supertest_1.default)(app)
            .patch('/appointments/a1')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439012', role: 'stylist' }))
            .send({ notes: 'x' });
        expect(res.status).toBe(200);
    });
    it('PATCH /appointments/:id propagates error status', async () => {
        services_1.appointmentService.update.mockRejectedValueOnce(Object.assign(new Error('forbidden'), { status: 403 }));
        const res = await (0, supertest_1.default)(app)
            .patch('/appointments/a1')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439012', role: 'stylist' }))
            .send({ notes: 'x' });
        expect(res.status).toBe(403);
    });
    it('DELETE /appointments/:id returns 200 when deleted', async () => {
        services_1.appointmentService.remove.mockResolvedValueOnce(true);
        const res = await (0, supertest_1.default)(app)
            .delete('/appointments/a1')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'admin' }));
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ deleted: true });
    });
    it('DELETE /appointments/:id returns 404 when not found', async () => {
        services_1.appointmentService.remove.mockResolvedValueOnce(false);
        const res = await (0, supertest_1.default)(app)
            .delete('/appointments/a2')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'admin' }));
        expect(res.status).toBe(404);
    });
    it('DELETE /appointments/:id propagates error status', async () => {
        services_1.appointmentService.remove.mockRejectedValueOnce(Object.assign(new Error('forbidden'), { status: 403 }));
        const res = await (0, supertest_1.default)(app)
            .delete('/appointments/a1')
            .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'admin' }));
        expect(res.status).toBe(403);
    });
});
//# sourceMappingURL=appointment.controller.spec.js.map