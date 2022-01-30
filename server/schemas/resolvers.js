const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // users: async () => {
    //   return User.find();
    // },

    // user: async (parent, { userId }) => {
    //   return User.findOne({ _id: userId });
    // },
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them

    myBooks: async (parent, {bookOwner}) => {
      return await Book.findById({bookOwner: bookOwner });
    },

    // me: async (parent, args, context) => {
    //   if (context.user) {
    //     const userData = await User.findOne({ _id: context.user._id }).select('-__v -password')
    //     return userData;
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },

    // OLD ADD BOOK FROM WHEN BOOK WAS A SUBDOCUMENT

    // // Add a third argument to the resolver to access data in our `context`
    // addBook: async (parent, args, context) => {
    //   // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
    //   if (context.user) {
    //     const updateBook = await User.findOneAndUpdate(
    //       { _id: context.user._id },
    //       {
    //         $push: { savedBooks: args },
    //       },
    //       {
    //         new: true,
    //         runValidators: true,
    //       }
    //     );
    //     return updateBook
    //   }
    //   // If user attempts to execute this mutation and isn't logged in, throw an error
    //   throw new AuthenticationError('You need to be logged in!');
    // },

    addBook: async (parent, { bookId, authors, description, image, title, bookOwner }) => {
      const book = await Book.create({ bookId, authors, description, image, title, bookOwner });
      return book;
    },

    // Set up mutation so a logged in user can only remove their profile and no one else's
    removeUser: async (parent, args, context) => {
      if (context.user) {
        return User.findOneAndDelete({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    // Make it so a logged in user can only remove a skill from their own profile
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updateBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: {bookId} } },
          { new: true }
        );
        return updateBook 
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
