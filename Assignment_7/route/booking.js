const express=require("express")
const db= require('../db')
const utils= require('../Util')
const config = require('./config')
const router =express.Router()

router.get('/',(request,response)=>{
    const statement =`select * from bookings`
    db.pool.query(statement,(error,bookings )=>{
        response.send(utils.createResult(error,bookings))
    })
    })

    router.post('/',(request,response) =>{
        
       const{propertyId,total,fromDate,toDate}=request.body
        // console.log(request.userId)
        console.log(request.body)
        console.log(request.userId)
        const statment = `insert into bookings(userId,propertyid,total,fromDate,toDate) values (?,?,?,?,?);`
        db.pool.execute(
            statment,
            [request.userId,propertyId,total,fromDate,toDate],
            (error,bookings)=>{
                console.log("gg"+request.userId)
                response.send(utils.createResult(error,bookings))
            }
        )
  
    })

    module.exports = router;
