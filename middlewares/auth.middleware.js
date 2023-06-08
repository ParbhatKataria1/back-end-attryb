require('dotenv').config();
var jwt = require('jsonwebtoken');

const authentication = async(req, res, next)=>{
    const token = req.headers.authorization.split(" ")[1];
    if(!token)res.status(401).send({msg:'Token Not Provided'})
    
    try {
        jwt.verify(token, process.env.jwtSecret, function(err, decoded) {
            
            if(err){

                res.status(401).send({msg:'Invalid Token'})
            }else {
                req.headers.userid = decoded.userid;
                next();
            }
          });
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"})
    }
}

module.exports = {authentication}