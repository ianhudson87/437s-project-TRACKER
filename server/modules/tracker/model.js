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
        required: true,
        default: [],
    },
    group_time_joined: {
        // contains time stamps of when user join group.
        type: Array,
        required: true,
        default: []
    },
    games: {
        // contains game ids that the users created 
        type: Array,
        required: true,
        default: [],
    },
    friends: {
        //contains id's of user's friends
        type: Array,
        required: true,
        default: []
    },
    email_verified: {
        // contains whether user has verified their account with the email_verification_code
        type: Boolean,
        required: true,
        default: false,
    },
    email_verification_code: {
        // contains hashed value of the code
        type: String,
        required: true,
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
    },
    tournaments: {
        // contains tournament ids that the users created 
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
    },
    goal_score: {
        // contains the score that users are trying to reach
        type: Number,
        require: true
    },
    game_ended: {
        // contains bool if game has ended or not
        type: Boolean,
        require: true
    },
    winner: {
        // contains user object of winner if the game has ended
        type: Object,
        require: false
    }
}, {timestamps: true}
)

const TournamentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        // contains ids of Users in the Group
        type: Array,
        required: true
    },
    results: {
        // contains an array representing the User at each slot in the tournament
        type: Array,
        required: true
    }
})

export const UserModel =  mongoose.model('users', UserSchema)
export const GroupModel = mongoose.model('groups', GroupSchema)
export const GameModel = mongoose.model('games', GameSchema)
export const TournamentModel = mongoose.model('tournaments', TournamentSchema)