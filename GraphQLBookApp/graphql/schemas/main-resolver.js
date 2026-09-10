
const authors = require('../models/authors')
const books = require('../models/books')

const authorResolver = {
    BookType: {
        author: (book) => {
            return authors.find(author => author.id === book.authorId)
        },
    },
    AuthorType: {
        books: (author) => {
            return books.filter(book => book.authorId === author.id)
        },
    },
    Query: {
        author: (parent, args) => authors.find(author => author.id === parseInt(args.id)),
        authors: () => authors,
        book: (parent, args) => books.find(book => book.id === parseInt(args.id)),
        books: () => books,
    },
    Mutation:{
        addAuthor:(parent, args) => {
            const author = { id: authors.length + 1, name: args.name }
            authors.push(author)

            return author
        },
        addBook:(parent, args) => {

            const book = { id: books.length + 1, name: args.name, authorId: args.authorid }
            books.push(book)
            return book
        }
    }
};

module.exports = authorResolver