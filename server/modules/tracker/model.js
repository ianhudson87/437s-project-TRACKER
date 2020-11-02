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
        // contains ids of Games in the Group
        type: Array,
        required: false
    }
})

const GameSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        // contains ids of Users in the Game
        type: Array,
        required: true
    },
    score: {
        type: Number,
        required: false
    }
})

export const UserModel =  mongoose.model('users', UserSchema)
export const GroupModel = mongoose.model('groups', GroupSchema)
export const GameModel = mongoose.model('games', GameSchema)