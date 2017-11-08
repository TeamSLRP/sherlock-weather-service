var mongoose = require('mongoose');

var weatherData = mongoose.model('weatherData',{
  name:{
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  description:{
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  summary: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completeAddress: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  nearestStorm: {
    type: String,
    required: true,
    minlength: 1,
    trim: false
  },
  windSpeed: {
    type: Number,
    required: false
  },
  humidity: {
    type: Number,
    required: false
  },
  pressure: {
    type: Number,
    required: false
  },
  visibility: {
    type: Number,
    required: false,
    default: 0
  },
  ozone: {
    type: Number,
    required: false
  },
  cloud: {
    type: Number,
    required: false
  },
  aqi: {
    type:String,
    required:false
  },
  idx: {
    type:String,
    required:false
  },
  attname: {
    type:String,
    required:false
  },
  co: {
    type:String,
    required:false
  },
  h: {
    type:String,
    required:false
  },
  t: {
    type:String,
    required:false
  },
  no2: {
    type:String,
    required:false
  },
  o3: {
    type:String,
    required:false
  },
  p: {
    type:String,
    required:false
  },
  so2: {
    type:String,
    required:false
  },
  date:{
    type: String,
    required: false,
    default: "date was not saved"

  }
});

module.exports = {weatherData};
