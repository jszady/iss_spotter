const { fetchMyIP , fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned IP:' , ip);

  fetchCoordsByIP(ip, (error, coords) => {
    if (error) {
      console.log('Error fetching coordinates:', error);
      return;
    }
    console.log('Coordinates:', coords);
    fetchISSFlyOverTimes(coords, (error, data) => {
      if(error){
        console.log(`Error getting data`, error);
      }
      console.log('It worked! Returned flyover times:' , data);
    })
  });
});