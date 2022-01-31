import React, { useState } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { QUERY_MYBOOKS } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {

  const { loading, data: bookData } = useQuery(QUERY_MYBOOKS, {
    variables: {bookOwner: Auth.getProfile().data._id}
  });
  console.log(bookData)
  const bookMap = bookData?.myBooks || {};
  // const { loading, data } = useQuery(QUERY_ME);
  // const bookMap = data?.me || {};

  const [removeBook, {data: deleteData, error}] = useMutation(REMOVE_BOOK);

  const [userData, setData] = useState(loading ? null : bookData);
  console.log(userData)
  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  // if (!userData) {
  //   return null
  // }


  const handleDeleteBook = async (myBook) => {
    try {
      const { deleteData } = await removeBook({
       variables: {myBook},
     });

     // update state of books:
     setData(()=>{
       return{
         ...userData,
       }
     })
   } catch (err) {
     console.error(err);
   }
   removeBookId(myBook);
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
          {bookMap
            ? `Viewing  ${Auth.getProfile().data.username}'s saved ${bookMap.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
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
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book._id)}>
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
