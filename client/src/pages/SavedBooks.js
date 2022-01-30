import React, { useState } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { QUERY_MYBOOKS } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {

  const { loading, data } = useQuery(QUERY_MYBOOKS, {
    variables: {bookOwner: Auth.getProfile().data._id}
  });
  console.log(data)
  const bookMap = data?.myBooks || {};
  // const { loading, data } = useQuery(QUERY_ME);
  // const bookMap = data?.me || {};

  const [removeBook, {error}] = useMutation(REMOVE_BOOK);

  const [userData, setData] = useState(loading ? null : data.me);

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  // if (!userData) {
  //   return null
  // }


  const handleDeleteBook = async (bookId) => {
    try {
      const data = await removeBook({
       variables: {bookId},
     });

     // update state of books:
     setData(()=>{
       return{
         ...userData,
         savedBooks: data.data.removeBook.savedBooks
       }
     })
   } catch (err) {
     console.error(err);
   }
   removeBookId(bookId);
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>{`Viewing ${Auth.getProfile().data.username}'s saved books!`}</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {/* {bookMap.savedBooks.length
            ? `Viewing  ${bookMap.savedBooks.length} saved ${bookMap.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'} */}
        </h2>
        <CardColumns>
          {!loading && bookMap.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
