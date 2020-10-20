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
        type: Array,
        required: true
    }
})

export default mongoose.model('User', UserSchema)