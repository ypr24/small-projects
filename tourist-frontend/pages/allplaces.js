import React from 'react'
import HeaderLayout from '../hoc/HeaderLayout'
import AllPlaces from '../components/AllPlaces/AllPlaces'
import axios from 'axios'
import config from '../config/config'

const allplaces = (props) => {
    return (
        <div>
            <HeaderLayout>
                <AllPlaces allplaces={props.allplaces} />
            </HeaderLayout>
        </div>
    )
}

export async function getServerSideProps(ctx){

    const url = `${config.URL.SERVER}place/getallplaces`
    const getAllplaces = await axios.get(url).then(
        res=>{
            const listOfallPlaces = res.data.list
            return listOfallPlaces
        }
    ).catch(e=>{
        console.log(e)
        return []
    })

    return {
        props :{
            allplaces: getAllplaces
        }
    }

}

export default allplaces
