import React, { useState } from 'react'
import { graphql } from 'react-apollo';
import {flowRight as compose} from 'lodash';
import { getAuthorsQuery,getBookQuery, addBookMutation, getBooksQuery } from '../queries/queries';

const AddBook = (props) => {

    const [name, setName] = useState('')
    const [authorId, setAuthorId] = useState(1)

    const authorOptions = [
        { id: 1, name: 'J. K. Rowling' },
	    { id: 2, name: 'J. R. R. Tolkien' },
	    { id: 3, name: 'Brent Weeks' }
    ]

    const onSubmit = (event) => {
        event.preventDefault()

        if (!name.trim()) {
            return
        }

        props.addBookMutation({
            variables: {
                name: name.trim(),
                authorid: authorId
            },
            refetchQueries: [
                { query: getBooksQuery },
                { query: getBookQuery}
            ]
        }).then(() => setName(''));
    }

    return (
        <section className="panel add-book-panel">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">New entry</p>
                    <h2>Add a book</h2>
                </div>
                <span className="section-icon" aria-hidden="true">+</span>
            </div>
            <p className="section-description">Add a title to your reading shelf and connect it to an author.</p>
            <form className="book-form" onSubmit={onSubmit}>
                <label htmlFor="book-name">Book name</label>
                <input
                    id="book-name"
                    type="text"
                    value={name}
                    placeholder="e.g. The Name of the Wind"
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="author">Author</label>
                <select id="author" value={authorId} onChange={(e) => setAuthorId(Number(e.target.value))}>
                {authorOptions.map((item)=>{
                    const {id, name} = item 
                    return <option key={id} value={id} >{name}</option>
                })}
                </select>
                <button className="primary-button" type="submit">Add to library</button>
            </form>
        </section>
    )
}

export default compose(
    graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);