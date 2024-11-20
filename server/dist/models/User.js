import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
// Importa el esquema de libros
import bookSchema from './Book.js';
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must use a valid email address'], // Mejora posible: usa la librería 'validator' para validar emails
    },
    password: {
        type: String,
        required: true,
    },
    // Define savedBooks como un array que sigue el esquema de Book
    savedBooks: [bookSchema],
}, {
    toJSON: {
        virtuals: true, // Habilita la inclusión de campos virtuales en la salida JSON
    },
});
// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});
// Método para comparar contraseñas ingresadas con la almacenada
userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
// Virtual para calcular el número de libros guardados
userSchema.virtual('bookCount').get(function () {
    return this.savedBooks.length;
});
// Modelo de usuario
const User = model('User', userSchema);
export default User;
