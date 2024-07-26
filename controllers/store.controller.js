import asyncHandler from '../utils/asyncHandler.js'
import { ErrorHandler } from '../utils/errorHandler.js';
import { Brand } from '../model/brand.model.js';


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