////////// IMPORTS ////////// 

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

////////// CONFIG JSON RESPONSE //////////
app.use(express.json())

////////// MODELS //////////
const User = require('./models/User')

////////// OPEN ROUTE - PUBLIC ROUTE //////////
app.get('/', (req,res) => {
    res.status(200).json({msg: "Bem vindo a nossa API" })
})

////////// REGISTER USER //////////
app.post('/auth/register', async(req,res) =>{
    const {name, email, password, confirmpassword} = req.body

    ////  VALIDAÇÂO  ////
    if(!name){
        return res.status(422).json({msg: 'O nome é obrigatório!'})
    }
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }
    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatório!'})
    }

    if(password !== confirmpassword){
        return res.status(422).json({msg: 'As senhas não conferem!'})
    }

    //// CHECK IF USER EXISTS  ////
    const userExists = await User.findOne({email:email})
    
    if(userExists){
        return res.status(422).json({msg: 'Email já está cadastrado!'})
    }

    ////  CREATE PASSWORD  ////
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password,salt)

    ////  CREATE USER  ////
    const user = new User({
        name,
        email,
        password:passwordHash,
    })

    try{
        await user.save(201)
        
        res.status(201).json({msg:"Usuario Criado com sucesso!"})
    }catch(error){
        console.log(error)
        res.status(500).json({msg: error})
    }
})

////////// CEDENCIALS //////////
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.uorn7.mongodb.net/?retryWrites=true&w=majority` ,
    ).then(()=>{
    app.listen(3000)
    console.log('CONECTADO AO BANCO')
}).catch((err) =>{
    console.log(err)
}) 
