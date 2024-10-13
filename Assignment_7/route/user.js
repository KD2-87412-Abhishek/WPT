const express = require("express"); 
const db = require("../db");
const util = require('../Util');
const crypto = require('crypto-js');
const jwt=require("jsonwebtoken");

const config= require('./config');



const router = express.Router();

router.post('/login',(req,res)=>{
    const {email,password} = req.body;
    const stmp = `select id ,firstName, lastName,phoneNumber,isDeleted from user where email =? and password =?`; 
    const encryptedPassword =String(crypto.SHA256(password))
    db.pool.query(stmp,[email,encryptedPassword],(error,users)=>
        {
        if(error)
        {
            res.send(util.createErrorResult(error));
        }
        else{
                     if(users.length==0)
                    {
                        res.send(util.createErrorResult('user does not exist'))
                    }
            else{
                const user = users[0]
                
                if(user.isDeleted){
                        res.send(util.createErrorResult('your account is closed'))
                }

                else{
                // create the payload
                console.log("u"+user.id);
                const payload ={ id:user.id}
                const token = jwt.sign(payload,config.secret)
                const usersData={
                token, 
                name: `${user['firstName']} ${user['lastName']}`,
                                }
                res.send(util.createSuccessResult(usersData))
                     }
                 }
            }      
        }
)});
router.post('/register',(req, res)=>{
const { firstName, lastName, email,password, phone} = req.body
const statement = `insert into user (firstName, lastName, email, password, phoneNumber) values (?, ?, ?, ?, ?);`
const encryptedPassword =String(crypto.SHA256(password))
db.pool.execute(
    statement,
    [firstName,lastName,email,encryptedPassword,phone],
    (error,result)=>{
        res.send(util.createResult(error,result))
    }
)
});





app.put("/profile/", (req, res) => {
    const { firstName, lastName, phone } = req.body;
    const statement = `update user set firstName= ?,LastName= ?, phoneNumber=? where id=?`;
    db.pool.query(
      statement,
      [firstName, lastName, phone, req.userId],
      (err, result) => {
        res.send(utils.createResult(err, result));
      }
    );
  });

  app.get("/profile/", (req, res) => {
    const statement = `select firstName,lastName,phoneNumber,email from user where id=?`;
    db.pool.query(statement, [req.userId], (err, result) => {
      res.send(utils.createResult(err, result));
    });
  });
  


module.exports=router;