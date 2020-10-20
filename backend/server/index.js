const express = require('express')
import dbConfig from "./config/db"
import middlewaresConfig from './config/middlewares'
import {TrackerRoutes} from './modules'

const app = express();

/**
 * Database
 */
dbConfig();

/**
 * Database
 */
middlewaresConfig(app);

app.use('/api', [TrackerRoutes])
app.get('/test', (res,req)=>{
    res = "hi"
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('APP LISTENING HAHAHAJDIOWAJDPOIWAJDpoi');
    }
});