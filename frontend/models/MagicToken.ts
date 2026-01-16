import { Schema, model, models } from 'mongoose';

const MagicTokenSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    used: {
        type: Boolean,
        required: true,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

export const MagicToken = models.MagicToken || model('MagicToken', MagicTokenSchema);
