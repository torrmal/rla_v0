

Meteor.methods({

    saveFile: function(blob, name, path, encoding) {

        var path = cleanPath(path),
            name = cleanName(name || 'file'),
            encoding = encoding || 'binary',
            //chroot = '/var/rlafiles',
            downloadDir = '/tmp/tmp',
            extractDir = '/tmp/extract'
            untaggedDir = '/var/rlafiles';

        //chroot =  Npm.require('fs').realpathSync( process.cwd() + '/../' ) +'/public';
        // Clean up the path. Remove any initial and final '/' -we prefix them-,
        // any sort of attempt to go to the parent directory '..' and any empty directories in
        // between '/////' - which may happen after removing '..'
        //path = chroot + (path ? '/' + path + '/' : '/');

        // Save the uploaded file
        var tmpZipFile = downloadDir + "/" + name;
        fs.writeFileSync(tmpZipFile, blob, encoding);

        // Extract the extension
        var ext = name.split('.').pop();
        var setname = name.split('.')[0];

        var storeImage = function(filename_i)
        {
          var file = filename_i.split('/').pop();
          console.log('file:' + file);
          var ext = file.split('.').pop();
          console.log('file:' + ext);
          // Accepted image extensions
          if (ext === 'jpg' || ext === 'png' || ext === 'bmp') {
              /*new Fiber( insertImageToDb(chroot,extractDir,file,ext) ).run();*/

              var md5_filename = MD5(fs.readFileSync(filename_i));

              var doc;
              new Fiber(function() {
                doc = metaDataImage.findOne({_id:md5_filename});
              }).run();
              console.log( doc );

              if (typeof doc === 'undefined')
              {
                  var md5_file_with_path = untaggedDir + "/" + md5_filename + "." + ext;
                  fs.renameSync(filename_i, md5_file_with_path);

                  // create the new image entry
                  var newImage = {
                      _id: md5_filename,
                      name: md5_filename + "." + ext,
                      orgname: file,
                      setname: setname,
                      path: untaggedDir,
                      tagged: false
                  };

                  new Fiber(function() {
                      metaDataImage.insert(newImage);
                  }).run();
              }
              else {
                console.log(md5_filename + " : Already in the database");
              }
          }
          fs.unlink(filename_i);
        }

        if (ext == 'zip') {

            // Make it unzip files with image extensions
            var unzipper = new DecompressZip(tmpZipFile);

            unzipper.on('error', function(err) {
                console.log("Unzipper Err");
                console.log(err);
            });

            unzipper.on('extract', function(log) {
                console.log('Finished extracting');
                unzipper.list();
            });

            unzipper.on('list', function(files) {

                console.log('The archive contains:');
                console.log(files);

                // Move the extracted files that match the image extension
                // Delete the files from extract folder that do not match the image extension
                files.forEach(function(file) {

                    var filename_i = extractDir + "/" + file;
                    storeImage(filename_i);

                });

                // Delete the downloaded zip file
                fs.unlink(tmpZipFile);

            });

            unzipper.extract({
                path: extractDir
            });

        } // end of zip if
        else {

            // Accepted image extensions
            if (ext === 'jpg' || ext === 'png' || ext === 'bmp') {
                /*insertImageToDb(chroot,extractDir,file,ext);*/
                var filename_i = tmpZipFile;
                storeImage(filename_i);

            } else {
                console.log('Error : Compression extension not supported yet');
                console.log('Error : Image extension not supported yet');
            }

        }

        function cleanPath(str) {
            if (str) {
                return str.replace(/\.\./g, '').replace(/\/+/g, '').
                replace(/^\/+/, '').replace(/\/+$/, '');
            }
        }

        function cleanName(str) {
            return str.replace(/\.\./g, '').replace(/\//g, '');
        }

        /*
    function insertImageToDb(chroot,folder,filename,extension) {

      var md5_filename = MD5( fs.readFileSync( chroot + '/' + folder + '/' + filename ) );

      fs.renameSync(chroot + '/' + folder + '/' + filename,
                    chroot + '/' + untaggedDir + '/' + md5_filename + "." + extension);

      // create the new image entry
      var newImage = {
          //_id: md5_filename,
          path: chroot, // Whether in tagged or untagged folder is determined by the 'tagged' prop state
          name: md5_filename + "." + ext,
          orgname: file,
          tagged: false
      };

      new Fiber( function() {
        metaDataImage.insert(newImage);
      }).run();
    }*/
    }

});

if (Meteor.isServer) {
    console.log("Hello Server!");

    // Declare server image collection
    //metaDataImage = new Meteor.Collection("Image_Meta_Data");

    Meteor.startup(function() {

        console.log('fileupload server : ' + metaDataImage.find().count());

        DecompressZip = Npm.require('decompress-zip');
        Fiber = Npm.require('fibers');
        fs = Npm.require('fs');
        MD5 = Npm.require('MD5');

        downloadDir = "tmp";
        extractDir = "extract";
        untaggedDir = "untagged";

    });

}
