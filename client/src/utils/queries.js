import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;

export const QUERY_MYBOOKS = gql`
  query my($bookOwner: String) {
    myBooks(bookOwner: $bookOwner) {
      _id
      authors
      description
      bookId
      image
      link
      title
      bookOwner
      owned
    }
  }
`