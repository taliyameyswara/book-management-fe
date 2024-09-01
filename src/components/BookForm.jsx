import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createBook, updateBook } from "../services/bookService";

const BookForm = ({
  show,
  handleClose,
  onSuccess,
  bookToEdit = null,
  mode = "create",
}) => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    image: null,
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (bookToEdit) {
      setBook({ ...bookToEdit, image: bookToEdit.image || null });

      if (bookToEdit.image && typeof bookToEdit.image === "string") {
        setPreviewImage(bookToEdit.image);
      }
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setBook({ ...book, image: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("author", book.author);
    formData.append("description", book.description);
    formData.append("category", book.category);

    if (book.image && typeof book.image !== "string") {
      formData.append("image", book.image);
    }

    const action =
      mode === "create" ? createBook(formData) : updateBook(book.id, formData);

    action
      .then(() => {
        onSuccess();
        handleClose();
      })
      .catch((err) => {
        console.error(err.response?.data);
        setError(err.response?.data?.message || "Failed to save book");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          {mode === "create" ? "Add New Book ✅" : "Edit Book's Data ✏️"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p>Loading...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label className="fw-bold">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="author">
            <Form.Label className="fw-bold">Author</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={book.author}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={book.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label className="fw-bold">Category</Form.Label>
            <Form.Select
              name="category"
              value={book.category}
              onChange={handleChange}
              required
            >
              <option>Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="Biography">Biography</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label className="fw-bold">Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ maxWidth: "100px" }}
                />
              </div>
            )}
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              variant={mode === "create" ? "success" : "primary"}
              type="submit"
              className="fw-bold"
            >
              {mode === "create" ? "Add Book" : "Update Book"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookForm;
