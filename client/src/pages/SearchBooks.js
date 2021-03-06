import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { ADD_BOOK } from '../utils/mutations';
import { QUERY_MYBOOKS } from '../utils/queries';
import Auth from '../utils/auth';
import { saveBook, searchGoogleBooks } from '../utils/API';
// import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  
  // const { loading: loadingMe, data: dataMe } = useQuery(QUERY_ME);
  // const myBooks = dataMe?.me || {};
  // const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  // console.log(myBooks)
 
console.log(Auth.getProfile().data.username)

  const [ addBook, {data, loading, error} ] = useMutation(ADD_BOOK, {

    update(cache, { data: { addBook } }) {
      try {

        const { savedBooks } = cache.readQuery({ query: QUERY_MYBOOKS, 
          variables: {bookOwner: Auth.getProfile().data._id}
       });

        cache.writeQuery({
          query: QUERY_MYBOOKS,
          data: { savedBooks: [...savedBooks, addBook] },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup

  // useEffect(() => {
  //   return () => myBooks;
  // });

  // create method to search for books and set state on form submit
  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        bookOwner: Auth.getProfile().data._id,
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }

  }

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
 
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await addBook(
        {
          variables: {
            ...bookToSave,

          }
        }
      )
        console.log(response)
      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // if book successfully saves to user's account, save book id to state
      // setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  let disable = false;

  // if (myBooks.savedBooks?.find(book => book.bookId === searchedBooks.bookId)) {
  //   disable = true;
  //   console.log(disable)
  // }
  // console.log(myBooks.savedBooks, searchedBooks)


  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <CardColumns>
          {searchedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={disable}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(book.bookId)}>
                      {disable
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchBooks;
