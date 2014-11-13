var fs = Npm.require('fs');
var mime = Npm.require('mime');

Router.route(/^\/files\/(.*)/, function() {


    var path = '/tmp/' + this.params[0];

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
