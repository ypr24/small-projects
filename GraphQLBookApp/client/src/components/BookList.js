import React, { useState } from 'react'
import { graphql } from 'react-apollo';
import { getBooksQuery } from '../queries/queries';
import BookDetails from './BookDetails';

const BookList = (props) => {

    const [selected, setSelected] = useState(1)

    const onSelected = (id) =>{ 
        setSelected(() => id)
    }

    const displayBooks = () => {

        let data = props.data;

        if(data.loading){
            return( <p className="state-message">Loading your library...</p> );
        } else if (!data.books || data.books.length === 0) {
            return( <p className="state-message">No books yet. Add your first title above.</p> );
        } else {
            return data.books.map(book => {
                const {id, name} = book
                return(
                    <li
                        className={selected === id ? 'book-item selected' : 'book-item'}
                        key={id}
                        onClick={() => onSelected(id)}
                    >
                        <span className="book-dot" aria-hidden="true" />
                        <span>{name}</span>
                        <span className="book-arrow" aria-hidden="true">&#8594;</span>
                    </li>
                );
            })
        }
    }

    

    return (
        <section className="library-layout">
                <div className="panel book-list-panel">
                    <div className="section-heading compact-heading">
                        <div>
                            <p className="eyebrow">Your collection</p>
                            <h2>Books</h2>
                        </div>
                        <span className="collection-label">Live list</span>
                    </div>
                    <ul id="book-list" className="book-list">
                        {displayBooks()}
                    </ul>
                </div>
                <div className="panel details-panel">
                    <BookDetails bookId={selected}/>
                </div>
        </section>
    )
}

export default graphql(getBooksQuery)(BookList)
