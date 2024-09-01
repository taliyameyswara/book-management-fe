import React, { useState, useEffect } from "react";
import { Button, Col, Card } from "react-bootstrap";
import { getBooks, deleteBook } from "../services/bookService";
import BookForm from "./BookForm";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // 'create' or 'edit'
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    getBooks()
      .then((response) => {
        setBooks(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch books");
        setLoading(false);
      });
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const handleShowCreate = () => {
    setMode("create");
    setShowModal(true);
  };

  const handleShowEdit = (book) => {
    setMode("edit");
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleBookAddedOrUpdated = () => {
    fetchBooks();
  };

  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBook(bookId)
        .then(() => {
          fetchBooks();
        })
        .catch((err) => {
          alert("Failed to delete book: " + err.message);
        });
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <Button
        variant="success"
        onClick={handleShowCreate}
        className="mb-3 fw-bold fst-italic"
      >
        Add New Book
      </Button>
      <Col>
        {books.map((book) => (
          <Col key={book.id} className="mb-4">
            <Card className="d-flex flex-row">
              <Card.Img
                variant="top"
                src={book.image}
                alt={`${book.title} cover`}
                style={{
                  width: "150px",
                }}
                className="object-fit-cover rounded-0 rounded-start-1"
              />
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Subtitle className="mb-2 fs-6 text-body-tertiary fst-normal">
                  {book.category}
                </Card.Subtitle>
                <Card.Title className="fw-bold">{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {book.author}
                </Card.Subtitle>
                <Card.Text>{truncateText(book.description, 50)}</Card.Text>
                <Card.Text className="text-muted">#{book.id}</Card.Text>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleShowEdit(book)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Col>
      <BookForm
        show={showModal}
        handleClose={handleClose}
        onSuccess={handleBookAddedOrUpdated}
        bookToEdit={selectedBook}
        mode={mode}
      />
    </div>
  );
};

export default BookList;
