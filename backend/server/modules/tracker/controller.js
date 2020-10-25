import * as Models from './model'
const bcrypt = require('bcrypt');

export const createUser = async (req, res) => {
    // req body requires name and password of user you're creating
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
    // no requirements for req.body
    console.log("REQUESTING USERS")
    try{
        return res.status(200).json({ users: await Models.UserModel.find() })
    } catch(e) {
        return res.status(e.status).json({ error:true, message: "error with getAllUsers"})
    }
}

export const createGroup = async (req, res) => {
    // req.body requires the name of the group that you are creating
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
    // no requirements for req.body
    console.log("REQUESTING GROUPS")
    try{
        return res.status(200).json({ groups: await Models.GroupModel.find() })
    } catch(e) {
        return res.status(e.status).json({ error:true, message: "error with getAllUsers"})
    }
}

export const joinGroup = async (req, res) => {
    // req.body requires the id of the user and the id of the group
    const {user_id, join_group_id} = req.body;

    try{
        // check to make sure that user is valid
        let user_with_given_id = await Models.UserModel.find({ '_id': user_id})
        if(user_with_given_id.length == 0){
            // there doesn't exist a user with the given id
            return res.status(200).json({ error: false, joined_group: false, message: "user_id DNE"})
        }
        else{
            // user_id is valid
            // check to make sure that user isn't already in the group
            let group_contains_user = await Models.GroupModel.find({ '_id': join_group_id, 'users': user_id })
            if(group_contains_user.length == 1){
                // group that user is trying to join already contains the user
                return res.status(200).json({ error: false, joined_group: false, message: "user_id is already in group"})
            }
            else{
                // push the user id to the list of users in the group with the correct group id
                await Models.GroupModel.updateOne({ '_id': join_group_id }, { '$push': { users: user_id } })
                return res.status(200).json({ error: false, joined_group: true, message: "joined group!"})
            }
        }
        
    } catch(e) {
        return res.status(400).json({ error:true, error_message: "error with joining group"})
    }
}
