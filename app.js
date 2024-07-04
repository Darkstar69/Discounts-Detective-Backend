import dotenv from 'dotenv'
import express from 'express'
import userRoute from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
import errorMiddleware from './middlewares/error.middleware.js'


dotenv.config({
    path: './.env'
})


const PORT = process.env.PORT || 5000

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(errorMiddleware)

app.use('/api/v1/user', userRoute);

app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}`));