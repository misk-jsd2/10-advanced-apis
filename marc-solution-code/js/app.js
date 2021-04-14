// app.js
$(function () {
  // check if navigator geolocation is available from the browser
  if (navigator.geolocation) {
    // if it is use the getCurrentPosition method to retrieve the Window's location
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('lat: ' + position.coords.latitude);
      console.log('lon: ' + position.coords.longitude);

      // All code from here on down is new code, including the closing });
      // Now that we have the user's location, let's search the API for landscape photos nearby
      let url = 'https://api.flickr.com/services/rest/?'; // base URL
      // Object storing each key and value we need in our query.
      // This makes it clear what options we're choosing, and makes it easier
      // to change the values or add/remove options.
      let searchOptions = {
        method: 'flickr.photos.search', // endpoint
        api_key: apiKey, // stored in js/keys.js
        // tags: 'landscape',
        media: 'photos',
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        radius: 20,
        radius_units: 'mi',
        format: 'json',
        nojsoncallback: 1,
        extras: 'url_n',
        content_type: 1,
        safe_search: 1,
        sort: 'relevance',
        per_page: 20,
      };
      // loop through the searchOptions object and append each key and value
      // to the url variable to build the full search URL
      for (let key in searchOptions) {
        url += '&' + key + '=' + searchOptions[key];
      }
      console.log(url);

      // Now that we've built our URL, we can send our GET request
      $.get(url).done(function (response) {
        console.log(response);
        if (response.stat === 'fail') {
          console.log(response.message); // point out that for end users, we'll want to use DOM manipulation, but this is a quick and dirty
          // way of seeing if there's an error while we're building the app
        } else if (response.photos.photo.length === 0) {
          console.log('No photos found!'); // same as previous
        } else {
          console.log(response.photos.photo);

          $imagesElement = $('.images');

          $.each(response.photos.photo, function () {
            let element = $('<img>').attr('src', this.url_n).addClass('image');
            $imagesElement.append(element);
          });

          // Handle the successful response here
          console.log('Request succeeded!'); // note that we will replace this with code to handle the data when it's received; this is just
          // to make sure our code is working to this point
        }
      });
    });
  } else {
    $('.images').append('Sorry, the browser does not support geolocation');
  }
});
