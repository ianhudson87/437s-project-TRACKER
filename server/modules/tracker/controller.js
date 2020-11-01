import * as Models from './model'
const bcrypt = require('bcrypt');

// checks whether a valid username was entered and if so, creates a new user
export const createUser = async (req, res) => {
    // req body requires name and password of user you're creating
    const {name, password} = req.body;
    console.log(req.body);
    const groups = []
    const games = []
    const saltRounds = 6;
    const newUser = new Models.UserModel( {name, password, groups, games});


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
        return res.status(400).json({ error:true, message: "error with getAllUsers"})
    }
}


export const createGroup = async (req, res) => {
    // req.body requires the name of the group that you are creating
    const {name} = req.body;
    const users = []
    const games = []
    const newGroup = new Models.GroupModel( {name, users, games} );
    
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
        return res.status(400).json({ error:true, message: "error with getAllUsers"})
    }
}

export const getObjectByID = async (req, res) => {
    // id and type required in req.body
    console.log("GETTING GROUP FROM ID")
    const {id, type} = req.body;

    // determine which type of object is being wanted
    let model_type
    switch(type){
        case "group":
            model_type = Models.GroupModel
            break
        case "game":
            model_type = Models.GameModel
            break
        case "user":
            model_type = Models.UserModel
        default:
            model_type = Models.UserModel
    }

    try{
        let object_with_given_id = await model_type.find({ '_id': id})
        if(object_with_given_id.length == 0){
            // there doesn't exist a group with the given id
            console.log("Object ID: " + id)
            return res.status(200).json({ object: null, error: false, object_exists: false, message: "object_id DNE"})
        }
        else{
            return res.status(201).json({ object: object_with_given_id[0], error: false, object_exists: true, message: "object Found"})
        }
    } catch(e) {
        return res.status(500).json({ error:true, message: "error with getting object by ID"})
    }
}

// export const getUserByID = async (req, res) => {
//     // user_id required in req.body
//     console.log("GETTING User FROM ID")
//     const {user_id} = req.body;
//     try{
//         let users_with_given_id = await Models.UserModel.find({ '_id': user_id})
//         if(users_with_given_id.length == 0){
//             // there doesn't exist a user with the user_id
//             console.log("User ID: " + user_id)
//             return res.status(200).json({ user: null, error: false, user_exists: false, message: "user_id DNE"})
//         }
//         else{
//             return res.status(201).json({ user: users_with_given_id[0], error: false, user_exists: true, message: "User Found"})
//         }
//     } catch(e) {
//         return res.status(500).json({ error:true, message: "error with getting group"})
//     }
// }

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
    console.log("HERE")
    // req.body requires the id of the user and the id of the group
    const {user_id, group_id} = req.body;
    console.log(group_id)

    try{
        // check to make sure that user_id and group_id are valid
        let user_with_given_id = await Models.UserModel.find({ '_id': user_id})
        let group_with_given_id = await Models.GroupModel.find({ '_id': group_id})
        if(user_with_given_id.length == 0){
            // there doesn't exist a user with the given id
            return res.status(200).json({ error: false, joined_group: false, message: "user_id DNE"})
        }
        else if(group_with_given_id.length == 0){
            // check to make sure the the group_id is valid
            return res.status(200).json({ error: false, joined_group: false, message: "group_id DNE"})
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
                // push group id to the list of groups for the user
                await Models.UserModel.updateOne({ '_id': user_id }, { '$push': { groups: group_id } })
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
    console.log("name:", name, "password", password)
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

// creates a game based on the users that are in the game
export const createGame = async (req, res) => {
    // req.body requires:
    //  name of the game that you are creating
    //  list of user_ids in the game
    //  group_id of group that the game is being created for
    const {name, user_ids, group_id} = req.body;
    let scores = Array(user_ids.length).fill(0)
    let users = user_ids
    const newGame = new Models.GameModel( {name, users, scores} );
    
    try{

        // check to make sure that user_ids are valid
        let valid_user_ids = true
        for(let i=0; i<user_ids.length; i++){
            let user_with_given_id = await Models.UserModel.find({ '_id': user_ids[i]})

            if(user_with_given_id.length == 0){
                // user DNE
                valid_user_ids = false
                break
            }
        }
        if(!valid_user_ids){
            return res.status(200).json({ error: false, game_created: false, message: "some user_id DNE"})
        }
        else{
            // check to make sure that group_id is valid
            let group_with_given_id = await Models.GroupModel.find({ '_id': group_id})
            if(group_with_given_id.length == 0){
                return res.status(200).json({ error: false, game_created: false, message: "some group_id DNE"})
            }
            else{
                // all user_ids and group_id are valid
                // create the game and get the id of the game
                let game = await newGame.save()
                let game_id = game._id

                // add the game_id to the user and group
                await Models.UserModel.updateMany({ '_id': {$in: user_ids} }, { '$push': { games: game_id } })
                await Models.GroupModel.updateOne({ '_id': group_id }, { '$push': { games: game_id } })

                return res.status(200).json({ error:false, game_created: true, game_info: game, message: "game created!"})
            }
        }
    } catch(e) {
        return res.status(400).json({ error:true, game_created: false, message: "error with creating game", error_msg: e})
    }
}

// retrieves a list of all games in the database
export const getAllGames = async (req, res) => {
    // no requirements for req.body
    console.log("REQUESTING Games")
    try{
        return res.status(200).json({ users: await Models.GameModel.find() })
    } catch(e) {
        return res.status(400).json({ error:true, message: "error with getAllGames"})
    }
}

// changes score for some user
export const changeScore = async (req, res) => {
    // game_id, user_id, type, amount required for req.body
    console.log("Changing Score")
    const {game_id, user_id, type, amount} = req.body;
    if(type == "delta"){
        // change score by amount
        try{
            // get index of player that we want to change
            let game = await Models.GameModel.findOne({ '_id': game_id })
            let user_ids = game.users
            let user_index = user_ids.indexOf(user_id)

            // change the score of the scores array at that index
            let score_object = {}
            score_object['scores.'+user_index.toString()] = parseInt(amount) // tels which index of scores to change and by how much
            await Models.GameModel.updateOne({ '_id': game_id}, { '$inc': score_object })
            let updated_game = await Models.GameModel.findOne({ '_id': game_id })
            return res.status(200).json({ error: false, updated_game: updated_game, game_updated: true, message: "game successfully updated" })
        } catch(e) {
            return res.status(400).json({ error:true, game_updated: false, message: "error with changeScore", err_msg: e})
        }
    }
    else if(type == "set"){
        // TODO: set score to amount
    }
    else{
        return res.status(200).json({ error:false, game_updated: false, message: "error with changeScore: not valid type"})
    }
}