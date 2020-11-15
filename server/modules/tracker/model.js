import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    groups: {
        // contains ids of Groups that User is in
        type: Array,
        required: true
    },
    group_time_joined: {
        // contains time stamps of when user join group.
        type: Array,
        required: true
    },
    games: {
        // contains game ids that the users created 
        type: Array,
        required: true
    },
    game_time_joined: {
        // contains time stamps of when user joined game
        type: Array,
        required: true,
    },
    friends: {
        //contains id's of user's friends
        type: Array,
        required: true
    }
})

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        // contains ids of Users in the Group
        type: Array,
        required: true
    },
    games: {
        // contains game ids that the users created 
        type: Array,
        required: true
    }
})

const GameSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        // contains ids of Users in the Group
        type: Array,
        required: true
    },
    scores: {
        // contains scores of Users. Indices of this array and users array match up
        type: Array,
        required: true
    }
})

export const UserModel =  mongoose.model('users', UserSchema)
export const GroupModel = mongoose.model('groups', GroupSchema)
export const GameModel = mongoose.model('games', GameSchema)