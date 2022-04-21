let myLibrary = [
    {
        id: 1,
        title: `Lord of The Rings Rings Rings`,
        author: `J.R.R Tolkien J.R.R Tolkien J.R.R`,
        pages: 300,
        read: true
    },
    {
        id: 2,
        title: `Harry Potter and the Order of Phoenix`,
        author: `J.K. Rowling`,
        pages: 500,
        read: false
    },
    {
        id: 3,
        title: `Go`,
        author: `John Doe`,
        pages: 500,
        read: false
    },
    {
        id: 4,
        title: `Harry Potter and the Order of Phoenix`,
        author: `J.K. Rowling`,
        pages: 500,
        read: false
    },
    {
        id: 5,
        title: `Lord of The Rings Rings Rings`,
        author: `J.R.R Tolkien J.R.R Tolkien J.R.R`,
        pages: 300,
        read: true
    },
    {
        id: 6,
        title: `Harry Potter and the Order of Phoenix`,
        author: `J.K. Rowling`,
        pages: 500,
        read: false
    },
    {
        id: 7,
        title: `Go`,
        author: `John Doe`,
        pages: 500,
        read: false
    },
    {
        id: 8,
        title: `Harry Potter and the Order of Phoenix`,
        author: `J.K. Rowling`,
        pages: 500,
        read: false
    },
    {
        id: 9,
        title: `Lord of The Rings Rings Rings`,
        author: `J.R.R Tolkien J.R.R Tolkien J.R.R`,
        pages: 300,
        read: true
    },
    {
        id: 10,
        title: `Harry Potter and the Order of Phoenix`,
        author: `J.K. Rowling`,
        pages: 500,
        read: false
    },
    {
        id: 11,
        title: `Harry Potter and the Order of Phoenix`,
        author: `J.K. Rowling`,
        pages: 500,
        read: false
    },
];

function Book(id, title, author, pages, read) {
    this.id = id
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}

function addBookToLibrary(title, author, pages, read) {
    newBook = new Book(title, author, pages, read)
    myLibrary.push(newBook)
    updateLibrary(myLibrary)
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
        iconEl.classList.add(`material-icons`)
        let icon = document.createTextNode(`done`)
        iconEl.appendChild(icon)
        el.appendChild(iconEl)

        text = document.createTextNode(`Read`)
    } else {
        text = document.createTextNode(`Mark as read`)
    }
    el.appendChild(text)

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

function deleteBook(library, id) {
    library = library.filter((book) => book.id !== id)
    updateLibrary(library)
}

function updateLibrary(library) {
    let booksContainer = document.querySelector(`.books-container`)
    booksContainer.innerHTML = ``
    displayBooks(library)
}

displayBooks(myLibrary)
deleteBook(myLibrary, 2)
