var lambda = require("../index.js");
const expect = require('chai').expect;
// 
// describe("Simple Call of Weather Lambda", function() {
//   it('Should return the weather in Korntal', async function() {
//     const result = await lambda.getWeatherInfos();
//     expect(result.id).to.equal(6557968);
//   })
// });
//
// describe("Call easyvis.io API", function() {
//   it('Should return something from easyvis', async function() {
//     const data = {
//         type: "stream",
//         config: {
//             uri: "rtmp://s1ncsmuzekoro8.cloudfront.net/cfx/st/TestVideoColorChange.mp4"
//         },
//         playConfig: {
//             loop: -1
//         }
//     }
//     const result = await lambda.easyvisCall(data);
//   })
// });

describe("Complete function", function() {
  it('Should set the color in easyvis', async function() {
    const result = await lambda.handler();
  })
});
