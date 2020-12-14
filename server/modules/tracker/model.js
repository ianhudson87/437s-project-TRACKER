import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    info: {
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
    stats: {
        // contains json of various stats
        type: Object,
        required: true,
        default: { },
    }
}, { minimize: false })

const PendingUserSchema = new Schema({
    // users that are in the process of being created, ie have not had email verified yet
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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
    description: {
        type: String,
        required: true
    },
    users: {
        // contains ids of Users in the Group
        type: Array,
        required: true,
        default: []
    },
    games: {
        // contains game ids that the users created 
        type: Array,
        required: true,
        default: []
    },
    pending_games: {
        // contains pending game ids 
        type: Array,
        required: true,
        default: []
    },
    tournaments: {
        // contains tournament ids that the users created 
        type: Array,
        required: true,
        default: []
    },
    stats: {
        // contains json of various stats
        type: Object,
        required: true,
        default: { },
    },
    code: {
        // random code needed to join the group
        type: String,
        required: true,
    },
    games_require_accept: {
        // whether games created in the group require all users to accept them
        type: Boolean,
        required: true,
        default: true,
    }

}, { minimize: false })

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
        require: true,
        default: 1,
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

const PendingGameSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    group: {
        // id of group that the game is being created for
        type: String,
        required: true
    },
    game_type: {
        // type of game "standard" or "tournament"
        type: String,
        required: true
    },
    users: {
        // contains ids of Users in the Group
        type: Array,
        required: true
    },
    users_accepted: {
        // contains ids of users in users list that has accepted
        type: Array,
        required: true,
        default: [],
    },
    goal_score: {
        // contains the score that users are trying to reach
        type: Number,
        require: true,
        default: 1,
    },
})

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
export const PendingUserModel =  mongoose.model('pendingUsers', PendingUserSchema)
export const GroupModel = mongoose.model('groups', GroupSchema)
export const GameModel = mongoose.model('games', GameSchema)
export const PendingGameModel = mongoose.model('pendingGames', PendingGameSchema)
export const TournamentModel = mongoose.model('tournaments', TournamentSchema)