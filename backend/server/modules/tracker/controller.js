import Tracker from './model'

export const createUser = async (req, res) => {
    const {name, password} = req.body;
    const groups = []
    const bcrypt = require('bcrypt');
    const saltRounds = 6;
    const newUser = new Tracker( {name, password, groups});

    bcrypt.hash(password, saltRounds, function(err, hash){
        newUser.password = hash;
        console.log(hash);
    })
    
    try{
        let existingUsers  = await Tracker.find();
        for(let i=0; i<existingUsers.length; i++){
            if(newUser.name == existingUsers[i].name){
                return res.status(269).json({ error:false, repeatedUser:true, message: "USER EXISTS"})
            }
        }
        return res.status(201).json({ user: await newUser.save(), error:false, repeatedUser:false })
    } catch(e) {
        return res.status(400).json({ error:true, message: "ERROR WITH CREATING USER"})
    }
}

export const getAllUsers = async (req, res) => {
    console.log("REQUESTING USERS")
    try{
        return res.status(200).json({ users: await Tracker.find() })
    } catch(e) {
        return res.status(e.status).json({ error:true, message: "ERROR WITH GETING ALL FREAKING USER"})
    }
}

export const loginUser = async (req, res) => {
    console.log("LOGGING IN USER");
    const {name, password} = req.body;
    const groups = [];
    const saltRounds = 6;
    const bcrypt = require('bcrypt');

    try{
        let existingUsers = await Tracker.find();
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
                        console.log('Compared result', result, password)
                        if(result){
                            correctPassword = true;
                            return res.status(200).json({ user: selectedUser, error:false, userExists: true, correctPassword: true, message: "VALID LOGIN"})
                        }else{
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