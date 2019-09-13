var mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/INVIGILATION',{useNewUrlParser:true});

var obj= require('./index.js');

var time_sem = obj.semester_model_time_table.find({}).sort({"exdate":1}).exec()

var sync=require('sync')

console.log("FOR SEM : \n")

async function solve(){

 await time_sem.then( async (all_dates)=>{

    //var selected_time_table=[]
    console.log(all_dates)
    for(var loop=0;loop<all_dates.length;loop++)
    {
        var blocks=all_dates[loop].blocks[0]+all_dates[loop].blocks[1]+2
        var prof_contri=Math.round(blocks*(2/14))
        var astp_contri=Math.round(blocks*(8/14))
        var aasp_contri=Math.round(blocks*(4/14))
        console.log("BLOCKS ARE: ",blocks,"PROF HAS ",prof_contri,"ASST-PROF HAS ",astp_contri,"ASSCP-PROF HAS ",aasp_contri)
        

        while(astp_contri>0)
        {         
           var qry=obj.model_astp.find({}).sort({"REG_COUNT":1}).exec()

            await qry.then( async (data)=>{
               
            var upobj={
                UNAME:data[0].UNAME,
                SDRN:data[0].SDRN,
                DEPT:data[0].DEPT,
                DESIG:data[0].DESIG,
                DUTIES:data[0].DUTIES-1,
                REG_COUNT:data[0].REG_COUNT+1,
                KT_COUNT:0,
               }
               
               var select={
                   date_of_exam:all_dates[loop].exdate,
                   DEPT:data[0].DEPT,
                   teacher:data[0].UNAME,
                   SDRN:data[0].SDRN,
                   type:""
               }

               console.log("UPDATED OBJECTS: ",upobj, "LEFT : ",astp_contri)

               await obj.model_astp.findOneAndUpdate({SDRN:data[0].SDRN},upobj, (err,data)=>{
                //obj.model_teacher.find({},function(err,data){console.log(data)})
                    })
                
               await obj.model_selections(select).save(function(err,data){})     
                    
           })

            astp_contri--;
          
        }


        while(aasp_contri>0)
        { 
            
           var qry=obj.model_asap.find({}).sort({"REG_COUNT":1}).exec()

            await qry.then( async (data)=>{
               
            var upobj={
                UNAME:data[0].UNAME,
                SDRN:data[0].SDRN,
                DEPT:data[0].DEPT,
                DESIG:data[0].DESIG,
                DUTIES:data[0].DUTIES-1,
                REG_COUNT:data[0].REG_COUNT+1,
                KT_COUNT:0

               }
               
               var select={
                   date_of_exam:all_dates[loop].exdate,
                   DEPT:data[0].DEPT,
                   teacher:data[0].UNAME,
                   SDRN:data[0].SDRN,
                   type:""
                   
               }

               console.log("UPDATED OBJECTS: ",upobj, "LEFT : ",aasp_contri)

               await obj.model_asap.findOneAndUpdate({SDRN:data[0].SDRN},upobj, (err,data)=>{
                //obj.model_teacher.find({},function(err,data){console.log(data)})
                    })
                
               await obj.model_selections(select).save(function(err,data){})     
                    
           })

            aasp_contri--;
          
        }


        while(prof_contri>0)
        { 
            
           var qry=obj.model_prof.find({}).sort({"REG_COUNT":1}).exec()

          await qry.then( async (data)=>{
               
            var upobj={
                UNAME:data[0].UNAME,
                SDRN:data[0].SDRN,
                DEPT:data[0].DEPT,
                DESIG:data[0].DESIG,
                DUTIES:data[0].DUTIES-1,
                REG_COUNT:data[0].REG_COUNT+1,
                KT_COUNT:0

               }
               
               var select={
                   date_of_exam:all_dates[loop].exdate,
                   DEPT:data[0].DEPT,
                   teacher:data[0].UNAME,
                   SDRN:data[0].SDRN,
                   type:""
                   
               }

               console.log("UPDATED OBJECTS: ",upobj, "LEFT : ",prof_contri)

               await obj.model_prof.findOneAndUpdate({SDRN:data[0].SDRN},upobj, (err,data)=>{
                //obj.model_teacher.find({},function(err,data){console.log(data)})
                    })
                
               await obj.model_selections(select).save(function(err,data){})     
                    
           })

            prof_contri--;
          
        }

    
    }

      

