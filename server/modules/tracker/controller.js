import * as Models from './model'
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const tracker_email_add = 'trackerihardlyknowher@gmail.com'

let send_verification_email = (email_add, code) => {
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: tracker_email_add,
        pass: 'Oooofers1!'
    }
    });

    var mailOptions = {
        from: tracker_email_add,
        to: email_add,
        subject: 'Tracker Email Verification Code!',
        text: "Here's your code: " + code, 
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

let get_model_type = (type) => {
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
            break
        case "tournament":
            console.log("here!!!")
            model_type = Models.TournamentModel
            break
        default:
            model_type = Models.UserModel
    }
    return model_type
}

// create user that has not had email verified yet. If verified then it becomes an actual user
export const createPendingUser = async (req, res) => {
    // req body requires name, email, and password of user you want to create
    const {name, email, password} = req.body;
    console.log(req.body)
    const saltRounds = 6;
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    let email_verification_code = Math.random().toString(36).substring(2,6)

    // send email to user for verification: https://www.w3schools.com/nodejs/nodejs_email.asp
    send_verification_email(email, email_verification_code)

    // hashes and salts the entered password for storage in database
    let hash = bcrypt.hashSync(password, saltRounds)
    // newUser.password = hash

    // hashes and salts the entered email verification code for storage in database
    let verify_hash = bcrypt.hashSync(email_verification_code, saltRounds)
    // newUser.email_verification_code = verify_hash

    const newPendingUser = new Models.PendingUserModel( {
        name: name,
        email: email,
        password: hash,
        email_verification_code: verify_hash
    });

    //console.log("USE THIS CODE", newUser.email_verification_code)
    
    try{

        // iterates through USERS from database to check whether the requested 
        //  username already exists
        let existingUsers  = await Models.UserModel.find();
        // determine if username is taken already
        for(let i=0; i<existingUsers.length; i++){
            if(newPendingUser.name == existingUsers[i].name){
              
                //does not create user if the username already exists
                return res.status(202).json({ error:false, repeatedUser:true, message: "user is taken"})
            }
        }
        console.log("here")
        // creates pendingUser if username does not already exist
        let pendingUser = await newPendingUser.save()
        return res.status(202).json({ error:false, pendingUserID: pendingUser._id, repeatedUser:false })

    } catch(e) {
        return res.status(400).json({ error:true, message: "error with creating user", err_msg: e})
    }
}

// checks whether a valid username was entered and if so, creates a new user
export const createUser = async (req, res) => {
    // req body requires name, email, and password of user you're creating
    const {name, email, password} = req.body;
    console.log(req.body)
    const saltRounds = 6;
    let email_verification_code = Math.random().toString(36).substring(2,6)

    // send email to user for verification: https://www.w3schools.com/nodejs/nodejs_email.asp
    send_verification_email(email, email_verification_code)

    const newUser = new Models.UserModel( {
        name: name,
        email: email,
        password: password,
        email_verification_code: email_verification_code
    });

    //console.log("USE THIS CODE", newUser.email_verification_code)

    // hashes and salts the entered password for storage in database
    let hash = bcrypt.hashSync(password, saltRounds)
    newUser.password = hash

    // hashes and salts the entered email verification code for storage in database
    let verify_hash = bcrypt.hashSync(email_verification_code, saltRounds)
    newUser.email_verification_code = verify_hash
    
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
        return res.status(400).json({ error:true, message: "error with creating user", err_msg: e})
    }
}

// checks whether the verification code the the user gave matches the code sent to their email
export const verifyEmail = async (req, res) => {
    // req.body requires id of pendingUser and code they input
    const {pending_user_id, verification_code} = req.body;
    console.log("VERIFY EMAIL")
    console.log(req.body)
    try{
        // get the pendingUser that matches the ID
        let pendingUser = await Models.PendingUserModel.findOne({ '_id': pending_user_id })
        console.log('here', pending_user_id)
        let hashedCode = pendingUser.email_verification_code // get hashed version of email code
        // console.log("CODES", hashedCode, verification_code)
        let existingUsers  = await Models.UserModel.find();
        // determine if username is taken already
        for(let i=0; i<existingUsers.length; i++){
            if(pendingUser.name == existingUsers[i].name){
                // does not create user if the username already exists
                return res.status(202).json({ error:false, repeatedUser:true, message: "user is taken"})
            }
        }

        // check to see if input code matches code in database
        bcrypt.compare(verification_code, hashedCode, async (err, result) => {
            if(result){
                // user input correct verification code
                // create a new user based on the pending user
                const newUser = new Models.UserModel( {
                    name: pendingUser.name,
                    email: pendingUser.email,
                    password: pendingUser.password
                });
                let user = await newUser.save()
                return res.status(200).json({ error:false, repeatedUser:false, user: user, verified: true })
            }
            else{
                // user input incorrect verifiction code
                return res.status(200).json({ error:false, repeatedUser:false, verified: false })
            }
        })
    } catch(e) {
        return res.status(400).json({ error:true, message: "error with checking email verification code"})
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
    const {name, description, creator_id, games_require_accept} = req.body;
    console.log(creator_id, "CREATOR_ID")
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const code = Math.random().toString(36).substring(2,6)
    const newGroup = new Models.GroupModel({ name: name, description: description, users: [creator_id], code: code, games_require_accept: games_require_accept });
    
    try{
        let existingGroups  = await Models.GroupModel.find({});
        // determine if group name is taken already
        for(let i=0; i<existingGroups.length; i++){
            if(newGroup.name == existingGroups[i].name){
                return res.status(203).json({ error:false, repeatedGroup:true, message: "group is taken is taken"})
            }
        }
        // name not taken yet
        let group = await newGroup.save()
        await Models.UserModel.updateOne({ '_id': creator_id }, { '$push': { groups: group._id } })
        return res.status(203).json({ group: group, error:false, repeatedGroup:false })
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
        return res.status(e.status).json({ error:true, message: "error with getAllGroups"})
    }
}


export const getObjectByID = async (req, res) => {
    // id and type required in req.body
    console.log("GETTING GROUP FROM ID")
    const {id, type} = req.body;

    // determine which type of object is being wanted
    let model_type = get_model_type(type)
    // let model_type
    // switch(type){
    //     case "group":
    //         model_type = Models.GroupModel
    //         break
    //     case "game":
    //         model_type = Models.GameModel
    //         break
    //     case "tournament":
    //         model_type = Models.TournamentModel
    //         break
    //     case "user":
    //         model_type = Models.UserModel
    //     default:
    //         model_type = Models.UserModel
    // }

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

export const getObjectsByIDs = async (req, res) => {
    // ids and type required in req.body
    console.log("GETTING objects FROM IDs")
    const {ids, type} = req.body;
    console.log(type)

    // determine which type of object is being wanted
    let model_type = get_model_type(type)

    try{
        let objects_with_given_id = await model_type.find({ '_id': {'$in': ids}})
        if(objects_with_given_id.length == 0){
            // there doesn't exist a group with the given id
            console.log("Object IDs: " + ids)
            return res.status(200).json({ objects: null, error: false, objects_exist: false, message: "object_ids DNE"})
        }
        else{
            return res.status(201).json({ objects: objects_with_given_id, error: false, objects_exist: true, message: "objects Found"})
        }
    } catch(e) {
        return res.status(500).json({ error:true, message: "error with getting object by ID"})
    }
}

export const searchObjectsByString = async (req, res) => {
    // get all objects of a certain type that match "query_string"
    const {query_string, type} = req.body;

    // determine which type of object is being wanted
    let model_type = get_model_type(type)

    try{
        let objects_that_match_query_string = await model_type.find({ 'name': { '$regex': query_string, '$options': 'i' } })
        return res.status(200).json({ objects: objects_that_match_query_string, error: false})
    } catch(e) {
        return res.status(500).json({ error:true, msg:e, message: "error with searching objects by query_string"})
    }
    

}

export const getGameByID = async (req, res) => {
    // no requirements for req.body
    console.log("GETTING GAME FROM ID")
    const {id} = req.body;
    let game_id = id
    try{
        let game_with_given_id = await Models.GameModel.find({ '_id': game_id})
        if(game_with_given_id.length == 0){
            // there doesn't exist a group with the given id
            console.log("Game ID: " + game_id)
            return res.status(200).json({ group: null, error: false, group_exists: false, message: "game_id DNE"})
        }
        else{
            return res.status(201).json({ group: game_with_given_id, error: false, game_exists: false, message: "Game Found"})
        }
    } catch(e) {
        return res.status(500).json({ error:true, message: "error with getting game"})
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
    console.log("JOIN GROUP")
    // req.body requires the id of the user and the id of the group
    const {user_id, group_code} = req.body;


    try{
        // check to make sure that user_id and group_id are valid
        let user_with_given_id = await Models.UserModel.find({ '_id': user_id})
        let group_with_given_code = await Models.GroupModel.find({ 'code': group_code})
        if(user_with_given_id.length == 0){
            // there doesn't exist a user with the given id
            return res.status(200).json({ error: false, joined_group: false, message: "Your user ID could not be found"})
        }
        else if(group_with_given_code.length == 0){
            // check to make sure the the group_id is valid
            return res.status(200).json({ error: false, joined_group: false, message: "Group code could not be found"})
        }
        else{
            // user_id is valid
            // check to make sure that user isn't already in the group
            let group_id = group_with_given_code[0]._id
            let group_contains_user = await Models.GroupModel.find({ '_id': group_id, 'users': user_id })
            // console.log(group_with_given_code['_id'])
            if(group_contains_user.length == 1){
                // group that user is trying to join already contains the user
                return res.status(200).json({ error: false, joined_group: false, message: "You are already in this group"})
            }
            else{
                // push the user id to the list of users in the group with the correct group id
                await Models.GroupModel.updateOne({ '_id': group_id }, { '$push': { users: user_id } })
                // push group id to the list of groups for the user
                await Models.UserModel.updateOne({ '_id': user_id }, { '$push': { groups: group_id } })
                // push time stamp to list of times when user joinged group
                await Models.UserModel.updateOne({ '_id': user_id }, { '$push': { group_time_joined: Date.now() } })
                return res.status(200).json({ error: false, joined_group: true, message: "joined group!", group: group_with_given_code[0]})
            }
        }
        
    } catch(e) {
        return res.status(400).json({ error:true, error_message: "error with joining group"})
    }
}

export const joinGame = async (req, res) => {
    // req.body requires the id of the user and the id of the game
    const {user_id, game_id} = req.body;

    try{
        // check to make sure that user is valid
        let user_with_given_id = await Models.UserModel.find({ '_id': user_id})
        if(user_with_given_id.length == 0){
            // there doesn't exist a user with the given id
            return res.status(200).json({ error: false, joined_game: false, message: "user_id DNE"})
        }
        else{
            // user_id is valid
            // check to make sure that user isn't already in the game
            let game_contains_user = await Models.GameModel.find({ '_id': game_id, 'users': user_id })
            if(game_contains_user.length == 1){
                // game that user is trying to join already contains the user
                return res.status(200).json({ error: false, joined_game: false, message: "user_id is already in game"})
            }
            else{
                // push the user id to the list of users in the game with the correct game id
                await Models.GameModel.updateOne({ '_id': game_id }, { '$push': { users: user_id } })
                return res.status(200).json({ error: false, joined_game: true, message: "joined game!"})
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

export const createPendingGame = async (req, res) => {
    const {name, user_ids, group_id, game_type, goal_score} = req.body;
    let users_accepted = [user_ids[0]] // only the user who created the game has accepted
    let handled_goal_score = Number.isInteger(goal_score) ? goal_score : 1
    let newPendingGame = new Models.PendingGameModel({ name: name, group: group_id, game_type: game_type, users: user_ids, users_accepted: users_accepted, goal_score: handled_goal_score });

    if(game_type=="tournament"){
        // checks for tournament
        if(user_ids.length < 4 || user_ids > 16){ //eventually might support larger tournaments
            return res.status(200).json({ error: false, game_created: false, message: "Need more users in group"})
        }
    }

    try{
        let pendingGame = await newPendingGame.save()
        await Models.GroupModel.updateOne({ '_id': group_id }, { '$push': { pending_games: pendingGame._id } })
        return res.status(200).json({ error: false, game_created: true, game_info: pendingGame, message: "created pending game"})
    }
    catch(e){
        return res.status(400).json({ error: true, game_created: false, message: "could not create pending game"})
    }
}

export const getPendingGamesOfUser  = async (req, res) => {
    const {user_id} = req.body
    // console.log(typeof user_id)
    try{
        let pendingGamesOfUser = await Models.PendingGameModel.find({ users: user_id })
        // console.log(pendingGamesOfUser)
        return res.status(200).json({ error: false, pending_games: pendingGamesOfUser})
    }
    catch(e){
        // console.log(e)
        return res.status(400).json({ error: true, e: e})
    }
}

export const acceptGame  = async (req, res) => {
    const {user_id, pending_game_id} = req.body
    console.log(req.body)
    try{
        await Models.PendingGameModel.updateOne({ '_id': pending_game_id }, { '$push': { users_accepted: user_id }})
        let updatedPendingGame = await Models.PendingGameModel.findOne({ '_id': pending_game_id })
        // check to see if everyone has accepted:
        console.log(updatedPendingGame)
        let users = updatedPendingGame.users
        let users_accepted = updatedPendingGame.users_accepted
        let not_all_users_have_accepted = users.some(r=> !users_accepted.includes(r)) // if there is some user that isn't in users_accepted
        if (!not_all_users_have_accepted){
            // all users accepted
            await Models.PendingGameModel.deleteOne({ '_id': pending_game_id })
        }
        return res.status(200).json({ error: false, updated_pending_game: updatedPendingGame, all_users_have_accepted: !not_all_users_have_accepted})
    }
    catch(e){
        //console.log(e)
        return res.status(400).json({ error: true, e: e})
    }
}

// creates a game based on the users that are in the game
export const createGame = async (req, res) => {
    // req.body requires:
    //  name of the game that you are creating
    //  list of user_ids in the game
    //  group_id of group that the game is being created for
    //  game_type of the game that you are creating
    //  goal_score for standard game, or 0 for tournament
    const {name, user_ids, group_id, game_type, goal_score} = req.body;
    console.log(req.body)
    let newGame;
    if(game_type == "tournament"){
        // CREATING TOURNAMENT GAME
        if(user_ids.length < 4 || user_ids > 16){ //eventually might support larger tournaments
            return res.status(200).json({ error: false, game_created: false, message: "invalid number of users"})
        }
        // initialize results as an empty array of the correct size
        let results;
        let numRounds;
        if(user_ids.length == 4){
            results = Array(7).fill(0)
            numRounds = 3;
        }
        else if(user_ids.length <= 8){
            results = Array(15).fill(0)
            numRounds = 4;
        }
        else if(user_ids.length <= 16){
            results = Array(31).fill(0)
            numRounds = 5;
        }
        // else{
        //     results = Array(63).fill(0)
        //     numRounds = 6;
        // }
        // assign first round positions
        let numEmpty = Math.pow(2, numRounds-1) - user_ids.length;
        let user = 0;
        for(let i=0; i<Math.pow(2, numRounds-1); i++){
            if(user < user_ids.length){
                if(numEmpty <= 0 || i%2==0){
                    results[results.length-1-i] = user_ids[user];
                    user++;
                }
                else{
                    results[Math.floor((results.length-i)/2)-1] = results[results.length-i]
                    numEmpty--;
                }
            }
        }
        console.log(name)
        console.log(user_ids)
        console.log(results)    
        newGame = new Models.TournamentModel( {name, user_ids, results} );
    }
    else if(game_type == "standard"){
        // CREATING COUNTER GAME
        let scores = Array(user_ids.length).fill(0)
        let handled_goal_score = Number.isInteger(goal_score) ? goal_score : 1
        newGame = new Models.GameModel( {name: name, users: user_ids, scores: scores, goal_score: handled_goal_score, game_ended: false} );
    }
    else{
        return res.status(200).json({ error: false, game_created: false, message: "invalid game type"})
    }

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
                return res.status(200).json({ error: false, game_created: false, message: "group_id DNE"})
            }
            else{
                // all user_ids and group_id are valid
                // create the game and get the id of the game
                let game;
                if(game_type == "tournament"){
                    game = await newGame.save()
                }
                else{
                    game = await newGame.save()
                }
                
                let game_id = game._id

                // add the game_id to the user and group
                if(game_type == "tournament"){
                    await Models.UserModel.updateMany({ '_id': {$in: user_ids} }, { '$push': { tournaments: game_id } })
                    await Models.GroupModel.updateOne({ '_id': group_id }, { '$push': { tournaments: game_id } })
                }
                else{
                    await Models.UserModel.updateMany({ '_id': {$in: user_ids} }, { '$push': { games: game_id } })
                    await Models.GroupModel.updateOne({ '_id': group_id }, { '$push': { games: game_id } })
                }
                

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
        return res.status(200).json({ games: await Models.GameModel.find() })
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
        // change score by amount if the game hasn't been finished yet
        try{
            // determine if the game is finished already or not
            let game = await Models.GameModel.findOne({ '_id': game_id })
            if(game.game_ended) {
                // game has ended, don't need to update scores, send the original game state
                return res.status(200).json({ error: false, updated_game: game, game_updated: true, message: "game already finished" })
            }
            else{
                // game has not ended, update scores, and send new game state
                console.log(game)

                // get index of player that we want to change
                let user_ids = game.users
                let user_index = user_ids.indexOf(user_id)

                // change the score of the scores array at that index
                let score_object = {}
                score_object['scores.'+user_index.toString()] = parseInt(amount) // tels which index of scores to change and by how much
                await Models.GameModel.updateOne({ '_id': game_id}, { '$inc': score_object })
                let updated_game = await Models.GameModel.findOne({ '_id': game_id })

                let user_index_of_winner = updated_game.scores.findIndex( (elt) => {return elt >= game.goal_score} )
                if(user_index_of_winner > -1){
                    console.log("here2")
                    // if someone just reached the goal or has score greater than the goal
                    // get the id of that user
                    let user_id_of_winner = updated_game.users[user_index_of_winner]
                    let user_object_of_winner = await Models.UserModel.findOne({ '_id': user_id_of_winner })

                    await Models.GameModel.updateOne({ '_id': game_id}, { '$set': {game_ended: true, winner: user_object_of_winner} }) // update game_ended and winner object
                    updated_game = await Models.GameModel.findOne({ '_id': game_id }) // update the object we are sending as a response
                    return res.status(200).json({ error: false, updated_game: updated_game, game_updated: true, message: "game successfully updated" })
                }
                else{
                    // no one has won the game yet
                    return res.status(200).json({ error: false, updated_game: updated_game, game_updated: true, message: "game successfully updated" })
                }
            }
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

// advances some user to the next round in a tournament
export const moveToNextRound = async (req, res) => {
    // tournament_id, index required for req.body
    console.log("Move to next round")
    const {tournament_id, index} = req.body;
   
    try{
        // get id stored at given index of the results array
        let tournament = await Models.TournamentModel.findOne({ '_id': tournament_id })
        let results = tournament.results
        let userToAdvance = results[index]

        if(userToAdvance == 0){ // no user at that position in the results array
            return res.status(200).json({ error: false, tournament_updated: false, message: "tournament not updated" })
        }
        else{
             // advance the user and then send resulting array to database
            console.log("Initial results");
            console.log(results)
            results[Math.floor((index-1)/2)] = userToAdvance
            console.log("Index: " + index)
            console.log("Index/2", index/2)
            console.log("New results")
            console.log(results)
            await Models.TournamentModel.updateOne({'_id': tournament_id}, {'results': results})
            let updated_tournament = await Models.TournamentModel.findOne({ '_id': tournament_id })

            return res.status(201).json({ error: false, updated_tournament: updated_tournament, tournament_updated: true, message: "tournament successfully updated" })
        }
    } catch(e) {
        return res.status(400).json({ error:true, tournament_updated: false, message: "error with moveToNextRound", err_msg: e})
    }
}

// add users to each other's list of friends
export const addFriend = async (req, res) => {
    // req.body requires the id of the user and the id of the game
    const {user_friending_id, user_being_friended_id} = req.body;

    try{
        // check to make sure that users are valid
        let user_friending = await Models.UserModel.findOne({ '_id': user_friending_id})
        let user_being_friended = await Models.UserModel.findOne({ '_id': user_being_friended_id})
        if(user_friending.length == 0 || user_being_friended.length == 0){
            // one of the given id's does not match any user
            return res.status(200).json({ error: false, friend_added: false, message: "(at least one) user_id DNE"})
        }
        else{
            // both id's are valid
            // check to make sure that users are not already friends
            if(user_friending.friends.length > 0){
                for(let i = 0; i < user_friending.friends.length; i++){
                    if(user_friending.friends[i] == user_being_friended_id){
                        // friend list already contains user
                        return res.status(200).json({ error: false, friend_added: false, message: "users are already friends"})
                    }
                }
            }
            
            // push the user id to the list of users in the game with the correct game id
            await Models.UserModel.updateOne({ '_id': user_friending_id }, { '$push': { friends: user_being_friended_id } })
            await Models.UserModel.updateOne({ '_id': user_being_friended_id }, { '$push': { friends: user_friending_id } })
            return res.status(200).json({ error: false, friend_added: true, message: "friend added!"})
        }
        
    } catch(e) {
        return res.status(400).json({ error:true, error_message: "error with friending"})
    }
}

//check whether two users are friends
export const checkFriends = async (req, res) => {
    const {user1_id, user2_id} = req.body;

    try{
        // check to make sure that users are valid
        let user1 = await Models.UserModel.findOne({ '_id': user1_id})
        let user2 = await Models.UserModel.findOne({ '_id': user2_id})
    
        if(user1.length == 0 || user2.length == 0){
            // one of the given id's does not match any user
            return res.status(200).json({ error: false, friends: false, message: "(at least one) user_id DNE"})
        }
        else{
            // both id's are valid
            // check whether users are friends
            if(user1.friends.length > 0){
                for(let i = 0; i < user1.friends.length; i++){
                    if(user1.friends[i] == user2_id){
                        // friend list already contains user
                        return res.status(200).json({ error: false, friends: true, message: "users are friends"})
                    }
                }
            }
            // friend list does not contain user
            return res.status(200).json({ error: false, friends: false, message: "users are not friends"})
        }
        
    } catch(e) {
        return res.status(400).json({ error:true, error_message: "error with checking friends"})
    }
}

