var express= require('express');
var appex=express();

appex.set('view engine','ejs');
appex.use('/assets',express.static('assets'));
const path=require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/INVIGILATION',{useNewUrlParser:true});

var criteriaschema = new mongoose.Schema({
      type:String,
      profcontri :Number,
      asspcontri : Number,
      astpcontri :Number,
      buffer_per_slot : Array 

});


var teacherSchema= new mongoose.Schema({
  UNAME:String,
  SDRN:String,
  DEPT:String,
  DESIG:String,
  DUTIES:Number,
  REG_COUNT:0,
  KT_COUNT:0,
  
});


var timetableSchema= new mongoose.Schema({
  
  exam:String,
  exdate:String,
  blocks:Number,
  examtype:String
});

var semester_timetableSchema= new mongoose.Schema({
  
  exam:String,
  exdate:String,
  blocks:Array,
  //morning_blocks:Number,
  //evening_blocks:Number,
  examtype:String
});

var ut_timetableSchema= new mongoose.Schema({
  
  exam:String,
  exdate:String,
  blocks:Array
  
});




var professorschema= new mongoose.Schema({
  UNAME:String,
  SDRN:String,
  DEPT:String,
  DESIG:String,
  DUTIES:Number,
  REG_COUNT:0,
  KT_COUNT:0,
  
});

var asstprofessorschema= new mongoose.Schema({
  UNAME:String,
  SDRN:String,
  DEPT:String,
  DESIG:String,
  DUTIES:Number,
  REG_COUNT:0,
  KT_COUNT:0,
  
});

var assoprofessorschema= new mongoose.Schema({
  UNAME:String,
  SDRN:String,
  DEPT:String,
  DESIG:String,
  DUTIES:Number,
  REG_COUNT:0,
  KT_COUNT:0,
  
});

var selected_time_table=new mongoose.Schema({
  date_of_exam:String,
  DEPT:String,
  teacher:String,
  type:String,
  SDRN:String
})




var model_prof= mongoose.model('PROFESSOR',professorschema);
var model_astp= mongoose.model('ASSISTANT-PROFESSOR',asstprofessorschema);
var model_asap= mongoose.model('ASSOCIATIVE-PROFESSOR',assoprofessorschema);
var selections= mongoose.model('SELECTED TEACHERS',selected_time_table);



var model_teacher= mongoose.model('TEACHER-DETAILS',teacherSchema);

var model_time_table= mongoose.model('TIME-TABLE',timetableSchema);

var semester_model_time_table= mongoose.model('SEMESTER-TIME-TABLE',semester_timetableSchema);
var ut_model_time_table= mongoose.model('UT-TIME-TABLE',ut_timetableSchema);

var criteria= mongoose.model('CRITERIA',criteriaschema);


appex.post('/criteria',urlencodedParser,(req,res)=>{
  
  console.log(req.body.type)

  criteria.countDocuments({type:req.body.type},(err,data)=>{

    console.log(data)

          
          var Blocks=[];
          Blocks.push(parseInt(req.body.buffer[0]));
            
          if(req.body.type=="SEM") {
            Blocks.push(parseInt(req.body.buffer[1]));
            
          }  
          


          var obj={
            type:req.body.type,
              profcontri :parseInt(req.body.contriprof),
              asspcontri : parseInt(req.body.contriassp),
              astpcontri :parseInt(req.body.contriasst),
              buffer_per_slot : Blocks
          }

          console.log(obj,data)
          
      if(data!=0){
              criteria.updateMany({type:req.body.type},obj,()=>{console.log("UPDATED")})
      }
      else{
          
             criteria(obj).save(()=>{console.log("CRITERIA ADDED")})

      }

  })      



  

})



appex.post('/login_submit',urlencodedParser,function(req,res){
 
  console.log(req.body)
  if("12345"==req.body.pass && req.body.sdrn=="12345")
  {
    res.redirect('/home')
   }
   if("12345"!=req.body.pass | req.body.sdrn!="12345")
   res.render("login",{status:"failure"})
  
})

appex.get('/view',function(req,res){
  res.render("view")
})

appex.get('/login',function(req,res){
  res.render('login')
})

appex.get('/teacher',function(req,res){
     res.render('teacher');
});


appex.get('/view/:id',function(req,res){
  console.log(req.params.id)
  
});

appex.get('/time_ut',function(req,res){
  res.render('time_ut');
  
});

appex.get('/duties_input',function(req,res){
  res.render('duties_input');
  
});

appex.get('/display_chart/:id',function(req,res){

  console.log(req.params.id,typeof(req.params.id))
  var timetable;
  if(req.params.id=="ut")
        timetable=ut_model_time_table;
  else 
        timetable=semester_model_time_table;
  

  model_prof.find({},(professors)=>{

    model_asap.find({},(associates)=>{

      model_astp.find({},(assistants)=>{

        timetable.find({},(timetable)=>{

          console.log("professors",professors,"\n");
          console.log("associates",associates,"\n");
          console.log("assistants",assistants,"\n");
          console.log("timetable",timetable,"\n");
          

          res.render('display_chart',{professors,assistants,associates,timetable});
 
        }).sort({"exdate":1})

      })

    })

  })



  
});

appex.get('/requirement',(req,res)=>{

  model_prof.find({},(err,professors)=>{

        model_astp.find({},(err,assistants)=>{

            model_asap.find({},(err,associates)=>{

                      
                                                                                          
                                              selections.find({},(err,selections)=>{
                                                if(err) throw err;
                                                res.render('requirement',{professors,assistants,associates,selections});
                                              })
  
              
              
            })
          
        })

    
  })  

 
});



appex.get('/time',function(req,res){
        res.render('time');
});

appex.post('/time',urlencodedParser,function(req,res){
          var obj={
                exam:req.body.exam,
                exdate:req.body.exdate,
                blocks:parseInt(req.body.blocks),
                examtype:req.body.examtype
          }

          model_time_table.find({exdate:req.body.exdate},function(err,data){
            console.log(data.length)
            if(err) throw err;
            if(data.length==0)
                 model_time_table(obj).save(function(err,data){
                   console.log("TIMETABLE-SUCCESS")

                   res.redirect('/time')
                 })
            else
                  {
                    console.log("TIMETABLE-UNSUCCESS")
                    res.redirect('/time')
                  }
              
          })
});


appex.post('/time/semester',urlencodedParser,function(req,res){
          
     req.body.blocks[0]=parseInt(req.body.blocks[0])
      req.body.blocks[1]=parseInt(req.body.blocks[1])
      var obj={
                exam:req.body.exam,
                exdate:req.body.exdate,
                blocks:req.body.blocks,
                //blocks[1]:parseInt(req.body.blocks[1])
                //morning_blocks:parseInt(req.body.morning_blocks),
                //evening_blocks:parseInt(req.body.evening_blocks),
                examtype:req.body.examtype
          }
          console.log(req.body)
          semester_model_time_table.find({exdate:req.body.exdate},function(err,data){
            console.log(data.length)
            if(err) throw err;
            if(data.length==0)
                 semester_model_time_table(obj).save(function(err,data){
                   console.log("SEMESTER-SUCCESS")

                   res.redirect('/time')
                 })
            else
                  {
                    console.log("SEMESTER-UNSUCCESS")
                    res.redirect('/time')
                  }
              
          })
});

appex.post('/time/ut',urlencodedParser,function(req,res){
          console.log(req.body)
          for(var i=0;i<req.body.blocks.length;i++)
          {
            req.body.blocks[i]=parseInt(req.body.blocks[i])
          }

          var obj={
                exam:req.body.exam,
                exdate:req.body.exdate,
                blocks:req.body.blocks
          }

          
          ut_model_time_table.find({exdate:req.body.exdate},function(err,data){
            console.log(data.length)
            if(err) throw err;
            if(data.length==0)
                 ut_model_time_table(obj).save(function(err,data){
                   console.log("UT-SUCCESS")

                   res.redirect('/time')
                 })
            else
                  {
                    console.log("UT-UNSUCCESS")
                    res.redirect('/time')
                  }
              
          })
});









appex.post('/teacher',urlencodedParser,function(req,res){


      
    model_teacher.countDocuments({SDRN:req.body.SDRN},function(err,data){
          if (err) throw err;
          console.log(data)
          if (data==0)
            {
                var obj={
                  UNAME:req.body.UNAME,
                  SDRN:req.body.SDRN,
                  DEPT:req.body.DEPT,
                  DESIG:req.body.DESIG,
                  DUTIES:parseInt(req.body.DUTIES),
                  REG_COUNT:0,
                  KT_COUNT:0

                };
              var model;
              if(req.body.DESIG=="PROFESSOR")
                    model=model_prof
              else if(req.body.DESIG=="ASSISTANT-PROFESSOR")
                    model=model_astp
              else
                    model=model_asap  

              
              model_teacher(obj).save(function(err,data){
                if (err) throw err;
                //dialog.info({content:"SUCCESS"});
                
                //console.log("SUCCESS");

                
               // res.redirect('/teacher/success');

                   model(obj).save(function(err,datasav){
                          if(err) throw err;
                             })      
                  
               
               res.render('teacher',{data:"success"})
              });
            }           
          else{
              //dialog.info({content:"RESPONSE not RECORDED!!"});
              //console.log("RESPONSE not RECORDED!!")
              //res.redirect('/teacher/failure');
              res.render('teacher',{data:"failure"})    
            }
    });

});


appex.get('/perform',function(req,res){
    res.render("perform")
})

appex.post('/perform',function(req,res){
  console.log(req.body)
})

appex.get('/final',function(req,res){
        res.render('final');
});


appex.get('/display_time_table',function(req,res){
  var qry= model_time_table.find({}).sort({"exdate":1}).exec()

  qry.then((data)=>{
       res.render("display_tt",{data})
  })
  
})

appex.get('/display_semester_time_table',function(req,res){
  var qry= semester_model_time_table.find({}).sort({"exdate":1}).exec()

  qry.then((data)=>{
    console.log(data)
       res.render("display_tt_sem",{data})
  })
  
})

appex.get('/display_ut_time_table',function(req,res){

  var qry= ut_model_time_table.find({}).sort({"exdate":1}).exec()

  qry.then((data)=>{
    console.log(data)

       res.render("display_tt_ut",{data})
  })
  
})

appex.get('/display_teacher',(req,res)=>{

  var qry=model_teacher.find({},function(err,data){})
  qry.then((data)=>{
    //console.log(data)
    res.render('display_teacher')
  })
  
})



appex.get('/page',(req,res)=>{
  res.render('page')
})

appex.get('/home',(req,res)=>{
  res.render('home')
})

appex.post('/update/time_table/sem',urlencodedParser,function(req,res){
      
  var sid=Object.entries(req.body.blocks)
  console.log(req.body,req.body.blocks)
  var tmp=[]
  var i=0
  while(i<req.body.blocks.length)
  {
    var smtp=[]
    if(i%2==0) {var smtp=[parseInt(req.body.blocks[i])] ; i++;}
  
      while(i%2!=0)
      {
          smtp.push(parseInt(req.body.blocks[i]))
          i++
      }
      tmp.push(smtp)
  }


 

     console.log("FOR UPDATE SEMESTER: ",req.body)
       var j=0;
      for(var i=0;i<req.body.exdate.length;i++)
      {  
        try{
   //       semester_model_time_table.updateOne({exdate:req.body.exdate[i]},{morning_blocks:(req.body.morning_blocks[i]),evening_blocks:(req.body.evening_blocks[i])},(err,data)=>{})
       //     console.log(req.body)
    semester_model_time_table.updateOne({exdate:req.body.exdate[i]},{blocks:tmp[i]},(err,data)=>{})
            
         }
         catch(exe){console.log(exe)}
         

      }

      res.redirect('/display_semester_time_table')
      
})

appex.post('/update/time_table/ut',urlencodedParser,function(req,res){
  var sid=Object.entries(req.body.blocks)
  console.log(req.body,req.body.blocks)
  var tmp=[]
  var i=0
  while(i<req.body.blocks.length)
  {
    var smtp=[]
    if(i%4==0) {var smtp=[parseInt(req.body.blocks[i])] ; i++;}
  
      while(i%4!=0)
      {
          smtp.push(parseInt(req.body.blocks[i]))
          i++
      }
      tmp.push(smtp)
  }


  for(var i=0;i<req.body.exdate.length;++i)
  {
    try{
      ut_model_time_table.updateOne({exdate:req.body.exdate[i]},{blocks:tmp[i]},(err,data)=>{})

     }
     catch(exe){console.log(exe)}
     

  }

  res.redirect('/display_ut_time_table')
  //var arr=Object.entries(req.body)
  //console.log(arr)
  
})


appex.get('/display_teacher/:id1/:id2',function(req,res){
  console.log(req.params.id1,req.params.id2)

  var qry=model_teacher.find({DEPT:req.params.id1,DESIG:req.params.id2}).sort({"SDRN":1}).exec()
  
  qry.then((data)=>{
    console.log(data)
    res.render('display_teacher',{data})  
  })
  
})


appex.get('/display/result/date-wise',function(req,res){
  var qry=selections.find({}).exec()
  
  qry.then((data)=>{
      res.render('date_wise_display',{data})

  })


 
})








/// THESE ROUTES ARE JUST DEMO :

appex.post("/sid_reset",urlencodedParser,function(req,res){

  model_prof.find({},function(err,data){

    for(var i=0;i<data.length;i++)
    {
      var objtoupdate={
        UNAME:data[i].UNAME,
        SDRN:data[i].SDRN,
        DEPT:data[i].DEPT,
        DESIG:data[i].DESIG,
        DUTIES:2,
        REG_COUNT:0,
        KT_COUNT:0,
      }
  
  
     model_prof.updateOne({SDRN:data[i].SDRN},objtoupdate,function(err,data){})
  
  
    }
  
  })
  
  
  
  model_astp.find({},function(err,data){
  
    for(var i=0;i<data.length;i++)
    {
      var objtoupdate={
        UNAME:data[i].UNAME,
        SDRN:data[i].SDRN,
        DEPT:data[i].DEPT,
        DESIG:data[i].DESIG,
        DUTIES:8,
        REG_COUNT:0,
        KT_COUNT:0,
      }
     
      model_astp.updateOne({SDRN:data[i].SDRN},objtoupdate,function(err,data){})
  
  
    }
  
  })
  
  
  model_asap.find({},function(err,data){
  
    for(var i=0;i<data.length;i++)
    {
      var objtoupdate={
        UNAME:data[i].UNAME,
        SDRN:data[i].SDRN,
        DEPT:data[i].DEPT,
        DESIG:data[i].DESIG,
        DUTIES:4,
        REG_COUNT:0,
        KT_COUNT:0,
      }
     
      model_asap.updateOne({SDRN:data[i].SDRN},objtoupdate,function(err,data){})
  
  
    }
  
  })
  
  res.redirect("/perform")

})


appex.post("/aman_reset",urlencodedParser,function(req,res){

        var solteacher=model_teacher.find({},function(err,data){if(err) throw err;}).sort({'REG_COUNT':1}).exec()
      var all_teachers = []


      solteacher.then(function(datateacher){
        // datateacher.forEach(teacher => {
        //     all_teachers.push(teacher)
          
        // });

          console.log(datateacher)
        for(var i=0;i<datateacher.length;i++)
        {
            all_teachers.push(datateacher[i])
            
        } 
        
          console.log("We have length as",all_teachers.length,datateacher.length)

        for(var i=0;i<all_teachers.length;i++)
        { 
          switch(all_teachers[i].DESIG)
                                              {
                                                      case "PROFESSOR" : all_teachers[i].DUTIES = 2;
                                                                        break;
                                                      case "ASSISTANT-PROFESSOR" : all_teachers[i].DUTIES = 8;
                                                                                  break;
                                                      case "ASSOCIATIVE-PROFESSOR" : all_teachers[i].DUTIES = 4; 
                                                                                    break;
                                              }
          all_teachers[i].REG_COUNT=0

          model_teacher.updateOne({SDRN:all_teachers[i].SDRN},all_teachers[i],function(err,data){});
        }
        console.log("Updated!!!")
      })

      res.redirect("/perform")

})


appex.post("/aman_algo",urlencodedParser,function(req,res){
  module.exports = {
    model_teacher: model_teacher,
    model_time_table: model_time_table,
    model_prof:model_prof,
    model_astp:model_astp,
    model_asap:model_asap,
    model_selections:selections
  }
  
  const db = require('./db.js')
  //const test =require('./test.js') 

  res.redirect("/perform")


})


appex.post("/sid_algo",urlencodedParser,function(req,res){
  module.exports = {
    model_teacher: model_teacher,
    semester_model_time_table: semester_model_time_table,
    ut_model_time_table:ut_model_time_table,
    model_prof:model_prof,
    model_astp:model_astp,
    model_asap:model_asap,
    model_selections:selections
  }
  
  var sidalgo=require('./sidalgo.js')

  res.redirect("/perform" )

})


appex.post("/ut_algo",urlencodedParser,function(req,res){
  module.exports = {
    ut_model_time_table:ut_model_time_table,
    model_prof:model_prof,
    model_astp:model_astp,
    model_asap:model_asap,
    model_selections:selections,
    criteria:criteria
  }
   var ut_algo=require("./ut.js")

  //var allot_teacher=require("./allot_teachers.js");


  res.redirect("/perform")
})

appex.post("/sem_algo",urlencodedParser,function (req,res) {
  module.exports = {
    semester_model_time_table:semester_model_time_table,
    model_prof:model_prof,
    model_asap:model_asap,
    model_astp:model_astp,
    model_selections:selections,
    criteria
  }
  var sem_algo=require("./sem.js")
  res.redirect("/perform")
})

appex.post("/kt_algo",urlencodedParser,function (req,res) {
  module.exports = {
    semester_model_time_table:semester_model_time_table,
    model_prof:model_prof,
    model_asap:model_asap,
    model_astp:model_astp,
    model_selections:selections,
    criteria
  }
  var sem_algo=require("./kt.js")
  res.redirect("/perform")
})


appex.post('/allot_ut_selected',urlencodedParser,(req,res)=>{
  module.exports = {
    ut_model_time_table:ut_model_time_table,
    model_prof:model_prof,
    model_astp:model_astp,
    model_asap:model_asap,
    model_selections:selections,
    criteria
  }

  var allot_teacher=require("./allot_ut_teachers.js");
  res.redirect("/perform")

  
})


appex.post('/allot_sem_selected',urlencodedParser,(req,res)=>{
  module.exports = {
    semester_model_time_table:semester_model_time_table,
    model_prof:model_prof,
    model_astp:model_astp,
    model_asap:model_asap,
    model_selections:selections,
    criteria
  }

  var allot_teacher=require("./allot_sem_teachers.js");
  res.redirect("/perform")

  
})

appex.post('/allot_sem_kt_selected',urlencodedParser,(req,res)=>{
  module.exports = {
    semester_model_time_table:semester_model_time_table,
    model_prof:model_prof,
    model_astp:model_astp,
    model_asap:model_asap,
    model_selections:selections,
    criteria
  }

  var allot_teacher=require("./allot_sem_kt_teachers.js");
  res.redirect("/perform")

  
})


appex.post("/professors",urlencodedParser,function(req,res){
       console.log("PROFESSORS: ")
       model_prof.find({},function(err,data){
         console.log(data)
        console.log(data.length)
        })
       res.redirect("/perform")

})

appex.post("/asstprofessors",urlencodedParser,function(req,res){
     console.log("ASSISTANT-PROFESSORS: ")
       model_astp.find({},function(err,data){
         console.log(data)
         console.log(data.length)
        })
       res.redirect("/perform")

})

appex.post("/asscprofessors",urlencodedParser,function(req,res){
        console.log("ASSOCITIVE-PROFESSORS: ")
        model_asap.find({},function(err,data){
          console.log(data)
          console.log(data.length)
        })
        res.redirect("/perform")

      })


appex.post("/timetable",urlencodedParser,function(req,res){
  console.log("TIME-TABLE IS :\n")
  model_time_table.find({},function(err,data){console.log(data)})
  res.redirect("/perform")

})

appex.post('/timetable/semester',urlencodedParser,function(req,res){
  console.log("SEMESTER TIME-TABLE IS :\n")
  semester_model_time_table.find({},function(err,data){console.log(data)})
  res.redirect("/perform")

})

appex.post('/timetable/ut',urlencodedParser,function(req,res){
  console.log("UT TIME-TABLE IS :\n")
  ut_model_time_table.find({},function(err,data){console.log(data)})
  res.redirect("/perform")

})



appex.post("/sid_selected",urlencodedParser,function(req,res){
  console.log("SELECTED TEACHERS : \n")
  selections.find({},function(err,data){console.log(data,data.length)}).sort({"date_of_exam":1})

  res.redirect("/perform")
})  


appex.post("/delete_selected_teachers",urlencodedParser,function(req,res){
  
  selections.deleteMany({},(err,data) => {
    console.log("selections del")
    })
  
  /*
  model_prof.deleteMany({},(err,data) => {
  console.log("Professors Deleted.")
  })

  model_asap.deleteMany({},(err,data) => {
  console.log("Associative-Professors Deleted")
  })

  model_astp.deleteMany({},(err,data) => {
  console.log("Assistant-Professor Deleted")
  })
  model_teacher.deleteMany({},(err,data) => {
  delete_confirmation_teacher = "Data deleted"
  console.log("teacher del")
  }) */
  res.redirect("/perform")
})

/*
criteria.deleteMany({},(err,data)=>{
  console.log("CRITERIA DELETED");
  
})*/


/*
semester_model_time_table.deleteMany({},(err,data)=>{
  console.log("SEM-TIME-TABLE-DELETED");
  
})
*/



/*
selections.deleteMany({},(err,data) => {
  console.log("selections del")
  })
*/
/*
  semester_model_time_table.deleteMany({},(err,data)=>{
  console.log("SEMESTER-TIME-TABLE-DELETED");

}) */
/*
ut_model_time_table.deleteMany({},(err,data)=>{
  console.log("UT-TIME-TABLE-DELETED");
  
})*/

/*
model_time_table.deleteMany({},(err,data) => {
  delete_confirmation_time_table = "Data deleted"
  console.log("table del")
})*/


// THIS SCRIPT IS TO CONNECT WITH NODE JS
/*var tt=require('./db.js')
const {PythonShell} = require('python-shell')
tt.promisetable.then( async function(data){
    var table=['timetable']
    m=Object.entries(data)
    for(var i=0;i<m.length;i++)
            table.push( JSON.stringify(m[i][1]))
    //console.log("TIME-TABLE IS : ", table)
    
    var options = {
      mode:"text",
      args: table
    };

    PythonShell.run('./hello.py', options, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      console.log(results.length)
      console.log('results: ', results);
      
    });
  
    
})

tt.promiseteacher.then( async function(data){
  var table=['teacher']
   m=Object.entries(data)
    for(var i=0;i<m.length;i++)
            table.push(JSON.stringify(m[i][1]))
            
//    console.log("TEACHER IS : ", table)

    var options = { 
      mode:"text",
      args: table
    };
    PythonShell.run('./hello.py', options, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      console.log(results.length)
      console.log('results: ', results);
      for(var i=0;i<results.length;i++)
        {
          var ans=results[i].split(" ")
          console.log(ans)
        }
         });
  

})*/
//model_teacher.deleteMany({"SDRN":"17"})
module.exports = {
  model_prof,
  model_asap,
  model_astp,
}
 //var leftshift=require("./left_shift")


appex.listen(5)