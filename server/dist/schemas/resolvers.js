import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';
const resolvers = {
    Query: {
        users: () => {
            return User.find().sort({ createdAt: -1 });
        },
        user: async (_parent, { userId }) => {
            return User.findById(userId);
        },
        me: async (_parent, _args, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated.');
            }
            return User.findById(context.user._id);
        },
    },
    Mutation: {
        saveBook: async (_parent, { input }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated.');
            }
            // try {
            const updatedUser = await User.findByIdAndUpdate(context.user._id, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true });
            if (!updatedUser) {
                throw new Error('Failed to save the book.');
            }
            return updatedUser;
            //     }
            /* catch (err) {
              throw new Error('Error while saving book.');
            }*/
        },
        removeBook: async (_parent, { bookId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated.');
            }
            try {
                const updatedUser = await User.findByIdAndUpdate(context.user._id, { $pull: { savedBooks: { bookId } } }, { new: true });
                if (!updatedUser) {
                    throw new Error('Failed to remove the book.');
                }
                return updatedUser;
            }
            catch (err) {
                throw new Error('Error while removing book.');
            }
        },
        addUser: async (_parent, { input }) => {
            const user = await User.create(input);
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
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
