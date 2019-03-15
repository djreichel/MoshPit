var inputArtist;
var where;
var blank = "";
var logo = $("#logo")
var randomDate = moment();
    var randomFormat = "YYYY/MM/DD";
    var convertedDate = moment(randomDate, randomFormat);
    console.log(convertedDate);

function evdbapi(artist, loc)
{
  console.log("evdbapi called, artist="+artist+", loc = "+loc);
   var app_key = "PW24gq77zLtqXLnT";
   var oArgs = {
      app_key: app_key,
      q: artist,
      where: loc,
      "date": "future",
      "include": "tags,categories",
      page_size: 20,
      sort_order: "popularity",
   };
   EVDB.API.call("/events/search", oArgs, function(oData) {
    var topevent = oData.events.event[0];
    console.log(topevent);
    var artistName = $("<h1>").text(topevent.title);
    if (topevent.image == null){ 
    var artistImage = $("<p>").text("no image avaliable");
    } else {
      var artistImage = $("<img>").attr("src", topevent.image.medium.url);
    }
    var venue = $("<p>").text(topevent.venue_name);
    var vlocal = $("<p>").text(topevent.city_name + " ," + topevent.region_name + " ," + topevent.country_name);
    var date = $("<p>").text(topevent.start_time);

      // Empty the contents of the artist-div, append the new artist content
      $("#bandinfo").empty();
      $("#artist-div").append(vlocal, venue, date);
    console.log(oData);
    });
}
  function searchBandsInTown(artist) {
    if(artist == "") { console.log("no artist")
      return false;
    }

    // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {

      // Printing the entire object to console
      console.log(response);

      // Constructing HTML containing the artist information
      var artistName = $("<h1 class='card-title'>").text(response.name);
      var artistURL = $("<a>").attr("href", response.url).append(artistName);
      var artistImage = $("<img class='card-img-top'>").attr("src", response.thumb_url);
      var goToArtist = $("<a>").attr("href", response.url).text("See Tour Dates");

      // Empty the contents of the artist-div, append the new artist content
      $("#artist-div").empty();
      $("#artist-div").append(artistURL, artistImage, goToArtist);
    });
  }

  // Event handler for user clicking the select-artist button
  $("#select-artist").on("click", function(event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    logo.animate({height: "150px"});
    // Storing the artist name
    inputArtist = $("#artist-input").val().trim();
    where   = $("#where").val().trim();
    // Running the searchBandsInTown function(passing in the artist as an argument)
    evdbapi(inputArtist, where);
    searchBandsInTown(inputArtist);
  });
