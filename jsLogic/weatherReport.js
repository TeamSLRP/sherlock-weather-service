const request = require('request');
const key = '6f009cb8dfcf12d6586150621943685c';
const key1 = '3067fb5de1ea6fba011df4ec83ad9aa254435d5d';

var getCompleteData = (address,callback) => {
  var encodedAddress = encodeURIComponent(address);

  request({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodedAddress,
    json: true
  } , (error,response,body) => {
    if(error){
      callback('Unable to connect to Google Servers');
    }
    else if(body.status === 'ZERO_RESULTS' ){
      callback('Unable to find the address');
    }
    else if(body.status === 'OK'){
      request({
        url: `https://api.darksky.net/forecast/${key}/${body.results[0].geometry.location.lat},${body.results[0].geometry.location.lng}`,
        json: true
      } , (errorW,responseW,bodyW) => {
        if(errorW){
          callback('Unable to connect to forecast server');
        }else if(responseW.statusCode === 400){
          callback('unable to fetch weather');
        }else if(responseW.statusCode === 200){
          request({
            url:`https://api.astrodigital.com/v2.0/search/?contains=${body.results[0].geometry.location.lng},${body.results[0].geometry.location.lat}`,
            json: true
          } , (errorA,responseA,bodyA) => {
            if(errorA){
              callback('Unable to connect to Astro Digital Server');
            } else {
              if(bodyW.currently.nearestStormDistance === undefined){
                var stormStatus = 'No storm present nearby';
              } else {
                var stormStatus = 'Storm is '+bodyW.currently.nearestStormDistance+' kms away';
              }

              request({
                url: `https://api.waqi.info/feed/geo:${body.results[0].geometry.location.lat};${body.results[0].geometry.location.lng}/?token=${key1}`,
                json: true
              } , (errorWW,responseWW,bodyWW) => {
                if(errorWW){
                  callback('Unable to connect to forecast server');
                }else if(responseWW.statusCode === 400){
                  callback('unable to fetch weather');
                }else if(responseWW.statusCode === 200){
                  var resultObject = {} ;
                  if(bodyWW.data.iaqi.co){
                   resultObject.co = bodyWW.data.iaqi.co.v;
                 }
                 if(bodyWW.data.iaqi.h){
                  resultObject.h = bodyWW.data.iaqi.h.v;
                }
                if(bodyWW.data.iaqi.no2){
                 resultObject.no2 = bodyWW.data.iaqi.no2.v;
               }
               if(bodyWW.data.iaqi.o3){
                resultObject.o3 = bodyWW.data.iaqi.o3.v;
              }
              if(bodyWW.data.iaqi.p){
               resultObject.p = bodyWW.data.iaqi.p.v;
             }
             if(bodyWW.data.iaqi.so2){
              resultObject.so2 = bodyWW.data.iaqi.so2.v;
            }
            if(bodyWW.data.iaqi.t){
             resultObject.t = bodyWW.data.iaqi.t.v;
           }
           if(bodyWW.data.attributions){
            resultObject.attname= bodyWW.data.attributions[0].name;
          }
           resultObject.longitude= body.results[0].geometry.location.lng;
           resultObject.latitude= body.results[0].geometry.location.lat;
           resultObject.address= body.results[0].formatted_address;
           resultObject.temperature= bodyW.currently.temperature;
           resultObject.summary= bodyW.currently.summary;
           resultObject.imageUrl= bodyA.results[0].thumbnail;
           resultObject.nearestStorm= stormStatus;
           resultObject.windSpeed= bodyW.currently.windSpeed;
           resultObject.rawAddress= address;
           resultObject.humidity= bodyW.currently.humidity;
           resultObject.pressure= bodyW.currently.pressure;
           resultObject.cloud= bodyW.currently.cloudCover;
           resultObject.visibility= bodyW.currently.visibility;
           resultObject.ozone= bodyW.currently.ozone;
           resultObject.aqi= bodyWW.data.aqi ;
           resultObject.idx= bodyWW.data.idx ;


           callback(undefined,resultObject);


                }
              });

              // console.log('GeoCode Api link ->','https://maps.googleapis.com/maps/api/geocode/json?address='+encodedAddress);
              // console.log('DarkSky Api link ->',`https://api.darksky.net/forecast/${key}/${body.results[0].geometry.location.lat},${body.results[0].geometry.location.lng}`);
              // console.log('Astrodigital Api link ->',`https://api.astrodigital.com/v2.0/search/?contains=${body.results[0].geometry.location.lng},${body.results[0].geometry.location.lat}`);
            }
          });
        }
      });
    }
  });
};

module.exports.getCompleteData = getCompleteData;

// to use later on
// callback(undefined,{
//   longitude: body.results[0].geometry.location.lng,
//   latitude: body.results[0].geometry.location.lat,
//   address: body.results[0].formatted_address,
//   temperature: bodyW.currently.temperature,
//   summary: bodyW.currently.summary,
//   imageUrl: bodyA.results[0].thumbnail,
//   nearestStorm: stormStatus,
//   windSpeed: bodyW.currently.windSpeed,
//   rawAddress: address,
//   humidity: bodyW.currently.humidity,
//   pressure: bodyW.currently.pressure,
//   cloud: bodyW.currently.cloudCover,
//   visibility: bodyW.currently.visibility,
//   ozone: bodyW.currently.ozone,
//   aqi: bodyWW.data.aqi ,
//   idx: bodyWW.data.idx ,
//   attname: bodyWW.data.attributions[0].name ,
//   co: bodyWW.data.iaqi.co.v ,
//   h: bodyWW.data.iaqi.h.v ,
//   no2: bodyWW.data.iaqi.no2.v ,
//   o3: bodyWW.data.iaqi.o3.v ,
//   p: bodyWW.data.iaqi.p.v ,
//   so2: bodyWW.data.iaqi.so2.v ,
//   t: bodyWW.data.iaqi.t.v
// });
