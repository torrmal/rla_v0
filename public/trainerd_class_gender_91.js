/**
layer_defs = [];
layer_defs.push({type:'input', out_sx:32, out_sy:32, out_depth:3});
layer_defs.push({type:'conv', sx:10, filters:4, stride:3, pad:2, activation:'relu'});
layer_defs.push({type:'fc', filters:100, activation:'relu'});
layer_defs.push({type:'fc', filters:500, activation:'relu'});
layer_defs.push({type:'softmax', num_classes:2});

net = new convnetjs.Net();
net.makeLayers(layer_defs);

trainer = new convnetjs.SGDTrainer(net, {method:'adadelta', batch_size:32, l2_decay:0.001});
**/