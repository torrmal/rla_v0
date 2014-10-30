Meteor.methods({
  saveFile: function(blob, name, path, encoding) {
    
    var path = cleanPath(path), fs = Npm.require('fs'),
    name = cleanName(name || 'file'), encoding = encoding || 'binary',
    chroot =  process.env['PWD'] +'/public/training_images~';
    
    var unzip = Npm.require('unzip');
    //var DecompressZip = Npm.require('decompress-zip');
    
    //chroot =  Npm.require('fs').realpathSync( process.cwd() + '/../' ) +'/public'; 
    // Clean up the path. Remove any initial and final '/' -we prefix them-,
    // any sort of attempt to go to the parent directory '..' and any empty directories in
    // between '/////' - which may happen after removing '..'
    path = chroot + (path ? '/' + path + '/' : '/');   

    // TODO Add file existance checks, etc...
    fs.writeFileSync(path + name, blob, encoding);/*, function(err) {
      if (err) {
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      } else {
        console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
      }
    }); */
 
    var ext = name.split('.').pop();

    if( ext == 'zip' )
    {
       fs.renameSync(chroot + "/" + name,chroot + "/tmp/" + name);/*,function(err) {
          if (err) {
            throw (new Meteor.Error(500, 'Failed to move file.', err));
          } else {
            console.log('The file ' + name + ' was moved to' + chroot + '/tmp' );
          }
        });*/

      // Make it unzip files with image extensions
      fs.createReadStream(chroot + "/tmp/" + name)
        .pipe( unzip.Extract({ path: chroot + '/extract' }) );

      var files = getAllFilesFromFolder(chroot + "/extract");
        console.log(files);
    /*      
      var unzipper = new DecompressZip(chroot + "/tmp/" + name);
     
      unzipper.on('error', function (err) {
          console.log(err);
      });

      unzipper.on('extract', function (log) {
          console.log('Finished extracting');
      });

      unzipper.extract({ 
          path: chroot,
          filter: function (file) {
              var ext = file.split('.').pop();
              return ext == 'jpg';
          }
      });
    */
    /*
      fs.unlink(chroot + "/tmp/" + name);/*, function (err) {
        if (err) {
          throw (new Meteor.Error(500, 'Failed to remomove file.', err));
        } else {
          console.log('The file ' + name + ' was deleted from' + chroot + '/tmp' );
        }
      });
    */

      // code to run on server at startup
      metaDataImage = new Meteor.Collection("Image_Meta_Data");
      
      // Add to collection
      console.log(files.length);
      for (var i = 0; i < files.length; i++) {

        var ext = files[i].split('.').pop();
        console.log(ext);
        if( ext === 'jpg' || ext === 'png' || ext === 'bmp')
        {
          metaDataImage.insert({
            'path' : chroot,
            'name' : files[i],
            'tagged' : false,
          });

          fs.renameSync(chroot + "/extract/" + files[i],chroot + "/" + files[i]);
        }
      }

      console.log("Total Entries in meta : " + metaDataImage.find({}).count());

    }// end of zip if

    function cleanPath(str) {
      if (str) {
        return str.replace(/\.\./g,'').replace(/\/+/g,'').
          replace(/^\/+/,'').replace(/\/+$/,'');
      }
    }
    function cleanName(str) {
      return str.replace(/\.\./g,'').replace(/\//g,'');
    }
    function getAllFilesFromFolder(dir) {
        var results = [];

        fs.readdirSync(dir).forEach(function(file) {

            pathfile = dir+'/'+file;
            var stat = fs.statSync(pathfile);

            if (stat && stat.isDirectory()) {
                //results = results.concat(_getAllFilesFromFolder(pathfile))
            } else results.push(file);

        });

        return results;
    }
  }
});
