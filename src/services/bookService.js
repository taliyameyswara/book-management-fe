import axios from "axios";

const api_url = "http://127.0.0.1:8000/api/books";

export const getBooks = () => {
  return axios.get(api_url);
};

export const getBookById = (bookId) => {
  return axios.get(`${api_url}/${bookId}`);
};

export const createBook = (bookData) => {
  return axios.post(api_url, bookData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateBook = (bookId, bookData) => {
  return axios.post(`${api_url}/${bookId}`, bookData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteBook = (bookId) => {
  return axios.delete(`${api_url}/${bookId}`);
};
