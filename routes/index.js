var express = require('express');
var empModel=require('../modules/employee');
var router = express.Router();
var employee=empModel.find({});

/* GET home page. */
router.get('/', function(req, res, next) {
  employee.exec(function(err, data){
    if (err) throw err;
    res.render('index', { title: 'Employee Records' , records : data , success : ""});
  });
});

router.post("/", function(req, res, next){
  var empDetails = new empModel({
    name: req.body.uname,
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total:  parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
  });
   
    empDetails.save(function(err, res1){
      if(err) throw err;

    employee.exec(function(err, data){
      if(err) throw err;
      res.render('index', { title: 'Employee Records' , records: data , success :"Record inserted Sucessfully ....!"});

  });
});

});

router.post("/search/", function(req, res, next){

  var fltrName= req.body.fltrname;
  var fltrEmail = req.body.fltremail;
  var fltremptype = req.body.fltremptype;

  if(fltrName!="" && fltrEmail != "" && fltremptype != "")
  {
    var filterParameter= {$and: [{ name: fltrName}, {$and:[{email: fltrEmail},{etype: fltremptype}]}]}
  }else if (fltrName!="" && fltrEmail=="" && fltremptype !="")
   {
    var filterParameter= {$and: [{ name: fltrName},{etype: fltremptype}]}
   }
   else if (fltrName=="" && fltrEmail!="" && fltremptype !="")
   {
    var filterParameter= {$and: [{email: fltrEmail},{etype: fltremptype}]}
   }
   else if (fltrName=="" && fltrEmail=="" && fltremptype !="")
   {
       var filterParameter = { etype: fltremptype};
   }
    else {
      var filterParameter={}
    }
    
    var employeeFilter=empModel.find(filterParameter);
     employeeFilter.exec(function(err, data){
      if(err) throw err;
      res.render('index', { title: 'Employee Records' , records: data , success: "Filtered Record"});

  });
});


router.get('/delete/:id', function(req, res, next) {
     var id= req.params.id;
     var del= empModel.findByIdAndDelete(id);
   del.exec(function(err){
    if (err) throw err;
    res.redirect("/");
  });
});


router.get('/edit/:id', function(req, res, next) {
     var id = req.params.id;
     var edit= empModel.findById(id);
  edit.exec(function(err, data){
    if (err) throw err;
    res.render('edit', { title: ' Edit Employee Records' , records : data});
  });
});

router.post("/update/", function(req, res, next) {
    var update = empModel. findByIdAndUpdate(req.body.id , {
      name: req.body.uname,
      email: req.body.email,
      etype: req.body.emptype,
      hourlyrate: req.body.hrlyrate,
      totalHour: req.body.ttlhr,
      total:  parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
    });

  update.exec(function(err, data){
    if (err) throw err;
    res.render('update', { title: ' Employee Records' , records : data});
  });
});

module.exports = router;
