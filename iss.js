const request = require('request');

const fetchMyIP = (callback) =>  { 

  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);

  }); 

};

const fetchCoordsByIP = (ip, callback) => {

  request (`http://ipwho.is/${ip}`, (error, response, body) => {
   if (error) return callback(error);
   if (response.statusCode !== 200) {
    callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
    return;
  }

  const parsedBody = JSON.parse(body);
  // check if "success" is true or not
  if (!parsedBody.success) {
    const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
    callback(Error(message), null);
    return;
  }
  const coordinates = {latitude: parsedBody.latitude, longitude:parsedBody.longitude};

  callback(null, coordinates);
  });

}
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
    
    const passes = JSON.parse(body).response;
    callback(null, passes);

  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if(error) return callback(error);
      fetchCoordsByIP(ip, (error, coords) => {
        if(error) return callback(error);
        fetchISSFlyOverTimes(coords, (error, time) => {
          if (error) return callback(error);
            callback(null, time);
        })
      })
  })
}


module.exports = { nextISSTimesForMyLocation};