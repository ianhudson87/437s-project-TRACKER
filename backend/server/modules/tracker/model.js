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
    }
})

export const UserModel =  mongoose.model('User', UserSchema)
export const GroupModel = mongoose.model('Group', GroupSchema)