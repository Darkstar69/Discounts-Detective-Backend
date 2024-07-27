import express from 'express';
import { couponsAdd, deleteCoupon, getAllCoupons, getAllStores, storeDetailsAdd, updateCoupon } from "../controllers/store.controller.js";

const router = express.Router();

router.post('/storeDetailsAdd', storeDetailsAdd);
router.get('/getStores', getAllStores);
router.get('/getAllCoupons', getAllCoupons);
router.post('/couponsAdd', couponsAdd);
router.get('/deleteCoupon', deleteCoupon);
router.post('/updateCoupon', updateCoupon);

export default router;