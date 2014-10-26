Template.akshay.rendered = function(){
	$('#button').click(Akshay.logClicked);
}

Akshay = {
  logClicked: function(what) {
  	console.log('clicked: ');
  	console.log(what);
  }
};