Meteor.methods({
  
  saveFile: function(blob, name, path, encoding) {
    
    var path = cleanPath(path), 
    name = cleanName(name || 'file'), encoding = encoding || 'binary',
    chroot =  process.env['PWD'] +'/public/training_images~';
    
    //chroot =  Npm.require('fs').realpathSync( process.cwd() + '/../' ) +'/public'; 
    // Clean up the path. Remove any initial and final '/' -we prefix them-,
    // any sort of attempt to go to the parent directory '..' and any empty directories in
    // between '/////' - which may happen after removing '..'
    path = chroot + (path ? '/' + path + '/' : '/');   

    // Save the uploaded file 
    fs.writeFileSync(path + "/" + downloadDir + "/" + name, blob, encoding);
  
    // Extract the extension
    var ext = name.split('.').pop();

    if( ext == 'zip' )
    {
      // Make it unzip files with image extensions
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

          ext = file.split('.').pop();
          // Accepted image extensions
          if( ext === 'jpg' || ext === 'png' || ext === 'bmp')
          {
            /*insertImageToDb(chroot,extractDir,file,ext);*/

            var md5_filename = MD5( fs.readFileSync( chroot + "/" + extractDir + "/" + file ) );

            fs.renameSync(chroot + "/" + extractDir + "/" + file,
                          chroot + "/" + untaggedDir + "/" + md5_filename + "." + ext);

            // create the new image entry
            var newImage = {
                _id: md5_filename,
                path: chroot,
                name: md5_filename + "." + ext,
                orgname: file,
                tagged: false
            };

            new Fiber( function() {
              metaDataImage.insert(newImage);
            }).run();

          }
        });

        // Delete the downloaded zip file
        fs.unlink(chroot + "/" + downloadDir + "/" + name);

      });

      unzipper.extract({
        path: chroot + '/extract'
      });

    }// end of zip if
    else
    {

      // Accepted image extensions
      if( ext === 'jpg' || ext === 'png' || ext === 'bmp')
      {
        /*insertImageToDb(chroot,extractDir,file,ext);*/

        file = name;

        var md5_filename = MD5( fs.readFileSync( chroot + "/" + downloadDir + "/" + file ) );

        fs.renameSync(chroot + "/" + downloadDir + "/" + file,
                      chroot + "/" + untaggedDir + "/" + md5_filename + "." + ext);

        // create the new image entry
        var newImage = {
            _id: md5_filename,
            path: chroot,
            name: md5_filename + "." + ext,
            orgname: file,
            tagged: false
        };

        new Fiber( function() {
          metaDataImage.insert(newImage);
        }).run();
      }
      else
      {
        console.log('Error : Compression extension not supported yet');
        console.log('Error : Image extension not supported yet');
      }

    }

    function cleanPath(str) {
      if (str) {
        return str.replace(/\.\./g,'').replace(/\/+/g,'').
          replace(/^\/+/,'').replace(/\/+$/,'');
      }
    }

    function cleanName(str) {
      return str.replace(/\.\./g,'').replace(/\//g,'');
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
   
  // Seed the movie database with a few movies
  Meteor.startup(function () {
    
    console.log( 'fileupload server : ' + metaDataImage.find().count() );

    DecompressZip = Npm.require('decompress-zip');
    Fiber = Npm.require('fibers');
    fs = Npm.require('fs');
    MD5 = Npm.require('MD5');

    downloadDir = "tmp";
    extractDir = "extract";
    untaggedDir = "untagged";

  });

  Meteor.publish('Image_Meta_Data', function(subsargs) {
    //subsargs are args passed in the next section
    return metaDataImage.find({tagged: subsargs});
    //or 
    //return posts.find({}, {time:-1, limit: 5}) //etc
   });

  //// Server
  //Meteor.publish('untagged', function publishFunction() {
  // return metaDataImage.find({}, {sort: {tagged: false}, limit: 10});
  //});

}
/*
getCollection = function(collectionName){
  if(collectionName=="users"){
    return Meteor.users;
  }
  var globalScope=Meteor.isClient?window:global;
  for(var property in globalScope){
    var object=globalScope[property];
    if(object instanceof Meteor.Collection && object._name==collectionName){
      return object;
    }
  }
  throw Meteor.Error(500,"No collection named "+collectionName);
};
*/