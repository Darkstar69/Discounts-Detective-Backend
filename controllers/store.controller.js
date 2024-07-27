import asyncHandler from '../utils/asyncHandler.js'
import { ErrorHandler } from '../utils/errorHandler.js';
import { Brand } from '../model/brand.model.js';
import { ProductDetails } from '../model/product.model.js';


export const storeDetailsAdd = asyncHandler(async (req, res, next) => {
    try {
        const { name, url } = req.body;

        if (!name)
            return next(new ErrorHandler("Please Provide Name", 400));

        if (!url)
            return next(new ErrorHandler("Please Provide Brand Logo", 400));

        const isStore = await Brand.findOne({ name });

        if (isStore)
            return next(new ErrorHandler('Store Already Exist', 400))

        const newStore = await Brand.create({
            name,
            url
        })

        if (!newStore)
            return next(new ErrorHandler("Store Not Get Added", 500))

        return res.status(200).json({
            success: true,
            newStore
        })


    } catch (error) {
        return new Error(error)
    }
})

export const getAllStores = asyncHandler(async (req, res, next) => {
    try {
        const allStores = await Brand.find();
        return res.status(200).json({
            success: true,
            allStores
        })
    } catch (error) {
        return new Error(error)
    }
})

export const couponsAdd = asyncHandler(async (req, res, next) => {
    try {
        const { title, thumbnail, discount, platform, platformIcon, description, price, prevPrice, offerLink } = req.body;

        const isCoupon = await ProductDetails.findOne({ offerLink });

        if (isCoupon) { return next(new ErrorHandler("Coupon Already Exists", 400)) }

        const newCoupon = await ProductDetails.create({
            title,
            thumbnail,
            discount,
            platform,
            platformIcon,
            description,
            price,
            prevPrice,
            offerLink
        })

        if (!newCoupon) {
            return next(new ErrorHandler("Coupon Not Added", 500))
        }

        return res.status(200).json({
            success: true,
            newCoupon
        })

    } catch (error) {
        return new Error(error)
    }
})

export const getAllCoupons = asyncHandler(async (req, res, next) => {
    try {
        const allCoupons = await ProductDetails.find();
        return res.status(200).json({
            success: true,
            allCoupons
        })
    } catch (error) {
        return new Error(error)
    }
})

export const deleteCoupon = asyncHandler(async (req, res, next) => {
    try {
        const _id = req.query._id;

        const deletedData = await ProductDetails.findOneAndDelete({ _id })

        if (!deletedData) {
            return next(new ErrorHandler("Coupon Not Deleted", 500))
        }

        return res.status(200).json({
            success: true,
            deletedData
        })
    } catch (error) {
        return new Error(error)
    }
})

export const updateCoupon = asyncHandler(async (req, res, next) => {
    try {
        const _id = req.query._id;
        const { title, thumbnail, discount, platform, platformIcon, description, price, prevPrice, offerLink } = req.body;
        const updatedData = await ProductDetails.findOneAndUpdate(
            { _id },
            {
                $set: {
                    title,
                    thumbnail,
                    discount,
                    platform,
                    platformIcon,
                    description,
                    price,
                    prevPrice,
                    offerLink
                }
            },
            { new: true }
        );

        if (!updatedData) {
            return next(new ErrorHandler("Coupon Not Updated", 500))
        }

        return res.status(200).json({
            success: true,
            updatedData
        })
    } catch (error) {
        return new Error(error)
    }
})