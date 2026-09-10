import React from 'react'
import { graphql } from 'react-apollo';
import { getBookQuery } from '../queries/queries';

const BookDetails = (props) => {

    
    const displayBookDetails = () => {
        const { book } = props.data;
        
        console.log('book : ',JSON.stringify(book,null,2))

        if(book){
            return (<div>
                <br />
                id : {book.id}
                <br />
                name : {book.name}
                <br />
                author : {book.author.name}
                <br />
                All books by Author
                <br />
                {
                    book.author.books.map((item, i)=>{
                        return <li key={i} > id: {item.id} name : {item.name}</li>
                    })
                }
            </div>)  
        }else{
            return (<div> No books found .. </div>)
        }

    }
    
    return (
        <div>
            BookDetails
            <br />
            <div>
            {displayBookDetails()}
            </div>
            <br />
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