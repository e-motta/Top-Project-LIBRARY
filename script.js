let myLibrary = [
    {
        id: 0,
        title: `Infinite Jest`,
        author: `David Foster Wallace`,
        pages: 1079,
        read: true
    },
    {
        id: 1,
        title: `The Fellowship of the Ring`,
        author: `J. R. R. Tolkien`,
        pages: 423,
        read: true
    },
    {
        id: 2,
        title: `Harry Potter and the Order of Phoenix`,
        author: `J.K. Rowling`,
        pages: 766,
        read: true
    },
    {
        id: 3,
        title: `The Final Empire (Mistborn, #1)`,
        author: `Brandon Sanderson`,
        pages: 541,
        read: false
    },
];

class Book {
    constructor(id, title, author, pages, read) {
        this.id = id
        this.title = title
        this.author = author
        this.pages = pages
        this.read = read
    }
}

function displayBooks(library) {
    let booksContainer = document.querySelector(`.books-container`)

    for (let book of library) {
        let bookEl = document.createElement(`div`)
        bookEl.classList.add(`book`)

        addBookTextElement(bookEl, `book-title`, book.title)
        addBookTextElement(bookEl, `book-author`, book.author)
        addBookPagesElement(bookEl, book)
        addBookReadElement(bookEl, book)
        addBookRemoveElement(bookEl, book)

        booksContainer.appendChild(bookEl)
    }
}

function addBookTextElement(container, cls, textAttr) {
    let el = document.createElement(`div`)
    el.classList.add(cls)
    let text = document.createTextNode(textAttr)
    el.appendChild(text)
    container.appendChild(el)
}

function addBookPagesElement(container, book) {
    let el = document.createElement(`div`)
    el.classList.add(`book-pages`)
    let text = document.createTextNode(`${book.pages} pages`)
    el.appendChild(text)
    container.appendChild(el)
}

function addBookReadElement(container, book) {
    let el = document.createElement(`button`)

    el.classList.add(`book-read`)

    let text
    if (book.read) {
        let iconEl = document.createElement(`span`)
        iconEl.id = book.id

        iconEl.classList.add(`material-icons`)
        let icon = document.createTextNode(`done`)
        iconEl.appendChild(icon)
        el.appendChild(iconEl)

        text = document.createTextNode(`Read`)

        el.appendChild(text)

        el.classList.remove(`unread`)
    } else {
        text = document.createTextNode(`Mark as read`)

        el.appendChild(text)

        el.classList.add(`unread`)
    }

    el.id = book.id

    container.appendChild(el)
}

function addBookRemoveElement(container, book) {
    let el = document.createElement(`button`)

    el.classList.add(`book-delete`)
    el.classList.add(`material-icons`)

    let text = document.createTextNode(`delete_forever`)

    el.appendChild(text)

    el.id = book.id

    container.appendChild(el)
}

function updateLibrary() {
    let booksContainer = document.querySelector(`.books-container`)
    booksContainer.innerHTML = ``

    displayBooks(myLibrary)

    const deleteButtons = document.querySelectorAll(`.book-delete`)
    deleteButtons.forEach(e => e.addEventListener("click", deleteBook))
    const readButtons = document.querySelectorAll(`.book-read`)
    readButtons.forEach(btn => btn.addEventListener("click", toggleRead))
}

function deleteBook(e) {
    myLibrary = myLibrary.filter(book => book.id !== parseInt(e.target.id))
    updateLibrary()
}

function toggleRead(e) {
    myLibrary.map((book) => {
        if (book.id === parseInt(e.target.id)) {
            book.read = !book.read
        }
        
    })
    updateLibrary()
}

function addBookToLibrary(title, author, pages, read) {
    const id = myLibrary.length
    newBook = new Book(id, title, author, pages, read)
    myLibrary.push(newBook)
    updateLibrary(myLibrary)
}

function closeModal() {
    const closeButton = document.querySelector(`.modal__close`)
    closeButton.click()
}

function handeSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData)

    addBookToLibrary(formProps[`book-title`], formProps[`book-author`], formProps[`book-pages`], formProps[`book-read`])

    closeModal()
    e.target.reset()
}

updateLibrary()

newBookForm = document.querySelector(`#add-book-form`)
newBookForm.addEventListener(`submit`, handeSubmit)
