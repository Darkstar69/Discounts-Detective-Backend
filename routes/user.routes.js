import express from 'express'

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send('User Register Successfully');
})

router.get('/login', (req, res) => {
    res.send('User Login Successfully');
})


export default router

