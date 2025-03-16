const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Basic Details
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100 // e.g., "3 Bed House in Sowan Gardens" or "5 Marla Plot"
  },
  type: {
    type: String,
    enum: ['house', 'plot'], // Limited to house and plot for now
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the admin who uploaded it
    required: true
  },

  // Location Details
  address: {
    houseNo: { type: String, trim: true }, // For houses, optional
    plotNo: { type: String, trim: true },  // For plots, optional
    street: { type: String, required: true, trim: true },
    block: { type: String, required: true, trim: true },
    societyName: { type: String, default: 'Sowan Gardens', trim: true }, // Fixed for now
    city: { type: String, default:'Islamabad',required: true, trim: true },
    country: { type: String, default: 'Pakistan', trim: true }
  },
  coordinates: {
    lat: { type: Number, required: true }, // Latitude from Mapbox
    lng: { type: Number, required: true }  // Longitude from Mapbox
  },

  // Description
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000 // Detailed info about the property
  },
  size: {
    value: { type: Number, required: true }, // e.g., 500
    unit: { type: String, enum: ['sqft', 'marla', 'kanal'], required: true } // Adjusted units
  },
  bedrooms: { 
    type: Number, 
    default: 0, 
    validate: {
      validator: function(v) {
        return this.type === 'house' ? v >= 0 : v === 0;
      },
      message: 'Bedrooms should only be specified for houses'
    }
  }, // Only for houses
  bathrooms: { 
    type: Number, 
    default: 0,
    validate: {
      validator: function(v) {
        return this.type === 'house' ? v >= 0 : v === 0;
      },
      message: 'Bathrooms should only be specified for houses'
    }
  }, // Only for houses
  features: [String], // e.g., ["garden", "garage"] for houses, ["corner"] for plots

  // Pricing
  price: {
    value: { type: Number, required: true }, // e.g., 5000000
    currency: { type: String, default: 'PKR' }
  },

  // Media
  images: [{
    url: { type: String, required: true }, // Cloud storage URL
    caption: { type: String, trim: true }
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update 'updatedAt' on save
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', propertySchema);