import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Brand = mongoose.model('Brands', brandSchema);