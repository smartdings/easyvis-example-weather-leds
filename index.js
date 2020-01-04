const fetch = require('node-fetch');
const config = require('./config.json');

const time_api = 'http://worldtimeapi.org/api/timezone/' + config.time_api.location;
const weather_api = 'https://api.openweathermap.org/data/2.5/weather?id=' + config.weather_api.location + '&APPID=' + config.weather_api.id;
const easyvis_api_play = 'https://api.easyvis.io/v1/players/' + player + '/play';
const easyvis_api_stop = 'https://api.easyvis.io/v1/players/' + player + '/stop';

const credentials = {
  client: {
    id: config.easyvis_api.auth.client_id,
    secret: config.easyvis_api.auth.client_secret
  },
  auth: {
    tokenHost: 'https://auth.easyvis.io',
    tokenPath: '/token'
  },
  options: {
    bodyFormat: 'form'
  }
};
const oauth2 = require('simple-oauth2').create(credentials);
const tokenObject = {
  'access_token': config.easyvis_api.auth.access_token,
  'refresh_token': config.easyvis_api.auth.refresh_token,
  'expires_in': '3600'
};

const apiKey = config.easyvis_api.api_key;

const player = config.easyvis_api.player;

// MAIN FUNCTION
exports.handler = async (event, context, callback) => {
    console.log('Execute easyvis.io Weather App')

    const timePlain = await getTime();
    const time = new Date(timePlain);
    const hour = time.getHours();

    if (hour > 18 && hour < 23) {
      console.log('Inside the defined time frame. Start the player.')
      const weather = await getWeatherInfos();
      const color = calculateColor(weather.temp);
      const easyvis_app = {
          type: "blink",
          config: {
              bps: 1,
              blinkDuration: "1",
              color: color
          },
          playConfig: {}
      };
      easyvisCallPlay(easyvis_app);
      callback(null, {
          continue: true
      })
    } else {
      console.log('Outside the defined time frame. Stop the player');
      easyvisCallStop();
    }
};

// Calculates the color depending on the temeperature
var calculateColor = (temp) => {
  var color = '#d45a08';
  if (temp < 0) {
    color = '#2e16c9';
  } else if (temp > 0 && temp < 10) {
    color = '#d4cd08';
  }
  console.log('Input temp: ' + temp + ' results in color ' + color);
  return color;
}

// Retrieves the current weather temperature in Celcius
var getWeatherInfos =  async () => {
  var weather = {};
  const response = await fetch(weather_api);
  const json = await response.json();
  weather.id = json.id;
  weather.temp = json.main.temp - 273.15;  // transform from Kalvin to Celcius
  console.log('Weather: ' + JSON.stringify(weather));
  return weather;
}

// Retrieves the current datetime
var getTime = async () => {
  const response = await fetch(time_api);
  const json = await response.json();
  console.log('Time: ' + JSON.stringify(json));
  return json.datetime;
}

// Calls the easyvis.io play api
var easyvisCallPlay =  async (data) => {
  const token = await getAccessToken();
  const response = await fetch(easyvis_api_play, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-api-key': apiKey
    },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  console.log('Result of easyvis play call' + JSON.stringify(json));
}

// Calls the easyvis.io stop api
var easyvisCallStop =  async () => {
  const token = await getAccessToken();
  const response = await fetch(easyvis_api_stop, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-api-key': apiKey
    }
  });
  const json = await response.json();
  console.log('Result of easyvis stop call' + JSON.stringify(json));
}

// Retrieves a new access token with the existing refresh token.
// This is necessary because each access token expires after an hour.
// A refresh token has a much longer life time.
var getAccessToken = async () => {
  // Create the access token wrapper
  let accessToken = oauth2.accessToken.create(tokenObject);
  try {
    const params = {
      scope: 'email'
    };

    token = await accessToken.refresh(params);
    return token.token.access_token;
  } catch (error) {
    console.log('Error refreshing access token: ', error.message);
  }
}
