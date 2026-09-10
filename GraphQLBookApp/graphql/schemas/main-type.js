const schema = `
    type BookType {
        id: ID!
        name: String!
        authorid: String
        author: AuthorType
    }
    type AuthorType {
        id: ID!
        name: String!
        books: [BookType]
    }
    type Query {
        book(id:ID):BookType
        books:[BookType]
        author(id:ID):AuthorType
        authors:[AuthorType]
    }
    type Mutation{
        addBook(name:String!,authorid:Int):BookType
        addAuthor(name:String!):AuthorType
    }
`

module.exports = schema

