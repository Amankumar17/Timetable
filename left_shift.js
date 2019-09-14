var mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/INVIGILATION',{useNewUrlParser:true});

var obj= require('./index.js');

//var time_sem = obj.semester_model_time_table.find({"examtype":"KT"}).sort({"exdate":1}).exec()

var sync=require('sync')
 min=1
 max=10
console.log(Math.floor(Math.random() * (max - min + 1) + min))


async function professor () {
    await obj.model_prof.find({}).then((professors)=>{

        for(var i=0;i<professors.length;i++){

            var object={
                UNAME:professors[i].UNAME,
                SDRN:professors[i].SDRN,
                DEPT:professors[i].DEPT,
                DESIG:professors[i].DESIG,
                DUTIES:professors[i].DUTIES,
                REG_COUNT:professors[i].REG_COUNT,
                KT_COUNT:professors[i].KT_COUNT
                    }
           
            obj.model_prof.deleteOne({_id:professors[i]._id});
            obj.model_prof(object).save();

        }

         //  var prof= Object.entries(professors);
          /*var prof=[]

          for(var i=0;i<professors.length;i++)
               prof.push(professors[i])
            var number=Math.floor(Math.random() * (max - min + 1) + min);
           while(number!=0){
          prof.push(  prof.shift());
            number--;
              
                }
            console.log(typeof(prof))
            var resprof=[];

            for(var i=0;i<prof.length;i++)
                resprof.push(prof[i])
            
                console.log("AFTER : ",resprof);
             
            //     obj.model_prof(resprof).save();
            // for(var i=0;i<resprof.length;i++)
                 // obj.model_prof(resprof[i]).save(()=>{console.log("success")})
                 
                */
            
    })

    
   //await obj.model_prof.deleteMany({});
    
    
}

professor();