"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../src/services");
const mongoose_1 = require("mongoose");
// Mocks for models
jest.mock('../../src/models/Appointment', () => ({
    AppointmentModel: require('../mocks/models/AppointmentModel.mock').AppointmentModel,
}));
jest.mock('../../src/models', () => ({
    ServiceModel: require('../mocks/models/ServiceModel.mock').ServiceModel,
}));
const AppointmentModel_mock_1 = require("../mocks/models/AppointmentModel.mock");
const ServiceModel_mock_1 = require("../mocks/models/ServiceModel.mock");
const asISO = (d) => new Date(d).toISOString();
describe('AppointmentService.create', () => {
    const baseData = {
        client_id: '507f1f77bcf86cd799439011',
        staff_id: '507f1f77bcf86cd799439012',
        service_id: '507f1f77bcf86cd799439013',
        start_at: asISO('2025-01-01T10:00:00.000Z'),
        end_at: asISO('2025-01-01T11:00:00.000Z'),
        notes: 'note',
    };
    const userClient = { id: '507f1f77bcf86cd799439011', role: 'client' };
    const userAdmin = { id: '507f1f77bcf86cd799439099', role: 'admin' };
    const activeService = { _id: '507f1f77bcf86cd799439013', status: 'active', durationMin: 60 };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('throws 403 if client creates for another client', async () => {
        await expect(services_1.appointmentService.create({ ...baseData, client_id: 'other' }, userClient)).rejects.toMatchObject({ status: 403 });
    });
    it('throws 404 when service not found', async () => {
        ServiceModel_mock_1.ServiceModel.findById.mockResolvedValueOnce(null);
        await expect(services_1.appointmentService.create(baseData, userClient)).rejects.toMatchObject({
            status: 404,
        });
    });
    it('throws 400 when service inactive', async () => {
        ServiceModel_mock_1.ServiceModel.findById.mockResolvedValueOnce({ status: 'inactive' });
        await expect(services_1.appointmentService.create(baseData, userClient)).rejects.toMatchObject({
            status: 400,
        });
    });
    it('throws 400 for invalid time range', async () => {
        ServiceModel_mock_1.ServiceModel.findById.mockResolvedValueOnce(activeService);
        const bad = { ...baseData, start_at: baseData.end_at, end_at: baseData.start_at };
        await expect(services_1.appointmentService.create(bad, userClient)).rejects.toMatchObject({
            status: 400,
        });
    });
    it('throws 400 when duration does not match service durationMin', async () => {
        ServiceModel_mock_1.ServiceModel.findById.mockResolvedValueOnce({ ...activeService, durationMin: 90 });
        await expect(services_1.appointmentService.create(baseData, userClient)).rejects.toMatchObject({
            status: 400,
        });
    });
    it('throws 409 when time slot overlaps', async () => {
        ServiceModel_mock_1.ServiceModel.findById.mockResolvedValueOnce(activeService);
        AppointmentModel_mock_1.AppointmentModel.exists.mockResolvedValueOnce(true);
        await expect(services_1.appointmentService.create(baseData, userClient)).rejects.toMatchObject({
            status: 409,
        });
    });
    it('creates successfully when no overlap and service active', async () => {
        ServiceModel_mock_1.ServiceModel.findById.mockResolvedValueOnce(activeService);
        AppointmentModel_mock_1.AppointmentModel.exists.mockResolvedValueOnce(false);
        const created = { _id: 'a1', ...baseData, status: 'SCHEDULED', paid_flag: false };
        AppointmentModel_mock_1.AppointmentModel.create.mockResolvedValueOnce(created);
        const result = await services_1.appointmentService.create(baseData, userClient);
        expect(AppointmentModel_mock_1.AppointmentModel.create).toHaveBeenCalledTimes(1);
        const arg = AppointmentModel_mock_1.AppointmentModel.create.mock.calls[0][0];
        expect(arg).toMatchObject({ notes: 'note', status: 'SCHEDULED', paid_flag: false });
        // ObjectId + Date conversions
        expect(arg.client_id).toBeInstanceOf(mongoose_1.Types.ObjectId);
        expect(arg.staff_id).toBeInstanceOf(mongoose_1.Types.ObjectId);
        expect(arg.service_id).toBeInstanceOf(mongoose_1.Types.ObjectId);
        expect(arg.start_at).toBeInstanceOf(Date);
        expect(arg.end_at).toBeInstanceOf(Date);
        expect(result).toBe(created);
    });
});
describe('AppointmentService.list', () => {
    beforeEach(() => {
        AppointmentModel_mock_1.AppointmentModel.find.mockReset();
    });
    it('admin sees all with filters applied', async () => {
        const items = [];
        const sort = jest.fn().mockResolvedValue(items);
        AppointmentModel_mock_1.AppointmentModel.find.mockReturnValue({ sort });
        const user = { id: '507f1f77bcf86cd799439099', role: 'admin' };
        const query = { from: '2025-01-01T00:00:00.000Z', to: '2025-01-31T23:59:59.000Z', staffId: '507f1f77bcf86cd799439012', serviceId: '507f1f77bcf86cd799439013' };
        const res = await services_1.appointmentService.list(query, user);
        expect(res).toBe(items);
        expect(AppointmentModel_mock_1.AppointmentModel.find).toHaveBeenCalledTimes(1);
        const filter = AppointmentModel_mock_1.AppointmentModel.find.mock.calls[0][0];
        expect(filter.staff_id).toBeInstanceOf(mongoose_1.Types.ObjectId);
        expect(filter.service_id).toBeInstanceOf(mongoose_1.Types.ObjectId);
        expect(filter.start_at.$gte).toBeInstanceOf(Date);
        expect(filter.start_at.$lte).toBeInstanceOf(Date);
    });
    it('stylist filters by own staff_id', async () => {
        const sort = jest.fn().mockResolvedValue([]);
        AppointmentModel_mock_1.AppointmentModel.find.mockReturnValue({ sort });
        const user = { id: '507f1f77bcf86cd799439012', role: 'stylist' };
        await services_1.appointmentService.list({}, user);
        const filter = AppointmentModel_mock_1.AppointmentModel.find.mock.calls[0][0];
        expect(filter.staff_id).toBeInstanceOf(mongoose_1.Types.ObjectId);
    });
    it('client filters by own client_id', async () => {
        const sort = jest.fn().mockResolvedValue([]);
        AppointmentModel_mock_1.AppointmentModel.find.mockReturnValue({ sort });
        const user = { id: '507f1f77bcf86cd799439011', role: 'client' };
        await services_1.appointmentService.list({}, user);
        const filter = AppointmentModel_mock_1.AppointmentModel.find.mock.calls[0][0];
        expect(filter.client_id).toBeInstanceOf(mongoose_1.Types.ObjectId);
    });
});
describe('AppointmentService.getOne', () => {
    it('throws 403 if user is not admin, owner, or assigned stylist', async () => {
        AppointmentModel_mock_1.AppointmentModel.findById.mockResolvedValueOnce({
            _id: 'a1',
            client_id: '507f1f77bcf86cd799439011',
            staff_id: '507f1f77bcf86cd799439012',
        });
        const user = { id: '507f1f77bcf86cd799439000', role: 'client' };
        await expect(services_1.appointmentService.getOne('a1', user)).rejects.toMatchObject({ status: 403 });
    });
    it('returns appointment for admin', async () => {
        const appt = { _id: 'a1', client_id: '507f1f77bcf86cd799439011', staff_id: '507f1f77bcf86cd799439012' };
        AppointmentModel_mock_1.AppointmentModel.findById.mockResolvedValueOnce(appt);
        const user = { id: '507f1f77bcf86cd799439099', role: 'admin' };
        const res = await services_1.appointmentService.getOne('a1', user);
        expect(res).toBe(appt);
    });
});
describe('AppointmentService.update', () => {
    it('status DONE only allowed for assigned stylist or admin', async () => {
        AppointmentModel_mock_1.AppointmentModel.findById.mockResolvedValueOnce({
            _id: 'a1',
            client_id: '507f1f77bcf86cd799439011',
            staff_id: '507f1f77bcf86cd799439012',
            start_at: new Date('2025-01-01T10:00:00.000Z'),
            end_at: new Date('2025-01-01T11:00:00.000Z'),
        });
        const user = { id: '507f1f77bcf86cd799439011', role: 'client' }; // owner but not stylist/admin
        await expect(services_1.appointmentService.update('a1', { status: 'DONE' }, user)).rejects.toMatchObject({ status: 403 });
    });
    it('throws 400 on invalid new time range', async () => {
        AppointmentModel_mock_1.AppointmentModel.findById.mockResolvedValueOnce({
            _id: 'a1',
            client_id: '507f1f77bcf86cd799439011',
            staff_id: '507f1f77bcf86cd799439012',
            start_at: new Date('2025-01-01T10:00:00.000Z'),
            end_at: new Date('2025-01-01T11:00:00.000Z'),
        });
        const user = { id: '507f1f77bcf86cd799439099', role: 'admin' };
        await expect(services_1.appointmentService.update('a1', { start_at: '2025-01-01T12:00:00.000Z', end_at: '2025-01-01T11:00:00.000Z' }, user)).rejects.toMatchObject({ status: 400 });
    });
    it('throws 409 when updated time overlaps', async () => {
        AppointmentModel_mock_1.AppointmentModel.findById.mockResolvedValueOnce({
            _id: 'a1',
            client_id: '507f1f77bcf86cd799439011',
            staff_id: new mongoose_1.Types.ObjectId('507f1f77bcf86cd799439012'),
            start_at: new Date('2025-01-01T10:00:00.000Z'),
            end_at: new Date('2025-01-01T11:00:00.000Z'),
        });
        AppointmentModel_mock_1.AppointmentModel.exists.mockResolvedValueOnce(true);
        const user = { id: '507f1f77bcf86cd799439012', role: 'stylist' }; // assigned stylist
        await expect(services_1.appointmentService.update('a1', { start_at: '2025-01-01T10:30:00.000Z', end_at: '2025-01-01T11:30:00.000Z' }, user)).rejects.toMatchObject({ status: 409 });
    });
    it('updates successfully when no overlap', async () => {
        const appt = {
            _id: 'a1',
            client_id: new mongoose_1.Types.ObjectId('507f1f77bcf86cd799439011'),
            staff_id: new mongoose_1.Types.ObjectId('507f1f77bcf86cd799439012'),
            start_at: new Date('2025-01-01T10:00:00.000Z'),
            end_at: new Date('2025-01-01T11:00:00.000Z'),
        };
        AppointmentModel_mock_1.AppointmentModel.findById.mockResolvedValueOnce(appt);
        AppointmentModel_mock_1.AppointmentModel.exists.mockResolvedValueOnce(false);
        const updated = { ...appt, notes: 'updated' };
        AppointmentModel_mock_1.AppointmentModel.findByIdAndUpdate.mockResolvedValueOnce(updated);
        const user = { id: '507f1f77bcf86cd799439012', role: 'stylist' }; // assigned stylist
        const res = await services_1.appointmentService.update('a1', { notes: 'updated', start_at: '2025-01-01T10:00:00.000Z', end_at: '2025-01-01T11:00:00.000Z' }, user);
        expect(res).toBe(updated);
        expect(AppointmentModel_mock_1.AppointmentModel.findByIdAndUpdate).toHaveBeenCalled();
    });
});
describe('AppointmentService.remove', () => {
    it('only admin or owning client can remove', async () => {
        AppointmentModel_mock_1.AppointmentModel.findById.mockResolvedValueOnce({
            _id: 'a1',
            client_id: '507f1f77bcf86cd799439011',
        });
        const user = { id: '507f1f77bcf86cd799439012', role: 'stylist' };
        await expect(services_1.appointmentService.remove('a1', user)).rejects.toMatchObject({ status: 403 });
    });
    it('returns true on successful deletion by admin', async () => {
        AppointmentModel_mock_1.AppointmentModel.findById.mockResolvedValueOnce({ _id: 'a1', client_id: '507f1f77bcf86cd799439011' });
        AppointmentModel_mock_1.AppointmentModel.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });
        const user = { id: '507f1f77bcf86cd799439099', role: 'admin' };
        const ok = await services_1.appointmentService.remove('a1', user);
        expect(ok).toBe(true);
    });
    it('returns false when not found', async () => {
        AppointmentModel_mock_1.AppointmentModel.findById.mockResolvedValueOnce(null);
        const user = { id: '507f1f77bcf86cd799439099', role: 'admin' };
        const ok = await services_1.appointmentService.remove('a1', user);
        expect(ok).toBe(false);
    });
});
//# sourceMappingURL=appointment.service.spec.js.map