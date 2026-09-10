import React, {useState} from 'react'
import { graphql } from 'react-apollo';
import {flowRight as compose} from 'lodash';
import { getAuthorsQuery,getBookQuery, addBookMutation, getBooksQuery } from '../queries/queries';

const AddBook = (props) => {

    const [name, setName] = useState('')
    const [authorId, setAuthorId] = useState(1)

    const author_option = [
        { id: 1, name: 'J. K. Rowling' },
	    { id: 2, name: 'J. R. R. Tolkien' },
	    { id: 3, name: 'Brent Weeks' }
    ]

    const onSubmit = () => {
        
        props.addBookMutation({
            variables: {
                name: name,
                authorid: authorId
            },
            refetchQueries: [
                { query: getBooksQuery },
                { query: getBookQuery}
            ]
        });
    }

    return (
        <div>
            Add Book
            <br />
            <br />
            Book Name : <input type="text" onChange={ (e) => setName(e.target.value) } />
            <br />
            {/* {name} */}
            <br />
            <label htmlFor="author">Author : </label>
            <select id="author" value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
                {author_option.map((item)=>{
                    const {id, name} = item 
                    return <option key={id} value={id} >{name}</option>
                })}
            </select>
            <br />
            {/* {authorId} */}
            <br />
            <input type="submit" onClick={()=>onSubmit()} />
            <br />
        </div>
    )
}

export default compose(
    graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);