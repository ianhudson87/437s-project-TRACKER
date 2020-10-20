import mongoose from 'mongoose';

export default () =>{
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb+srv://trackerDude3000:letmeinplz@tracker.osjll.mongodb.net/Tracker?retryWrites=true&w=majority',
    { useUnifiedTopology: true, useNewUrlParser: true });
    mongoose.connection
        .once('open', () => console.log('Mongodb running'))
        .on('error', (err) => console.error(err))
}