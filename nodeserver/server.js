/**
 * Created by debasis on 14/9/16.
 */

var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var request = require('request');
var cheerio = require('cheerio');
var http = require('http').Server(app);
var mailer = require("nodemailer");

var mzsadielink='http://mzsadie.influxiq.com/#/';

var bodyParser = require('body-parser');
app.use(bodyParser.json({ parameterLimit: 10000000,
    limit: '90mb'}));
app.use(bodyParser.urlencoded({ parameterLimit: 10000000,
    limit: '90mb', extended: false}));
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '../uploads/');
    },
    filename: function (req, file, cb) {
        //console.log(cb);

        console.log(file.originalname);
        filename=file.originalname.split('.')[0].replace(/ /g,'') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        console.log(filename);
        cb(null, filename);
    }
});



var EventEmitter = require('events').EventEmitter;

const emitter = new EventEmitter()
//emitter.setMaxListeners(100)
// or 0 to turn off the limit
emitter.setMaxListeners(0)

var upload = multer({ //multer settings
    storage: storage
}).single('file');


app.use(bodyParser.json({type: 'application/vnd.api+json'}));




app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




/** API path that will upload the files */
app.post('/uploads', function(req, res) {
    datetimestamp = Date.now();
    upload(req,res,function(err){
        console.log(1);
        console.log(err);
        console.log(filename);

        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }

        res.json({error_code:0,filename:filename});


    });
});

var mongodb = require('mongodb');
var db;
var url = 'mongodb://localhost:27017/mzsadie';

var MongoClient = mongodb.MongoClient;

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log(err);

    }else{
        db=database;

    }});




app.get('/addexpertarea', function (req, resp) {

    value1 = {title: 'sdf',description: '5435', priority: 6,status: 0};

    var collection = db.collection('addexpertarea');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});


/*-----------------------------------EXAMPLES_START------------------------------------------*/
app.get('/test', function (req, resp) {

    value1 = {title: 'today',description: '5435', priority: 6,status: 0};

    var collection = db.collection('test');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Newesttttttttttt Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});

app.get('/addperson', function (req, resp) {

    value1 = {title: 'number10',description: '5435', priority: 1,status: 0};

    var collection = db.collection('person');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});


app.post('/adddealer', function (req, resp) {

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    value1 = {fname: req.body.fname,lname: req.body.fname, phone: req.body.phone,zip: req.body.zip,username:req.body.username,password:hash,is_lead:1};

    var collection = db.collection('dealers');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});



app.post('/updatedealer',function (req,resp) {

    var collection = db.collection('dealers');
    collection.update({username: req.body.username}, {$set: {address:req.body.address,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,phone:req.body.phone,zip:req.body.zip}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //db.close();

        }
    });

});

app.get('/testlist', function (req, resp) {


    var collection = db.collection('test');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/show', function (req, resp) {


    var collection = db.collection('person');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/deleteperson', function (req, resp) {

    var o_id = new mongodb.ObjectID('58f44da6520983ab4bb87ce0');

    var collection = db.collection('person');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //   db.close();
        }
    });

});
app.get('/updateperson',function (req,resp) {

    var o_id = new mongodb.ObjectID('58f44db8520983ab4bb87ce2');
    var collection = db.collection('person');
    collection.update({_id: o_id}, {$set: {description:'Updated'}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //db.close();

        }
    });

});
app.post('/addcustomer', function (req, resp) {

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    value1 = {fname: req.body.fname,lname: req.body.fname, phone: req.body.phone,zip: req.body.zip,username:req.body.username,password:hash,is_lead:1};

    var collection = db.collection('customer');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});

app.post('/updatecustomer',function (req,resp) {

    var collection = db.collection('customer');
    collection.update({username: req.body.username}, {$set: {address:req.body.address,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,phone:req.body.phone,zip:req.body.zip}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //db.close();

        }
    });

});

app.get('/listexpert', function (req, resp) {


    var collection = db.collection('addexpertarea');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});

app.get('/listdealers', function (req, resp) {


    var collection = db.collection('dealers');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
/*-----------------------------------EXAMPLES_END------------------------------------------*/


/*--------------------------------------ADMIN_START--------------------------------------------*/

app.post('/addadmin',function(req,resp){
    var collection = db.collection('users');

    var crypto = require('crypto');

    /*console.log("hello,this is the answer");
     console.log(req.body);
     */
    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    var added_on=new Date();
    /*if(req.body.is_active==true){
     var is_active=1;  //1=>admin, 0=>user, 2=>aces, 3=>employee
     }
     else {
     var is_active=0;
     }*/

    collection.insert([{
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        added_time: Math.floor(Date.now() / 1000),
        status: 0,
        supradmin:0,
        type:1 //1=>admin, 0=>user
    }], function (err, result) {
        if (err) {
            console.log('error'+err);
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {


            //console.log(req.body.id);
            var smtpTransport = mailer.createTransport("SMTP", {
                service: "Gmail",
                auth: {
                    user: "itplcc40@gmail.com",
                    pass: "DevelP7@"
                }
            });

            //var link=mzsadielink+'emailverify/'+result.ops[0]._id;
            var link='http://localhost:4200/#/emailverify/'+result.ops[0]._id;
            var name=req.body.firstname+' '+req.body.lastname;
            var email=req.body.email;
            var mail = {
                from: "Admin <ipsitaghosal1@gmail.com>",
                to: req.body.email,
                //to: 'ipsita.influxiq@gmail.com',
                subject: 'Welcome to Admin Management System',
                html: '<p>Welcome '+name+' </p>'+'<P>We are please to let you know that you have been successfully registered as Admin.</p>'+'<P>Below is your login information:</p>'+'<p>Email id: '+email+'</p>'+'<p>Password: Protected due to security</p>'+'<p>Login Link: http://mzsadie.influxiq.com/#/login</p>' +
                '<p>Please click on the link below to activate your account.</p><a href="'+link+'">Click Here</a>'

                /* html: '<P>Below is your login information – Login Link: http://localhost:4200/#/login</p><p>Please click on the link below to activate your account.</p><a href="'+link+'">Click Here</a>'*/
            }

            smtpTransport.sendMail(mail, function (error, response) {
                // resp.send((response.message));
                console.log('send');
                smtpTransport.close();
            });

            /* '/editadmin',item._id*/
            console.log(result);
            resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id}));
        }
    });
});

/*
 app.post('/addadmin', function (req, resp) {

 var crypto = require('crypto');

 var secret = req.body.password;
 var hash = crypto.createHmac('sha256', secret)
 .update('password')
 .digest('hex');
 var added_on=new Date();
 if(req.body.is_active==true){
 var is_active=1;  //1=>admin, 0=>user, 2=>aces, 3=>employee
 }
 else {
 var is_active=0;
 }

 value1 = {username:req.body.username,password:hash,fname: req.body.fname,lname: req.body.lname,email:req.body.email,address:req.body.address,city:req.body.city,state:req.body.state,zip:req.body.zip, phone: req.body.phone,is_active:req.body.is_active,added_on:added_on};

 var collection = db.collection('admin');

 collection.insert([value1], function (err, result) {
 if (err) {
 resp.send(err);
 } else {
 resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

 }
 });

 });*/


app.get('/adminlist',function (req,resp) {

    var collection = db.collection('users');

    collection.find({type: 1}).toArray(function(err, items) {

        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify({'res':items}));
        }

    });

});
app.post('/admindetails',function(req,resp){
//console.log("admindetails from server.js called");
    var resitem = {};

    var collection = db.collection('users');

    var o_id = new mongodb.ObjectID(req.body._id);

    collection.find({_id:o_id}).toArray(function(err, items) {

        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            resitem = items[0];

            resp.send(JSON.stringify({'status':'success','item':resitem}));
        }
    });
    // resp.send(JSON.stringify({'status':'error','id':0}));

});



app.post('/getreply', function (req, resp) {

    var resitem = {};

    var collection = db.collection('reviewmanager');

    var o_id = new mongodb.ObjectID(req.body._id);

    collection.find({_id:o_id}).toArray(function(err, items) {

        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            resitem = items[0];

            resp.send(JSON.stringify({'status':'success','item':resitem}));
        }
    });
/*    var o_id=new mongodb.ObjectID(req.query.id);
    console.log(req.query);
    var collection = db.collection('reviewmanager');
    collection.find({_id:o_id}).toArray(function(err, items) {
        resp.send(JSON.stringify(items));
        console.log(items);
    });*/
});



app.post('/accesscodecheck', function (req, resp) {
    var collection = db.collection('users');

    console.log(req.body.email);
    console.log(req.body.accesscode);
    //console.log('SG4t67LpAGndf71V6EhiZrQuCI3mfZIE');


    collection.find({ email:req.body.email, accesscode:req.body.accesscode}).toArray(function(err, items) {
        console.log(items.length);
        if(items.length>0) {
            resp.send(JSON.stringify({'status': 'success', 'msg': ''}));

        }

        if(items.length==0){
            resp.send(JSON.stringify({'status':'error','msg':'Wrong access code'}));
            return;
        }

    });

});


app.post('/editadmin',function(req,resp){
    var collection = db.collection('users');
    //console.log("serverjs");
//console.log(req.body.id);
    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
    }

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({_id:o_id}, {$set: data}, true, true);

    resp.send(JSON.stringify({'status':'success'}));
});


app.post('/updateprofile',function(req,resp){
    var collection = db.collection('users');

    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
    }

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({_id:o_id}, {$set: data}, true, true);

    resp.send(JSON.stringify({'status':'success'}));
});


app.post('/adminlogin', function (req, resp) {
    var crypto = require('crypto');
    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    var collection = db.collection('users');

    collection.find({ email:req.body.email }).toArray(function(err, items){
        //console.log(items[0]); //admin_login details shown here
        if(items.length==0){
            resp.send(JSON.stringify({'status':'error','msg':'Username invalid...'}));
            return;
        }
        if(items.length>0 && items[0].password!=hash){
            //console.log(items[0].password); //hex
            //console.log(hash); //given password
            //console.log(req.body.password);
            resp.send(JSON.stringify({'status':'error','msg':'Password Doesnot match'}));
            return;
        }
        if(items.length>0 && items[0].status!=1){
            resp.send(JSON.stringify({'status':'error','msg':'You are Blocked..'}));
            return;
        }
        if(items.length>0 && items[0].password==hash){
            var ip = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
                console.log(ip);
                console.log(items[0].type);
                if(ip != ''){
                var collection = db.collection('ipaddress');
                collection.insert([{
                    mailid: req.body.email,
                    ipaddress: ip,
                    time: Math.floor(Date.now() / 1000),
                    type:0, //login
                }], function (err2, result2) {

                });
            }
            resp.send(JSON.stringify({'status':'success','msg':items[0]/*, 'ipadd':ip*/}));   //sending the items[0] through msg variable
            return;

        }
    });
});


app.post('/updateipaddress', function (req, resp) {
    var collection = db.collection('ipaddress');
    collection.find({ email:req.body.email }).toArray(function(err, items){
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

            collection.insert([{
                mailid: req.body.email,
                ipaddress: ip,
                time: Math.floor(Date.now() / 1000),
                type:1, //logout
            }], function (err2, result2) {

            });

        resp.send(JSON.stringify({'status':'success','msg':items[0]/*, 'ipadd':ip*/}));   //sending the items[0] through msg variable
        return;
    });
});




app.get('/ipaddress', function (req, resp) {
    var collection = db.collection('ipaddress');
    //collection.drop(function(err, items) {
    collection.find().toArray(function(err, items) {

        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify({'res':items}));
        }

    });
});
app.get('/users', function (req, resp) {
    var collection = db.collection('users');
    //collection.drop(function(err, items) {
    collection.find().toArray(function(err, items) {

        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify({'res':items}));
        }

    });
});

app.get('/reviewmanager', function (req, resp) {
    var collection = db.collection('reviewmanager');
    //collection.drop(function(err, items) {
    collection.find().toArray(function(err, items) {

        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify({'res':items}));
        }

    });
});

app.post('/forgetpassword', function (req, resp) {

    var collection = db.collection('users');
    //console.log(req.body.email);
    collection.find({ email:req.body.email }).toArray(function(err, items) {

        if(items.length>0){
            var randomstring = require("randomstring");
            var generatedcode=randomstring.generate();

            //console.log(generatedcode);
            var data = {
                accesscode: generatedcode,
            }

            collection.update({ email:req.body.email}, {$set: data}, true, true);


            var smtpTransport = mailer.createTransport("SMTP", {
                service: "Gmail",
                auth: {
                    user: "itplcc40@gmail.com",
                    pass: "DevelP7@"
                }
            });

            var mail = {
                from: "Admin <ipsitaghosal1@gmail.com>",
                to: req.body.email,
                //to: 'ipsita.influxiq@gmail.com',
                subject: 'Access code',

                html: 'Access code is given -->  '+generatedcode
            }

            smtpTransport.sendMail(mail, function (error, response) {
                // resp.send((response.message));
                console.log('send');
                smtpTransport.close();
            });
            resp.send(JSON.stringify({'status':'success','msg':req.body.email}));
        }


        if(items.length==0){
            resp.send(JSON.stringify({'status':'error','msg':'Emailid invalid...'}));
            return;
        }

    });

});

app.post('/newpassword', function (req, resp) {

    var collection = db.collection('users');
    var crypto = require('crypto');
    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
//console.log("hello");
    var data = {
        password: hash
    }
    collection.update({email:req.body.email}, {$set: data}, true, true);
    resp.send(JSON.stringify({'status': 'success', 'msg': ''}));
});


app.post('/resetpassword', function (req, resp) {
    var collection = db.collection('users');
    var crypto = require('crypto');
    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
//console.log("hello");
    var data = {
        password: hash
    }
    console.log(data);
    var o_id = new mongodb.ObjectID(req.body.userid);
    console.log(req.body.userid);
    collection.find({_id: o_id}).toArray(function (err, items) {
        console.log(items.length);
        if(items.length==0) {
            resp.send(JSON.stringify({'status': 'error', 'msg': ''}));
            return;
            // console.log(1);
        }
        else{
            collection.update({_id: o_id}, {$set: data}, true, true);

            resp.send(JSON.stringify({'status': 'success', 'msg': 'Password updated..'}));
        }
    });

});


app.post('/changepassword', function (req, resp) {
    var cryptoold = require('crypto');
    var secretold = req.body.oldpassword;
    var hashold = cryptoold.createHmac('sha256', secretold)
        .update('password')
        .digest('hex');


    var cryptonew = require('crypto');
    var secretnew = req.body.password;
    var hashnew = cryptonew.createHmac('sha256', secretnew)
        .update('password')
        .digest('hex');
    var data = {
        password: hashnew
    }

    var collection = db.collection('users');
    var o_id = new mongodb.ObjectID(req.body.id);

    collection.find({_id: o_id, password: hashold}).toArray(function (err, items) {
        // console.log(items.length);

        if(items.length==0) {
            resp.send(JSON.stringify({'status': 'error', 'msg': 'Old password doesnot match'}));
            return;
            // console.log(1);
        }
        else {

            collection.update({_id: o_id}, {$set: data}, true, true);
            resp.send(JSON.stringify({'status': 'success', 'msg': 'Password updated..'}));
        }
    });
});

app.post('/emailverify',function(req,resp){

    var crypto = require('crypto');

    var collection = db.collection('users');

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({_id:o_id}, {$set: {status:1}}, true, true);

    collection.find({_id:o_id}).toArray(function(err, items) {

        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {

            resitem = items[0];


            var time = Date.now();

            var hash = crypto.createHmac('sha256',time.toString() )
                .update('password')
                .digest('hex');

            var o_id = new mongodb.ObjectID(resitem._id);
            db.collection('users').update({_id:o_id}, {$set: {password:hash}}, true, true);

            // mailsend('useractivate',resitem.email,{});

            resp.send(JSON.stringify({'status':'success','id':resitem._id,'password':hash,'time':time}));
        }
    });


});

app.post('/deleteadmin', function (req, resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('users');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //   db.close();
        }
    });



});

app.post('/adminstatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('admin');
    collection.update({_id: o_id}, {$set: {is_active: req.body.is_active}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


});
app.post('/admincheck',function(req,resp){
    var collection=db.collection('admin');
    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    collection.find({username:req.body.username,password:hash}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //db.close();
        ///dbresults.push(items);
    });
})
/*app.post('/adminlogin', function (req, resp) {

 var resitem = {};

 var crypto = require('crypto');

 var secret = req.body.password;
 var hash = crypto.createHmac('sha256', secret)
 .update('password')
 .digest('hex');

 var collection = db.collection('users');

 collection.find({ email:req.body.email , password: hash }).toArray(function(err, items) {
 if(err){
 resp.send(JSON.stringify({'status':'error','msg':'Database error occurred! Try again.'}));
 }else{
 if(items.length == 0){
 resp.send(JSON.stringify({'status':'error','msg':'Your information is incorrect.'}));
 }else{

 resitem = items[0];

 var accesscode = makeaccesscode();

 db.collection('accesscodes').insert([{
 user_id: resitem._id,
 access_code: accesscode,
 status: 0,
 time: Math.floor(Date.now() / 1000),
 }], function (err2, result2) {
 mailsend('userverification',resitem.email,{accesscode:accesscode});
 });

 if(resitem.status == 0){
 resp.send(JSON.stringify({'status':'error','msg':'This user is not activated.'}));
 }else{
 resp.send(JSON.stringify({'status':'success','item':resitem}));
 }
 }
 }
 });



 });*/
/*app.get('/adminlist', function (req, resp) {


 var collection = db.collection('users');

 collection.find().toArray(function(err, items) {

 resp.send(JSON.stringify(items));
 });

 });*/

/*app.post('/admindell',function(req,resp){
 var collection = db.collection('users');

 var o_id = new mongodb.ObjectID(req.body.id);

 /!* collection.remove( {"_id": o_id});

 resp.send(JSON.stringify({'status':'success'}));
 *!/
 /!*collection.deleteOne({_id: o_id}, function(err, results) {
 if (err){
 resp.send("failed");
 throw err;
 }
 else {
 resp.send("success");
 //   db.close();
 }
 });*!/
 resp.send('success');

 });*/
/*--------------------------------------ADMIN_END--------------------------------------------*/


/*--------------------------------------CHECK_MAIL_START--------------------------------------------*/
app.get('/testemail4',function(req,resp){
    var smtpTransport = mailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "itplcc40@gmail.com",
            pass: "DevelP7@"
        }
    });

    var mail = {
        from: "Admin <ipsitaghosal1@gmail.com>",
        to: 'ipsita.influxiq@gmail.com',
        subject: 'password change',
        //text: "Node.js New world for me",
        html: 'Password has been changed'
    }

    smtpTransport.sendMail(mail, function (error, response) {
        // resp.send((response.message));
        console.log('send');
        smtpTransport.close();
    });
});

/*

 var smtpTransport = mailer.createTransport("SMTP", {
 service: "Gmail",
 auth: {
 user: "itplcc40@gmail.com",
 pass: "DevelP7@"
 }
 });

 var mail = {
 from: "Admin <ipsitaghosal1@gmail.com>",
 to: req.body.email,
 //to: 'ipsita.influxiq@gmail.com',
 subject: 'Access code',

 html: 'Access code is given -->  '+generatedcode
 }

 smtpTransport.sendMail(mail, function (error, response) {
 // resp.send((response.message));
 console.log('send');
 smtpTransport.close();
 });
 */

/*--------------------------------------CHECK_MAIL_END--------------------------------------------*/


app.post('/userstatcng',function(req,resp){
    var collection = db.collection('users');

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({_id:o_id}, {$set: {status:req.body.status}}, true, true);

    resp.send(JSON.stringify({'status':'success'}));
});


/*app.post('/usercheck',function(req,resp){
 var collection=db.collection('dealers');
 var crypto = require('crypto');
 var secret = req.body.password;
 var hash = crypto.createHmac('sha256', secret)
 .update('password')
 .digest('hex');

 collection.find({username:req.body.username,password:hash}).toArray(function(err, items) {

 // resp.send(JSON.stringify(items));
 //db.close();
 ///dbresults.push(items);
 });
 })*/

/*-----------------------------------Aces_Work_Start---------------------------------*/

app.post('/addaces',function(req,resp){
    //console.log("Hello");
    var collection = db.collection('users');

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    collection.insert([{
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        bio: req.body.bio,
        image: req.body.image,
        vivacityurl: req.body.vivacityurl,
        //added_time: Math.floor(Date.now() / 1000),
        type:2 //1=>admin, 0=>user, 2=>aces, 3=>employee
    }], function (err, result) {
        if (err) {
            console.log('error'+err);
            resp.send(JSON.stringify({'id':0}));
        } else {
            console.log(result);
            resp.send(JSON.stringify({'id':result.ops[0]._id}));
        }
        //console.log("Hi");
    });

});




app.post('/editaces',function(req,resp){
    var collection = db.collection('users');

    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        bio: req.body.bio,
        image:req.body.image,
        vivacityurl:req.body.vivacityurl,
    }

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({_id:o_id}, {$set: data}, true, true);

    resp.send(JSON.stringify({'status':'success'}));
});



app.post('/acesdetails',function(req,resp){
//console.log("admindetails from server.js called");
    var resitem = {};

    var collection = db.collection('users');

    var o_id = new mongodb.ObjectID(req.body._id);

    collection.find({_id:o_id}).toArray(function(err, items) {

        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            resitem = items[0];

            resp.send(JSON.stringify({'status':'success','item':resitem}));
        }
    });
    // resp.send(JSON.stringify({'status':'error','id':0}));

});


app.post('/deleteaces', function (req, resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('users');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //   db.close();
        }
    });


});

app.post('/deleteimage', function (req, resp) {
    //console.log(data);
    if (req.body.id != ''){
        var o_id = new mongodb.ObjectID(req.body.id);
        var collection = db.collection('users');

        var data = {
            image: ''
        }

        collection.update({_id: o_id}, {$set: data}, true, true);
    }

    var fs = require('fs');
    var filePath = "/home/influxiq/public_html/projects/mzsadie/uploads/" +req.body.image; // Path set //
    fs.unlinkSync(filePath);
    resp.send(JSON.stringify({'status': 'success', 'msg': ''}));


});

app.get('/aceslist',function (req,resp) {

    var collection = db.collection('users');

    collection.find({type: 2}).toArray(function(err, items) {

        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify({'res':items}));
        }

    });

});
/*-----------------------------------Aces_Work_End---------------------------------*/


/*-----------------------------------Employee_Work_Start---------------------------------*/


app.post('/addemployee',function(req,resp){
    //console.log("Hello");
    var collection = db.collection('users');

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    var added_on=new Date();
    collection.insert([{
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        designation: req.body.designation,
        note: req.body.note,
        //added_time: Math.floor(Date.now() / 1000),
        type:3 //1=>admin, 0=>user, 2=>aces, 3=>employee
    }], function (err, result) {
        if (err) {
            console.log('error'+err);
            resp.send(JSON.stringify({'id':0}));
        } else {
            var smtpTransport = mailer.createTransport("SMTP", {
                service: "Gmail",
                auth: {
                    user: "itplcc40@gmail.com",
                    pass: "DevelP7@"
                }
            });


            //var link=mzsadielink+'emailverify/'+result.ops[0]._id;
            var link='http://localhost:4200/#/emailverify/'+result.ops[0]._id;
            var name=req.body.firstname+' '+req.body.lastname;
            var email=req.body.email;
            var mail = {
                from: "Admin <ipsitaghosal1@gmail.com>",
                to: req.body.email,
                //to: 'ipsita.influxiq@gmail.com',
                subject: 'Welcome to Employee Management System',


                /*html: '<P>Below is your login information – Login Link: http://localhost:4200/#/login</p>' +
                 '<p>Please click on the link below to activate your account.</p><a href="'+link+'">Click Here</a>'*/
                html: '<p>Welcome </p>'+name +'<P>We are please to let you know that you have been successfully registered as an Employee.</p>'+'<P>Below is your login information:</p>'+'<p>Email id: </p>'+email+'<p>Password: Protected due to security</p>'+'<p>Login Link: http://mzsadie.influxiq.com/#/login</p>' +
                '<p>Please click on the link below to activate your account.</p><a href="'+link+'">Click Here</a>'



            }

            smtpTransport.sendMail(mail, function (error, response) {
                // resp.send((response.message));
                console.log('send');
                smtpTransport.close();
            });
            resp.send(JSON.stringify({'id':result.ops[0]._id}));
        }
        //console.log("Hi");
    });

});


app.get('/employeelist',function (req,resp) {

    var collection = db.collection('users');

    collection.find({type: 3}).toArray(function(err, items) {

        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            console.log(items.length);
            resp.send(JSON.stringify({'res':items}));
        }

    });

});

app.post('/deleteemployee', function (req, resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('users');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");

        }
    });


});

app.post('/editemployee',function(req,resp){
    var collection = db.collection('users');

    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        designation: req.body.designation,
        note:req.body.note,
    }

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({_id:o_id}, {$set: data}, true, true);

    resp.send(JSON.stringify({'status':'success'}));
});


app.post('/employeedetails',function(req,resp){
//console.log("admindetails from server.js called");
    var resitem = {};

    var collection = db.collection('users');

    var o_id = new mongodb.ObjectID(req.body._id);

    collection.find({_id:o_id}).toArray(function(err, items) {

        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            resitem = items[0];

            resp.send(JSON.stringify({'status':'success','item':resitem}));
        }
    });
    // resp.send(JSON.stringify({'status':'error','id':0}));

});

app.get('/viewlogindetails', function (req, resp) {
    var collection1 = db.collection('users');
    var collection = db.collection('users').aggregate([

        { "$match": { "type": 3 } },
        {
            $lookup: {
                from: "ipaddress",
                localField: "email",
                foreignField: "mailid",
                as: "Userlogindata"
            }
        },
        /*{$match:{"Userlogindata._id":new mongodb.ObjectID('591d68b3957b8c55328d5cc3')}},*/
        { "$unwind": "$Userlogindata" },
        {$match:{"Userlogindata.type":0}},


    ]);
    collection.toArray(function (err, items) {
        resp.send(JSON.stringify(items));

    });
});




app.get('/settimein', function (req, resp) {
    var o_id=new mongodb.ObjectID(req.query.id);
    console.log("is this id?");
console.log(o_id);
    var collection1 = db.collection('users');
    var collection = db.collection('users').aggregate([
        { "$match": { "type": 3 } },
        {
            $lookup: {
                from: "ipaddress",
                localField: "email",
                foreignField: "mailid",
                as: "Userlogindata"
            }
        },

        { "$unwind": "$Userlogindata" },
        {$match:{"Userlogindata.type":0}},
        {$match:{"Userlogindata._id":o_id}},

    ]);
    collection.toArray(function (err, items) {
        console.log(items);
        resp.send(JSON.stringify(items));


    });
});

app.get('/settimeout', function (req, resp) {
    var o_id=new mongodb.ObjectID(req.query.id);
    console.log("is this id?");
console.log(o_id);
    var collection1 = db.collection('users');
    var collection = db.collection('users').aggregate([
        { "$match": { "type": 3 } },
        {
            $lookup: {
                from: "ipaddress",
                localField: "email",
                foreignField: "mailid",
                as: "Userlogindata"
            }
        },

        { "$unwind": "$Userlogindata" },
        {$match:{"Userlogindata.type":1}},
        {$match:{"Userlogindata._id":o_id}},

    ]);
    collection.toArray(function (err, items) {
        console.log(items);
        resp.send(JSON.stringify(items));


    });
});

app.post('/setouttimeofemployee',function(req,resp){

    var collection = db.collection('settimeofemployee');

    collection.insert([{

        indate: req.body.indate,
        intime: req.body.intime,
        id:  new mongodb.ObjectId(req.body.id),
        type: 1 //logout_time

    }], function (err, result) {
        if (err) {
            //console.log('error'+err);
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            //console.log(result);
            resp.send(JSON.stringify(result));
        }
    });

});

app.post('/setintimeofemployee',function(req,resp){

    var collection = db.collection('settimeofemployee');

    collection.insert([{

        indate: req.body.indate,
        intime: req.body.intime,
        id:  new mongodb.ObjectId(req.body.id),
        type: 0 //login_time

    }], function (err, result) {
        if (err) {
            //console.log('error'+err);
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            //console.log(result);
            resp.send(JSON.stringify(result));
        }
    });

});

app.get('/settimeofemployee', function (req, resp) {
    var collection = db.collection('settimeofemployee');
    //collection.drop(function(err, items) {
    collection.find().toArray(function(err, items) {

        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify(items));
        }

    });
});




app.get('/viewloginouttime', function (req, resp) {
   // var collection = db.collection('settimeofemployee');

    var collection = db.collection('users').aggregate([
        { "$match": { "type": 3 } },

        {
            $lookup: {
                from: "settimeofemployee",
                localField: "_id",
                foreignField: "id",
                as: "Userloginouttime"
            }
        },
        { "$unwind": "$Userloginouttime" },
    ]);
    collection.toArray(function (err, items) {
        resp.send(JSON.stringify(items));

    });
});




app.get('/viewlogouthistory', function (req, resp) {
    var collection1 = db.collection('users');
    var collection = db.collection('users').aggregate([
        { "$match": { "type": 3 } },

        {
            $lookup: {
                from: "ipaddress",
                localField: "email",
                foreignField: "mailid",
                as: "Userlogindata"
            }
        },
        { "$unwind": "$Userlogindata" },
        {$match:{"Userlogindata.type":1}},
    ]);
    collection.toArray(function (err, items) {
        resp.send(JSON.stringify(items));

    });
});

app.post('/getlogindetails', function (req, resp) {
    var resitem = {};
    var o_id = new mongodb.ObjectID(req.body._id);
    var o_type= req.body.type;
    console.log(o_type);
    console.log(o_id);
    var collection = db.collection('users');

    collection.find({_id:o_id}).toArray(function(err, items) {
        resitem = items[0].email;
        console.log(resitem);
        var collection = db.collection('ipaddress');
        collection.find({mailid: resitem, type: o_type}).toArray(function (err, items) {
            if (err) {
                console.log("under error");
                resp.send(JSON.stringify({'status': 'error', 'id': 0}));
            } else {
                console.log(items);
                resp.send(JSON.stringify({'status': 'success', 'msg': items}));
                return;
            }
        });
    });
});


app.post('/addreviewdetails',function(req,resp) {
/*
     collection.find({employeeid:o_idadmin}).toArray(function(err, items) {

     if (err) {
     resp.send(JSON.stringify({'status':'error','id':0}));
     } else {
     resitem = items;
     //resitem1 = items[0].reviewedby;
     console.log("hi");
     console.log(resitem);
     resp.send(JSON.stringify({'status':'success','item':resitem}));
     }
     });
     */
    var collection1 = db.collection('users');
    var o_idadmin = new mongodb.ObjectID(req.body._idadmin);
    /*    collection1.find({_id:o_idadmin}).toArray(function(err, items) {
     resitem2 = items;
     resitem3 = items[0].firstname+' '+items[0].lastname;
     console.log("name");
     console.log(resitem3);

     // console.log(resitem1);
     });*/


    var collection = db.collection('reviewmanager');
    var data = {
        review:req.body.review,
    }
    collection.insert([{
        review:req.body.review,
        //reviewedby: req.body._idadmin,
        //employeeid: req.body._idemp,
        reviewedby:  new mongodb.ObjectId(req.body._idadmin),
        employeeid:  new mongodb.ObjectId(req.body._idemp),



        //employeename: resitem3,
        time: Math.floor(Date.now() / 1000),
        parent: 0,
    }], function (err, result) {
        if (err) {
            console.log('error'+err);
            resp.send(JSON.stringify({'id':0}));
        } else {
            resp.send(JSON.stringify({'id':result.ops[0]._id}));
        }
    });
});
app.post('/addreplydetails',function(req,resp) {

    var collection1 = db.collection('users');
    var o_idadmin = new mongodb.ObjectID(req.body._idadmin);
    var collection = db.collection('reviewmanager');
    var data = {
        review:req.body.reply,
    }
    /*console.log("hi");
    console.log(req.body.employeeid);*/
    collection.insert([{
        review:req.body.reply,
        reviewedby:  new mongodb.ObjectId(req.body._idadmin),
        employeeid: new mongodb.ObjectId(req.body.employeeid),
        time: Math.floor(Date.now() / 1000),
        parent: new mongodb.ObjectId(req.body._idrev),
    }], function (err, result) {
        if (err) {
            console.log('error'+err);
            resp.send(JSON.stringify({'id':0}));
        } else {
            resp.send(JSON.stringify({'id':result.ops[0]._id}));
        }
    });
});

app.get('/reviewdetail', function (req, resp) {
    //var collection = db.collection('users');
    var collection = db.collection('reviewmanager');
    //collection.drop(function(err, items) {
    collection.find().toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify({'res':items}));
        }

    });
});








app.get('/getreviewdetailsbyemployeeid', function (req, resp) {
    var resitem = {};
    var resitem1 = {};
    //var collection = db.collection('reviewmanager');
    var o_id = new mongodb.ObjectID(req.body._id);

    var collection=db.collection('reviewmanager').aggregate([
        //{ "$unwind": "$employeeid" },
        { "$match": { "employeeid": "59143a2012d0999d53b0a12b" } },
        {
            $lookup : {
                from: "users",
                localField: "new mongodb.ObjectID(employeeid)",
                foreignField: "new mongodb.ObjectID(_id)",
                as: "Userdata"
            }
        },
        // Unwind the result arrays ( likely one or none )
        { "$unwind": "$Userdata" },
        {$match:{"Userdata._id":new mongodb.ObjectID('59143a2012d0999d53b0a12b')}},
        {
            $lookup : {
                from: "users",
                localField: "new mongodb.ObjectID(reviewedby)",
                foreignField: "new mongodb.ObjectID(_id)",
                as: "reviewedbydata"
            }
        },
        { "$unwind": "$reviewedbydata" },

        
        //{ $out: 'reviewmanager' }
        // Group back to arrays
       // { "$group": {
           // "_id": "$_id",
            //"employeeid": { "$push": "$employeeid" },
            //"Userdata": { "$push": "$Userdata" }
        //}},


    ]);
    console.log("inside server");

    collection.toArray(function(err, items) {
        console.log(JSON.stringify(items));

        resp.send(JSON.stringify(items));

    });
});


/*app.get('/getreviewdetails', function (req, resp) {

    //var collection = db.collection('reviewmanager');

    //var o_id = new mongodb.ObjectID(req.body._id);

    var collection=db.collection('reviewmanager').aggregate([
        //{ "$unwind": "$employeeid" },
        //{ "$match": { "employeeid": "59143a2012d0999d53b0a12b" } },
        { "$match": { "parent": 0 } },

        {
            $lookup : {
                from: "users",
                localField: "employeeid",
                foreignField: "_id",
                as: "Userdata"
            }
        },

        // Unwind the result arrays ( likely one or none )
        //{ "$unwind": "$Userreviewdata" },

        {
            $lookup : {
                from: "users",
                localField: "reviewedby",  //localfield of reviewmanager db
                foreignField: "_id",       //foreignfield of users db
                as: "Userreviewdatadata"
            }
        },
        {
            $lookup : {
                from: "reviewmanager",
                localField: "_id",
                foreignField: "parent",
                as: "Reviewdata"
            }
        },


        /!*{
            $lookup : {
                from: "users",
                localField: "new mongodb.ObjectID(reviewedby)",
                foreignField: "new mongodb.ObjectID(_id)",
                as: "reviewedbydata"
            }
        },
        { "$unwind": "$reviewedbydata" },*!/

        //{$match:{"Userdata._id":new mongodb.ObjectID('59143a2012d0999d53b0a12b')}}

        //{ $out: 'reviewmanager' }
        // Group back to arrays
       // { "$group": {
           // "_id": "$_id",
            //"employeeid": { "$push": "$employeeid" },
            //"Userdata": { "$push": "$Userdata" }
        //}},

        { "$unwind": "$Userreviewdatadata" },
        { "$unwind": "$Userdata" },
       /!* { "$unwind": "$Reviewdata" },*!/
    ]);
    console.log("inside server");
/!*    collection.toArray(function(err, items) {
        resp.send(JSON.stringify(items));

    });*!/

    collection.toArray(function(err, items) {
            resp.send(JSON.stringify(items));
            //console.log(items);

    });

});*/
app.get('/getreviewdetails', function (req, resp) {

    var collection=db.collection('reviewmanager').aggregate([
        {
            $lookup : {
                from: "users",
                localField: "employeeid",
                foreignField: "_id",
                as: "Userdata"
            }
        },
        {
            $lookup : {
                from: "users",
                localField: "reviewedby",
                foreignField: "_id",
                as: "Userreviewdatadata"
            }
        },
        { "$unwind": "$Userreviewdatadata" },
        { "$unwind": "$Userdata" },
    ]);
    console.log("inside server");
    collection.toArray(function(err, items) {
        resp.send(JSON.stringify(items));
    });
});


app.get('/getreviewofemployee', function (req, resp) {
    var resitem = {};
    var resitem1 = {};
    var o_id=new mongodb.ObjectID(req.query.id);
    var parentvalue=0;
    console.log(req.query);

    var collection=db.collection('reviewmanager').aggregate([
        { "$match": { "employeeid": o_id } },
        { "$match": { "parent": parentvalue } },
        {
            $lookup : {
                from: "users",
                localField: "employeeid",
                foreignField: "_id",
                as: "Userdata"
            }
        },

        {
            $lookup : {
                from: "users",
                localField: "reviewedby",
                foreignField: "_id",
                as: "Userreviewdatadata"
            }
        },

    ]);
    console.log("inside server");
    collection.toArray(function(err, items) {
        resp.send(JSON.stringify(items));
    });
});



/*-----------------------------------Employee_Work_End---------------------------------*/

/*-----------------------------------URL_UPDATE_START---------------------------------*/
/*app.get('/autourlupdate',function(req,resp){

 var url = 'http://www.radiologyimagingcenters.com/client.list.do';            //we have to import data from this link

 setTimeout(function () {
 console.log("inside autourlupdate");
 geturllist(url); //send the url to the function
 },500)


 resp.send(JSON.stringify({'status': 'success', 'msg': ''}));


 });*/


function geturllist(url){

    request(url, function(error2, response, html2){                    //before using this request declare this and install request using npm
        if(!error2) {
            var $ = cheerio.load(html2);                //assigning the html of full page to $ variable
            var states;
            states=$('#state').find('option').each(function () {             //show all values of state and bind every value to url using loop

                var link1='http://www.radiologyimagingcenters.com/client.list.do?state='+$(this).attr('value');
                setTimeout(function () {
                    getpagedetail(link1);
                },500);

            });

        }
        else {
            console.log("inside geturllist");
            console.log('in error  :'+error2);
        }

    });
}


function getpagedetail(link1){

    request(link1, function(error2, response, html2){

        if(!error2) {
            var $ = cheerio.load(html2);
            var links;
            links=$('table.table-condensed').find('tr').find('td').find('a').each(function () {    //from that link catch the table using the class

                var link1='http://www.radiologyimagingcenters.com/'+$(this).attr('href'); //link of each a href tag
                setTimeout(function () {
                    getdetaildata(link1);
                },500);

            });

        }
        else{
            console.log("inside getpagedetail");
            console.log('in error  :'+error2);
        }

    });
}

function getdetaildata(link1) {

    //console.log(link1);
    request(link1, function(error2, response, html2) {
        var value1={};

        if (!error2) {
            var $ = cheerio.load(html2);
            var links;
            console.log($('h1').html()); //heading of the page
            value1['name']=null;
            value1['name']=$('h1').html();
            value1['url']=null;
            value1['url']=link1;

            links = $('form').find('label').each(function () { //inside the formm tag find label
                console.log("label");
                console.log($(this).text());
                console.log("value");
                console.log($(this).next().text());
                value1[$(this).text()]=null;
                value1[$(this).text()]=$(this).next().text();
            });


            var collection = db.collection('urls');

            collection.insert([value1], function (err, result) {
                if (err) {
                    //resp.send(err);
                } else {
                    //resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

                }
            });

        }
        else{
            console.log("inside getdetaildata");
            console.log('in error:'+error2);
        }
    });
}


app.get('/urllist',function (req,resp) {

    var collection = db.collection('urls');

    collection.find().toArray(function(err, items) {

        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify(items));


        }

    });

});


var state;

app.get('/gplist',function(req,resp){

    //var url = 'http://www.wellness.com/find/cardiologist';
    var url ='http://www.wellness.com/find/general%20practitioner';
    var mainurl = 'http://www.wellness.com/';            //we have to import data from this link
    var statecityarr=new Array();
    var statecity=new Object();
    var state;
    request(url, function(error2, response, html2){                    //before using this request declare this and install request using npm
        if(!error2) {
            var $ = cheerio.load(html2);                //assigning the html of full page to $ variable
            //var states;

            $('.find-item-container').eq(41).each(function () {             //show all values of state and bind every value to url using loop

                state=$(this).find('a').find('h2').html();
                $(this).find('ul').find('li').each(function () {

                    statecity.state=state;
                    statecity.city=$(this).find('a').html();
                    statecity.listurl=mainurl+$(this).find('a').attr('href');
                    statecityarr.push(statecity);
                    fetchdata(statecity,1);
                    fetchdata(statecity,2);
                    fetchdata(statecity,3);
                    fetchdata(statecity,4);
                    fetchdata(statecity,5);
                    fetchdata(statecity,6);
                    fetchdata(statecity,7);
                    fetchdata(statecity,8);
                    fetchdata(statecity,9);
                    fetchdata(statecity,10);
                    fetchdata(statecity,11);
                    fetchdata(statecity,12);
                    fetchdata(statecity,13);
                    fetchdata(statecity,14);
                    fetchdata(statecity,15);
                    fetchdata(statecity,16);
                    fetchdata(statecity,17);
                    fetchdata(statecity,18);
                })

                //console.log($(this).find('h2').html());
                //console.log(JSON.stringify(statecityarr));


            });

        }
        else {
            console.log("inside geturllist");
            console.log('in error  :'+error2);
        }

    });

    setTimeout(function () {
        resp.send(JSON.stringify(statecityarr));
    },3000);



});
var urlcounter=0;

function  fetchdata(obj,pageno) {

//console.log(obj);
    var mainurl = 'http://wellness.com';
    var url=obj.listurl;
    if(pageno>1) url=obj.listurl+'/'+pageno;
    request(url, function(error2, response, html2) {                    //before using this request declare this and install request using npm
        if (!error2) {
            var $ = cheerio.load(html2);                //assigning the html of full page to $ variable
            //var states;

            $('.categories-list').find('li').each(function () {             //show all values of state and bind every value to url using loop



                //console.log(mainurl+$(this).attr('onclick').toString().replace("parent.location=","").replace("'","").replace("'",""));
                var actualurl=(mainurl+$(this).attr('onclick').toString().replace("parent.location=","").replace("'","").replace("'",""));
                //console.log($(this).html());
                //console.log(JSON.stringify(statecityarr));

                setTimeout(function () {

                    if(urlcounter<500)fetchdoctordata(obj,actualurl);
                    urlcounter++;
                    //fetchdoctordata(obj,actualurl);
                    //return;
                },2500);

            });

        }
        else {
            console.log("inside fetchdata");
            console.log('in error  :' + error2);
        }
    });

}

function  fetchdocdata(obj,actualurl) {

    //console.log(obj);
    console.log(urlcounter++);
    //console.log(actualurl);
    var mainurl = 'http://www.wellness.com/';
    var url=mainurl+'#referrer';
    obj._id=url;
    console.log(url);
   /* var collection = db.collection('generaldoctorurllist');

    collection.insert([obj], function (err, result) {
        if (err) {
            //resp.send(err);
            console.log("in error -- :"+err);
        } else {
            console.log('insert completed');
            //resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });*/
    //if(pageno>1) url=obj.listurl+'/'+pageno;
    request(url, function(error3, response, html3) {                    //before using this request declare this and install request using npm
        if (!error3) {
            var $ =cheerio.load(html3);                //assigning the html of full page to $ variable
            //var states;
            console.log(html3);
            console.log($('.listing-org-name').text());
            obj.docname=$('.listing-org-name').text();
            obj.docphone=$('.office-phone').text();
            obj.docaddress=$('.office-address').text();
            obj.docabout=$('.listing-about').text();
            obj.docservice=$('.availableService').text();
            obj.docsadditionalservice=$('.additional-services-textç').text();
            obj.docurl=actualurl;
            //obj._id=actualurl;

           /* var collection = db.collection('gendoclist');

            collection.find({_id: actualurl}).toArray(function(err, items) {

                if (err) {
                    console.log(err);
                    //resp.send(JSON.stringify({'res':[]}));
                } else {
                    //resp.send(JSON.stringify({'res':items}));
                    console.log(items.length);
                    if(items.length==0) savedocdata(obj);
                }

            });*/
            console.log(obj);
            savedocdata(obj);




        }
        else {
            console.log("inside fetchdocdata");

            console.log('in error  :' + error3);
        }
    });

}

var objg=new Object();
function  fetchdoctordata(obj,actualurl) {

    objg=obj;
    var url = actualurl;            //we have to import data from this link
    var url = 'http://localhost:3001/particulardocdata?url='+url+'&state='+obj.state+'&city='+obj.city;            //we have to import data from this link
    console.log(url);
    request(url, function(error2, response, html2){                    //before using this request declare this and install request using npm
        if(!error2) {
            var $ = cheerio.load(html2);                //assigning the html of full page to $ variable
            //var states;
            //console.log('in html ... ');
            //console.log(html2);

        }
        else {
            console.log("inside particulardocdata");
            console.log('in error  :'+error2);
        }

    });

}

function savedocdata(obj) {
    var collection = db.collection('generaldoctorlist');

    collection.insert([obj], function (err, result) {
        if (err) {
            //resp.send(err);
            console.log("in error -- :"+err);
        } else {
            console.log('insert completed');
            //resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

}


var updatecounter=0;

app.get('/particulardocdata',function(req,resp){

    var url = req.query.url;            //we have to import data from this link
    console.log(url);
    var mainurl = 'http://www.wellness.com/';
    request(url, function(error2, response, html2){                    //before using this request declare this and install request using npm
        if(!error2) {
            var $ = cheerio.load(html2);                //assigning the html of full page to $ variable
            //var states;
            //console.log('in html ... ');
            //console.log(html2);

            //obj=req.query.obj;
            //console.log('ofifce phone');
            //console.log($("h4[itemprop='telephone']").html());
            var obj=new Object();
            obj.docnamehead=$("h1[itemprop='name']").html();
            obj.docname=$('.listing-org-name').html();
            obj.docphone=$("h4[itemprop='telephone']").html();
            obj.docaddress=$('.office-address').html();
            obj.docabout=$('.listing-about').html();
            obj.docservice=$('.availableService').html();
            obj.phoneurl=$('#directions_tab').find('a').attr('href');
            obj.docsadditionalservice=$('.additional-services-textç').html();
            obj._id=url;
            obj.state=req.query.state;
            obj.city=req.query.city;
            //console.log(obj);


            var collection = db.collection('generaldoctorlist');

            collection.insert([obj], function (err, result) {
                if (err) {
                    //resp.send(err);
                    console.log("in error -- :"+err);
                } else {
                    console.log('insert completed');
                    console.log(result);
                    updatephone(mainurl,obj);




                    //resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

                }
            })

        }
        else {
            console.log("inside particulardocdata");
            console.log('in error  :'+error2);
        }

    });

    setTimeout(function () {
        resp.send((url));
    },3000);



});

function updatephone(mainurl,obj) {

    request(mainurl+obj.phoneurl, function(error21, response1, html21){                    //before using this request declare this and install request using npm
        if(!error21) {
            var $ = cheerio.load(html21);                //assigning the html of full page to $ variable
            //var states;
            console.log('in doc update phone ... ');

            var docphone=$("span[itemprop='telephone']").html();
            console.log(docphone);
            console.log(obj._id);
            console.log(updatecounter++);
            var collection = db.collection('generaldoctorlist');
            collection.update({_id: obj._id}, {$set: {docphone:docphone}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else {


                    //resp.send("success");
                    //db.close();

                }
            });

        }
        else {
            console.log("inside particulardocdata");
            console.log('in error  :'+error2);
        }

    });

}

/*-----------------------------------URL_UPDATE_END---------------------------------*/


app.get('/getusastates',function (req,resp) {


    var usastates=[
        {
            "name": "Alabama",
            "abbreviation": "AL"
        },
        {
            "name": "Alaska",
            "abbreviation": "AK"
        },
        {
            "name": "American Samoa",
            "abbreviation": "AS"
        },
        {
            "name": "Arizona",
            "abbreviation": "AZ"
        },
        {
            "name": "Arkansas",
            "abbreviation": "AR"
        },
        {
            "name": "California",
            "abbreviation": "CA"
        },
        {
            "name": "Colorado",
            "abbreviation": "CO"
        },
        {
            "name": "Connecticut",
            "abbreviation": "CT"
        },
        {
            "name": "Delaware",
            "abbreviation": "DE"
        },
        {
            "name": "District Of Columbia",
            "abbreviation": "DC"
        },
        {
            "name": "Federated States Of Micronesia",
            "abbreviation": "FM"
        },
        {
            "name": "Florida",
            "abbreviation": "FL"
        },
        {
            "name": "Georgia",
            "abbreviation": "GA"
        },
        {
            "name": "Guam",
            "abbreviation": "GU"
        },
        {
            "name": "Hawaii",
            "abbreviation": "HI"
        },
        {
            "name": "Idaho",
            "abbreviation": "ID"
        },
        {
            "name": "Illinois",
            "abbreviation": "IL"
        },
        {
            "name": "Indiana",
            "abbreviation": "IN"
        },
        {
            "name": "Iowa",
            "abbreviation": "IA"
        },
        {
            "name": "Kansas",
            "abbreviation": "KS"
        },
        {
            "name": "Kentucky",
            "abbreviation": "KY"
        },
        {
            "name": "Louisiana",
            "abbreviation": "LA"
        },
        {
            "name": "Maine",
            "abbreviation": "ME"
        },
        {
            "name": "Marshall Islands",
            "abbreviation": "MH"
        },
        {
            "name": "Maryland",
            "abbreviation": "MD"
        },
        {
            "name": "Massachusetts",
            "abbreviation": "MA"
        },
        {
            "name": "Michigan",
            "abbreviation": "MI"
        },
        {
            "name": "Minnesota",
            "abbreviation": "MN"
        },
        {
            "name": "Mississippi",
            "abbreviation": "MS"
        },
        {
            "name": "Missouri",
            "abbreviation": "MO"
        },
        {
            "name": "Montana",
            "abbreviation": "MT"
        },
        {
            "name": "Nebraska",
            "abbreviation": "NE"
        },
        {
            "name": "Nevada",
            "abbreviation": "NV"
        },
        {
            "name": "New Hampshire",
            "abbreviation": "NH"
        },
        {
            "name": "New Jersey",
            "abbreviation": "NJ"
        },
        {
            "name": "New Mexico",
            "abbreviation": "NM"
        },
        {
            "name": "New York",
            "abbreviation": "NY"
        },
        {
            "name": "North Carolina",
            "abbreviation": "NC"
        },
        {
            "name": "North Dakota",
            "abbreviation": "ND"
        },
        {
            "name": "Northern Mariana Islands",
            "abbreviation": "MP"
        },
        {
            "name": "Ohio",
            "abbreviation": "OH"
        },
        {
            "name": "Oklahoma",
            "abbreviation": "OK"
        },
        {
            "name": "Oregon",
            "abbreviation": "OR"
        },
        {
            "name": "Palau",
            "abbreviation": "PW"
        },
        {
            "name": "Pennsylvania",
            "abbreviation": "PA"
        },
        {
            "name": "Puerto Rico",
            "abbreviation": "PR"
        },
        {
            "name": "Rhode Island",
            "abbreviation": "RI"
        },
        {
            "name": "South Carolina",
            "abbreviation": "SC"
        },
        {
            "name": "South Dakota",
            "abbreviation": "SD"
        },
        {
            "name": "Tennessee",
            "abbreviation": "TN"
        },
        {
            "name": "Texas",
            "abbreviation": "TX"
        },
        {
            "name": "Utah",
            "abbreviation": "UT"
        },
        {
            "name": "Vermont",
            "abbreviation": "VT"
        },
        {
            "name": "Virgin Islands",
            "abbreviation": "VI"
        },
        {
            "name": "Virginia",
            "abbreviation": "VA"
        },
        {
            "name": "Washington",
            "abbreviation": "WA"
        },
        {
            "name": "West Virginia",
            "abbreviation": "WV"
        },
        {
            "name": "Wisconsin",
            "abbreviation": "WI"
        },
        {
            "name": "Wyoming",
            "abbreviation": "WY"
        }
    ];

    resp.send(usastates);

});



var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    //  console.log("Example app listening at http://%s:%s", host, port)

})