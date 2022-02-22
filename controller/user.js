const User = require("../models/user");
const bcrypt = require('bcrypt')

exports.registerUser = async(req,res) =>{

    const {name,userId,password} = req.body;

    try{

        if(req.session.user)
        return res.status(400).send("Already Logged in")

        if(name===""||password===""||userId===""||!name||!password||!userId)
        return res.status(400).send("Please Fill all the details to regitser : name userId and password")

        let existedUser = await User.findOne({userId : userId})

        if(existedUser)
        return res.status(400).send("User already existed by this userId please try something else")

        const salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        let user = await User.create({
            name,
            userId,
            password : hashedPassword,
        })

        console.log("New User Created",user)

        if(user)
        return res.status(201).send("User created please Login to create Events")
        else
        return res.status(500).send("user not created due to some error")

    } catch(err){
        console.log(" UserController : registerUser : "+err)
        return res.status(500).send(err)
    }
    
}

exports.loginUser = async(req,res) =>{

    const {userId,password} = req.body;

    console.log(req.body)

    try{

        if(req.session.user)
        return res.status(400).send("Already Logged in")

        if(password===""||userId===""||!password||!userId)
        return res.status(400).send("Please Fill all the details to regitser : userId and password")

        let user = await User.findOne({userId : userId})

        if(!user)
        return res.status(400).send("User is not existed So please regiter first")

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword)
        return res.status(400).send("Invalid Password. Try again")

        req.session.user = req.body.userId
        return res.status(200).send("Logged In now you can create Events")

    } catch(err){
        console.log(" UserController : loginUser : "+err)
        return res.status(500).send(err)
    }
    
}

exports.logoutUser = async(req,res) =>{

    try{

        if(!req.session.user)
        return res.status(400).send("You are not logged In")

        req.session.destroy();

        return res.status(200).send("Successfully Logged Out")


    } catch(err){
        console.log(" UserController : logoutUser : "+err)
        return res.status(500).send(err)
    }
    
}

exports.changePassword = async(req,res) =>{

    const {newPassword,password} = req.body;

    try{

        if(!req.session.user)
        return res.status(400).send("You are not logged In")

        if(password===""||newPassword===""||!password||!newPassword)
        return res.status(400).send("Please Fill all the details to change Password : newPassword and password")

        let user = await User.findOne({userId : req.session.user})

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword)
        return res.status(400).send("Invalid Password. Try again")
        else{

            const salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(newPassword, salt);
    
            let user = await User.findOneAndUpdate({userId : req.session.user},{
                password : hashedPassword
            })

            return res.status(200).send("Password change successfully")
        }

    } catch(err){
        console.log(" UserController : changePassword : "+err)
        return res.status(500).send(err)
    }
    
}

exports.passInfo = async(req,res) =>{

    try{

        if(!req.session.user)
        return res.status(401).send("You are not logged In")

        let user = await User.findOne({userId : req.session.user})

        if(user){
        let updatedDate = new Date(user.updatedAt)
        return res.status(200).send(`You have updated password on ${updatedDate.toDateString()} at ${updatedDate.getHours()}:${updatedDate.getMinutes()} for userId ${req.session.user}`)
        }

    } catch(err){
        console.log(" UserController : changePassword : "+err)
        return res.status(500).send(err)
    }
    
}

exports