import Tracker from './model'

export const createUser = async (req, res) => {
    const {name, password} = req.body;
    const groups = []
    const newUser = new Tracker( {name, password, groups})

    try{
        let existingUsers  = await Tracker.find();
        for(let i=0; i<existingUsers.length; i++){
            console.log("New user" + newUser.name)
            console.log("Existing user" + existingUsers[i].name)
            if(newUser.name == existingUsers[i].name){
                return res.status(269).json({ error:false, repeatedUser:true, message: "USER EXISTS"})
            }
        }
        return res.status(201).json({ user: await newUser.save(), error:false, repeatedUser:true })
        
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