import "./reset.css";
import "./style.css";

import Auth from "./auth";
import DOMHandler from "./dom_handler";
import Library from "./library";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyBzvedVoohmLiocZ60gA0N18cTy9RmzOM4",
  authDomain: "top-project-library.firebaseapp.com",
  projectId: "top-project-library",
  storageBucket: "top-project-library.appspot.com",
  messagingSenderId: "310303229002",
  appId: "1:310303229002:web:24d843a4e6edb6a3e692b3",
  measurementId: "G-85BPBZ30WY",
};

const auth = Auth(authStateObserver);
const library = Library(auth);
const domHandler = DOMHandler(library);
const app = initializeApp(firebaseConfig);

async function authStateObserver(user) {
  if (user) {
    // Set name and profile pic
    let userName = auth.getUserName();

    // Show Sign-out button and hide Sign-in button
    domHandler.signIn(userName);

    // Show user books
    await library.loadUserBooks();
    domHandler.renderBooks(
      library.state.books,
      library.deleteBook,
      library.toggleRead
    );
  } else {
    // Hide name, profile pic and Sign-out button; show Sign-in button
    domHandler.signOut();

    // Hide user books
    library.loadSampleBooks();
    domHandler.renderBooks(
      library.state.books,
      library.deleteBook,
      library.toggleRead
    );
  }
}

getAnalytics(app);
getPerformance();
auth.initFirebaseAuth();

domHandler.addFormHandler(library.addBook);
domHandler.renderBooks(
  library.state.books,
  library.deleteBook,
  library.toggleRead
);
