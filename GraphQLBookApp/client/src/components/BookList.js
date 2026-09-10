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
            return( <div> Loading books .. </div> );
        } else {
            return data.books.map(book => {
                const {id, name} = book
                return(
                    <li key={ id } onClick={ (e) => {onSelected(id)} } >  { name }  </li> 
                );
            })
        }
    }

    

    return (
        <div>
            <br />
            <div style={{display:'flex'}}>
                <div style ={{width:400}}>
                    BookList
                    <br />
                    <ul id="book-list">
                        {displayBooks()}
                    </ul>
                </div>
                <div style ={{width:600}}>
                    <BookDetails bookId={selected}/>
                </div>
            </div>
            
            <br />
        </div>
    )
}

export default graphql(getBooksQuery)(BookList)
