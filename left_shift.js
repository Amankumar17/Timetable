var mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/INVIGILATION',{useNewUrlParser:true});

var obj= require('./index.js');

//var time_sem = obj.semester_model_time_table.find({"examtype":"KT"}).sort({"exdate":1}).exec()

var sync=require('sync')
 



async function professor () {
    await obj.model_prof.find({}).then(async (professors)=>{
        var min=1
        var max=professors.length-1
        var reslt = []
           var prof= Object.entries(professors);
        
            var rand=Math.floor(Math.random() * (max - min + 1) + min)
            var start=prof.slice(0,rand)
            for(var i=rand;i<professors.length;i++)
            {
                reslt.push(prof[i])
                
            }
            for(var i=0;i<rand;i++)
            {
                reslt.push(prof[i])
            }
            console.log(professors,rand,"=random val")
            await obj.model_prof.deleteMany({},()=>{console.log("DEleted")})

            var pushprof=[];
                for(var i=0;i<professors.length;i++)
                {
                    var pf = {
                        UNAME:reslt[i][1].UNAME,
                        SDRN:reslt[i][1].SDRN,
                        DEPT:reslt[i][1].DEPT,
                        DESIG:reslt[i][1].DESIG,
                        DUTIES:reslt[i][1].DUTIES,
                        REG_COUNT:reslt[i][1].REG_COUNT,
                        KT_COUNT:reslt[i][1].KT_COUNT,
  
                    }
                    pushprof.push(pf);
                    //console.log(prof[i],typeof(prof[i]))
            //        await obj.model_prof(pf).save(function(err,data){console.log("SHIFTED",err,data);})
                }

                await obj.model_prof.insertMany(pushprof,()=>{console.log("SHIFTED")})
            
            
            
            
            


    })

    
   //await obj.model_prof.deleteMany({});
    
    
}

professor();


async function assosciate () {
    await obj.model_asap.find({}).then(async (assosciates)=>{
        var min=1
        var max=assosciates.length-1
        var reslt = []
           var prof= Object.entries(assosciates);
        
            var rand=Math.floor(Math.random() * (max - min + 1) + min)
            var start=prof.slice(0,rand)
            for(var i=rand;i<assosciates.length;i++)
            {
                reslt.push(prof[i])
                
            }
            for(var i=0;i<rand;i++)
            {
                reslt.push(prof[i])
            }
            console.log(assosciates,rand,"=random val")
            await obj.model_asap.deleteMany({},()=>{console.log("DEleted")})

            var pushprof=[];
                for(var i=0;i<assosciates.length;i++)
                {
                    var pf = {
                        UNAME:reslt[i][1].UNAME,
                        SDRN:reslt[i][1].SDRN,
                        DEPT:reslt[i][1].DEPT,
                        DESIG:reslt[i][1].DESIG,
                        DUTIES:reslt[i][1].DUTIES,
                        REG_COUNT:reslt[i][1].REG_COUNT,
                        KT_COUNT:reslt[i][1].KT_COUNT,
  
                    }
                    pushprof.push(pf);
                   
                }

                await obj.model_asap.insertMany(pushprof,()=>{console.log("SHIFTED")})
            
            
            
            
            


    })

    
    
    
}

assosciate();



async function assistant () {
    await obj.model_astp.find({}).then(async (assistants)=>{
        var min=1
        var max=assistants.length-1
        var reslt = []
           var prof= Object.entries(assistants);
        
            var rand=Math.floor(Math.random() * (max - min + 1) + min)
            var start=prof.slice(0,rand)
            for(var i=rand;i<assistants.length;i++)
            {
                reslt.push(prof[i])
                
            }
            for(var i=0;i<rand;i++)
            {
                reslt.push(prof[i])
            }
            console.log(assistants,rand,"=random val")
            await obj.model_astp.deleteMany({},()=>{console.log("DEleted")})

            var pushprof=[];
                for(var i=0;i<assistants.length;i++)
                {
                    var pf = {
                        UNAME:reslt[i][1].UNAME,
                        SDRN:reslt[i][1].SDRN,
                        DEPT:reslt[i][1].DEPT,
                        DESIG:reslt[i][1].DESIG,
                        DUTIES:reslt[i][1].DUTIES,
                        REG_COUNT:reslt[i][1].REG_COUNT,
                        KT_COUNT:reslt[i][1].KT_COUNT,
  
                    }
                    pushprof.push(pf);
                    
                }

                await obj.model_astp.insertMany(pushprof,()=>{console.log("SHIFTED")})
            
      
            


    })

    
   
    
    
}

assistant();
