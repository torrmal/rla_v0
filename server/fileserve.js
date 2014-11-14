var fs = Npm.require('fs');
var mime = Npm.require('mime');

Router.route(/^\/files\/(.*)/, function() {


    var path = '/var/rlafiles/' + this.params[0];
<<<<<<< HEAD
    console.log("path : " + path);
=======
>>>>>>> a38d0708e96abebcc59dee7d0d4c3cd755044283

    var _this = this;
    if (fs.existsSync(path)) {
    	var type = mime.lookup(path);
        console.log('will serve static content @ ' + path);
        var file = fs.readFileSync(path);
        var headers = {
            'Content-type': type,
            'Content-Disposition': "attachment; filename=" + this.params[0]
        };
        this.response.writeHead(200, headers);
        return this.response.end(file);
        //this.response.sendfile(path);
    }
    else {
    	//console.log(this.response);
    }

}, {
    where: 'server'
});
