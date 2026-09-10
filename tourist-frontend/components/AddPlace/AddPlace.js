import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import config from '../../config/config'

const AddPlace = () => {

    const place = {
        "name": "Red Fort",
        "address": "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi, Delhi 110006",
        "description": "This is the description of Red Fort",
        "image": "http://abhibuscommunity.com/wp-content/uploads/2018/01/delhi-red-fort.jpg"
    }

    const [name, setName] = useState(place.name)
    const [address, setAddress] = useState(place.address)
    const [description, setDescription] = useState(place.description)
    const [image, setImage] = useState(place.image)

    const onAddingPlace = async () => {

        console.log('on adding place')
       
        const url = `${config.URL.SERVER}place/insert`

        const addPlace = {
            'name' : name, 'address' : address,
            'description' : description, 'image' : image
        }

        console.log(`name : ${name}`)

        console.log(JSON.stringify(addPlace, null, 2))

        const response = await axios.post(url, addPlace).then(res=>{
            return res.data.response
        })

        console.log('response', response)
        
    }

    const onUpdatingPlace = async () => {

        console.log('on updating place')

        const url = `${config.URL.SERVER}place/update`

        const updatePlace = {
            name : name, address : address,
            description : description, image : image
        }

        console.log(`name : ${name}`)

        console.log(JSON.stringify(updatePlace, null, 2))

        const response = await axios.put(url, updatePlace).then(res=>{
            return res.data.response
        })

        console.log('response', response)
    
    
    }

    return (
        <div>
           <Grid>
            <form action="">
                <div style={{margin:20}}>
                <TextField variant="outlined" label="Place Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div style={{margin:20}}>
                <TextField style={{paddingRight:100}} variant="outlined" value={address} fullWidth label="Place Address" onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div style={{margin:20, }}>
                <TextField style={{paddingRight:100, }} fullWidth variant="outlined" value={image} label="Place image url" onChange={(e) => setImage(e.target.value)} />
                </div>
                <div style={{margin:20}}> 
                <TextField style={{paddingRight:100}} multiline fullWidth rows={6} value={description} variant="outlined" label="Place Description" onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div style={{display:'flex',marginLeft:20}}>
                    <Button variant='contained' onClick={()=>{onAddingPlace()}} style={{background:'green', color:'white'}}> Add Place </Button>
                    <div style={{marginRight:50}}></div>
                    <Button variant='contained' onClick={()=>{onUpdatingPlace()}} style={{background:'darkorange', color:'white'}}> Update Place </Button>
                </div>
                
            </form>
            </Grid>
        </div>
    )
}

export default AddPlace
