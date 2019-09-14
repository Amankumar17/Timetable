var mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/INVIGILATION',{useNewUrlParser:true});


var obj=require('./index.js')

var time_sem = obj.semester_model_time_table.find({"examtype":"KT"}).sort({"exdate":1}).exec()

var sorted_select = obj.model_selections.find({}).sort({"date_of_selection":1}).exec()

console.log(obj.criteria)


//Note ---->>>delete selected teacher from "selections" but not "sid reset" so as to maintain duties for both regular and kt




obj.criteria.find({type:"SEM"},(err,datacri)=>{
    time_sem.then((data)=>{
        console.log(data)
    
        sorted_select.then((dataselected)=>{
    
            var selections = Object.entries(dataselected);
    
            var count=0;
    
            
            for(var i=0;i<data.length;i++){
                console.log(String(i+1)+ " time")
                var blocks=data[i].blocks;
                var date_of_selection =data[i].exdate;
                var Sum=0;
    
                for(var I=0;I<blocks.length;I++){
                    var N=blocks[I];
                    Sum=Sum+N;
    
                    
    
                    console.log("BEGIN WITH : ",N);
    
                    while(N>0){
                        selections[count][1].type="TIME SLOT : "+String(I+1);
                        count++;
                        N--;
                    }
    
                    
    
                }
    
                count=count+2*datacri[0].buffer_per_slot[1]   /// THIS IS MEANT FOR BUFFER ..
                 
    
                console.log(Sum);
    
              
    
            }
            
           // console.log(selections);
    
            var selectionobj=[]
    
            for(var I = 0 ;I<selections.length;I++){
                selectionobj.push(selections[I][1])
            }
    
            console.log(selectionobj)
    
            for(var I=0;I<selectionobj.length;I++){
    
                obj.model_selections.findByIdAndUpdate({_id:selectionobj[I]._id},selectionobj[I],(err,data)=>{
                    if(err) throw err;
                    console.log("UPDATED")
    
                })
    
            }
    
    
        })
    
    
    })
    

})


/*
*/




