# Weather LED solution
The easyvis.io weather LED solution is a simple app which sets a certain color for your easyvis.io visualization device depending on the current weather and the time. For that an AWS lambda function is used to trigger the easyvis.io API. The lambda function is called via an AWS step function every 10 minutes.  


## Setup

### Access to the weather api
In order to retrieve the current weather information for your location we use the openweathermap.org API. Make sure you have created an openweathermap account and get your APP_ID and the id of the city you want to retrieve the weather from. For more information check the openweathermap.org [documentation](https://openweathermap.org/guide). Once you have both of these ids replace them with the placeholders in the index.js.

### Access to the easyvis.io api
Obviously you also need to be able to access your visualization device via the easyvis.io api. For that you require an access and refresh token. Check the [easyvis.io documentation](http://developer.easyvis.io/docs/basics/authorization/) which explains how to retrieve the tokens. You also need to define your provided API key. 

### Set your player
You also need to set your easyvis.io player in the index.js. Via the [easyvis.io console](https://www.easyvis.io/console/) you can retrieve your player id.


## Test
For testing you can just execute

    npm test



## Deployment

### Build and Deploy Lambda

    zip -r function.zip *
    aws lambda update-function-code --function-name led_lights_outdoor_weather_color_controller --zip-file fileb://function.zip


### Deploy Step Function
A AWS Step Function is used to trigger the lambda every 10 min. The code for the step function can be found in the stepFunction.json file.

Create a standard state machine [here](https://eu-central-1.console.aws.amazon.com/states/home?region=eu-central-1#/statemachines) with the code defined in stepFunction.json. Note that you should create a new IAM role for you step function.

More information on step functions can be found in the [AWS documentation](https://aws.amazon.com/step-functions/getting-started/)
