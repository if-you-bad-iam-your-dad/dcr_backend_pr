const bcrypt = require('bcrypt');
const { KnexHms } = require('../config/db');
const moment = require('moment');


require('dotenv').config();

const tblpolice = 'police'


exports.datainsert = async (req, res) => {
    try {
        const { district,
            Police_Station,
            CR_NO,
            Section_of_law,
            Crime_type,
            Year,
            Accused_Name,
            Accused_Nick_Name,
            Accused_Gender,
            Guardian,
            Accused_Age,
            Accused_Address,
            updated_by, } = req.body;

        // Validate required fields
        if (!police_name || !police_id || !police_station || !police_rank) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if police already exists
        const existingPolice = await KnexHms(tblpolice).where({ police_id }).first();
        if (existingPolice) {
            return res.status(400).json({ message: 'Police already exists' });
        }

        // Insert new police into the database
        await KnexHms(tblpolice).insert({
            district,
            Police_Station,
            CR_NO,
            Section_of_law,
            Crime_type,
            Year,
            Accused_Name,
            Accused_Nick_Name,
            Accused_Gender,
            Guardian,
            Accused_Age,
            Accused_Address,
            updated_by,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        });

        // Return success response  
        return res.status(201).json({ message: 'Police registered successfully' });
    } catch (error) {
        console.error('Error registering police:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


exports.getAllData = async (req, res) => {
    try {
        const data = await KnexHms(tblpolice).select('*');
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}