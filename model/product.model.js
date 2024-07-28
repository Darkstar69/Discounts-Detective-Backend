import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },

    discount: {
        type: Number,
        required: true
    },

    platform: {
        type: String,
        required: true
    },

    platformIcon: {
        type: String
    },

    description: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    prevPrice: {
        type: Number,
        required: true
    },

    offerLink: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const ProductDetails = mongoose.model("CouponDetails", productSchema)