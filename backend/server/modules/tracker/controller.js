import Tracker from './model'

export const createUser = async (req, res) => {
    const {name, password} = req.body;
    const groups = []
    const newUser = new Tracker( {name, password, groups})

    try{
        return res.status(201).json({ user: await newUser.save() })
    } catch(e) {
        return res.status(e.status).json({ error:true, message: "ERROR WITH CREATING A FREAKING USER"})
    }
}

export const getAllUsers = async (req, res) => {
    try{
        return res.status(200).json({ users: await Tracker.find() })
    } catch(e) {
        return res.status(e.status).json({ error:true, message: "ERROR WITH GETING ALL FREAKING USER"})
    }
}