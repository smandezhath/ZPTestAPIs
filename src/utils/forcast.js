const request = require("request");

const forecast = (lat, long, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=8457a39a0c1635a2a18fe36e8bfb4e94&query=${lat},${long}&units=f`;

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (response.body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        `It is currently ${response.body.current.temperature} degrees out. There is a ${response.body.current.precip}% chance of rain.`
      );
    }
  });
};

module.exports = forecast;
