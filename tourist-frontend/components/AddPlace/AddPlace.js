import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios from 'axios'
import { API_URL } from '../../config/config'

const AddPlace = () => {
    const [place, setPlace] = useState({ name: '', address: '', description: '', image: '' })
    const [status, setStatus] = useState({ type: '', message: '' })
    const [isSaving, setIsSaving] = useState(false)

    const onChange = (event) => {
        const { name, value } = event.target
        setPlace((currentPlace) => ({ ...currentPlace, [name]: value }))
    }

    const savePlace = async (event, method, action) => {
        event.preventDefault()

        if (Object.values(place).some((value) => !value.trim())) {
            setStatus({ type: 'error', message: 'Please complete every field.' })
            return
        }

        setIsSaving(true)
        setStatus({ type: '', message: '' })

        try {
            await axios({
                method,
                url: `${API_URL}place/${action}`,
                data: place,
            })
            setStatus({ type: 'success', message: `Place ${action === 'insert' ? 'added' : 'updated'} successfully.` })
        } catch (error) {
            setStatus({ type: 'error', message: 'Could not save the place. Check the server and try again.' })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={(event) => savePlace(event, 'post', 'insert')}>
            <TextField name="name" label="Place name" value={place.name} onChange={onChange} fullWidth required margin="normal" />
            <TextField name="address" label="Place address" value={place.address} onChange={onChange} fullWidth required margin="normal" />
            <TextField name="image" label="Image URL" value={place.image} onChange={onChange} fullWidth required margin="normal" />
            <TextField name="description" label="Description" value={place.description} onChange={onChange} fullWidth required multiline rows={5} margin="normal" />
            <div className="form-actions">
                <Button type="submit" variant="contained" disabled={isSaving}>Add place</Button>
                <Button type="button" variant="outlined" disabled={isSaving} onClick={(event) => savePlace(event, 'put', 'update')}>Update place</Button>
            </div>
            {status.message && <p className={status.type}>{status.message}</p>}
        </form>
    )
}

export default AddPlace
