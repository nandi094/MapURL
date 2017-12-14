'use strict'
  var map;

  var markers = [];
  var locations = [
    {title:'ISKCON Temple Bangalore',
    location: {lat: 13.0104, lng: 77.5510},
    wiki: 'https://en.wikipedia.org/wiki/ISKCON_Temple_Bangalore',
    },
    {title:'Lal Bagh',
    location: {lat: 12.9507, lng:77.5848},
    wiki: 'https://en.wikipedia.org/wiki/Lal_Bagh',
    },
    {title:'M Chinnaswamy Stadium',
    location: {lat: 12.9788, lng: 77.5996},
    wiki: 'https://en.wikipedia.org/wiki/M._Chinnaswamy_Stadium',
    },
    {title:'Vidhana Soudha',
    location: {lat: 12.9783, lng: 77.5895},
    wiki: 'https://en.w/ikipedia.org/wiki/Vidhana_Soudha',
    },
    {title:'Basavanagudi Nandi Temple',
    location: {lat: 12.9456, lng: 77.5713},
    wiki: 'https://en.wikipedia.org/wiki/Dodda_Ganeshana_Gudi',
    },
	{title:'Infosys',
    location: {lat: 12.8505, lng: 77.6655},
    wiki: 'https://en.wikipedia.org/wiki/Infosys',
    }
	
  ];
function initMap(){
  map = new google.maps.Map(document.getElementById('map'),
  {
    center: {lat: 12.9716, lng: 77.5967},
    zoom: 12
  });

  var biginfowindow = new google.maps.InfoWindow({
  });
  var bounds = new google.maps.LatLngBounds();
//creating array of markers using location array
  for (var i = 0; i < locations.length; i++) {
    var position =locations[i].location;
    var title = locations[i].title;
    //var wiki = locations[i].wiki;
  //creating markers
    var marker = new google.maps.Marker ({
      position : position,
      map:map,
      title: title,
      animation : google.maps.Animation.DROP
    });

    bounds.extend(marker.position);
  // adding action to be performed while clicked
    marker.addListener('click',function(){
      popInfoWindow(this,biginfowindow);
          toggleBounce(this);
      });
    locations[i].locationObject=marker;
  }
  function popInfoWindow(marker, infowindow) {
    // This just makes sure the window is not already open

      //This sets the content ofthe info window
      var Mtitle = marker.title;
	  var Mute = marker.position;
	  
          //Create contentString variable for infowindows
          var contentString;

          //Alter locations.name content to account for symbols and spaces


          //Wikipedia API request URL
          var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + Mtitle + "&limit=1&redirects=return&format=json"
          var wikiRequestTimeout = setTimeout(function() {
             alert("failed to get wikipedia resources");
            }, 100000000);
          //AJAX request for Wikipedia API information used in infowindows
          $.ajax ({
            url: wikiUrl,
            dataType: "jsonp",
            success: function ( response ){
             var articleList = response[1];
              //If an article is found, populate infowindow with content string information showing Wikipedia response
              if (articleList.length > 0) {
                for (var i=0; i<articleList.length; i++) {
                  var articleStr = articleList[i];
                  var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                  contentString = '<div>' + Mtitle + '<p>' + '</p>' + '<p>' +"The Location is :"+Mute+ '</p>' + '<a href=" ' + url + '">' + url + '</a>' + '</div>'
                  infowindow.setContent(contentString);
                }
                console.log(wikiUrl);
              //If no article is found, populate infowindow with content string reflecting no articles were found
              } else {
                contentString = '<div id="content">' + Mtitle + '<p>'  + '</p>' + '<p>' + 'No articles found on Wikipedia'+ '</p>' + '</div>'
                console.log(url);
                infowindow.setContent(contentString);
              }
            }
          })
      console.log("clicked");
      infowindow.open(map, marker);
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        //Makes sure the animation of the marker is stopped if the infoWindow close button is clicked
            marker.setAnimation(null);
          });
      };
  function toggleBounce(marker)  {
      //Otherwise, set animation on this marker
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout (function () {
        marker.setAnimation(google.maps.Animation.null);
      },2100);
      };
  map.fitBounds(bounds);
  ko.applyBindings(new AppViewModel());
}

// in case of error while loading
function googleError(){
  alert("Google maps is not loading. Please check your internet connection");
  };

//the view model which uses the concepts of knockout
var AppViewModel = function() {
//declaring self to make sure that the object knows its own items
    var self = this;
    self.details=ko.observable();
    self.title = ko.observable();
    // self.marker = ko.observableArray([]);
      self.locations = ko.observable(locations);
      self.click = function(locations,marker,locationObject) {
        map.setZoom(15 );
        map.setCenter(locations.location);
        //this event not happening while i click list element
        google.maps.event.trigger(locations.locationObject, 'click');
        // google.maps.event.trigger(loadData.details, 'click');
        };
      self.query = ko.observable('');
     //for filter operations
      self.search = ko.computed(function() {
        var newArray = ko.utils.arrayFilter(self.locations(), function(place)  {
          if(place.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
            if(place.locationObject) {
              place.locationObject.setVisible(true);
            }
            return true;
          }else {
            place.locationObject.setVisible(false);
          }
        });
        return newArray;
      });
    };
