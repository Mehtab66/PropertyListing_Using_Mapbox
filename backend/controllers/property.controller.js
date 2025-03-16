const Property=require('../models/property.model');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Property = require('../models/Property');

// Create Property (Admin only)
module.exports.uplodProperty=async(req,res)=>{
  const {
    title,
    type,
    address: { houseNo, plotNo, street, block, city }, // Destructure address, societyName defaults to Sowan Gardens
    description,
    size,
    bedrooms,
    bathrooms,
    features,
    price,
    images
  } = req.body;

  // Construct full address for geocoding
  const fullAddress = `${
    type === 'house' && houseNo ? houseNo + ', ' : 
    type === 'plot' && plotNo ? plotNo + ', ' : ''
  }${street}, ${block}, Sowan Gardens, ${city}, Pakistan`;

  try {
    // Geocode with Mapbox
    const geocodingResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${process.env.MAPBOX_TOKEN}`
    );
    const geocodingData = await geocodingResponse.json();
    if (!geocodingData.features || geocodingData.features.length === 0) {
      return res.status(400).json({ message: 'Address not found' });
    }
    const [lng, lat] = geocodingData.features[0].geometry.coordinates;

    const property = new Property({
      title,
      type,
      adminId: req.user.id,
      address: {
        houseNo: type === 'house' ? houseNo : undefined,
        plotNo: type === 'plot' ? plotNo : undefined,
        street,
        block,
        societyName: 'Sowan Gardens', // Fixed for now
        city,
        country: 'Pakistan'
      },
      coordinates: { lat, lng },
      description,
      size,
      bedrooms: type === 'house' ? bedrooms : 0,
      bathrooms: type === 'house' ? bathrooms : 0,
      features,
      price,
      images
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get All Properties (Public)
module.exports.getAllProperties=async(req,res)=>{
  try {
    const properties = await Property.find().populate('adminId', 'email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

module.exports = router;