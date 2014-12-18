/*
Meteor.startup(function () {
    collectionApi = new CollectionAPI({ authToken: 'rlatoken123123' });
    collectionApi.addCollection(metaDataImage, 'metadataimage');
    collectionApi.start();
  });
*/

// species a 2-layer neural network with one hidden layer of 20 neurons
var layer_defs = [];
// input layer declares size of input. here: 2-D data
// ConvNetJS works on 3-Dimensional volumes (sx, sy, depth), but if you're not dealing with images
// then the first two dimensions (sx, sy) will always be kept at size 1
layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:2});
// declare 20 neurons, followed by ReLU (rectified linear unit non-linearity)
layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
// declare the linear classifier on top of the previous hidden layer
layer_defs.push({type:'softmax', num_classes:10});

var http = Npm.require("http");
var convnetjs = Npm.require("convnetjs");
// here you will define the neural network
var net = new convnetjs.Net();
net.makeLayers(layer_defs); // layer defs is soemthing you will have to define before
// now we get the data from the meteor app
var options = {
  host: 'http://rtc.reallifeanalytics.com ',
  port: 80,
  path: '/collectionapi/metadataimage',
  method: 'GET'
};

/*
http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('response: ' + chunk);
       var images =  JSON.parse(chunk);
       shuffle(images);
       for  (var i = 0; i < images.length; ++i) {
            //this is where you get one random image an start training
       }
  });
}).end();
*/
