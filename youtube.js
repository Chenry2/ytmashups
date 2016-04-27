/*global $*/
/*global url*/

// API Key for Accessing Youtube (throw out before making this application live)
var apiKey = 'AIzaSyCSB_uqednNkulQWQYCMikD2TH-XljThq0';

// Need to add apiKey through GET variable `key`; i.e. &key=apiKeyHere
var urlStructure = 'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=';
var youtubeAccess = {};

// Sample Playlist URL: https://www.youtube.com/playlist?list=PLzMs8_V-DPKhm_co5a3Yyp_m6CyMFB8QN
youtubeAccess.getPlaylistIdFromUrl = function(url) {
  if(!url) return false;

  // OK. So we need to split the url that's passed into two sections. What's before the ? and what's after
  // We can do that with... .split

  // When passing `https://test.com/?test=yes` we get `test=yes`. Perfect.
  var getVars = url.split('?', 2)[1]; // We split where the ? is, and we limit it to 2 parts, and get the second one.

  if(!getVars) return false; // If we didn't get anything here, this is definitely an invalid link.
  if(getVars.indexOf('list=') === -1) return false; // This checks to make sure that there is a `list` get variable being set in the url

  // Okay. Enough checks, now we'll get the Playlists's ID.
  // We'll first get the portion after the `list=` string, and make sure that there are no more variables attached.
  var playlistId = getVars.split('list=', 2)[1]; // Get what's after `list=`
  playlistId = playlistId.split('&')[0]; // Get what's before `&` (if it exists)

  return playlistId;
};

// Returns a JSON object, object parameter `items` is Array of Objects of videos within playlist
youtubeAccess.getVideosByPlaylistId = function(playlistId, callback) {
  if(!playlistId) return false;

  // OK, we need to create a request through the browser (behind-the-scenes) to grab these videos.
  // Here's the easy way to do it

  var url = urlStructure + playlistId + '&key=' + apiKey;

  var request = $.getJSON(url);

  request.done(function(json) {
    var videos = json.items;
    callback(videos);
  });

  request.fail(function() {
    callback(false);
    alert('We failed to retrieve the videos within this playlist from Google.');
  });
};

// Generates iFrame for YouTube playlist
// See: https://developers.google.com/youtube/player_parameters?csw=1#playlist
youtubeAccess.getPlayer = function(videos) {
  //return '<iframe src="http://www.w3schools.com"></iframe>';
  var videosArray = [];
  var urlBase = 'http://www.youtube.com/embed/';

  videos.forEach(function(v, i) {
    if(!i) return; // Skip index 0
    videosArray.push(v.contentDetails.videoId);
  });

  url = urlBase + videosArray.join(',');
  return '<iframe src="' + url + videos[0].contentDetails.videoId + '?playlist=' + videosArray.join(',') + '" class="iframe" />';
};

// This makes the object accessible from anywhere in the DOM
document.youtubeAccess = youtubeAccess;
