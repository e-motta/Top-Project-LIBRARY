export default function DOMHandler(library) {
  function displayBooks(books = library.state.books) {
    if (books === undefined) return null;

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

    displayBooks(library.state.books);

    const deleteButtons = document.querySelectorAll(`.book-delete`);
    deleteButtons.forEach((e) =>
      e.addEventListener("click", (e) => {
        library.deleteBook(e, library.state.books);
        renderBooks(e);
      })
    );
    const readButtons = document.querySelectorAll(`.book-read`);
    readButtons.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        library.toggleRead(e, library.state.books);
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
