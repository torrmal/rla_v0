Template.analytics.rendered = function() {

	$('#minID').click(function(e) {
		data = dashBoardData.find({currentTime: -1});
		console.log('data');
		console.log(data);
		displayData(data);
	});

	$('#hourID').click(function(e) {

	});

	$('#dayID').click(function(e) {

	});

	$('#monthID').click(function(e) {

	});

	$('#yearID').click(function(e) {

	});

	var displayData = function(minuteData){
		document.getElementById("mengageID").innerHTML=minuteData.mengage;
		document.getElementById("fengageID").innerHTML=minuteData.fengage;
		document.getElementById("mageID").innerHTML=minuteData.mages;
		document.getElementById("fageID").innerHTML=minuteData.fages;
		document.getElementById("mcountID").innerHTML=minuteData.fcount;
		document.getElementById("fcountID").innerHTML=minuteData.mcount;
	}
}
