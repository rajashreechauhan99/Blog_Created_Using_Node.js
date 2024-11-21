require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser =require('cookie-parser');
/*cookie is goinf to be saved all session 
what we login we dont have to keep log in all the time
*/
/* The cookie-parser package in Node.js is
 used to manage cookies in an Express application. 
 It's a middleware that allows developers to read 
 cookies on the request object for their routes. 
 */
const session = require('express-session');
const MongoStore = require('connect-mongo');


const connectDB = require('./server/config/db');


const app = express();

const PORT = 5000||process.env.PORT;
const {isActiveRoute} = require('./server/helpers/routeHelpers')
// Connect to DB
connectDB();

// urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),

}))


app.use(express.static('public'));

//templating engine
app.use(expressLayout);



app.set('layout','./layouts/main');
app.set('view engine','ejs');
app.locals.isActiveRoute = isActiveRoute

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));

app.listen(PORT,()=>{
    console.log(`App Listen at ${PORT}`);
})