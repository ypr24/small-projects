import React, {useState, useEffect} from 'react'
import Place from './Place'
import axios from 'axios'
import config from '../../config/config'

const AllPlaces = (props) => {
    
    const [list, setList] = useState(props.allplaces)
    const [del, setDel] = useState(false)

    const loadData = async () => {

        const url = `${config.URL.SERVER}place/getallplaces`

        const getAllplaces = await axios.get(url)
        .then(res=>{
                const listOfallPlaces = res.data.list
                return listOfallPlaces
        })
        .then((listOfallPlaces)=>{
            setList(listOfallPlaces)
        })
        .catch(e=>e)

    }

    useEffect(() => {
        loadData()
    },[del])

    const onDelete = async (name) => {

        const url = `${config.URL.SERVER}place/delete`

        const response = await axios.delete(
            url, { data : {name: name} }
            ).then(
                res=>{
                    setDel(!del)
                    return res.data.r
            }).catch(e=>e)

    }


    return (
        <div>
            <br/>
            {
                list.map( item => {
                    return <Place onDelete={()=>{ onDelete(item.name) }} detail={item} />
                })
            }
        </div>
    )
}

export default AllPlaces
