var inputArtist;
var where;

function evdbapi()
{
   var app_key = "PW24gq77zLtqXLnT";
   var oArgs = {
      app_key: app_key,
      q: inputArtist,
      where: where,
      "date": "2019031100-20190122000",
      "include": "tags,categories",
      page_size: 20,
      sort_order: "popularity",
   };
   EVDB.API.call("/events/search", oArgs, function(oData) {
    var topevent = oData.events.event[0];
    var artistName = $("<h1>").text(topevent.title);
    var artistImage = $("<img>").attr("src", topevent.image.medium.url);
    var venue = $("<p>").text(topevent.venue_name);
    var vlocal = $("<p>").text(topevent.city_name + " ," + topevent.region_name + " ," + topevent.country_name);

      // Empty the contents of the artist-div, append the new artist content
      $("#bandinfo").empty();
      $("#bandinfo").append(artistImage, artistName, vlocal, venue);
    console.log(oData);
    });
}
  function searchBandsInTown(artist) {

    // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {

      // Printing the entire object to console
      console.log(response);

      // Constructing HTML containing the artist information
      var artistName = $("<h1>").text(response.name);
      var artistURL = $("<a>").attr("href", response.url).append(artistName);
      var artistImage = $("<img>").attr("src", response.thumb_url);
      var trackerCount = $("<h2>").text(response.tracker_count + " fans tracking this artist");
      var upcomingEvents = $("<h2>").text(response.upcoming_event_count + " upcoming events");
      var goToArtist = $("<a>").attr("href", response.url).text("See Tour Dates");

      // Empty the contents of the artist-div, append the new artist content
      $("#artist-div").empty();
      $("#artist-div").append(artistURL, artistImage, trackerCount, upcomingEvents, goToArtist);
    });
  }
  // Event handler for user clicking the select-artist button
  $("#select-artist").on("click", function(event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the artist name
    inputArtist = $("#artist-input").val().trim();
    where   = $("#where").val().trim();

    // Running the searchBandsInTown function(passing in the artist as an argument)
    searchBandsInTown(inputArtist);
    evdbapi(inputArtist, where)
  });
  