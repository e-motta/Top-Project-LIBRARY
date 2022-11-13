import "./reset.css";
import "./style.css";

import DOMHandler from "./dom_handler";

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
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getPerformance } from "firebase/performance";

// ### Firebase ###
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

async function authStateObserver(user) {
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

    // Show user books
    await library.loadUserBooks();
    domHandler.renderBooks();
  } else {
    // Hide name, profile pic and Sign-out button; show Sign-in button
    userNameElement.classList.add("hidden");
    userPicElement.classList.add("hidden");
    signOutButtonElement.classList.add("hidden");

    signInButtonElement.classList.remove("hidden");

    // Hide user books
    library.loadSampleBooks();
    domHandler.renderBooks();
  }
}

signOutButtonElement.addEventListener("click", signOutUser);
signInButtonElement.addEventListener("click", signIn);

// ## App ##

import Book from "./book";

function Library() {
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
    const booksQuery = await getDocs(
      collection(getFirestore(), "library"),
      orderBy("timestamp")
    );

    state.books = [];

    booksQuery.forEach((doc) => {
      const book = doc.data();
      book.id = doc.id;
      state.books.push(book);
    });

    return state.books;
  }

  async function addBook(title, author, pages, read) {
    if (isUserSignedIn()) {
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
        domHandler.renderBooks();
      } catch (error) {
        console.error("Error saving book to library database", error);
      }
    } else {
      const newBook = new Book(title, author, pages, read);
      newBook.id = state.books.length;
      state.books.push(newBook);
      domHandler.renderBooks();
    }
  }

  async function deleteBook(e, books = null) {
    if (isUserSignedIn()) {
      await deleteDoc(doc(getFirestore(), "library", e.target.id));
      await loadUserBooks();
      domHandler.renderBooks();
    } else {
      library.state.books = books.filter(
        (book) => book.id !== parseInt(e.target.id)
      );
    }
  }

  async function toggleRead(e, books = null) {
    if (isUserSignedIn()) {
      const bookRef = doc(getFirestore(), "library", e.target.id);
      const book = await getDoc(bookRef, e.target.id);
      await updateDoc(bookRef, {
        read: book.data().read ? false : true,
      });
      await loadUserBooks();
      domHandler.renderBooks();
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

// Run
const library = Library();
const domHandler = DOMHandler(library);
domHandler.renderBooks();
addFormHandler();
