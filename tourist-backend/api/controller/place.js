
const Place = require('../models/place')

module.exports = {

    getallplaces: async(req,res,next)=>{

        const allPlaces = await Place.find({})
        
        res.json({
            list : allPlaces,
            message:'fetching the list of all places'
        })

    },
    insert: async(req,res,next)=>{

        const {name, address, description, image} = req.body;

        const newPlace = new Place({ 
            'name':name, 'address': address, 
            'description' : description, 'image':image
        })
        
        try {
            const response = await newPlace.save()

            res.json({
                response: response ,
                message:'place successfully inserted'
            })

        }catch(e){

            res.json({
                response: e ,
                message:'place insertion failed'
            })
        }

    },
    update: async(req,res,next)=>{

        const {name, address, description, image} = req.body;

        let updatedPlaceDetails = {}

        Boolean(name) && (updatedPlaceDetails['name'] = name)
        Boolean(address) && (updatedPlaceDetails['address'] =  address)
        Boolean(description) && (updatedPlaceDetails['description'] = description)
        Boolean(image) && (updatedPlaceDetails['image'] = image)

        try {
            const response = await Place.updateOne({ 'name': name }, { $set: updatedPlaceDetails })

            res.json({
                response: response ,
                message:'place successfully updated'
            })

        }catch(e){

            res.json({
                response: e ,
                message:'place update failed'
            })
        }

    },
    delete: async(req,res,next)=>{

        console.log('Deleting ...')
        const {name} = req.body;
        console.log('name: ',name)
        try {
            const response = await Place.deleteOne({ name: name })
            console.log(JSON.stringify(response, null, 2))
            res.json({
                response: response ,
                message:'place successfully deleted'
            })
        }catch(e){
            console.log(e)
            res.json({
                response: e ,
                message:'place deletion failed'
            })
        }

    },   
}