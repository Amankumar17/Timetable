var mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/INVIGILATION',{useNewUrlParser:true});

var obj= require('./index.js');

var time_slot1=obj.semester_model_time_table.find({examtype:"REGULAR"}).sort({"exmdate":1}).exec()

var time_slot2=obj.semester_model_time_table.find({examtype:"KT"}).sort({"exmdate":1}).exec()

var sync=require('sync')



//THIS IS SIMPLE ALLOCATION LOGIC FOR TEACHERS WITH RESPECT TO BLOCKS IN DATES :

console.log("FOR REGULAR : \n")
async function solve(){

 await time_slot1.then( async (all_dates)=>{

    var selected_time_table=[]
    

    for(var loop=0;loop<all_dates.length;loop++)
    {
        var blocks=all_dates[loop].morning_blocks+all_dates[loop].evening_blocks+4
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
                   type:"MORNING"
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
                   type:"MORNING"
                   
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
                   type:"MORNING"
                   
               }

               console.log("UPDATED OBJECTS: ",upobj, "LEFT : ",prof_contri)

               await obj.model_prof.findOneAndUpdate({SDRN:data[0].SDRN},upobj, (err,data)=>{
                //obj.model_teacher.find({},function(err,data){console.log(data)})
                    })
                
               await obj.model_selections(select).save(function(err,data){})     
                    
           })

            prof_contri--;
          
        }

        
        for(var i=0;i<all_dates[loop].evening_blocks;i++)
        {
            var qry=obj.model_selections.find({date_of_exam:all_dates[loop].exdate}).sort({type:"MORNING"}).exec()
            await qry.then(async (data) => {
                var select = {
                   date_of_exam:all_dates[loop].exdate,
                   DEPT:data[0].DEPT,
                   teacher:data[0].UNAME,
                   SDRN:data[0].SDRN,
                   type:"EVENING"
                }

                if (data[0].type == "MORNING")
                {
                    await obj.model_selections.findOneAndUpdate({SDRN:data[0].SDRN},select, (err,data)=>{})
                }            
            })
        }
                
    } 
})
/*
//KT AFTER REGULAR
await time_slot2.then( async (all_dates)=>{

    var selected_time_table=[]

    for(var loop=0;loop<all_dates.length;loop++)
    {
        var blocks=all_dates[loop].morning_blocks+1
        var prof_contri=Math.round(blocks*(2/14))
    
        var astp_contri=Math.round(blocks*(8/14))
        var aasp_contri=Math.round(blocks*(4/14))
        console.log("BLOCKS ARE: ",blocks," PROFES HAS ",prof_contri ,"ASST-PROF HAS ",astp_contri,"ASSCP-PROF HAS ",aasp_contri)
        

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
                type:"MORNING"
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
                type:"MORNING"
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
                type:"EVENING"
                
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
    
    for(var loop=0;loop<all_dates.length;loop++)
    {
        var blocks=all_dates[loop].evening_blocks+1
        var prof_contri=Math.round(blocks*(2/14))
        var astp_contri=Math.round(blocks*(8/14))
        var aasp_contri=Math.round(blocks*(4/14))
        console.log("BLOCKS ARE: ",blocks," PROF HAS ",prof_contri,"ASST-PROF HAS ",astp_contri,"ASSCP-PROF HAS ",aasp_contri)
        

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
                type:"EVENING"
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
                type:"EVENING"
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
                type:"EVENING"
                
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
    
})
*/

}

solve()







