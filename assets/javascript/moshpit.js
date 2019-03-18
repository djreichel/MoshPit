////////// GLOBAL VARIABLES //////////
// for holding name of inputArtist the user input
var inputArtist;
// for holding the location the user input 
var where;
// grabs logo for jQuery manipulation
var logo = $("#logo");
// lastFM api key, just out in the open
var key = "fb84c3a57177226f589349b05b02b444";


var logovalue = $("#logo").attr("value");
////////// Function for calling LastFM API //////////
function lastfm(artist) {
  var key = "fb84c3a57177226f589349b05b02b444";
  var queryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=" + key + "&format=json";
  ////////// AJAX API call //////////
  $.ajax({
    url: queryURL,
    method: "GET"
    
  }).then(function (response) {
////////// Response Manipulation //////////
    // log the specific music brainz id from the response,
    // assign it to the artid variable and then make another
    // API call to get artist bio using the specific mbid
    console.log("music brainz:" + response.artist.mbid);
    var artid = response.artist.mbid;
    var queryURLtwo = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=" + artid + "&api_key=" + key + "&format=json";
    $.ajax({
////////// 2nd AJAX API call //////////
      url: queryURLtwo,
      method: "GET"
    }).then(function (response) {
////////// Response Manipulation //////////
      // log the bio to the console and assign to bio variable for manipulation
      console.log("potential bio:"+response.artist.bio.summary);
      var bio = response.artist.bio.summary;
      // there will be an anchor tag at the end of the biography linking to the full article,
      // we therefor lindex the bio for the first < occurance and assign the index number to the variable end
      var end = bio.indexOf("<");
      // log end
      console.log(end);
      // substring bio starting at the beginning and ending at end
      // this will chop any text after the first "<" occurence in bio
      // assign chopped bio to chopbio variable
      var chopbio = bio.substring(0, end);

      console.log(chopbio);
      // create a paragraph element with the text of chopbio and assign it to the biop variable
      $("#biog").append(chopbio);
    })

  })
};
////////// Function for calling Eventful API //////////
function evdbapi(inputArtist, where) {
  // console log the two user inputs
  console.log("evdbapi called, inputArtist=" + inputArtist + ", where = " + where);
  // API key for Eventful
  var app_key = "PW24gq77zLtqXLnT";
  // object containing the arguments to be passed into the API
  var oArgs = {
    app_key: app_key,
    q: inputArtist,
    where: where,
    "date": "Next week",
    "include": "tags,categories",
    page_size: 5,
    sort_order: "popularity",
  };
  EVDB.API.call("/events/search", oArgs, function (oData) {
////////// Response Manipulation ////////// 
    // log the response
    console.log(oData);
    // assign the events array to a variable for manipulation
    var allevents = oData.events.event;
    // log the array
    console.log(allevents);
    // empty the div of any previously built band cards
    $("#cardplace").empty();
    // starting at the index of 0 and for all the events in the array, do the following
    for ( var i=0; i < allevents.length; i++) {
      // log the current index event you are at
      console.log(allevents[i]);
      // create a Semantic UI card and assign it to the ebandcard variable
      var ebandcard = $("<div class=' ui card' id='artist-div'>");
      // create a content div to append information to and assign it to eventcardcontent
      var eventcardcontent = $("<div class='content eventful'>");
      // create a header div to append information to and assign it artistName
      var artistName = $("<div class='header'>");
      // create a h1 element with the text of the artist title and assign it to artname
      var artname = $("<h1>").text(allevents[i].title);
      // append artname to artistName div 
      $(artistName).append(artname);
      // if no image loaded
      if (allevents[i].image == null){
        //  then create a paragraph element with the text "no image avaliable" and assign it to the aristImage variable
          var artistImage = $("<p>").text("no image avaliable");
        // if there is an image...
      } else {
        // create an image element with the source of the url from the response
        var artistImage = $("<img class='image'>").attr("src", allevents[i].image.medium.url);
      }
      // create paragraph elements with the text of the venue, city, region, and date of the event
      var venue = $("<p>").text(allevents[i].venue_name);
      var vlocal = $("<p>").text(allevents[i].city_name + " ," + allevents[i].region_name + " ," + allevents[i].country_name);
      var date = $("<p>").text(allevents[i].start_time);
      // log the eventful url
      console.log(allevents[i].url);
      // create an anchor tag with the bands eventful url as the link,
      // tickets as the text,
      // and assign to link variable
      var link = $("<a>").attr("href", allevents[i].url);
      $(link).text("Tickets");
      // append all information to content div
      $(eventcardcontent).append(artistName, vlocal, link, venue, date);
      // append image and content to card div
      $(ebandcard).append(artistImage, eventcardcontent);
      // append eventful band card div to DOM
      $("#cardplace").append(ebandcard);
    }
  });
}
/////////// Function for calling BandsInTown API //////////
function searchBandsInTown(inputArtist) {
  // if the user input is equal to blank, log no input given and end function
  if (inputArtist == "") {
    console.log("no input given")
    return false;
  }
  var queryURL = "https://rest.bandsintown.com/artists/" + inputArtist + "?app_id=codingbootcamp";
////////// AJAX API call //////////
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
////////// Response Manipulation //////////
    // log the response
    console.log(response);
     // empty the div of any previously built band cards
    $("#cardplace").empty();
    var artistName = response.name;
    var emptybio = $("<div id='biog'>");
    var cardcontent = $("<div class='content'>");
    var artistlink = $("<a class='header'>");
    $(artistlink).attr("href", response.url);
    $(artistlink).text(artistName);
    $(cardcontent).append(artistlink);
    var artistImage = $("<div class='image'>").append($("<img>").attr("src", response.thumb_url))
    var description = $("<div class='description'>");
    var tdspan = $("<span>");
    $(tdspan).append($("<a>").attr("href", response.url).text("See Tour Dates"));
    $(description).append(tdspan);
    $(cardcontent).append(description);
    
    console.log(artistName);
    console.log(cardcontent);
    console.log(artistImage);

    var bandcard = $("<div class=' ui card' id='artist-div'>");
    $(bandcard).append(artistImage, emptybio, cardcontent);
    $("#cardplace").append(bandcard);
  });
}
$(document).ready(function () {
  
  $("#artist").on("click", function () {
    $("#dembutts").css("visibility", "hidden");
    $("#artist-input").css("visibility", "visible");
    $("#select-artist").css("visibility", "visible");
    
  });
  $("#city").on("click", function () {
    $("#dembutts").css("visibility", "hidden");
    $("#where").css("visibility", "visible");
    $("#select-location").css("visibility", "visible");
    $("#keyword").css("visibility", "visible");
    
  });
  $("#select-location").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    if (logovalue < 1) {
      logo.animate({ 
        top: "-=300px",
        right: "-=600px",
        width: "150px"
    }, "slow");
  }
    logovalue = logovalue + 1;
    // Storing the inputArtist name
    var keyword = $("#keyword").val().trim();
    where = $("#where").val().trim();
    
    evdbapi(keyword, where);
  });


  // Event handler for user clicking the select-inputArtist button
  $("#select-artist").on("click", function (event) {

    console.log(logovalue);
    // Preventing the button from trying to submit the form
    event.preventDefault();
    if (logovalue < 1) {
    logo.animate({ 
      top: "-=300px",
      right: "-=600px",
      width: "150px"
  }, "slow");
}
  logovalue = logovalue + 1;
  var inputArtist = $("#artist-input").val().trim();
  searchBandsInTown(inputArtist);
   lastfm(inputArtist);

  });
});
