import "./reset.css";
import "./style.css";

// Import Firebase SDKs
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getPerformance } from "firebase/performance";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzvedVoohmLiocZ60gA0N18cTy9RmzOM4",
  authDomain: "top-project-library.firebaseapp.com",
  projectId: "top-project-library",
  storageBucket: "top-project-library.appspot.com",
  messagingSenderId: "310303229002",
  appId: "1:310303229002:web:24d843a4e6edb6a3e692b3",
  measurementId: "G-85BPBZ30WY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
getPerformance();
initFirebaseAuth();

// DOM Elements
const userPicElement = document.querySelector("#user-pic");
const userNameElement = document.querySelector("#user-name");
const signOutButtonElement = document.querySelector("#sign-out");
const signInButtonElement = document.querySelector("#sign-in");

// Firebase Auth
async function signIn() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

function signOutUser() {
  signOut(getAuth());
}

function initFirebaseAuth() {
  onAuthStateChanged(getAuth(), authStateObserver);
}

function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || "/images/profile_placeholder.png";
}

function getUserName() {
  return getAuth().currentUser.displayName;
}

function isUserSignedIn() {
  return !!getAuth().currentUser;
}

function addSizeToGoogleProfilePic(url) {
  if (url.indexOf("googleusercontent.com") !== -1 && url.indexOf("?") === -1) {
    return url + "?sz=150";
  }
  return url;
}

function authStateObserver(user) {
  if (user) {
    // Set name and profile pic
    let profilePicUrl = getProfilePicUrl();
    let userName = getUserName();

    userPicElement.style.backgroundImage =
      "url(" + addSizeToGoogleProfilePic(profilePicUrl) + ")";
    userNameElement.textContent = userName;

    // Show Sign-out button and hide Sign-in button
    userNameElement.classList.remove("hidden");
    userPicElement.classList.remove("hidden");
    signOutButtonElement.classList.remove("hidden");

    signInButtonElement.classList.add("hidden");

    // TODO: Show user books
    const books = [
      {
        id: 0,
        title: `Infinite`,
        author: `David Foster Wallace`,
        pages: 1079,
        read: true,
      },
    ];

    library.updateBooks(books);
    domHandler.renderBooks();
  } else {
    // Hide name, profile pic and Sign-out button; show Sign-in button
    userNameElement.classList.add("hidden");
    userPicElement.classList.add("hidden");
    signOutButtonElement.classList.add("hidden");

    signInButtonElement.classList.remove("hidden");

    // TODO: Hide user books
    library.updateBooks();
    domHandler.renderBooks();
  }
}

signOutButtonElement.addEventListener("click", signOutUser);
signInButtonElement.addEventListener("click", signIn);

// Firebase Firestore Database
// asyncFunction saveBook()

// ## App ##

function Book(id, title, author, pages, read) {
  return { id, title, author, pages, read };
}

function Library() {
  const sampleBooks = [
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

  let books = sampleBooks;

  function updateBooks(newBooks) {
    books = newBooks;
  }

  function deleteBook(e, books) {
    library.books = books.filter((book) => book.id !== parseInt(e.target.id));
  }

  function toggleRead(e, books) {
    books.forEach((book) => {
      if (book.id === parseInt(e.target.id)) {
        book.read = !book.read;
      }
    });
    console.log("books", books);
  }

  function addBook(title, author, pages, read) {
    // TODO
    const id = books.length;

    const newBook = new Book(id, title, author, pages, read);

    books.push(newBook);
  }

  return {
    books,
    updateBooks,
    deleteBook,
    toggleRead,
    addBook,
    handleSubmit,
  };
}

function DOMHandler(library) {
  function displayBooks(books = library.sampleBooks) {
    const booksContainer = document.querySelector(`.books-container`);

    books.forEach((book) => {
      const bookEl = document.createElement(`div`);
      bookEl.classList.add(`book`);

      addBookTextElement(bookEl, `book-title`, book.title);
      addBookTextElement(bookEl, `book-author`, book.author);
      addBookPagesElement(bookEl, book);
      addBookReadElement(bookEl, book);
      addBookRemoveElement(bookEl, book);

      booksContainer.appendChild(bookEl);
    });
  }

  function addBookTextElement(container, cls, textAttr) {
    const el = document.createElement(`div`);
    const text = document.createTextNode(textAttr);

    el.classList.add(cls);
    el.appendChild(text);
    container.appendChild(el);
  }

  function addBookPagesElement(container, book) {
    const el = document.createElement(`div`);
    const text = document.createTextNode(`${book.pages} pages`);

    el.classList.add(`book-pages`);
    el.appendChild(text);
    container.appendChild(el);
  }

  function addBookReadElement(container, book) {
    const el = document.createElement(`button`);

    el.classList.add(`book-read`);

    let text;
    if (book.read) {
      const iconEl = document.createElement(`span`);
      const icon = document.createTextNode(`done`);

      iconEl.id = book.id;

      iconEl.classList.add(`material-icons`);
      iconEl.appendChild(icon);
      el.appendChild(iconEl);

      text = document.createTextNode(`Read`);

      el.appendChild(text);

      el.classList.remove(`unread`);
    } else {
      text = document.createTextNode(`Mark as read`);

      el.appendChild(text);

      el.classList.add(`unread`);
    }

    el.id = book.id;

    container.appendChild(el);
  }

  function addBookRemoveElement(container, book) {
    const el = document.createElement(`button`);
    const text = document.createTextNode(`delete_forever`);

    el.classList.add(`book-delete`);
    el.classList.add(`material-icons`);

    el.appendChild(text);

    el.id = book.id;

    container.appendChild(el);
  }

  function renderBooks() {
    const booksContainer = document.querySelector(`.books-container`);
    booksContainer.innerHTML = ``;

    displayBooks(library.books);

    const deleteButtons = document.querySelectorAll(`.book-delete`);
    deleteButtons.forEach((e) =>
      e.addEventListener("click", (e) => {
        library.deleteBook(e, library.books);
        renderBooks(e);
      })
    );
    const readButtons = document.querySelectorAll(`.book-read`);
    readButtons.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        library.toggleRead(e, library.books);
        renderBooks(e);
      })
    );
  }

  function closeModal() {
    const closeButton = document.querySelector(`.modal__close`);
    closeButton.click();
  }

  return { displayBooks, renderBooks, closeModal };
}

// Form handler
function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);

  library.addBook(
    formProps[`book-title`],
    formProps[`book-author`],
    formProps[`book-pages`],
    formProps[`book-read`]
  );

  domHandler.closeModal();
  e.target.reset();
}

function addFormHandler() {
  const newBookForm = document.querySelector(`#add-book-form`);
  newBookForm.addEventListener(`submit`, handleSubmit);
}

const library = Library();
const domHandler = DOMHandler(library);
domHandler.renderBooks();
addFormHandler();
