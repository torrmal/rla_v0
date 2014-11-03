Meteor.methods({
  saveFile: function(blob, name, path, encoding) {
    
    var path = cleanPath(path), fs = Npm.require('fs'),
    name = cleanName(name || 'file'), encoding = encoding || 'binary',
    chroot =  process.env['PWD'] +'/public/training_images~';
    
    //var unzip = Npm.require('unzip');
    var DecompressZip = Npm.require('decompress-zip');
    var Fiber = Npm.require('fibers');

    // code to run on server at startup
    var metaDataImage = new Meteor.Collection("Image_Meta_Data");

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
       fs.renameSync(chroot + "/" + name,chroot + "/tmp/" + name);

      // Make it unzip files with image extensions
    /*if (false) {
      fs.createReadStream(chroot + "/tmp/" + name)
        .pipe( unzip.Extract({ path: chroot + '/extract' }) );
    }
    else {*/ 
      var unzipper = new DecompressZip(chroot + "/tmp/" + name);
     
      unzipper.on('error', function (err) {
          console.log("Err Err");
          console.log(err);
      });

      unzipper.on('extract', function (log) {
          console.log('Finished extracting');
          unzipper.list();
      });

      unzipper.on('list', function (files) {
        console.log('The archive contains:');
        console.log(files);
        
        // Move the extracted files that match the image extension
        // Delete the files from extract folder that do not match the image extension
        files.forEach(function(file) {
          var ext = file.split('.').pop();
          if( ext === 'jpg' || ext === 'png' || ext === 'bmp')
          {
            fs.renameSync(chroot + "/extract/" + file,chroot + "/" + file);
            /* [Error: Meteor code must always run within a Fiber. 
                Try wrapping callbacks that you pass to non-Meteor 
                libraries with Meteor.bindEnvironment.]*/
            new Fiber( function() {
              metaDataImage.insert({
                'path' : chroot,
                'name' : file,
                'tagged' : false
              });
            }).run();
          }
          else
          {
            fs.unlink(chroot + "/extract/" + file);
          }
        });

        // Delete the downloaded zip file
        fs.unlink(chroot + "/tmp/" + name);

      });

      unzipper.extract({
        path: chroot + '/extract'
      });
    //}
        
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
  }
});
