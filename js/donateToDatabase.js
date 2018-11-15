/* This is needed for the sidenav, because materialize? */
$(document).ready(function(){
  $('.sidenav').sidenav();
});

/* This is the current buisiness that we want to add to the database. */
var currentBiz;

/* This is responsible for showing the relevent divs based on what we pass it. */
function showElement(x){
  var searchShow = document.getElementById("search-show");
  var profileShow = document.getElementById("profile-show");
  
  searchShow.style.display = "none";
  profileShow.style.display = "none";
  
  if(x == 0){
    profileShow.style.display = "block";
  } else if(x == 1){
    searchShow.style.display = "block";
  }
}

/* This is what gets triggered when we click on the buisiness we want to add after we search. */
function clickFunction(newBiz) {
  event.preventDefault();
  showElement(0);
  currentBiz = newBiz;
  $("#results-profile").html('<p class="text-info-light" id="' + newBiz.name + '" style="margin-top:10px;margin-bottom:10px;"><b>' + newBiz.name + '</b><br>' + newBiz.address + ' ' + newBiz.city + ', ' + newBiz.state + ' ' + newBiz.zipCode + '<br>' + newBiz.phone + '</p></div>');
  $('#img-result').html('<img id="img-profile" src="' + newBiz.imageUrl + '">');
}

/* Look at this unwieldly monster! Looks like a job for refactory man! This does the yelp ajax call and adds the relevent data from that call. */
$("form").submit(function( event ) {
  //businesses = [];
  $('#results').empty();
  event.preventDefault();
  var business = $("#search-business").val().trim();
  var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=austin&limit=3&term=" + business;
    $.ajax({
        url: myurl,
        headers: {
        'Authorization':'Bearer Uensef7YvWBDrkLIVTvHbF1RPf2IN989gIxMN9HEvEV8VyXjp4TZ_V8faI3tItTCrIheVIeD-XjS78gcmrmtJ9I0MvJ1kEjU6x1KzdaiUzynr8rMEwSVs9WUlrXlW3Yx',
    },
        method: 'GET',
        dataType: 'json',
        success: function(data){
            var totalresults = data.total;
            if (totalresults > 0){
                $.each(data.businesses, function(i, item) {
                  var newBiz = new BusinessInfo(item.name, item.location.address1, item.location.city, item.location.state, item.location.zip_code, item.display_phone, item.image_url, item.coordinates.latitude, item.coordinates.longitude);
                  
                  var container = $("<div>");
                  container.on ("click", function(){
                    clickFunction(newBiz);
                  });
                  
                  container.html('<p class="text-results" id="' + newBiz.name + '" style="margin-top:10px;margin-bottom:10px;"><b>' + newBiz.name + '</b><br>' + newBiz.address + ' ' + newBiz.city + ', ' + newBiz.state + ' ' + newBiz.zipCode + '<br>' + newBiz.phone + '</p></div>');

                  $("#results").append(container);
                  $("#search-business").val("");
                });
            } else {
                $('#results').append('<p class="text-info-light">We discovered no results!</p>');
            }
          }
      });
});

/* This is supposed to interact with the databaseHandler.js, and add a new ref for the request to donate. */
$("#donate-button").on("click", function() {
  var id = (new Date()).getTime();
  var fireVar = new databaseObjRef(id);
  databaseSetValue(id, "name", currentBiz.name);
  databaseSetValue(id, "address", currentBiz.address);
  databaseSetValue(id, "city", currentBiz.city);
  databaseSetValue(id, "state", currentBiz.state);
  databaseSetValue(id, "zipCode", currentBiz.zipCode);
  databaseSetValue(id, "phone", currentBiz.phone);
  databaseSetValue(id, "imageUrl", currentBiz.imageUrl);
  databaseSetValue(id, "lat", currentBiz.lat);
  databaseSetValue(id, "long", currentBiz.long);
  console.log(currentBiz.lat);
  console.log(currentBiz.long);
  fireVar.addMe();
  window.location = "pickup.html";
});

/* This constructor is what we use to easily pass information about a business with. */
var BusinessInfo = function(){
  this.name = arguments[0] || "N/A";
  this.address = arguments[1] || "N/A";
  this.city = arguments[2] || "N/A";
  this.state = arguments[3] || "N/A";
  this.zipCode = arguments[4] || "N/A";
  this.phone = arguments[5] || "N/A";
  this.imageUrl = arguments[6] || "N/A";
  this.lat = arguments[7] || "N/A";
  this.long = arguments[8] || "N/A";
}



showElement(1);