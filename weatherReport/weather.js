const key = '6f009cb8dfcf12d6586150621943685c';
const request = require('request');

var getWeatherData = (latitude,longitude,callback) => {
      request({
        url: `https://api.darksky.net/forecast/${key}/${longitude},${latitude}`,
        json: true
      }
      , (error,response,body) => {
        if(error){
          callback('Unable to connect to forecast server');
        }else if(response.statusCode === 400){
          callback('unable to fetch weather');
        }else if(response.statusCode === 200){
          callback('undefined',{
            currentTemp: body.currently.temperature,
            summary: body.currently.summary
          });
        }
      });
    };

module.exports.getWeatherData = getWeatherData;
