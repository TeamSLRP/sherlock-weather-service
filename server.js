const express = require('express');
const hbs = require('hbs');
var session = require('client-sessions');
// const dr = require('./jsLogic/dataRetriever');
// const geoCode = require('./jsLogic/geoCode');
// const weather = require('./jsLogic/weather');
const WR = require('./jsLogic/weatherReport');

const PORT = process.env.PORT || 3000;

// const dis = require('./jsLogic/distance');

// const aq = require('./jsLogic/airQuality');

var bodyParser = require('body-parser');

var {mongoose} = require('./database/db/mongoose');
var {weatherData} = require('./database/models/weatherData');

const {MongoClient,ObjectID} = require('mongodb');

var app = express();

app.use(bodyParser());

app.use(session({
  cookieName: 'session',
  secret: 'ajcnu876246fbd$E^%$&^hvuyyfu&%$&%$&$&^ggcq',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.set('view engine','hbs');

var dbEntry;
var address;
var name;
var date;
var d;
var description;
var latitude;
var longitude;
var temperature;
var summary;
var completeAddress;
var imageUrl;
var nearestStorm;
var windSpeed;
var humidity;
var pressure;
var visibility;
var ozone;
var cloud;
var aqi;
var idx;
var attname;
var co;
var h;
var no2;
var o3;
var p;
var so2;
var t;

app.get('/',(req,res) => {
  address = undefined;
  req.session.reset();
  res.render('home.hbs');
});

app.post('/',(req,res) => {
  address = undefined;
  req.session.reset();
  res.render('home.hbs');
});


app.post('/mainPage',(req,res) => {
  WR.getCompleteData(req.session.address || req.body.address , (error,results) => {
    if(error){
      res.render('error.hbs',{
        message: error
      });
    } else {

      req.session.address = results.address;

      address = results.address;
      d = new Date();
      date = (d.toDateString()).concat(", Time : ",d.getHours(),":",d.getMinutes(),":",d.getSeconds(),":",d.getMilliseconds()," IST");
      latitude = results.latitude;
      longitude = results.longitude;
      temperature = results.temperature;
      summary = results.summary;
      completeAddress = results.address;
      imageUrl = results.imageUrl;
      nearestStorm = results.nearestStorm;
      windSpeed = results.windSpeed;
      humidity = results.humidity;
      pressure = results.pressure;
      visibility = results.visibility;
      ozone = results.ozone;
      cloud = results.cloud;
      aqi = results.aqi;
      idx = results.idx;
      attname  =results.attname;
      co = results.co;
      h = results.h;
      no2 = results.no2;
      o3 = results.o3;
      p = results.p;
      so2 = results.so2;
      t = results.t;

      req.session.obj = {
        name: name,
        description: description,
        latitude: latitude,
        longitude: longitude,
        temperature: temperature,
        summary: summary,
        completeAddress: completeAddress,
        imageUrl: imageUrl,
        nearestStorm: nearestStorm,
        windSpeed: windSpeed,
        humidity: humidity,
        pressure: pressure,
        visibility: visibility,
        ozone: ozone,
        cloud: cloud,
        aqi : aqi,
        idx : idx,
        attname :attname,
        co : co,
        h : h,
        no2 : no2,
        o3 : o3,
        p : p,
        so2 : so2,
        t : t,
        date: date
      };

      res.render('mainPage.hbs',{
        latitude: results.latitude,
        longitude: results.longitude,
        temperature: results.temperature,
        summary: results.summary,
        completeAddress: results.address,
        imageUrl: results.imageUrl,
        nearestStorm: results.nearestStorm,
        windSpeed: results.windSpeed,
        address: results.rawAddress,
        humidity: results.humidity,
        pressure: results.pressure,
        visibility: results.visibility,
        ozone: results.ozone,
        cloud: results.cloud,
        aqi : results.aqi,
        idx : results.idx,
        attname : results.attname,
        co : results.co,
        h : results.h,
        no2 : results.no2,
        o3 : results.o3,
        p : results.p,
        so2 : results.so2,
        t : results.t,
        date: date
      });
    }
  });
});

app.post('/database',(req,res)=>{
  res.render('database.hbs',{
    completeAddress : req.session.address || address
  });
});

app.get('/database',(req,res)=>{
  res.render('database.hbs',{
    completeAddress : req.session.address || address
  });
});

app.post('/insertDatabase',(req,res) => {

  name = req.body.name;
  description = req.body.desc;

    req.session.obj.name = name;
    req.session.obj.description = description;

    weatherData.findOne({name : req.body.name},(err,obj) => {
      if(obj){
        res.render('name.hbs',{
          message: `${req.body.name} already taken, try a new one`
        });
      }
    });


  dbEntry = new weatherData(req.session.obj);
  dbEntry.save().then((doc)=>{
    res.render('final.hbs',{
      message: 'Entry is successfully saved.'
    });
  },(e)=>{
      //res.status(400).send(e);
      res.render('error.hbs',{
        message: e
      });
  });

});


app.post('/name',(req,res) => {
  res.render('name.hbs');
});

app.post('/nameForPrint',(req,res)=>{
  res.render('nameForPrint.hbs');
});

app.post('/searchDatabase',(req,res) => {
  weatherData.findOne({name : req.body.name},(err,obj) => {
    if(err){
      res.render('error.hbs',{
        message: err
      });
    } else {
      res.render('searchDatabase.hbs',obj);
    }
  });
});

// app.post('/airQuality',(req,res) => {
//   aq.airQuality(req.body.place,(error,results) => {
//     if(error){
//       res.render('error.hbs',{
//         message: error
//       });
//     }
//       else {
//         res.render('airQuality.hbs', results);
//       }
//   });
// });
//
// app.get('/airQuality',(req,res) => {
//   aq.airQuality(req.body.place,(error,results) => {
//     if(error){
//       res.render('error.hbs',{
//         message: error
//       });
//     }
//       else {
//         res.render('airQuality.hbs', results);
//       }
//   });
// });

app.get('/about',(req,res)=>{
  res.render('about.hbs');
});

app.post('/about',(req,res)=>{
  res.render('about.hbs');
});

app.listen(PORT,()=>{
  console.log('Server is up and running on PORT ',PORT);
});
