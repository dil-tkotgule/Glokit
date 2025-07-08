import express, { urlencoded } from 'express';
import path from 'path';
import cors from 'cors';

import {Pool} from 'pg';
import { router } from './routes/product.routes';

 export const pool= new Pool({
    user:'postgres',
    password:'root',
    host:'localhost',
    port:5432,
    database:"Product"

})
pool.connect().then(()=>{console.log("database connected")}).catch(err=>console.log(err))

const app = express();
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/app/product', router)

app.listen(3000, ()=>{
    console.log('server is started')
})