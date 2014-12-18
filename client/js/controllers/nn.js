Template.nn.rendered = function() {

	var canvas = document.getElementById('canvasID'),
        ctx = canvas.getContext('2d');
/*
	var layer_defs = [];
	layer_defs.push({type:'input', out_sx:32, out_sy:32, out_depth:3}); // declare size of input
	// output Vol is of size 32x32x3 here
	layer_defs.push({type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'});
	// the layer will perform convolution with 16 kernels, each of size 5x5.
	// the input will be padded with 2 pixels on all sides to make the output Vol of the same size
	// output Vol will thus be 32x32x16 at this point
	layer_defs.push({type:'pool', sx:2, stride:2});
	// output Vol is of size 16x16x16 here
	layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
	// output Vol is of size 16x16x20 here
	layer_defs.push({type:'pool', sx:2, stride:2});
	// output Vol is of size 8x8x20 here

	//layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
	//// output Vol is of size 8x8x20 here
	//layer_defs.push({type:'pool', sx:2, stride:2});
	// output Vol is of size 4x4x20 here

	layer_defs.push({type:'softmax', num_classes:2});
	// output Vol is of size 1x1x2 here

	// declare 20 neurons, followed by ReLU (rectified linear unit non-linearity)
	//layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
	// declare the linear classifier on top of the previous hidden layer
	//layer_defs.push({type:'softmax', num_classes:2});

	net = new convnetjs.Net();
	net.makeLayers(layer_defs);

	trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, l2_decay:0.001});

	document.getElementById("nnout").innerHTML = "Started";

	Img = new Image();
	for (i = 1; i < 1001; i++) {

		document.getElementById("nnout").innerHTML = '1_' + i;
		Img.src = '/training_images~/train/face/' + i + '.jpg';
		ctx.drawImage(Img, 0, 0, 32, 32);
		volImg = convnetjs.img_to_vol(document.getElementById('canvasID'));

		trainer.train(volImg, 1);

		document.getElementById("nnout").innerHTML = '0_' + i;
		Img.src = '/training_images~/train/nonface/' + i + '.jpg';
		ctx.drawImage(Img, 0, 0, 32, 32);
		volImg = convnetjs.img_to_vol(document.getElementById('canvasID'));

		trainer.train(volImg, 2);
	}

	// network outputs all of its parameters into json object
	var json = net.toJSON();
	// the entire object is now simply string. You can save this somewhere
	var str = JSON.stringify(json);
	document.getElementById("nnout").innerHTML = str;

	//for (i = 1001; i < 1500; i++) {
		Img.src = '/training_images~/test/face/1001.jpg';
		ctx.drawImage(Img, 0, 0, 32, 32);
		volImg = convnetjs.img_to_vol(document.getElementById('canvasID'));

		//predicted_label = net.predict(volImg);
		predicted_values = net.forward(volImg);
		console.log('predicted length: ' + predicted_values.w.length);
		console.log('predicted value: ' + predicted_values.w[0]);
		console.log('predicted value: ' + predicted_values.w[1]);

		Img.src = '/training_images~/test/nonface/1001.jpg';
		ctx.drawImage(Img, 0, 0, 32, 32);
		volImg = convnetjs.img_to_vol(document.getElementById('canvasID'));

		predicted_values = net.forward(volImg);
		console.log('predicted length: ' + predicted_values.w.length);
		console.log('predicted value: ' + predicted_values.w[0]);
		console.log('predicted value: ' + predicted_values.w[1]);
	//}

	//document.getElementById("nnout").innerHTML = predicted_label;
	//"Label is " + predicted_label;// + filelistF.length;
	//output_probabilities_vol.w.length;
*/

	train_data = [];
	train_labels = [];

	Img = new Image();
	for (i = 1; i < 1001; i++) {

		//document.getElementById("nnout").innerHTML = '1_' + i;
		Img.src = '/training_images~/train/face/' + i + '.jpg';
		ctx.drawImage(Img, 0, 0, 32, 32);
		tmp = convnetjs.img_to_vol(document.getElementById('canvasID'));
		train_data.push( new convnetjs.Vol( tmp ) );
		train_labels.push( 1 );

		//document.getElementById("nnout").innerHTML = '0_' + i;
		Img.src = '/training_images~/train/nonface/' + i + '.jpg';
		ctx.drawImage(Img, 0, 0, 32, 32);
		tmp = convnetjs.img_to_vol(document.getElementById('canvasID'));
		train_data.push( new convnetjs.Vol( tmp ) );
		train_labels.push( 0 );

	}

	console.log( train_data.length );
	console.log( train_labels.length );

	var opts = {}; // options struct
	opts.train_ratio = 0.7; // what portion of data goes to train, in train/validation fold splits. Here, 70%
	opts.num_folds = 1; // number of folds to evaluate per candidate
	opts.num_candidates = 50; // number of candidates to evaluate in parallel
	opts.num_epochs = 20; // number of epochs to make through data per fold
	opts.ensemble_size = 20; // how many nets to average in the end for prediction? likely higher = better but slower
	console.log( 'start' );
	var magicNet = new convnetjs.MagicNet(train_data, train_labels, opts);
	console.log( 'between' );
	magicNet.onFinishBatch(finishedBatch); // example of setting callback for events
	console.log( 'end' );
	// start training MagicNet. Every call trains all candidates in current batch on one example
	setInterval(function(){ magicNet.step(); }, 0);

	function finishedBatch() {
		console.log( 'batch' );

	  // prediction example. xout is Vol of scores
	  // there is also predict_soft(), which returns the full score volume for all labels
	  Img.src = '/training_images~/test/face/1001.jpg';
	  ctx.drawImage(Img, 0, 0, 32, 32);
	  some_test_vol = convnetjs.img_to_vol(document.getElementById('canvasID'));

	  predicted_label = magicNet.predict(some_test_vol);
	  console.log('Prediction : ' + predicted_label);

	  Img.src = '/training_images~/test/nonface/1001.jpg';
	  ctx.drawImage(Img, 0, 0, 32, 32);
	  some_test_vol = convnetjs.img_to_vol(document.getElementById('canvasID'));

	  predicted_label = magicNet.predict(some_test_vol);
	  console.log('Prediction : ' + predicted_label)
	}

/*
	// toy data: two data points, one of class 0 and other of class 1
	var train_data = [new convnetjs.Vol([1.3, 0.5]), new convnetjs.Vol([0.1, 0.7])];
	var train_labels = [0, 1];

	// create a magic net
	var magicNet = new convnetjs.MagicNet(train_data, train_labels);
	magicNet.onFinishBatch(finishedBatch); // set a callback a finished evaluation of a batch of networks

	// start training MagicNet. Every call trains all candidates in current batch on one example
	setInterval(function(){ magicNet.step(), 0});

	// once at least one batch of candidates is evaluated on all folds we can do prediction!
	function finishedBatch() {
	  // prediction example. xout is Vol of scores
	  // there is also predict_soft(), which returns the full score volume for all labels
	  var some_test_vol = new convnetjs.Vol([0.1, 0.2]);
	  var predicted_label = magicNet.predict(some_test_vol);
	  console.log('hhggfhg' + predicted_label);
	}
*/
}
