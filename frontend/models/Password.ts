import { Schema, model, models } from 'mongoose';

const PasswordEntrySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
        },

        username: {
            type: String,
            required: true,
        },

        encryptedPassword: {
            type: String,
            required: true,
        },

        url: {
            type: String,
        },

        category: {
            type: String,
            enum: ['personal', 'work', 'finance', 'social'],
            default: 'personal',
        },
    },
    {
        timestamps: true, // createdAt + updatedAt
    },
);

export const PasswordEntry = models.PasswordEntry || model('PasswordEntry', PasswordEntrySchema);
