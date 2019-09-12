
var mongoose= require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/INVIGILATION',{useNewUrlParser:true});

var obj=require('./index.js')

var result= new mongoose.Schema({
        Date:String,
        Teachers_alloted:Array
});

var teacher=[] ;
var delete_confirmation_time_table = '';
var delete_confirmation_teacher = '';


var soltime=obj.model_time_table.find({},function(err,data){if(err) throw err;}).sort({'blocks':1}).exec()


soltime.then( async function(datatime)
{
        //console.log(typeof(datatime))
        datatime.forEach( async (date) => 
        {
         
                var solteacher=obj.model_teacher.find({}, function(err,data){if(err) throw err;}).sort({'REG_COUNT':1}).exec()

                
               await solteacher.then( async function(datateacherupdated){
                         console.log("FETCHED UPDATED INITIAL PRINT: "+datateacherupdated)
                  })
          


                var no_of_teachers = date.blocks+2
                       
               await solteacher.then( async function(datateacher)
                {

                        var min_count = (datateacher[0].REG_COUNT)
                               
                        var my_selected_teachers=[]

                        while(my_selected_teachers.length < no_of_teachers)
                        {

                                console.log(no_of_teachers,min_count,my_selected_teachers.length)
                                
                                datateacher.forEach(teacher =>  
                                {
                                        //console.log(teacher.REG_COUNT , teacher.DESIG)
                                        
                                        switch(teacher.DESIG)
                                        {
                                                case "PROFESSOR" : if (teacher.REG_COUNT < 2) 
                                                                        {
                                                                                my_selected_teachers.push(teacher)
                                                                                
                                                                        }break;
                                                case "ASSISTANT-PROFESSOR" : if(teacher.REG_COUNT < 8)
                                                                        {
                                                                                my_selected_teachers.push(teacher)
                                                                               
                                                                        } break;
                                                case "ASSOCIATIVE-PROFESSOR" : if (teacher.REG_COUNT < 4)
                                                                        {
                                                                                my_selected_teachers.push(teacher)
                                                                                
                                                                        }break;
                                        }
                                        
                                })
 
                                
                                if (my_selected_teachers.length < no_of_teachers)
                                {
                                        min_count = min_count + 1
                                }
                        }
                        
                        
                        for(var i=0;i<no_of_teachers;i++)
                        {
                                my_selected_teachers[i].DUTIES = my_selected_teachers[i].DUTIES-1
                                my_selected_teachers[i].REG_COUNT = my_selected_teachers[i].REG_COUNT+1
                                //console.log(my_selected_teachers[i].REG_COUNT)

                                var upobj={
                                        UNAME:my_selected_teachers[i].UNAME,
                                        SDRN:my_selected_teachers[i].SDRN,
                                        DESIG:my_selected_teachers[i].DESIG,
                                        DUTIES:my_selected_teachers[i].DUTIES,
                                        REG_COUNT:my_selected_teachers[i].REG_COUNT,
                                        KT_COUNT:my_selected_teachers[i].KT_COUNT
                                
                                }
                         
                             await   obj.model_teacher.findOneAndUpdate({SDRN:my_selected_teachers[i].SDRN},upobj, (err,data)=>{
                                        //obj.model_teacher.find({},function(err,data){console.log(data)})
                                        console.log(data)
                                })
                                
                        }
                        //console.log(my_selected_teachers)
                        

                })
                        
        });



        // setTimeout(() => {
        //              console.log("RELAAX\n")        
        //         }, 5000);


        // var solteacher1=obj.model_teacher.find({},function(err,data){if(err) throw err;}).sort({'REG_COUNT':1}).exec()

        // console.log("ANSWER:  \n")
 
        // solteacher1.then(function(datateacherupdated){
        //        console.log("UPDATED DATA"+datateacherupdated)
        // })



        // console.log(i)
        // var solteacher=obj.model_teacher.find({},function(err,data){if(err) throw err;}).sort({'REG_COUNT':1}).exec()

        // console.log("ANSWER:  \n")
        // solteacher.then(function(datateacherupdated){
        //         console.log(datateacherupdated)
        // })


        
        /// for display
      /*  solteacher.then(function(datateacher)
        {       //datateacher.sort({REG_COUNT:1})
                //console.log("TIME-TABLE")
                console.log("TEACHER "+datateacher)

                
                //m=datateacher
                //console.log(date.blocks+"value")

                

        })*/



})



// module.exports = {
//     promisetable: soltime,
//     promiseteacher : solteacher
// }


/*
obj.model_teacher.deleteMany({},(err,data) => {
        delete_confirmation_teacher = "Data deleted"
 
}) */
/*obj.model_time_table.deleteMany({},(err,data) => {
        delete_confirmation_time_table = "Data deleted"
})
*/