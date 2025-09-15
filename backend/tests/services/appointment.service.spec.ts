import { appointmentService } from '../../src/services';
import { Types } from 'mongoose';

// Mocks for models
jest.mock('../../src/models/Appointment', () => ({
  AppointmentModel: require('../mocks/models/AppointmentModel.mock').AppointmentModel,
}));
jest.mock('../../src/models', () => ({
  ServiceModel: require('../mocks/models/ServiceModel.mock').ServiceModel,
}));

import { AppointmentModel } from '../mocks/models/AppointmentModel.mock';
import { ServiceModel } from '../mocks/models/ServiceModel.mock';

const asISO = (d: Date | string) => new Date(d).toISOString();

describe('AppointmentService.create', () => {
  const baseData = {
    client_id: '507f1f77bcf86cd799439011',
    staff_id: '507f1f77bcf86cd799439012',
    service_id: '507f1f77bcf86cd799439013',
    start_at: asISO('2025-01-01T10:00:00.000Z'),
    end_at: asISO('2025-01-01T11:00:00.000Z'),
    notes: 'note',
  };

  const userClient = { id: '507f1f77bcf86cd799439011', role: 'client' as const };
  const userAdmin = { id: '507f1f77bcf86cd799439099', role: 'admin' as const };
  const activeService = { _id: '507f1f77bcf86cd799439013', status: 'active', durationMin: 60 } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws 403 if client creates for another client', async () => {
    await expect(
      appointmentService.create({ ...baseData, client_id: 'other' }, userClient as any)
    ).rejects.toMatchObject({ status: 403 });
  });

  it('throws 404 when service not found', async () => {
    (ServiceModel.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(appointmentService.create(baseData as any, userClient as any)).rejects.toMatchObject({
      status: 404,
    });
  });

  it('throws 400 when service inactive', async () => {
    (ServiceModel.findById as jest.Mock).mockResolvedValueOnce({ status: 'inactive' });

    await expect(appointmentService.create(baseData as any, userClient as any)).rejects.toMatchObject({
      status: 400,
    });
  });

  it('throws 400 for invalid time range', async () => {
    (ServiceModel.findById as jest.Mock).mockResolvedValueOnce(activeService);
    const bad = { ...baseData, start_at: baseData.end_at, end_at: baseData.start_at };

    await expect(appointmentService.create(bad as any, userClient as any)).rejects.toMatchObject({
      status: 400,
    });
  });

  it('throws 400 when duration does not match service durationMin', async () => {
    (ServiceModel.findById as jest.Mock).mockResolvedValueOnce({ ...activeService, durationMin: 90 });

    await expect(appointmentService.create(baseData as any, userClient as any)).rejects.toMatchObject({
      status: 400,
    });
  });

  it('throws 409 when time slot overlaps', async () => {
    (ServiceModel.findById as jest.Mock).mockResolvedValueOnce(activeService);
    (AppointmentModel.exists as jest.Mock).mockResolvedValueOnce(true);

    await expect(appointmentService.create(baseData as any, userClient as any)).rejects.toMatchObject({
      status: 409,
    });
  });

  it('creates successfully when no overlap and service active', async () => {
    (ServiceModel.findById as jest.Mock).mockResolvedValueOnce(activeService);
    (AppointmentModel.exists as jest.Mock).mockResolvedValueOnce(false);

    const created = { _id: 'a1', ...baseData, status: 'SCHEDULED', paid_flag: false };
    (AppointmentModel.create as jest.Mock).mockResolvedValueOnce(created);

    const result = await appointmentService.create(baseData as any, userClient as any);

    expect(AppointmentModel.create).toHaveBeenCalledTimes(1);
    const arg = (AppointmentModel.create as jest.Mock).mock.calls[0][0];
    expect(arg).toMatchObject({ notes: 'note', status: 'SCHEDULED', paid_flag: false });
    // ObjectId + Date conversions
    expect(arg.client_id).toBeInstanceOf(Types.ObjectId);
    expect(arg.staff_id).toBeInstanceOf(Types.ObjectId);
    expect(arg.service_id).toBeInstanceOf(Types.ObjectId);
    expect(arg.start_at).toBeInstanceOf(Date);
    expect(arg.end_at).toBeInstanceOf(Date);
    expect(result).toBe(created);
  });
});

describe('AppointmentService.list', () => {
  beforeEach(() => {
    (AppointmentModel.find as jest.Mock).mockReset();
  });

  it('admin sees all with filters applied', async () => {
    const items: any[] = [];
    const sort = jest.fn().mockResolvedValue(items);
    (AppointmentModel.find as jest.Mock).mockReturnValue({ sort });

    const user = { id: '507f1f77bcf86cd799439099', role: 'admin' } as any;
    const query = { from: '2025-01-01T00:00:00.000Z', to: '2025-01-31T23:59:59.000Z', staffId: '507f1f77bcf86cd799439012', serviceId: '507f1f77bcf86cd799439013' };
    const res = await appointmentService.list(query as any, user);
    expect(res).toBe(items);
    expect(AppointmentModel.find).toHaveBeenCalledTimes(1);
    const filter = (AppointmentModel.find as jest.Mock).mock.calls[0][0];
    expect(filter.staff_id).toBeInstanceOf(Types.ObjectId);
    expect(filter.service_id).toBeInstanceOf(Types.ObjectId);
    expect(filter.start_at.$gte).toBeInstanceOf(Date);
    expect(filter.start_at.$lte).toBeInstanceOf(Date);
  });

  it('stylist filters by own staff_id', async () => {
    const sort = jest.fn().mockResolvedValue([]);
    (AppointmentModel.find as jest.Mock).mockReturnValue({ sort });

    const user = { id: '507f1f77bcf86cd799439012', role: 'stylist' } as any;
    await appointmentService.list({}, user);
    const filter = (AppointmentModel.find as jest.Mock).mock.calls[0][0];
    expect(filter.staff_id).toBeInstanceOf(Types.ObjectId);
  });

  it('client filters by own client_id', async () => {
    const sort = jest.fn().mockResolvedValue([]);
    (AppointmentModel.find as jest.Mock).mockReturnValue({ sort });

    const user = { id: '507f1f77bcf86cd799439011', role: 'client' } as any;
    await appointmentService.list({}, user);
    const filter = (AppointmentModel.find as jest.Mock).mock.calls[0][0];
    expect(filter.client_id).toBeInstanceOf(Types.ObjectId);
  });
});

describe('AppointmentService.getOne', () => {
  it('throws 403 if user is not admin, owner, or assigned stylist', async () => {
    (AppointmentModel.findById as jest.Mock).mockResolvedValueOnce({
      _id: 'a1',
      client_id: '507f1f77bcf86cd799439011',
      staff_id: '507f1f77bcf86cd799439012',
    });

    const user = { id: '507f1f77bcf86cd799439000', role: 'client' } as any;
    await expect(appointmentService.getOne('a1', user)).rejects.toMatchObject({ status: 403 });
  });

  it('returns appointment for admin', async () => {
    const appt = { _id: 'a1', client_id: '507f1f77bcf86cd799439011', staff_id: '507f1f77bcf86cd799439012' };
    (AppointmentModel.findById as jest.Mock).mockResolvedValueOnce(appt);
    const user = { id: '507f1f77bcf86cd799439099', role: 'admin' } as any;
    const res = await appointmentService.getOne('a1', user);
    expect(res).toBe(appt);
  });
});

describe('AppointmentService.update', () => {
  it('status DONE only allowed for assigned stylist or admin', async () => {
    (AppointmentModel.findById as jest.Mock).mockResolvedValueOnce({
      _id: 'a1',
      client_id: '507f1f77bcf86cd799439011',
      staff_id: '507f1f77bcf86cd799439012',
      start_at: new Date('2025-01-01T10:00:00.000Z'),
      end_at: new Date('2025-01-01T11:00:00.000Z'),
    });

    const user = { id: '507f1f77bcf86cd799439011', role: 'client' } as any; // owner but not stylist/admin
    await expect(
      appointmentService.update('a1', { status: 'DONE' } as any, user)
    ).rejects.toMatchObject({ status: 403 });
  });

  it('throws 400 on invalid new time range', async () => {
    (AppointmentModel.findById as jest.Mock).mockResolvedValueOnce({
      _id: 'a1',
      client_id: '507f1f77bcf86cd799439011',
      staff_id: '507f1f77bcf86cd799439012',
      start_at: new Date('2025-01-01T10:00:00.000Z'),
      end_at: new Date('2025-01-01T11:00:00.000Z'),
    });
    const user = { id: '507f1f77bcf86cd799439099', role: 'admin' } as any;
    await expect(
      appointmentService.update('a1', { start_at: '2025-01-01T12:00:00.000Z', end_at: '2025-01-01T11:00:00.000Z' } as any, user)
    ).rejects.toMatchObject({ status: 400 });
  });

  it('throws 409 when updated time overlaps', async () => {
    (AppointmentModel.findById as jest.Mock).mockResolvedValueOnce({
      _id: 'a1',
      client_id: '507f1f77bcf86cd799439011',
      staff_id: new Types.ObjectId('507f1f77bcf86cd799439012'),
      start_at: new Date('2025-01-01T10:00:00.000Z'),
      end_at: new Date('2025-01-01T11:00:00.000Z'),
    });
    (AppointmentModel.exists as jest.Mock).mockResolvedValueOnce(true);
    const user = { id: '507f1f77bcf86cd799439012', role: 'stylist' } as any; // assigned stylist
    await expect(
      appointmentService.update('a1', { start_at: '2025-01-01T10:30:00.000Z', end_at: '2025-01-01T11:30:00.000Z' } as any, user)
    ).rejects.toMatchObject({ status: 409 });
  });

  it('updates successfully when no overlap', async () => {
    const appt = {
      _id: 'a1',
      client_id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      staff_id: new Types.ObjectId('507f1f77bcf86cd799439012'),
      start_at: new Date('2025-01-01T10:00:00.000Z'),
      end_at: new Date('2025-01-01T11:00:00.000Z'),
    } as any;
    (AppointmentModel.findById as jest.Mock).mockResolvedValueOnce(appt);
    (AppointmentModel.exists as jest.Mock).mockResolvedValueOnce(false);
    const updated = { ...appt, notes: 'updated' };
    (AppointmentModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(updated);
    const user = { id: '507f1f77bcf86cd799439012', role: 'stylist' } as any; // assigned stylist
    const res = await appointmentService.update(
      'a1',
      { notes: 'updated', start_at: '2025-01-01T10:00:00.000Z', end_at: '2025-01-01T11:00:00.000Z' } as any,
      user
    );
    expect(res).toBe(updated);
    expect(AppointmentModel.findByIdAndUpdate).toHaveBeenCalled();
  });
});

describe('AppointmentService.remove', () => {
  it('only admin or owning client can remove', async () => {
    (AppointmentModel.findById as jest.Mock).mockResolvedValueOnce({
      _id: 'a1',
      client_id: '507f1f77bcf86cd799439011',
    });

    const user = { id: '507f1f77bcf86cd799439012', role: 'stylist' } as any;
    await expect(appointmentService.remove('a1', user)).rejects.toMatchObject({ status: 403 });
  });

  it('returns true on successful deletion by admin', async () => {
    (AppointmentModel.findById as jest.Mock).mockResolvedValueOnce({ _id: 'a1', client_id: '507f1f77bcf86cd799439011' });
    (AppointmentModel.deleteOne as jest.Mock).mockResolvedValueOnce({ deletedCount: 1 });
    const user = { id: '507f1f77bcf86cd799439099', role: 'admin' } as any;
    const ok = await appointmentService.remove('a1', user);
    expect(ok).toBe(true);
  });

  it('returns false when not found', async () => {
    (AppointmentModel.findById as jest.Mock).mockResolvedValueOnce(null);
    const user = { id: '507f1f77bcf86cd799439099', role: 'admin' } as any;
    const ok = await appointmentService.remove('a1', user);
    expect(ok).toBe(false);
  });
});
