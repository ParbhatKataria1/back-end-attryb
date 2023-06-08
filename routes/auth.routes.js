const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { DealerModel } = require('../model/dealer.model');
const auth = express.Router();
require('dotenv').config();


auth.post('/sign-up', async(req, res)=>{
    try {
        let {username, email, password} = req.body;
        let userexist = await DealerModel.find({email});
        if(!username || !email || !password){
            res.status(401).send({msg:"please enter all the credentials"})
        }
        else if(userexist.length){
            res.status(409).send({msg:'User already exists'})
        }
        else {
            bcrypt.hash(password, +process.env.saltRound, async function(err, hash) {
                if(err){
                    res.status(500).send({msg:"Internal Server Error"});
                }
                else if(hash){
                    let dealer = new DealerModel({username, email, password:hash});
                    await dealer.save();
                    res.status(201).send({msg:'user is created', email, password, username})
                }
            });
        }
        
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"})
    }
})

auth.post('/login', async(req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            res.status(401).send({msg:"Please Enter All The Credentials"})
        }else {
            const user = await DealerModel.find({email});
            console.log(user, email, password)
            if(!user.length){
                res.status(404).send({'msg':"User not found"});
            }else {
                const {password:hash, _id, username} = user[0];
                console.log(_id, '_id', username)
                bcrypt.compare(password, hash, function(err, result) {
                    if(result){
                        res.status(200).send({id:_id,username, email, token:'Bearer '+jwt.sign({ userid: _id }, process.env.jwtSecret) })
                        
                    }else {
                        res.status(401).send({'msg':"Wrong Credentials Provided"});
                    }
                });
            }
        }
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"})
    }
})

module.exports = {auth};