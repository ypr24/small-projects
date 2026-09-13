
const Place = require('../models/place');

module.exports = {
    getAllPlaces: async (req, res) => {
        try {
            const places = await Place.find({});
            res.json({ list: places, message: 'Fetching the list of all places.' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch places.', error: error.message });
        }
    },

    insert: async (req, res) => {
        const { name, address, description, image } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }

        try {
            const place = await Place.create({ name, address, description, image });
            res.status(201).json({ response: place, message: 'Place successfully inserted.' });
        } catch (error) {
            const status = error.code === 11000 ? 409 : 500;
            res.status(status).json({ message: 'Place insertion failed.', error: error.message });
        }
    },

    update: async (req, res) => {
        const { name, newName, address, description, image } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }

        const updates = {};
        if (newName) updates.name = newName;
        if (address !== undefined) updates.address = address;
        if (description !== undefined) updates.description = description;
        if (image !== undefined) updates.image = image;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'At least one field to update is required.' });
        }

        try {
            const result = await Place.updateOne({ name }, { $set: updates });

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Place not found.' });
            }

            res.json({ response: result, message: 'Place successfully updated.' });
        } catch (error) {
            const status = error.code === 11000 ? 409 : 500;
            res.status(status).json({ message: 'Place update failed.', error: error.message });
        }
    },

    delete: async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }

        try {
            const result = await Place.deleteOne({ name });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Place not found.' });
            }

            res.json({ response: result, message: 'Place successfully deleted.' });
        } catch (error) {
            res.status(500).json({ message: 'Place deletion failed.', error: error.message });
        }
    },
};