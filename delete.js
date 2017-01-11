$(document).ready(function(){
$(".deleteUser").on("click",deleteUser);
});
function deleteUser(){
var confirmation=confirm("Are you sure?");
if(confirmation){
$.ajax({
      type:"DELETE",
      url:"/users/delete/"+$(".deleteUser").data("id")
});
}
else{
return false;
}
}