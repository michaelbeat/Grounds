$(document).ready(function(){
  $('.sidenav').sidenav();
});

function initMap() {
  var options = {
    zoom: 10,
    center: {
      lat:30.2672,
      lng:-97.7431
    },
  }
  // Creates map on div element map
  var map = new google.maps.Map(document.getElementById('map'), options);
  // Creates marker on map for each firebase ref
  allRefs.forEach(function(ref) {
    if(ref.enRoute == -1 && !ref.completed){
      var marker = new google.maps.Marker({
        position: {
          lat: ref.lat,
          lng: ref.long
        },
        map: map,
        id: ref.id,
      })
      // If cursor is clicked
      google.maps.event.addListener(marker, 'click', function(e){
        var bullshit = $("img");
        if (window.innerWidth >= 736) {
          bullshit = $(e.ya.currentTarget.parentElement.parentElement);
        }
        bullshit.sidenav();
        bullshit.addClass("sidenav-trigger");
        bullshit.attr("data-target", "mobile-demo-right");
        // Update sidenav with new business info
        $("#img-style").attr("src", ref.imageUrl)
        $("#cardTitle").text(ref.name);
        $("#cardPhone").text("Phone:" + ref.phone);
        $("#cardAddress").text(ref.address);
        console.log(ref.id);
        $("#refID").attr("value", ref.id)
      });
    }
  });
}