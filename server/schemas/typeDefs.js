const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String
    image: String
    link: String
    title: String
    bookOwner: String
    owned: Boolean
  }

  type Query {
    users: [User]!
    user(userId: ID!): User
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    myBooks(bookOwner: String): [Book]
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    addBook(authors: [String], description: String, bookId: String, image: String, link: String, title: String, bookOwner: String): Book
    removeUser: User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
