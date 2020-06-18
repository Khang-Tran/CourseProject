var express = require('express');
var router = express.Router();

var fs = require("fs");

fileManager  = {
  read: function() {
    var rawdata = fs.readFileSync('CarData.json');
    let goodData = JSON.parse(rawdata);
    ServerArray = goodData;
    },
  

  write: function() {
    let data = JSON.stringify(ServerArray);
    fs.writeFileSync('CarData.json', data);
  },

  validData: function() {
  var rawdata = fs.readFileSync('CarData.json');
  console.log(rawdata.length);
  if(rawdata.length < 1) {
    return false;
  }
  else {
    return true;
  }
}

};


var lastID = 1;
var carArray = [];
var CarObject = function (pMake, pModel, pYear, pMPG, pMilage) {
    this.Make = pMake;
    this.Model = pModel;
    this.Year = pYear;
    this.ID = lastID++;
    this.MPG = pMPG;
    this.Milage = pMilage;
  }
  

if(!fileManager.validData()) {
  ServerArray.push(new CarObject("Toyota", "GT86", 2015, "34 Miles per Gallon", 90000));
  ServerArray.push(new CarObject("Subaru", "BRZ", 2015, "34 Miles Per Gallon", 30000));
  ServerArray.push(new CarObject("Ford", "Mustang GT350", 2020, "21 Miles per Gallon", 5000));
  ServerArray.push(new CarObject("Chevrolet", "Corvette C8", 2019, "27 Miles per Gallon", 3000));
  fileManager.write();
  console.log("added 4 Cars");
}
 else{
  lastID = 0;
  fileManager.read(); // do have prior movies so load up the array
  for (let i=0; i < ServerArray.length; i++){
    if(Number(ServerArray[i].ID) >= Number(lastID) ){
      console.log(ServerArray[i].ID + "  " + lastID);
     lastID = (ServerArray[i].ID) +1;
  }
}
 
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index' );
});

/* GET home page. */
router.get('/getAllMovies', function(req, res, next) {
  fileManager.read();
  res.json(ServerArray);
});




//  new code ***********************************************

/* Add one new note */
router.post('/AddCar', function(req, res) {
  const newCar = req.body;
  newCar.ID = lastID++;
  ServerArray.push(newCar);
  fileManager.write();
  res.status(200).json(newCar);
});


router.delete('/DeleteCar/:ID', (req, res) => {
  const delID = req.params.ID;
  let found = false;

  for(var i = 0; i < ServerArray.length; i++) // find the match
  {
    console.log(ServerArray[i].ID)
      if(ServerArray[i].ID == delID){
        ServerArray.splice(i,1);  // remove object from array
        fileManager.write();
          found = true;
          break;
      }
  }

  if (!found) {
    console.log("not found");
    return res.status(500).json({
      status: "error: no such index in array"
    });
  } else {
  res.send('Car with ID: ' + delID + ' deleted!');
  }
});

module.exports = router;
