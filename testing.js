var i=Math.round(42*1/12)
var j=Math.round(42*3/12)
var k=Math.round(42*8/12)
console.log(i,j,k)
if (i+j+k != 42)
{
    k=k+(42-(i+j+k))
    console.log(k)
}
