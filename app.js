// npm install express, ejs, mongoose, body-parser
// use yarn to go fast

var bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


dotenv.config();
const app = express();


app.set('view engine', 'ejs');


let connect_uri = process.env.MONGO_DB;
mongoose.connect(connect_uri,
    { useNewUrlParser: true},
    () => {
        console.log("DB Address -->  " + connect_uri);
    }
);


// Import Routes
const IndexRoute = require('./routes/index');
const AccountRoute = require('./routes/account');
const MenuRoute = require('./routes/menu');
const ApiRoute = require('./routes/api');
const AuthRoute = require('./routes/auth');


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Route Middlewares
app.use('/', IndexRoute);
app.use('/account', AccountRoute);
app.use('/menu', MenuRoute);
app.use('/api', ApiRoute);
app.use('/auth', AuthRoute);


// set owr public directory
app.use(express.static('public'));


const port = process.env.PORT;
app.listen(port, () => {
    console.log("Server is running.");
});
