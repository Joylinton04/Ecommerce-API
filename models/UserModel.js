import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {type: String},
    email: {type: String, required: true},
    password: {type: String, required: true},
})



const userModel = mongoose.models.User || mongoose.model('User', userSchema)

export default userModel;