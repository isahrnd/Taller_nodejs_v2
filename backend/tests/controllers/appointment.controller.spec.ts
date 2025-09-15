import request from 'supertest';
import { buildTestApp } from '../utils/testApp';
import { appointmentService } from '../../src/services';

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
  const app = buildTestApp();
  const validBody = {
    client_id: 'u-client',
    staff_id: 'u-staff',
    service_id: 'svc-1',
    start_at: new Date('2025-01-01T10:00:00.000Z').toISOString(),
    end_at: new Date('2025-01-01T11:00:00.000Z').toISOString(),
    notes: 'note',
  };

  it('returns 201 on success', async () => {
    (appointmentService.create as jest.Mock).mockResolvedValueOnce({ id: 'a1', ...validBody });
    const res = await request(app)
      .post('/appointments')
      .set('x-test-user', JSON.stringify({ id: 'u-client', role: 'client' }))
      .send(validBody);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 'a1' });
    expect(appointmentService.create).toHaveBeenCalledTimes(1);
  });

  it('propagates service errors with status', async () => {
    const statuses = [400, 403, 404, 409];
    for (const code of statuses) {
      (appointmentService.create as jest.Mock).mockRejectedValueOnce(
        Object.assign(new Error(`fail ${code}`), { status: code })
      );
      const res = await request(app)
        .post('/appointments')
        .set('x-test-user', JSON.stringify({ id: 'u-client', role: 'client' }))
        .send(validBody);
      expect(res.status).toBe(code);
      expect(res.body).toHaveProperty('message');
    }
  });

  it('does not call service if schema invalid', async () => {
    const invalid = { ...validBody };
    delete (invalid as any).client_id;

    const res = await request(app)
      .post('/appointments')
      .set('x-test-user', JSON.stringify({ id: 'u-client', role: 'client' }))
      .send(invalid);
    expect(res.status).toBe(400);
    expect(appointmentService.create).toHaveBeenCalledTimes(0);
  });
});

describe('AppointmentController other routes', () => {
  const app = buildTestApp();

  it('GET /appointments returns 200 with list', async () => {
    (appointmentService.list as jest.Mock).mockResolvedValueOnce([]);
    const res = await request(app)
      .get('/appointments')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439011', role: 'admin' }));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('GET /appointments propagates service error status', async () => {
    (appointmentService.list as jest.Mock).mockRejectedValueOnce(Object.assign(new Error('forbidden'), { status: 403 }));
    const res = await request(app)
      .get('/appointments')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439011', role: 'client' }));
    expect(res.status).toBe(403);
  });

  it('GET /appointments returns 500 when error has no status', async () => {
    (appointmentService.list as jest.Mock).mockRejectedValueOnce(new Error('oops'));
    const res = await request(app)
      .get('/appointments')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439011', role: 'client' }));
    expect(res.status).toBe(500);
  });

  it('GET /appointments/:id returns 200 for found', async () => {
    (appointmentService.getOne as jest.Mock).mockResolvedValueOnce({ id: 'a1' });
    const res = await request(app)
      .get('/appointments/a1')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439011', role: 'client' }));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 'a1' });
  });

  it('GET /appointments/:id returns 404 when not found', async () => {
    (appointmentService.getOne as jest.Mock).mockResolvedValueOnce(null);
    const res = await request(app)
      .get('/appointments/unknown')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'admin' }));
    expect(res.status).toBe(404);
  });

  it('GET /appointments/:id propagates error status', async () => {
    (appointmentService.getOne as jest.Mock).mockRejectedValueOnce(Object.assign(new Error('forbidden'), { status: 403 }));
    const res = await request(app)
      .get('/appointments/a1')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'client' }));
    expect(res.status).toBe(403);
  });

  it('GET /appointments/:id returns 500 when error has no status', async () => {
    (appointmentService.getOne as jest.Mock).mockRejectedValueOnce(new Error('oops'));
    const res = await request(app)
      .get('/appointments/a1')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'client' }));
    expect(res.status).toBe(500);
  });

  it('PATCH /appointments/:id returns 404 when service returns null', async () => {
    (appointmentService.update as jest.Mock).mockResolvedValueOnce(null);
    const res = await request(app)
      .patch('/appointments/a1')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439012', role: 'stylist' }))
      .send({ notes: 'x' });
    expect(res.status).toBe(404);
  });

  it('PATCH /appointments/:id returns 200 on success', async () => {
    (appointmentService.update as jest.Mock).mockResolvedValueOnce({ id: 'a1', notes: 'x' });
    const res = await request(app)
      .patch('/appointments/a1')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439012', role: 'stylist' }))
      .send({ notes: 'x' });
    expect(res.status).toBe(200);
  });

  it('PATCH /appointments/:id propagates error status', async () => {
    (appointmentService.update as jest.Mock).mockRejectedValueOnce(Object.assign(new Error('forbidden'), { status: 403 }));
    const res = await request(app)
      .patch('/appointments/a1')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439012', role: 'stylist' }))
      .send({ notes: 'x' });
    expect(res.status).toBe(403);
  });

  it('DELETE /appointments/:id returns 200 when deleted', async () => {
    (appointmentService.remove as jest.Mock).mockResolvedValueOnce(true);
    const res = await request(app)
      .delete('/appointments/a1')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'admin' }));
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });

  it('DELETE /appointments/:id returns 404 when not found', async () => {
    (appointmentService.remove as jest.Mock).mockResolvedValueOnce(false);
    const res = await request(app)
      .delete('/appointments/a2')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'admin' }));
    expect(res.status).toBe(404);
  });

  it('DELETE /appointments/:id propagates error status', async () => {
    (appointmentService.remove as jest.Mock).mockRejectedValueOnce(Object.assign(new Error('forbidden'), { status: 403 }));
    const res = await request(app)
      .delete('/appointments/a1')
      .set('x-test-user', JSON.stringify({ id: '507f1f77bcf86cd799439099', role: 'admin' }));
    expect(res.status).toBe(403);
  });
});
