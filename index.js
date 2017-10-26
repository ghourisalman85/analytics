var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var config = require('./config.js');
var bodyParser = require('body-parser');
var localStorage = require('localStorage');
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb'); 

var assert = require('assert');
var ObjectID = mongodb.ObjectID;
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;



//var url = 'mongodb://samad:asd.123.@ds151279.mlab.com:51279/cookies?autoReconnect=true';
var url ='mongodb://samad:asd.123.@ds151289.mlab.com:51289/heroku_ttr3gpn1?autoReconnect=true';


MongoClient.connect(url, function (err, db) {
  if(err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  }else{
    console.log(db);  
  }
}); 

var bcrypt = require('bcrypt-nodejs');


app.get('/registerUSer', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index_2.html'));
});



/*bcrypt.hash("Admin123", null, null, function(err, hash) {
    console.log(hash);
});*/
//localStorage.removeItem('loginData', 0);
app.use(bodyParser.json());


app.post('/loginProcess',function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  if(req.body=="" || req.body==null){

  }else{
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      if(err){
        console.log(err);
      }else{
        var email = req.body.email;
        var password = req.body.password;  
        db.collection('superUsers').findOne({"email":email},function(err , doc){
          if(doc=="" || doc==null){
            //db.close();
            res.json("email");
          }else{
            bcrypt.compare(password, doc.password, function(err, ress) {
                if(ress==true){
                  localStorage.setItem('superLoginData', JSON.stringify(doc));
                  res.send({redirect: '/superlogindashboard'});
                }else{
                  res.json("password"); 
                }
            });
            //process.exit();
          }

        });
      }
      
    });
  }

});



app.get('/superlogin', function(req, res){
  var myValue = localStorage.getItem('loginData');
  var superValue = localStorage.getItem('superLoginData');
  if(myValue!==null){
    res.redirect('/siteDashboard');
  }else if(superValue!==null){
    res.sendFile(path.join(__dirname, 'views/superdashboard.html'));
  }else{
    res.sendFile(path.join(__dirname, 'views/superlogin.html'));
   }
});






app.get('/editwebsite', function(req, res){
  var myValue = localStorage.getItem('loginData');
  var superValue = localStorage.getItem('superLoginData');
  if(myValue!==null){
    res.redirect('/siteDashboard');
  }else if(superValue!==null){
    res.sendFile(path.join(__dirname, 'views/editsite.html'));
  }else{
    res.redirect('/superlogin');
   }
});



app.get('/superlogindashboard', function(req, res){
  var myValue = localStorage.getItem('loginData');
  var superValue = localStorage.getItem('superLoginData');
  if(myValue!==null){
    res.redirect('/siteDashboard');
  }else if(superValue!==null){
    res.sendFile(path.join(__dirname, 'views/superdashboard.html'));
  }else{
    res.sendFile(path.join(__dirname, 'views/superlogin.html'));
   }
}); 

app.post('/registerSite',function(req,res){

    if(req.body=="" || req.body==null){

    }else{
      var time = new Date().getTime().toString().substr(-8);
      var data = req.body;
      var code = data.websitename.substring(0,3);
      code +=time;
      MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        
         db.collection("registeredWebsites").findOne({'websiteurl':data.websiteurl}, function(err, item) {
          if(item=="" || item==null){
            db.collection("registeredWebsites").insert({'websitename':data.websitename,'websitecode':code,'websiteurl':data.websiteurl},function(err , doc){
             	res.json(doc.ops);
            });
          }else{
            res.json("sorry");
          }
        })
      }
      });
    }
});




app.post('/getSitesList',function(req,res){
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      db.collection('registeredWebsites').find({}, {}).toArray(function(err, docs) {
        if(docs=="" || docs==null){
            res.json("sorry");
        }else{
            res.json(docs);
        }
      });
    }
  });

});  

app.post('/loginSite',function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  


  MongoClient.connect(url, function (err, db) {
    if(err){
      console.log(err);
    }else{
      db.collection('registeredWebsites').findOne({"websiteurl":req.body.websiteurl,"websitecode":req.body.websitecode},function(err , doc){
        if(doc=="" || doc==null){
           res.json("sorry");
           //db.close();
        }else{
           localStorage.setItem('loginData', JSON.stringify(doc));
           //db.close();
           res.send({redirect: '/siteDashboard'});
        }
      });
    } 
  });

})


/** insert and update notification tocken **/
app.post('/registerForPushNot',function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  MongoClient.connect(url, function (err, db) {
    if(err){
      res.json(err);
    }else{
      db.collection('visitors').findOne({websitecode:req.body.websiteCode,user_id:req.body.browserID},function(err , doc){
        //res.json(err);
        if(doc=="" || doc==null){
          res.json("err");
        } else{
          //res.json("else");
          db.collection('visitors').findAndModify(
          { _id:ObjectID(doc._id) },
          [], 
          { $set: {pushToken:req.body.pushToken} }, 
          { new:true }, 
          function(err, docUpdate) {
            //res.json(err);
            res.json(docUpdate);
            ////db.close();
          });
        }
      });
    }
  });
});

/** insert and update notification tocken **/


/** advertisment Code **/

app.post('/addAdvertisementByLocation',function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  MongoClient.connect(url, function (err, db) {

    var myValue = localStorage.getItem('loginData');
    var item = JSON.parse(myValue);

    var locationAdd = req.body.locations;
    if(err){
      console.log(err);
    }else{
      db.collection('advertisement').findOne({data:req.body.adData},function(err , doc){
        
        if(doc=="" || doc==null){
          db.collection('advertisement').insert({data:req.body.adData},function(err , docsInserteds){          
            db.collection('advertisementByLocation').insert({'advertisementID':docsInserteds.insertedIds,'websitecode':item.websitecode,location:locationAdd},function(errs , insertedRID){
              if(errs){
                res.json("sorry failed to insert");
                ////db.close();
              }else{
                res.json("Successfully inserted!");
                ////db.close();
              }
            });  
          });
        }else{
          res.json("already insert");
          //db.close();
        }
      });
    }
  });
});





app.post('/addAdvertisementByUser',function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  MongoClient.connect(url, function (err, db) {

    var myValue = localStorage.getItem('loginData');
    var item = JSON.parse(myValue);
    
    var usersIDarray = req.body.userIds;
    var temp = new Array();
    temp = usersIDarray.split(",");
    if(err){
      console.log(err);
    }else{
      db.collection('advertisement').findOne({data:req.body.UserAdData},function(err , doc){      
        if(doc=="" || doc==null){
          db.collection('advertisement').insert({data:req.body.UserAdData},function(err , docsInserteds){          
            var a = 0;
            for(var i = 0; i < temp.length; i++) {
              a++;
              db.collection('advertisementByUsers').insert({'advertisementID':docsInserteds.insertedIds,'websitecode':item.websitecode,user_id:temp[i]},function(errs , insertedRID){
                if(errs){
                }else{
                }
              });
            };
            if(a==temp.length){
              res.json("Successfully inserted!");
              a=0;
            }
          });
        }else{
          res.json("already insert");
        }
      });
    }
    });
});

/** advertisment Code **/

/*Events Code*/
app.post('/trackExitPages',function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //res.json(req.body);

  MongoClient.connect(url, function (err, db) {
   if(err){
    console.log(err);
   }else{
    req.body.exitTime =  new Date();
    db.collection('exitPages').insert(req.body,function(err , docsInserteds){
      res.json(docsInserteds.insertedIds);
      //db.close();
    });
   }
  });
});  


app.post('/track_links',function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  MongoClient.connect(url, function (err, db) {
    if(err){
      console.log(err);
     }else{
      db.collection('linksTracking').findOne({referrermenu: req.body.referrermenu,menu: req.body.menu,browserid: req.body.browserid, sitecode: req.body.sitecode},function(err , doc){      
        if(doc==null || doc==""){
          req.body.linkViewed = 1;
          req.body.actionViewedTime = new Date();
          db.collection('linksTracking').insert(req.body,function(err , docsInserteds){
            res.json(docsInserteds.insertedIds);
            //db.close();
          });
        }else{
          db.collection('linksTracking').findAndModify(
          { _id:ObjectID(doc._id) },
          [], 
          { $set: {linkViewed: doc.linkViewed+1 ,actionViewedTime:new Date()} }, 
          { new:true }, 
          function(err, docUpdate) {
            res.json(docUpdate);
            //db.close();
          });
        }
      });
    }
  });

}); 



app.post('/track_searches',function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  MongoClient.connect(url, function (err, db) {
    if(err){
      console.log(err);
    }else{
    
      db.collection('searchTracking').findOne({searchedKeyword: req.body.searchedKeyword,browserid: req.body.browserid, sitecode: req.body.sitecode},function(err , doc){      
        if(doc==null || doc==""){
          
          req.body.searchedRepeatedTimes = 1;
          req.body.searchedTime = new Date();
          db.collection('searchTracking').insert(req.body,function(err , docsInserteds){
            res.json(docsInserteds.insertedIds);
            //db.close();
          });

        }else{
          db.collection('searchTracking').findAndModify(
          { _id:ObjectID(doc._id) },
          [], 
          { $set: {searchedRepeatedTimes: doc.searchedRepeatedTimes+1 ,searchedTime:new Date()} }, 
          { new:true }, 
          function(err, docUpdate) {
            res.json(docUpdate);
            //db.close();
          });
        }
      });
    }
  });

}); 

app.post('/trackEvents',function(req,res){

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  if(req.body=="" || req.body==null){

  }else{
    MongoClient.connect(url, function (err, db) {
      if(err){
        console.log(err);
      }else{
        db.collection('events').findOne({Category: req.body.Category, Action: req.body.Action, Label: req.body.Label, browserid: req.body.browserid, sitecode: req.body.sitecode},function(err , doc){
          if(doc==null || doc==""){
            req.body.actionRepeated = 1;
            req.body.actionDateTime = new Date();
            db.collection('events').insert(req.body,function(err , docsInserteds){
              res.json(docsInserteds.insertedIds);
              //db.close();
            });
          }else{        
            db.collection('events').findAndModify(
            { _id:ObjectID(doc._id) },
            [], 
            { $set: {actionRepeated: doc.actionRepeated+1 ,actionDateTime:new Date()} }, 
            { new:true }, 
            function(err, docUpdate) {
              res.json(docUpdate);
              //db.close();
            });
          }
        });
      } 
    });  
  }
});

/*Events COde*/

var visitorsData = {};
app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.join(__dirname, 'public/')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/getPageData', function(req, res) {
  var myValue = localStorage.getItem('loginData');
  if(myValue!==null){
    res.sendFile(path.join(__dirname, 'views/getPageData.html'));
  }else{
    res.redirect('/login');
  }
});

app.get(/\/(about|contact)?$/, function(req, res) {
  res.redirect('/login');
});

app.get('/index', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/viewSiteReport', function(req, res) {
  var myValue = localStorage.getItem('loginData');
  var superValue = localStorage.getItem('superLoginData');
  if(myValue!==null){
    res.redirect('/siteDashboard');
  }else if(superValue!==null){
    res.sendFile(path.join(__dirname, 'views/viewSiteReport.html'));
  }else{
    res.redirect('/superlogin');
  }
});

app.get('/registersite', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/registerSite.html'));
});


app.get('/sendPush', function(req, res) {
  var myValue = localStorage.getItem('loginData');
  if(myValue!==null){   
    res.sendFile(path.join(__dirname, 'views/tables.html'));
  }else{
    res.redirect('/login');
  }

});

app.get('/users', function(req, res) {
  var myValue = localStorage.getItem('loginData');
  if(myValue!==null){   
    res.sendFile(path.join(__dirname, 'views/users.html'));
  }else{
    res.redirect('/login');
  }
});


app.get('/getPlatformUsers', function(req, res) {
  var myValue = localStorage.getItem('loginData');
  if(myValue!==null){
    res.sendFile(path.join(__dirname, 'views/platformUsers.html'));
  }else{
    res.redirect('/login');
  }
});

app.get('/send_push', function(req, res) {
  var myValue = localStorage.getItem('loginData');
  if(myValue!==null){
    res.sendFile(path.join(__dirname, 'views/send_push.html'));
  }else{
    res.redirect('/login');
  }
});

app.get('/usersinterval', function(req, res) {
  var myValue = localStorage.getItem('loginData');
  if(myValue!==null){
    res.sendFile(path.join(__dirname, 'views/usersinterval.html'));
  }else{
    res.redirect('/login');
  }
});

app.get('/getCountryUsers', function(req, res) {
  var myValue = localStorage.getItem('loginData');
  if(myValue!==null){  
    res.sendFile(path.join(__dirname, 'views/countryUsers.html'));
  }else{
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  var myValue = localStorage.getItem('loginData');
  var superValue = localStorage.getItem('superLoginData');
  if(myValue!==null){
    res.redirect('/siteDashboard');
  }else if(superValue!==null){
    res.redirect('/superlogin');
  }else{
    res.sendFile(path.join(__dirname, 'views/login.html'));
   }
});



app.get('/siteDashboard', function(req, res) {
  var myValue = localStorage.getItem('loginData');
  if(myValue!==null){
    res.sendFile(path.join(__dirname, 'views/index.html'));
  }else{
    res.redirect('/login');
  }
});



app.get('/worker', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/serviceWorker.html'));
});


app.post('/getUserInfo',function(req,res){
  var myValue = localStorage.getItem('loginData');
  var item = JSON.parse(myValue);
  res.json(item);
});

app.post('/getAdminData',function(req,res){
  var data = localStorage.getItem('superLoginData');
  var item = JSON.parse(data);
  res.json(item);
});

app.post('/allData',function(req,res){
    var myValue = localStorage.getItem('loginData');
    var item = JSON.parse(myValue);
    MongoClient.connect(url, function (err, db) {
     if(err){
      console.log(err);
     }else{
  	  db.collection('siteData').find({'websitecode':item.websitecode}, {}).toArray(function(err, docs) {
  	   	if(docs=="" || docs==null){
	        res.json("sorry");
          //db.close();
  	    }else{
	        res.json(docs);
          //db.close();
  	    }
  	  });
    }
  });
})


app.post('/getAllUsers',function(req,res){
    var myValue = localStorage.getItem('loginData');
    var item = JSON.parse(myValue);
    MongoClient.connect(url, function (err, db) {
      if(err){
        console.log(err);
      }else{
        db.collection('visitors').find({'websitecode':item.websitecode}, {}).toArray(function(err, docs) {
          if(docs=="" || docs==null){
            res.json("sorry");
            //db.close();
          }else{
            res.json(docs);
            //db.close();
          }
        });
      }
    });
})

app.post('/getAllpageData',function(req,res){
  MongoClient.connect(url, function (err, db) {
    if(err){
      console.log(err);
    }else{
      db.collection('browserData').find({pageId:ObjectID(req.body.pageId)}, {}).toArray(function(err, docs) {
        if(docs=="" || docs==null){
          res.json("sorry");
          //db.close();
        }else{
          res.json(docs);
          //db.close();
        }
      });
    }
  });
});

app.post('/getUsersPercent',function(req,res){

var myValue = localStorage.getItem('loginData');
var item = JSON.parse(myValue);

MongoClient.connect(url, function (err, db) {
 
 if(err){
  console.log(err);
 }else{
  
   db.collection('visitors').find({'websitecode':item.websitecode},{'country':1}, {}).toArray(function(err, docs) {   
    var countCountry={};
    var count=0;
    if(docs=="" || docs==null){
        console.log("sorry");
    }else{
      
      for(var i=0; i < docs.length; i++){
        var country=docs[i].country;
        if(country=="" || country==null){

        }else{
          if (country in countCountry) {
            countCountry[country]++;
          } else {
            countCountry[country] = 1;
          }
        }
      }

      
      res.json(percent(countCountry));
      function percent(array)
      {
        var max=0;
        var a=0;
        var maxTotal=0;
        for (var key in array) {
         a++;
         maxTotal = maxTotal+parseInt(array[key]);
         var keys = Object.keys(array);
         var len = keys.length;
         if(a==len){
           if (array[key] > max) max = maxTotal;      
         } 
        }
        for (var key in array) {
          var a= array[key] * 100 / max;
              a=a.toFixed(2);
          array[key] = a;
        }
        return array;
      }

    }
});
}
}); 

});


app.post('/getDevicePercent',function(req,res){

var myValue = localStorage.getItem('loginData');
var item = JSON.parse(myValue);

MongoClient.connect(url, function (err, db) {
if(err){
  console.log(err);
}else{  
db.collection('visitors').find({'websitecode':item.websitecode},{'platforms':1}, {}).toArray(function(err, docs) {   
  var countPlatforms={};
  var count=0;
  if(docs=="" || docs==null){
      console.log("sorry");
      //db.close();
  }else{
    
    for(var i=0; i < docs.length; i++){
      var platforms=docs[i].platforms;
      if (platforms in countPlatforms) {
        if(platforms=='null' || platforms=='' || platforms==null){
          countPlatforms['other']++;
        }else{
          countPlatforms[platforms]++;
        }
      } else {
        if(platforms=='null' || platforms=='' || platforms==null){
          countPlatforms['other']=1;
        }else{
          countPlatforms[platforms]=1;
        }
      }
    }

    res.json(percent(countPlatforms));
    function percent(array)
    {
      var max=0;
      var a=0;
      var maxTotal=0;
      for (var key in array) {
       a++;
       maxTotal = maxTotal+parseInt(array[key]);
       var keys = Object.keys(array);
       var len = keys.length;
       if(a==len){
         if (array[key] > max) max = maxTotal;      
       } 
      }
      for (var key in array) {
        var a= array[key] * 100 / max;
            a=a.toFixed(2);
        array[key] = a;
      }
      return array;
    }

  }
 }); 
}
 });
});



app.post('/checkUserAndCountries',function(req,res){

    var myValue = localStorage.getItem('loginData');
    var item = JSON.parse(myValue);

    if(item=="" || item==null){
        
    }else{

       MongoClient.connect(url, function (err, db) {
        
       if(err){
        console.log(err);
       }else{

        var total=0;
        var totalUserCountries={};
        db.collection('siteData').find({'websitecode':item.websitecode},{'pageViews':1}, {}).toArray(function(err, docs) {
          if(docs=="" || docs==null){
            console.log("sorry");
            //db.close();
          }else{ 
            for(var i=0; i < docs.length; i++){
              total+=parseInt(docs[i].pageViews);
            }      
            totalUserCountries['total'] = total;
          }
        });

        var countCountry = {};
        var ccount=''; 
        db.collection('visitors').find({'websitecode':item.websitecode},{'country':1}, {}).toArray(function(err, docs) {   
          if(docs=="" || docs==null){
              console.log("sorry");
              //db.close();
          }else{
            for(var i=0; i < docs.length; i++){
              var country=docs[i].country;
              if (country in countCountry) {
              } else {
                ccount++;
                countCountry[country] = 1;
              }
            }
            totalUserCountries['countries'] = ccount;
          }
          res.json(totalUserCountries);
          //db.close();
        }); 
       }
      });
    }   

});




/*** For monthly users Graph ***/
app.post('/monthlyUserGraph',function(req,res){
  var myValue = localStorage.getItem('loginData');
  var item = JSON.parse(myValue);
  MongoClient.connect(url, function (err, db) {

 if(err){
  console.log(err);
 }else{ 

  var countCountry = {};
    var ccount=''; 
  db.collection('monthlySiteViews').find({'websitecode':item.websitecode},{}, {}).toArray(function(err, docs) {   
    if(docs=="" || docs==null){
      console.log("sorry");
      //db.close();
  }else{
    //console.log(docs);
    
    for(var i=0; i < docs.length; i++){
        var country=docs[i].month;
        var visits=docs[i].visits;
        if (country in countCountry){
          countCountry[country] = parseInt(countCountry[country])+parseInt(visits);
        } else {
          countCountry[country] = visits;
        }
      }
    }
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var objects = countCountry;
    var output = {};
    for (var k in months) {
      var month = months[k];
      if(objects[month]=="" || objects[month]==null || objects[month]=="undefined"){
      }else{
        output[month] = objects[month];
      }
    }
    res.json(output);
    //db.close();
  }); 
   } 
  });
});





app.post('/getVisitorInfo',function(req,res){
  MongoClient.connect(url, function (err, db) {
    if(err){
    console.log(err);
   }else{
      var myValue = localStorage.getItem('loginData');
      var item = JSON.parse(myValue);

      if(item=="" || item==null){
          
      }else{
        db.collection("visitors").findOne({'user_id':req.body.user_id,'websitecode':item.websitecode}, function(err, docs){
          if(docs=="" || docs==null){
            res.json("sorry");
            //db.close();
          }else{
            res.json(docs);
            //db.close();
          }
        });
      } 
   }
  });
});



app.post('/geteditSite',function(req,res){
  MongoClient.connect(url, function (err, db) {
    if(err){
      console.log(err);
    }else{
      db.collection("registeredWebsites").findOne({'_id':ObjectID(req.body.websiteid)}, function(err, docs){
        if(docs=="" || docs==null){
          res.json("sorry");
          //db.close();
        }else{
          res.json(docs);
          //db.close();
        }
      });
    }
  });
});

app.post('/seteditSite',function(req,res){
  MongoClient.connect(url, function (err, db) {
    if(err){
      console.log(err);
    }else{
      db.collection('registeredWebsites').findAndModify(
       { _id:ObjectID(req.body.id) },
       [], 
       { $set:req.body}, 
       { new:true }, 
       function(err, doc){
        res.json(doc.value);
        //db.close();
      });
    }
  });
});


app.post('/getUserBycountry',function(req,res){
  MongoClient.connect(url, function (err, db) {
    if(err){
      console.log(err);
    }else{
      var myValue = localStorage.getItem('loginData');
      var item = JSON.parse(myValue);

      if(item=="" || item==null){
      }else{
        db.collection('visitors').find({'country':req.body.country,'websitecode':item.websitecode}, {}).toArray(function(err, docs) {
          if(docs=="" || docs==null){
            res.json("sorry");
            //db.close();
          }else{
            res.json(docs);
            //db.close();
          }
        });
      } 
    }
  });
});
app.post('/getUserByplatform',function(req,res){
  MongoClient.connect(url, function (err, db) {

    if(err){
      console.log(err);
    }else{
      
      var myValue = localStorage.getItem('loginData');
      var item = JSON.parse(myValue);

      if(item=="" || item==null){
        
      }else{
        db.collection('visitors').find({'platforms':req.body.platforms,'websitecode':item.websitecode}, {}).toArray(function(err, docs) {
          if(docs=="" || docs==null){
            res.json("sorry");
            //db.close();
          }else{
            res.json(docs);
            //db.close();
          }
        });
      } 
    }
  });
});

app.post('/newSignups',function(req,res){
  MongoClient.connect(url, function (err, db) {
    if(err){
      console.log(err);
    }else{
      req.body.addedon = new Date();
      db.collection('NewSignups').insert(req.body,function(err , docsInserteds){
        if(!err){
          res.json("done");
          //db.close();
        }else{
          res.json(err);
          //db.close();
        }
      }); 
    }
  });
});



app.post('/getVisitorEvents',function(req,res){
  MongoClient.connect(url, function (err, db) {
    if(err){
    console.log(err);
   }else{
      var myValue = localStorage.getItem('loginData');
      var item = JSON.parse(myValue);

      if(item=="" || item==null){
          
      }else{
         db.collection('events').find({'browserid':req.body.browserid,'sitecode':item.websitecode}, {}).toArray(function(err, docs) {
          if(docs=="" || docs==null){
            res.json("sorry");
            //db.close();
          }else{
            res.json(docs);
            //db.close();
          }
        });
      } 
    }
  });
});

app.post('/getVisitorPages',function(req,res){
  MongoClient.connect(url, function (err, db) {

    if(err){
      console.log(err);
    }else{
      var myValue = localStorage.getItem('loginData');
      var item = JSON.parse(myValue);
      if(item=="" || item==null){
      }else{
        db.collection('siteData').find({'userfingerprints':req.body.userfingerprints,'websitecode':item.websitecode} , {}).toArray(function(err, docs) {
          if(docs=="" || docs==null){
              res.json("sorry");
          }else{
              res.json(docs);
          }
        });
      } 
   }
  });
});

/** getting last 24 hours users **/

app.post('/checkLastDay',function(req,res){
  
  var myValue = localStorage.getItem('loginData');
  var item = JSON.parse(myValue);

  MongoClient.connect(url, function (err, db) {
    if(err){
      console.log(err);
    }else{
      var totalArray = {};
      db.collection('visitors').find({ 
        "lastTimeVisitedDate" : { 
          $lt: new Date(), 
          $gte: new Date(new Date().setDate(new Date().getDate()-1))
        },
        'websitecode':item.websitecode,
      },{}).toArray(function(err, docs) {
        if(docs=="" || docs==null){
          totalArray['minutes'] = "0";
          res.json(totalArray);
        }else{
          totalArray['oneday'] = docs.length;
          res.json(totalArray);
        }
      });
  }
  });
});

app.post('/checkLastminutes',function(req,res){
  
  var myValue = localStorage.getItem('loginData');
  var item = JSON.parse(myValue);
  var totalArray = {};
  MongoClient.connect(url, function (err, db) {
    if(err){
      console.log(err);
    }else{
      db.collection('visitors').find({ 
        "lastTimeVisitedDate" : { 
          $lt: new Date(), 
          $gte: new Date(new Date().getTime() - 1000 * 60 * 30)
        },
        'websitecode':item.websitecode,
      },{}).toArray(function(err, docs) {
        if(docs=="" || docs==null){
          totalArray['minutes'] = "0";
          res.json(totalArray);
        }else{
          totalArray['minutes'] = docs.length;
          res.json(totalArray);
        }
      });
    } 
  });
});
app.get('/dashboard', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

app.get('/addAdvertising',function(req , res){
  var myValue = localStorage.getItem('loginData');
  if(myValue!==null){
    res.sendFile(path.join(__dirname, 'views/addvertisment.html'));
  }else{
    res.redirect('/login');
  }
})

app.get('/viewuserdata',function(req , res){
  var myValue = localStorage.getItem('loginData');
  if(myValue!==null){
    res.sendFile(path.join(__dirname, 'views/userdata.html'));
  }else{
    res.redirect('/login');
  }
});




app.get('/logout', function(req, res) {
  localStorage.removeItem('loginData', 0);
  res.redirect('/login');
});
app.get('/logoutsuperuser', function(req, res) {
  localStorage.removeItem('superLoginData', 0);
  res.redirect('/superlogin');
});


io.on('connection', function(socket){

  var address = socket.handshake.address;
  
  if (socket.handshake.headers.host === config.host && socket.handshake.headers.referer.indexOf(config.host + config.dashboardEndpoint) > -1) {
    io.emit('updated-stats', computeStats());
  }

  socket.on('getUSerAd', function (data) {
    if(data=="" || data==null){

    }else{
      MongoClient.connect(url, function (err, db) {
        if(err){
          console.log(err);
        }else{
          db.collection('advertisementByUsers').findOne(data,function(err , docs){
              if(docs=="" || docs==null){
                //db.close();
              }else{
                db.collection('advertisement').findOne({'_id':ObjectID(docs.advertisementID[0])},function(err , addData){
                  socket.emit('sendAdvertisment',addData);
                  //db.close();
                });
              }
          });
        }
      });
    }
  });

  socket.on('getLocationAd', function (data) {
    if(data=="" || data==null){

    }else{
      MongoClient.connect(url, function (err, db) {
        if(err){
          console.log(err);
        }else{
          db.collection('advertisementByLocation').findOne(data,function(err , docs){
            if(err){
              console.log(err);
            }else{
              if(docs=="" || docs==null){
                //db.close();
              }else{
                db.collection('advertisement').findOne({'_id':ObjectID(docs.advertisementID[0])},function(err , addData){
                  socket.emit('LocatiosendAdvertisment',addData);
                  //db.close();
                });
              }
            } 
          });
        }
      });
    }  
  });


  var dataFinger = "";
  socket.on('visitor-data', function(data){
    
    dataFinger = data.userfingerprints.fingerPrints;
    MongoClient.connect(url, function (err, db){
	   if(err){
      console.log(err);
     }else{
      db.collection('registeredWebsites').findOne({'websitecode':data.webSiteCode},function(err , docs){
        if(docs=="" || docs==null){
        }else{
        db.collection("visitors").findOne({user_id:data.userfingerprints.browserID,'websitecode':data.webSiteCode}, function(err, docs){
          if(docs=="" || docs==null){
            if(data.userfingerprints.country=="" || data.userfingerprints.country==null)data.userfingerprints.country="Other";
            if(data.userfingerprints.platforms=="" || data.userfingerprints.platforms==null)data.userfingerprints.platforms="Other";
            db.collection('visitors').insert({'user_id':data.userfingerprints.browserID,'websitecode':data.webSiteCode,'country':data.userfingerprints.country,'city':data.userfingerprints.city,'browser':data.userfingerprints.browser,'CPU':data.userfingerprints.CPU,'OS':data.userfingerprints.OS,'platforms':data.userfingerprints.platforms,'isIphone':data.userfingerprints.isIphone,'isMobileAndroid':data.userfingerprints.isMobileAndroid, firstTimeVisitedDate:new Date(),lastTimeVisitedDate:new Date()},function(err , docsInserteds){
              ////db.close();
            });
          }else{
            db.collection('visitors').findAndModify(
            { _id:ObjectID(docs._id) },
            [], 
            { $set: {lastTimeVisitedDate:new Date()} }, 
            { new:true }, 
            function(err, doc){
              ////db.close();
            });
          }
        }); 

        var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        var d = new Date();
        MongoClient.connect(url, function (err, db){ 
            if(err){
             console.log(err);
           }else{   
            db.collection('monthlySiteViews').findOne({'month':monthNames[d.getMonth()],'websitecode':data.webSiteCode,'visitorid':data.userfingerprints.browserID},function(err , docs){
              if(docs=="" || docs==null){
                db.collection('monthlySiteViews').insert({'month':monthNames[d.getMonth()],'websitecode':data.webSiteCode,'visitorid':data.userfingerprints.browserID,'visits':1,timestamp:new Date()},function(err , docsInserteds){
                 ////db.close();
                });
              }else{ 
                var firstVisit = new Date();  
                var date = firstVisit.getFullYear()+'-'+(firstVisit.getMonth()+1)+'-'+firstVisit.getDate();
                var dateTime = date;  
                
                var recentVisit = docs.timestamp;  
                var recentdate = recentVisit.getFullYear()+'-'+(recentVisit.getMonth()+1)+'-'+recentVisit.getDate();
                var recentVisitDate = recentdate; 
            
                  if(recentVisitDate>dateTime){
                      var paid=docs._id;
                      var views = docs.visits;  
                      var pageViewsUpdate = views+1;
                     db.collection('monthlySiteViews').findAndModify(
                     { _id:ObjectID(paid) },
                     [], 
                     { $set: {visits: pageViewsUpdate,timestamp:new Date()} }, 
                     { new:true }, 
                     function(err, doc) {
                      ////db.close();
                     });
                  }else{
                    //console.log("else");
                  } 
              }
            });
          }
        });

       
        db.collection("siteData").findOne({'page':data.page,'userfingerprints':data.userfingerprints.browserID,'websitecode':data.webSiteCode}, function(err, doc){
          if(doc=="" || doc==null){
              db.collection('siteData').insert({'referringSite':data.referringSite,'page':data.page,'pageTitle':data.pageTitle,'completePath':data.completePath,'userfingerprints':data.userfingerprints.browserID,'websitecode':data.webSiteCode,'locLongLAt':data.userfingerprints.locationLatLang,'userIpAddress':data.userfingerprints.ip,'pageViews':1,timestamp:new Date() },function(err , docsInserted){
                db.collection('browserData').insert({pageId:docsInserted.insertedIds,'browserID':data.userfingerprints.browserID,'country':data.userfingerprints.country,'city':data.userfingerprints.city,'region':data.userfingerprints.region,'organization':data.userfingerprints.org,'zip':data.userfingerprints.zip,'webSiteCode':data.webSiteCode,'isMobileOpera':data.userfingerprints.isMobileOpera,'isMobileWindows':data.userfingerprints.isMobileWindows,'isMobileBlackBerry':data.userfingerprints.isMobileBlackBerry,'isMobileAndroid':data.userfingerprints.isMobileAndroid,'timeZone':data.userfingerprints.timeZone,'browser':data.userfingerprints.browser,'isIpod':data.userfingerprints.isIpod,'isIpad':data.userfingerprints.isIpad,'isIphone':data.userfingerprints.isIphone,'isMobileIOS':data.userfingerprints.isMobileIOS,'CPU':data.userfingerprints.CPU,'OperatingSystem':data.userfingerprints.OS,timestamp:new Date() },function(err , browserdocsInserted){
                });
              });
            }else{
              var paid=doc._id;
              var views = doc.pageViews;              
              db.collection('browserData').findOne({pageId:ObjectID(doc._id),browserID:data.userfingerprints.browserID},function(err , browserdocsInserted){
                  if(browserdocsInserted=="" || browserdocsInserted==null){                    
                    db.collection('browserData').insert({pageId:paid,'browserID':data.userfingerprints.browserID,'country':data.userfingerprints.country,'city':data.userfingerprints.city,'region':data.userfingerprints.region,'organization':data.userfingerprints.org,'zip':data.userfingerprints.zip,'webSiteCode':data.webSiteCode,'isMobileOpera':data.userfingerprints.isMobileOpera,'isMobileWindows':data.userfingerprints.isMobileWindows,'isMobileBlackBerry':data.userfingerprints.isMobileBlackBerry,'isMobileAndroid':data.userfingerprints.isMobileAndroid,'timeZone':data.userfingerprints.timeZone,'browser':data.userfingerprints.browser,'isIpod':data.userfingerprints.isIpod,'isIpad':data.userfingerprints.isIpad,'isIphone':data.userfingerprints.isIphone,'isMobileIOS':data.userfingerprints.isMobileIOS,'CPU':data.userfingerprints.CPU,'OperatingSystem':data.userfingerprints.OS,timestamp:new Date() },function(err , browserdocsInserteds){
                    });
                    var pageViewsUpdate = views+1;
                    db.collection('siteData').findAndModify(
                     { _id:ObjectID(paid) },
                     [], 
                     { $set: {pageViews: pageViewsUpdate ,timestamp:new Date()} }, 
                     { new:true }, 
                     function(err, doc) {
                      ////db.close();
                     });
                  }else{
                    var pageViewsUpdate = views+1;
                     db.collection('siteData').findAndModify(
                     { _id:ObjectID(paid) },
                     [], 
                     { $set: {pageViews: pageViewsUpdate ,timestamp:new Date()} }, 
                     { new:true }, 
                     function(err, doc) {
                      ////db.close();
                     });
                  }
                  
                });  
            }
          });
          
            var myValue = localStorage.getItem('loginData');
            var item = JSON.parse(myValue);

            if(item=="" || item==null){
                
            }else{
              if(item.websitecode==data.webSiteCode){
                visitorsData[socket.id+'='+item.websitecode] = data;
                io.emit('updated-stats', computeStats()); 
              }else{
              }    
            }


        }
      });
    }
    });
    // compute and send visitor data to the dashboard when a new user visits our page
  });
  

  socket.on('disconnect', function() {
    // a user has left our page - remove them from the visitorsData object
      
    

    var myValue = localStorage.getItem('loginData');
    var item = JSON.parse(myValue);
    if(item=="" || item==null){
        
    }else{
      delete visitorsData[socket.id+'='+item.websitecode];
      io.emit('updated-stats', computeStats());
    }
  });

});

// wrapper function to compute the stats and return a object with the updated stats
function computeStats(){
  return {
    onlineUsers:computeOnlineUsersCountryWise(),
    pages: computePageCounts(),
    referrers: computeRefererCounts(),
    activeUsers: getActiveUsers()
  };
}

// get the total number of users on each page of our site

function computeOnlineUsersCountryWise() {
  var userCounts = {};
  var keys="";
  for (var key in visitorsData){

    keys=key;
    function getSecondPart(str) {
      return str.split('=')[1];
    }
    var websiteCodeSocket = getSecondPart(key);
    var myValue = localStorage.getItem('loginData');
    var item = JSON.parse(myValue);
    if(item=="" || item==null){ 

    }else{

      if(item.websitecode==websiteCodeSocket){
        var country = visitorsData[keys].userfingerprints.country;
        if (country in userCounts){
          userCounts[country]++;
        } else {
          userCounts[country]=1;
        }
      } 

    }

   
  }
  return userCounts;
}   

function computePageCounts() {
  var pageCounts = {};
  for (var key in visitorsData){
      
    function getSecondPart(str) {
      return str.split('=')[1];
    }
    var websiteCodeSocket = getSecondPart(key);
    var myValue = localStorage.getItem('loginData');
    var item = JSON.parse(myValue);
    if(item=="" || item==null){ 

    }else{
      if(item.websitecode==websiteCodeSocket){
        var page = visitorsData[key].page;
        if (page in pageCounts) {
          pageCounts[page]++;
        } else {
          pageCounts[page] = 1;
        }
      }  
    }
  }
  return pageCounts;
} 

// get the total number of users per referring site
function computeRefererCounts() {
  var referrerCounts = {};
  for (var key in visitorsData) {
    function getSecondPart(str) {
      return str.split('=')[1];
    }
    var websiteCodeSocket = getSecondPart(key);
    var myValue = localStorage.getItem('loginData');
    var item = JSON.parse(myValue);
    if(item=="" || item==null){   
    }else{
      
      if(item.websitecode==websiteCodeSocket){
        var referringSite = visitorsData[key].referringSite || '(direct)';
        if (referringSite in referrerCounts) {
          referrerCounts[referringSite]++;
        } else {
          referrerCounts[referringSite] = 1;
        }
      }
    }
  }
  return referrerCounts;
}

// get the total active users on our site
function getActiveUsers() {
  var obj=[];
  var keyobj='';
  for (var key in visitorsData) {
    keyobj=key;
    function getSecondPart(str) {
      return str.split('=')[1];
    }
    var websiteCodeSocket = getSecondPart(key);
    var myValue = localStorage.getItem('loginData');
    var item = JSON.parse(myValue);
    if(item=="" || item==null){
    }else{
      if(item.websitecode==websiteCodeSocket){
        add(visitorsData[keyobj].userfingerprints.browserID);
        function add(name) {
          var found = obj.some(function (el) {
            return el.userfingerprints.browserID == name;
          });
          if (!found) {
             obj.push(visitorsData[key]);
          }else{
          }
        }
      }
    }
  }

  return Object.keys(obj).length;
}

http.listen(app.get('port'), function() {
  console.log('listening on *:' + app.get('port'));
});
