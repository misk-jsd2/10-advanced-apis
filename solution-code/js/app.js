$(function() {
  // DOM is now ready
  // check if navigator geolocation is available from the browser
  if (navigator.geolocation) {
    // if it is use the getCurrentPosition method to retrieve the Window's location
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('lat: ', position.coords.latitude);
      console.log('lon: ', position.coords.longitude);

      // Now that we have the user's location, let's search the API for landscape photos nearby
      let url = 'https://api.flickr.com/services/rest/?'; // base URL
      // Object storing each key and value we need in our query.
      // This makes it clear what options we're choosing, and makes it easier
      // to change the values or add/remove options.
      let searchOptions = {
        method: 'flickr.photos.search', // endpoint
        api_key: apiKey, // stored in js/keys.js
        // api_key: 'a8af22654d1fb40bcbd188722c2024f6',
        tags: 'landscape',
//        tags: 'nature', // BONUS: different category
        media: 'photos',
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        radius: 10,
        radius_units: 'mi',
        format: 'json',
        nojsoncallback: 1,
        extras: 'url_n',
//        extras: 'url_z', // BONUS: larger images
        content_type: 1,
        safe_search: 1,
        per_page: 30, // return 30 photos per page
        sort: 'relevance', // sort by relevance
      };
      // loop through the searchOptions object and append each key and value
      // to the url variable to build the full search URL
      for (let key in searchOptions) {
        url += '&' + key + '=' + searchOptions[key];
      }
      console.log(url);

      // Now that we've built our URL, we can send our GET request
      $.get(url)
        .done(function(response) {
          console.log(response);
          if (response.photos.photo.length === 0) {
            console.log('No photos found!');
          } else {
            handleResponseSuccess(response);
          }
        });
    });
  } else {
    $('.images').append('Sorry, the browser does not support geolocation');
  }

  function handleResponseSuccess(response) {
    let allData = response.photos.photo;
    $.each(allData, function() {
      // photos without titles may not be carefully tagged, so exclude them
      if (this.title !== '') {
        let element = $('<img>').attr('src', this.url_n).addClass('image');
        $('.images').append(element);
      }
    });
  }
});
