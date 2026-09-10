import React from 'react'
import HeaderLayout from '../hoc/HeaderLayout'
import AddPlace from '../components/AddPlace/AddPlace'

const addplace = () => {
    return (
        <div>
            <HeaderLayout>
                <AddPlace />
            </HeaderLayout> 
        </div>
    )
}

export default addplace
