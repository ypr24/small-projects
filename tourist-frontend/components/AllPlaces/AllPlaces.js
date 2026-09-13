import React, { useState, useEffect } from 'react'
import Place from './Place'
import axios from 'axios'
import { API_URL } from '../../config/config'

const AllPlaces = ({ allplaces = [] }) => {
    const [list, setList] = useState(allplaces)
    const [error, setError] = useState('')

    const loadData = async () => {

        const url = `${API_URL}place/getallplaces`

        try {
            const response = await axios.get(url)
            setList(response.data.list || [])
            setError('')
        } catch (e) {
            setError('Could not load places. Check the server and try again.')
        }

    }

    useEffect(() => {
        loadData()
    }, [])

    const onDelete = async (name) => {

        const url = `${API_URL}place/delete`

        try {
            await axios.delete(url, { data: { name } })
            setList((currentList) => currentList.filter((place) => place.name !== name))
        } catch (e) {
            setError('Could not delete the place. Check the server and try again.')
        }

    }


    return (
        <div>
            {error && <p className="error">{error}</p>}
            {list.length === 0 && !error && <p>No places found.</p>}
            {list.map((item) => (
                <Place key={item._id || item.name} onDelete={() => onDelete(item.name)} detail={item} />
            ))}
        </div>
    )
}

export default AllPlaces
