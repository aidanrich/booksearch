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
    _id: ID!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
  }

  type Query {
    user: [User]!
    user(userId: ID!): User
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    me: User
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    addBook(userId: ID!, authors: String, description: String!, bookId: String!, imnage: String, link: String!, title: String!): User
    removeUser: User
    removeBook(title: String!): User
  }
`;

module.exports = typeDefs;
