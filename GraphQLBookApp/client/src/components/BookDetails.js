import React from 'react'
import { graphql } from 'react-apollo';
import { getBookQuery } from '../queries/queries';

const BookDetails = (props) => {

    
    const { book, loading } = props.data;

    if (loading) {
        return <p className="state-message">Loading book details...</p>
    }

    if (!book) {
        return (
            <div className="empty-details">
                <span className="empty-icon" aria-hidden="true">+</span>
                <h2>Select a book</h2>
                <p>Choose a title from your collection to see its details.</p>
            </div>
        )
    }

    return (
        <div className="book-details">
            <div className="section-heading compact-heading">
                <div>
                    <p className="eyebrow">Now reading</p>
                    <h2>{book.name}</h2>
                </div>
                <span className="book-id">#{book.id}</span>
            </div>
            <div className="author-block">
                <span className="author-label">Written by</span>
                <strong>{book.author.name}</strong>
            </div>
            <div className="related-books">
                <h3>More from {book.author.name}</h3>
                <ul>
                    {book.author.books.map((item) => (
                        <li key={item.id}>
                            <span>{item.name}</span>
                            <span className="related-id">#{item.id}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default graphql(getBookQuery, {
    options: (props) => {
        return {
            variables: {
                id: props.bookId
            },
        }
    }
})(BookDetails);