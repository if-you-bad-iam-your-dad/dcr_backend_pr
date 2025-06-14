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
            console.log(req.body);

        // Validate required fields
        if (!CR_NO || !Crime_type || !Police_Station || !Section_of_law) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // // Check if police already exists
        // const existingPolice = await KnexHms(tblpolice).where({ police_id }).first();
        // if (existingPolice) {
        //     return res.status(400).json({ message: 'Police already exists' });
        // }

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
            updated_by
            
        });

        // Return success response  
        return res.status(201).json({ message: 'Police registered successfully' });
    } catch (error) {
        console.error('Error registering police:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updatecrime = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL parameters

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
            updated_by
         } = req.body;
        console.log('ID from params:', id);
        console.log('Request body:', req.body);
        
        // Update the record in the database
        await KnexHms(tblpolice).where({ id }).update({
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
            updated_by
        });
        
        // Return success response
        return res.status(200).json({ message: 'Crime record updated successfully' });
    } catch (error) {
        console.error('Error updating record:', error);
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

exports.deleteData = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL parameters
        // console.log('ID from params:', id);

        // Validate ID parameter
        if (!id) {
            return res.status(400).json({ message: 'ID parameter is required' });
        }

        // Check if the record exists
        const existingRecord = await KnexHms(tblpolice).where({ id }).first();
        if (!existingRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }        // Delete the record from the database
        await KnexHms(tblpolice).where({ id }).del();

        // Return success response
        return res.status(200).json({ message: 'Crime record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.totalcasecount = async (req, res) => {
    try {
        const count = await KnexHms(tblpolice)
            .countDistinct('CR_NO as total');
        return res.status(200).json({ total: count[0].total });
    } catch (error) {
        console.error('Error fetching total case count:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

    
exports.crimeTypeCount = async (req, res) => {
    try {
        const crimeCounts = await KnexHms(tblpolice)
            .select('Crime_type')
            .count('CR_NO as count')
            .groupBy('Crime_type');

        return res.status(200).json(crimeCounts);
    } catch (error) {
        console.error('Error fetching crime type counts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

