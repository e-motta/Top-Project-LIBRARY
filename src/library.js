import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import Book from "./book";
import DOMHandler from "./dom_handler";

const domHandler = DOMHandler();

export default function Library(auth) {
  let state = { books: [] };

  function loadSampleBooks() {
    state.books = [
      {
        id: 0,
        title: `Infinite Jest`,
        author: `David Foster Wallace`,
        pages: 1079,
        read: true,
      },
      {
        id: 1,
        title: `The Fellowship of the Ring`,
        author: `J. R. R. Tolkien`,
        pages: 423,
        read: true,
      },
      {
        id: 2,
        title: `Harry Potter and the Order of Phoenix`,
        author: `J.K. Rowling`,
        pages: 766,
        read: true,
      },
      {
        id: 3,
        title: `The Final Empire (Mistborn, #1)`,
        author: `Brandon Sanderson`,
        pages: 541,
        read: false,
      },
    ];
  }

  async function loadUserBooks() {
    const booksQuery = await getDocs(collection(getFirestore(), "library"));

    state.books = [];

    booksQuery.forEach((doc) => {
      const book = doc.data();
      book.id = doc.id;
      state.books.push(book);
      console.log(state.books);
    });

    state.books.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
  }

  async function addBook(title, author, pages, read) {
    if (auth.isUserSignedIn()) {
      const newBook = new Book(
        title,
        author,
        pages,
        read,
        getAuth().currentUser.email,
        serverTimestamp()
      );

      try {
        await addDoc(collection(getFirestore(), "library"), newBook);
        await loadUserBooks();
        domHandler.renderBooks(state.books, deleteBook, toggleRead);
      } catch (error) {
        console.error("Error saving book to library database", error);
      }
    } else {
      const newBook = new Book(title, author, pages, read);
      newBook.id = state.books.length;
      state.books.push(newBook);
      domHandler.renderBooks(state.books, deleteBook, toggleRead);
    }
  }

  async function deleteBook(e, books = null) {
    if (auth.isUserSignedIn()) {
      await deleteDoc(doc(getFirestore(), "library", e.target.id));
      await loadUserBooks();
      domHandler.renderBooks(state.books, deleteBook, toggleRead);
    } else {
      books.splice(
        0,
        books.length,
        ...books.filter((book) => book.id !== parseInt(e.target.id))
      );
    }
  }

  async function toggleRead(e, books = null) {
    if (auth.isUserSignedIn()) {
      const bookRef = doc(getFirestore(), "library", e.target.id);
      const book = await getDoc(bookRef, e.target.id);
      await updateDoc(bookRef, {
        read: book.data().read ? false : true,
      });
      await loadUserBooks();
      domHandler.renderBooks(state.books, deleteBook, toggleRead);
    } else {
      books.forEach((book) => {
        if (book.id === parseInt(e.target.id)) {
          book.read = !book.read;
        }
      });
    }
  }

  return {
    state,
    loadSampleBooks,
    loadUserBooks,
    addBook,
    deleteBook,
    toggleRead,
  };
}
