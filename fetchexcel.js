var fs =require('fs')
const readfile=require('read-excel-file/node')


readfile('file.xls').then((rows)=>{

    //console.log(rows)
    console.log(rows)
})
