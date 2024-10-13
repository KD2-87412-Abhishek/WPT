const express = require("express"); // serverside framework 
const userRouter = require('./route/user');
const propertyRouter = require('./route/property');
const app  = express();
const jwt=require("jsonwebtoken");
const config = require('./route/config');
const crypto = require('crypto-js')
app.use(express.json());
const categoryRouter= require('./route/category');

const bookingRouter=require('./route/booking');
// app.use((req,res,next)=>{
//     next();
// })
const util = require('./Util');



// middleware to verify token
app.use ((request ,response ,next)=>{
    // check if token is requied for the Api
if(
    request.url ==='/user/login'||
     request.url ==='/user/register'||
     request.url ==='/user/profile/:id'||     
     request.url.startsWith('/image/')     

){
    console.log("hhh");
    //skips verifying the token
    next()
}
else{
    // get the token
    const token= request.headers['token']
    console.log("token"+token)

    if(!token|| token.length == 0){
        response.send(util.createErrorResult('missing token'))
    }
    else{
        try{
            // verify the token
            const payload =jwt.verify(token,config.secret)

            // add the user id
            request.userId=payload ['id']
            console.log("s"+request.userId)
            // todo : expiry logic
            // call the real route
            next();
        } catch(ex){
            response.send(util.createErrorResult('invalid token'))
        }

    }
}
})
app.use('/user',userRouter);
app.use('/property',propertyRouter);
app.use('/category',categoryRouter);
app.use('/booking',bookingRouter);


app.listen(9999, ()=>{console.log("server started at port no 9999")})