import mongoose from "mongoose";

const UserModel = mongoose.model('User', new mongoose.Schema({
    email:{
        type: String, 
        unique: true
    },
    password: String,
    first_name: String,
    last_name: String,
    role: { type: String, enum: ['usuario', 'admin'], default: 'usuario' } 
}))

export default UserModel