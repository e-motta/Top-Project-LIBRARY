export default function DOMHandler() {
  function displayBooks(books) {
    if (books === undefined || books.length === 0) return null;

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

  function renderBooks(books, deleteBook, toggleRead) {
    const booksContainer = document.querySelector(`.books-container`);
    booksContainer.innerHTML = ``;
    displayBooks(books);

    const deleteButtons = document.querySelectorAll(`.book-delete`);
    deleteButtons.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        deleteBook(e, books);
        renderBooks(books, deleteBook, toggleRead);
      })
    );
    const readButtons = document.querySelectorAll(`.book-read`);
    readButtons.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        toggleRead(e, books);
        renderBooks(books, deleteBook, toggleRead);
      })
    );
  }

  function closeModal() {
    const closeButton = document.querySelector(`.modal__close`);
    closeButton.click();
  }

  function signIn(userName) {
    const userPicElement = document.querySelector("#user-pic");
    const userNameElement = document.querySelector("#user-name");
    const signOutButtonElement = document.querySelector("#sign-out");
    const signInButtonElement = document.querySelector("#sign-in");

    userNameElement.textContent = userName;

    userNameElement.classList.remove("hidden");
    userPicElement.classList.remove("hidden");
    signOutButtonElement.classList.remove("hidden");

    signInButtonElement.classList.add("hidden");
  }

  function signOut() {
    const userPicElement = document.querySelector("#user-pic");
    const userNameElement = document.querySelector("#user-name");
    const signOutButtonElement = document.querySelector("#sign-out");
    const signInButtonElement = document.querySelector("#sign-in");

    userNameElement.classList.add("hidden");
    userPicElement.classList.add("hidden");
    signOutButtonElement.classList.add("hidden");

    signInButtonElement.classList.remove("hidden");
  }

  function addAuthHandler(signOutUser, signIn) {
    const signOutButtonElement = document.querySelector("#sign-out");
    const signInButtonElement = document.querySelector("#sign-in");

    signOutButtonElement.addEventListener("click", signOutUser);
    signInButtonElement.addEventListener("click", signIn);
  }

  function handleSubmit(e, addBook) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    addBook(
      formProps[`book-title`],
      formProps[`book-author`],
      formProps[`book-pages`],
      formProps[`book-read`]
    );

    closeModal();
    e.target.reset();
  }

  function addFormHandler(addBook) {
    const newBookForm = document.querySelector(`#add-book-form`);
    newBookForm.addEventListener(`submit`, (e) => {
      handleSubmit(e, addBook);
    });
  }

  return {
    displayBooks,
    renderBooks,
    closeModal,
    signIn,
    signOut,
    addAuthHandler,
    addFormHandler,
  };
}
