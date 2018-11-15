/* 
  For fucks sake! Fuck this file. 
  This handles the timer and the sidenav for the file status.html.
*/

/* Navbar stuff */
$(document).ready(function(){
  $('.sidenav').sidenav();
});

/* This is a nice way to get all the things we passed in the previous form. */
var messyProps = window.location.href.split("?")[1].split("&");
var props = {};
for(let i = 0; i < messyProps.length; i++){
  var toAdd = messyProps[i].split("=");
  props[""+toAdd[0]] = toAdd[1];
}
/* This is the id of the databaseObjRef we are going to use in this file. */
var currentId = props.id;
/* This is the object that we are manipulating for the timer. */
var currentObj = new databaseObjRef(currentId);

/* This is how we update the currentObj so that things arn't out of sync later. */
var ref = database.ref(currentId);
ref.once('value', function(snapshot) {
  doThing(snapshot);
});
/* This works with the code above to set enRoute for the currentObj. */
function doThing(snapshot){
  if(snapshot.val().enRoute == -1){
    console.log(snapshot.val().enRoute, -1, snapshot.val().enRoute==-1);
    currentObj.setValue("enRoute", (new Date()).getTime() );
  }else if( ((new Date()).getTime() - snapshot.val().enRoute) >= 1200000){
    currentObj.setValue("enRoute", -1);
  }
}

/* This is for the complete button. It effectivly kills the currentObj. */
$("#complete-button").on("click", function() {
  databaseSetValue(window.location.href.substring(window.location.href.indexOf("=")+1, window.location.href.length), "completed", true);
  databaseRemove(window.location.href.substring(window.location.href.indexOf("=")+1, window.location.href.length));
});

/* This cancels the timer and brings you back to the previous page. */
$("#cancel-button").on("click", function() {
  currentObj.setValue("enRoute", -1);
  window.location = "pickup.html";
});

/* This is so that we can upate the timer that the user sees. */
var timer = setInterval(function(){
 $("#time-remaining").text( convertTime((1200000-((new Date()).getTime() - currentObj.enRoute))/1000).substring(0, 5) );
}, 1000);

/* This is somthing that Clayton stole from stack overflow that I am now using after some changes to format the time. */
function convertTime(t){
  if(t >= 0){
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);
    if (seconds < 10) {seconds = "0" + seconds;}
    if (minutes === 0) {minutes = "00";}
    else if (minutes < 10) {minutes = "0" + minutes;}
    return minutes + ":" + seconds;
  }else{
    return "00:00";
    setTimeout(function(e){
      window.location = "pickup.html";
    }, 10000);
  }
}