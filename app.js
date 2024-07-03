import dotenv from 'dotenv'
import express from 'express'
import userRoute from './routes/user.routes.js'

dotenv.config({
    path: './.env'
})


const PORT = process.env.PORT || 5000

const app = express();

app.get('/', (res, req) => {
    req.send('THis is Working')
})

app.use('/api/v1/user', userRoute);

app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}`));