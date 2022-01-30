import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook($authors: [String], $description: String, $title: String, $bookId: String, $image: String,  $bookOwner: String) {
    addBook(authors: $authors, description: $description, title: $title, bookId: $bookId, image: $image, bookOwner: $bookOwner) {
            _id
            authors
            description
            title
            bookId
            image
            bookOwner
    }
  }
`;

export const REMOVE_BOOK = gql`
mutation removeBook( $bookId: String! ){
        removeBook( bookId: $bookId ){
            username
            savedBooks{
                authors
                description
                title
                bookId
                image
                link
            }
        }
    }
`;