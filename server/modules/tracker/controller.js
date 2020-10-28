import * as Models from './model'
const bcrypt = require('bcrypt');

// checks whether a valid username was entered and if so, creates a new user
export const createUser = async (req, res) => {
    // req body requires name and password of user you're creating
    const {name, password} = req.body;
    console.log(req.body);
    const groups = []
    const saltRounds = 6;
    const newUser = new Models.UserModel( {name, password, groups});


    // hashes and salts the entered password for storage in database
    bcrypt.hash(password, saltRounds, function(err, hash){
        newUser.password = hash;
    })
    
    try{

        // iterates through users from database to check whether the requested 
        //  username already exists
        let existingUsers  = await Models.UserModel.find();
        // determine if username is taken already

        for(let i=0; i<existingUsers.length; i++){
            if(newUser.name == existingUsers[i].name){
              
                //does not create user if the username already exists
                return res.status(202).json({ error:false, repeatedUser:true, message: "user is taken"})
            }
        }
        // // creates user if username does not already exist
        return res.status(202).json({ user: await newUser.save(), error:false, repeatedUser:false })

    } catch(e) {
        return res.status(400).json({ error:true, message: "error with creating user"})
    }
}

// retrieves a list of all users in the database
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

export const getGroupByID = async (req, res) => {
    // no requirements for req.body
    console.log("GETTING GROUP FROM ID")
    const {id} = req.body;
    let group_id = id
    try{
        let group_with_given_id = await Models.GroupModel.find({ '_id': group_id})
        if(group_with_given_id.length == 0){
            // there doesn't exist a group with the given id
            console.log("Group ID: " + group_id)
            return res.status(200).json({ group: null, error: false, group_exists: false, message: "group_id DNE"})
        }
        else{
            return res.status(201).json({ group: group_with_given_id, error: false, group_exists: false, message: "Group Found"})
        }
    } catch(e) {
        return res.status(500).json({ error:true, message: "error with getting group"})
    }
}

export const getUser = async (req, res) => {
    // no requirements for req.body
    console.log("GETTING USER FROM ID")
    
    const name = req.body.name;
    
    try{
        let user_with_given_name = await Models.UserModel.find({ 'name': name})
        if(user_with_given_name.length == 0){
            // there doesn't exist a user with the given name
            return res.status(200).json({ user: null, error: false, user_exists: false, message: "username DNE"})
        }
        else{
            return res.status(201).json({ user: user_with_given_name, error: false, user_exists: true, message: "User Found"})
        }
    } catch(e) {
        return res.status(500).json({ error:true, message: "error with getting user"})
    }
}

export const joinGroup = async (req, res) => {
    // req.body requires the id of the user and the id of the group
    const {user_id, group_id} = req.body;

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
            let group_contains_user = await Models.GroupModel.find({ '_id': group_id, 'users': user_id })
            if(group_contains_user.length == 1){
                // group that user is trying to join already contains the user
                return res.status(200).json({ error: false, joined_group: false, message: "user_id is already in group"})
            }
            else{
                // push the user id to the list of users in the group with the correct group id
                await Models.GroupModel.updateOne({ '_id': group_id }, { '$push': { users: user_id } })
                return res.status(200).json({ error: false, joined_group: true, message: "joined group!"})
            }
        }
        
    } catch(e) {
        return res.status(400).json({ error:true, error_message: "error with joining group"})
    }
}


// logs in user by validating username and password, then returning that user
export const loginUser = async (req, res) => {
    console.log("LOGGING IN USER");
    const {name, password} = req.body;
    const bcrypt = require('bcrypt');

    try{
        let existingUsers = await Models.UserModel.find();
        let userExists = false;
        let correctPassword = false;
        let selectedUser = null;
        for(let i=0; i<=existingUsers.length; i++){
            if(i==existingUsers.length){
                // no user was found with the same name
                return res.status(202).json({ user: selectedUser, error:false, userExists: false, correctPassword: false, message: "INVALID USERNAME"})
            }
            else{
                // possible for user to be found
                if(name == existingUsers[i].name){
                    selectedUser = existingUsers[i];
                    userExists = true;
                    bcrypt.compare(password, existingUsers[i].password, function(err, result) {
                        if(result){ // entered password matches stored password
                            correctPassword = true;
                            return res.status(200).json({ user: selectedUser, error:false, userExists: true, correctPassword: true, message: "VALID LOGIN"})
                        }else{  // entered password is invalid
                            return res.status(201).json({ user: selectedUser, error:false, userExists: true, correctPassword: false, message: "INVALID PASSWORD"})
                        }
                    });
                    break;
                }
            }
            
        }  
    } catch(e) {
        return res.status(400).json({ error:true, message: "ERROR LOGGING IN USER", error_msg:e})
    }

}

