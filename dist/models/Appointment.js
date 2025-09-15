"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentModel = void 0;
const mongoose_1 = require("mongoose");
const AppointmentSchema = new mongoose_1.Schema({
    client_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    staff_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    service_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true },
    start_at: { type: Date, required: true },
    end_at: { type: Date, required: true },
    status: {
        type: String,
        enum: ['SCHEDULED', 'RESCHEDULED', 'CANCELLED', 'DONE'],
        default: 'SCHEDULED',
    },
    notes: { type: String },
    paid_flag: { type: Boolean, default: false },
}, { timestamps: true });
AppointmentSchema.index({ staff_id: 1, start_at: 1 });
AppointmentSchema.index({ staff_id: 1, end_at: 1 });
exports.AppointmentModel = (0, mongoose_1.model)('Appointment', AppointmentSchema);
//# sourceMappingURL=Appointment.js.map