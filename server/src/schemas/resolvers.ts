import {User} from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

// Define interfaces para argumentos y contexto
interface  UserType {
  _id: string;
  username: string;
  email: string;
  bookCount: number;
  savedBooks: BookType[];
}

interface BookType {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image?: string;
  link?: string;
}

interface SaveBookArgs {
  input: BookType;
}

interface RemoveBookArgs {
  bookId: string;
}

interface Context {
  user?: UserType;
}

const resolvers = {
  Query: {
    users: () => {
      return User.find().sort({ createdAt: -1 });
    },
 
    user: async (_parent: any, { userId }: { userId: string }): Promise<UserType | null> => {
      return User.findById(userId);
    },
    me: async (_parent: any, _args: any, context: Context): Promise<UserType | null> => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated.');
      }
      return User.findById(context.user._id);
    },
  },
  
  Mutation: {
    saveBook: async (_parent: any, { input }: SaveBookArgs, context: Context): Promise<UserType | null> => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated.');
      }
     // try {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        if (!updatedUser) {
          throw new Error('Failed to save the book.');
        }
        return updatedUser as UserType;
 //     }
      /* catch (err) {
        throw new Error('Error while saving book.');
      }*/
    },
    removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: Context): Promise<UserType | null> => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated.');
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error('Failed to remove the book.');
        }

        return updatedUser as UserType;
      } catch (err) {
        throw new Error('Error while removing book.');
      }
    },
    addUser: async (_parent: any, { input }: { input: { username: string; email: string; password: string } }) => {
      const user = await User.create(input);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Invalid credentials.');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
  },
};

export default resolvers;


   /*
     users: async (): Promise<UserType[]> => {
      try {
        return await User.find().sort({ createdAt: -1 });
      } catch (err) {
        throw new Error('Failed to fetch users.');
      }
    },
    */