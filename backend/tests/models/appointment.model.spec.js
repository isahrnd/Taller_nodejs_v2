"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Appointment_1 = require("../../src/models/Appointment");
describe('Appointment Model schema', () => {
    it('has required fields', () => {
        const schema = Appointment_1.AppointmentModel.schema;
        const fields = ['client_id', 'staff_id', 'service_id', 'start_at', 'end_at', 'status', 'paid_flag'];
        for (const f of fields) {
            expect(schema.path(f)).toBeTruthy();
        }
    });
    it('has indexes on staff_id + start_at/end_at', () => {
        const indexes = Appointment_1.AppointmentModel.schema.indexes();
        const hasStartIdx = indexes.some(([spec]) => spec.staff_id === 1 && spec.start_at === 1);
        const hasEndIdx = indexes.some(([spec]) => spec.staff_id === 1 && spec.end_at === 1);
        expect(hasStartIdx).toBe(true);
        expect(hasEndIdx).toBe(true);
    });
});
//# sourceMappingURL=appointment.model.spec.js.map