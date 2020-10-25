import * as Models from './model'
const bcrypt = require('bcrypt');

export const createUser = async (req, res) => {
    const {name, password} = req.body;
    const groups = []
    const saltRounds = 6;
    const newUser = new Models.UserModel( {name, password, groups});

    // salt and hash passwords
    bcrypt.hash(password, saltRounds, function(err, hash){
        newUser.password = hash;
        console.log(hash);
    })
    
    try{
        let existingUsers  = await Models.UserModel.find();
        // determine if username is taken already
        for(let i=0; i<existingUsers.length; i++){
            console.log("New user" + newUser.name)
            console.log("Existing user" + existingUsers[i].name)
            if(newUser.name == existingUsers[i].name){
                return res.status(202).json({ error:false, repeatedUser:true, message: "user is taken"})
            }
        }
        // name not taken yet
        return res.status(202).json({ user: await newUser.save(), error:false, repeatedUser:false })
    } catch(e) {
        return res.status(400).json({ error:true, message: "error with creating user"})
    }
}

export const getAllUsers = async (req, res) => {
    console.log("REQUESTING USERS")
    try{
        return res.status(200).json({ users: await Models.UserModel.find() })
    } catch(e) {
        return res.status(e.status).json({ error:true, message: "error with getAllUsers"})
    }
}

export const createGroup = async (req, res) => {
    const {name} = req.body;
    const users = []
    const newGroup = new Models.GroupModel( {name, users} );
    
    try{
        let existingGroups  = await Models.GroupModel.find();
        // determine if group name is taken already
        for(let i=0; i<existingGroups.length; i++){
            console.log("New group name" + newGroup.name)
            console.log("Existing group name" + existingGroups[i].name)
            if(newGroup.name == existingGroups[i].name){
                return res.status(203).json({ error:false, repeatedGroup:true, message: "group is taken is taken"})
            }
        }
        // name not taken yet
        console.log('here')
        return res.status(203).json({ group: await newGroup.save(), error:false, repeatedGroup:false })
    } catch(e) {
        return res.status(400).json({ error:true, message: "error with creating user", error_msg:e})
    }
}

export const getAllGroups = async (req, res) => {
    console.log("REQUESTING GROUPS")
    try{
        return res.status(200).json({ users: await Models.GroupModel.find() })
    } catch(e) {
        return res.status(e.status).json({ error:true, message: "error with getAllUsers"})
    }
}
