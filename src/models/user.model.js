import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true
    },
    password: String,
    first_name: String,
    last_name: String,
    role: { type: String, enum: ['usuario', 'admin'], default: 'usuario' }
});

// Métodos para manejar la contraseña
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;