function getdepartment(value) {
    switch(value){
                
        case "COMPUTER ENGG." : return "COMPUTER ENGINEERING"; 
        case "ELECTRONICS ENGG" : return "ELECTRONICS ENGG";  
        case "ELECTRONICS&TELE" : return "ELECTRONICS & TELECOMMUNICATION ENGINEERING";
        case "ENGG SCIENCE" : return "ENGINEERING SCIENCES";
        case "INFORMATION TECH" : return "INFORMATION TECHNOLOGY";
        case "INSTRUMENTATION" : return "INSTRUMENTATION ENGINEERING";
    }
}


function test() {
            var index=require('./index.js')
            console.log(index.model_prof);
            console.log(index.model_astp);
            console.log(index.model_asap);

                
            var fs =require('fs')
            const readfile=require('read-excel-file/node')


            readfile('test.xlsx').then((rows)=>{

                console.log(rows[0])
                for(var i=1;i<rows.length;i++){
                    var obj={
                        UNAME: rows[i][2],
                        SDRN: rows[i][0],
                        DEPT: getdepartment(rows[i][1]),
                        DESIG: rows[i][3]
                    }

                    if(obj.DESIG=="Professor"){
                        index.model_prof(obj).save(()=>{console.log("PROFESSOR INSERTED")});
                    }
                    else if(obj.DESIG=="Assistant Professor"){
                        index.model_astp(obj).save(()=>{console.log("ASSISTANT PROFESSOR INSERTED")});
                    }
                    else{
                        index.model_asap(obj).save(()=>{console.log("ASSOCIATE PROFESSOR INSERTED")});
                    }


                    //console.log(getdepartment(rows[i][1]))
                    //console.log("CONTENT AT "+i+" is "+rows[i])

                
                }



            })
    
}
test();


/*
  
    [ 'SDRN', 'DEPARTMENT', 'FACULTY NAME', 'Designation' ]  // from excel  

        /// from index.js

            
        var teacherSchema= new mongoose.Schema({
        UNAME:String,
        SDRN:Number,
        DEPT:String,
        DESIG:String,
        DUTIES:Number,
        REG_COUNT:0,
        KT_COUNT:0,
        
        });

        
        var professorschema= new mongoose.Schema({
        UNAME:String,
        SDRN:Number,
        DEPT:String,
        DESIG:String,
        DUTIES:Number,
        REG_COUNT:0,
        KT_COUNT:0,
        
        });

        var asstprofessorschema= new mongoose.Schema({
        UNAME:String,
        SDRN:Number,
        DEPT:String,
        DESIG:String,
        DUTIES:Number,
        REG_COUNT:0,
        KT_COUNT:0,
        
        });

        var assoprofessorschema= new mongoose.Schema({
        UNAME:String,
        SDRN:Number,
        DEPT:String,
        DESIG:String,
        DUTIES:Number,
        REG_COUNT:0,
        KT_COUNT:0,
        
        });



*/