/*global youtubeAccess */
/*global jQuery */

(function($) {
  $(document).ready(function() {
    console.log('File is running.');

    // Each playlist will have a property in this object that is associated with an array of Videos within the playlist
    var videosByPlaylist = {};

    // Update the list of videos with randomized array from `videosByPlaylist`
    var updatePlayer = function() {
      var allVideos = [];

      for(var playlist in videosByPlaylist) {
        if(videosByPlaylist.hasOwnProperty(playlist)) {
          var videos = videosByPlaylist[playlist];

          var allVideos = allVideos.concat(videos);
        }
      }

      // All videos are in `allVideos`
      allVideos.shuffle();
      var player = youtubeAccess.getPlayer(allVideos);

      $('#player').html('');
      $('#player').append(player);
    };

    $('#submit-playlist').click(function() {
      var playlistURL = $('#playlist-input').val();
      $('#playlist-input').val('');
      $('#playlist-input').attr('placeholder', 'Add Another Playlist...');

      // Parse URL with youtubeAccess.getPlaylistIdFromUrl
      var playlistId = youtubeAccess.getPlaylistIdFromUrl(playlistURL);

      if(!playlistId) alert('We couldn\'t get a valid playlist ID from that link!');
      else {
        youtubeAccess.getVideosByPlaylistId(playlistId, function(videos) {
          if(!videos) return;

          // This means we have a good video playlist
          $('#playlists').append('<li>' + playlistId + '</li>');

          // Add playlist videos to object
          videosByPlaylist[playlistId] = videos;
          updatePlayer();
        });
      }
    });

  });
})(jQuery);
