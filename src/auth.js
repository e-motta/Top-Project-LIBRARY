import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import DOMHandler from "./dom_handler";

const domHandler = DOMHandler();

export default function Auth(authStateObserver) {
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
    if (
      url.indexOf("googleusercontent.com") !== -1 &&
      url.indexOf("?") === -1
    ) {
      return url + "?sz=150";
    }
    return url;
  }

  domHandler.addAuthHandler(signOutUser, signIn);

  return {
    signIn,
    signOutUser,
    initFirebaseAuth,
    getProfilePicUrl,
    getUserName,
    isUserSignedIn,
    addSizeToGoogleProfilePic,
  };
}
