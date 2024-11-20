import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Importa el esquema de libros
import bookSchema from './Book.js';
import type { BookDocument } from './Book.js';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}

const userSchema = new Schema<UserDocument>(
  {
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
  },
  {
    toJSON: {
      virtuals: true, // Habilita la inclusión de campos virtuales en la salida JSON
    },
  }
);

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
  
  }
  next();
});

// Método para comparar contraseñas ingresadas con la almacenada
userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Virtual para calcular el número de libros guardados
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

// Modelo de usuario
const User = model<UserDocument>('User', userSchema);

export default User;