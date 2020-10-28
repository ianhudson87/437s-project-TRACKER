const express = require('express')
import dbConfig from "./config/db"
import middlewaresConfig from './config/middlewares'
import {TrackerRoutes} from './modules'
var cors = require('cors')

const app = express();
app.use(cors())

/**
 * Database
 */
dbConfig();

/**
 * Api
 */
middlewaresConfig(app);

app.use('/api', [TrackerRoutes])

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('APP LISTENING HAHAHAJDIOWAJDPOIWAJDpoi');
    }
});