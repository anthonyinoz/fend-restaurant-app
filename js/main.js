let restaurants,
neighborhoods,
cuisines
var newMap
var markers = []

/**
* Fetch neighborhoods and cuisines as soon as the page is loaded.
*/
document.addEventListener('DOMContentLoaded', (event) => {
    initMap(); // added
    fetchNeighborhoods();
    fetchCuisines();
});

/**
* Fetch all neighborhoods and set their HTML.
*/
fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
        if (error) { // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
}

/**
* Set neighborhoods HTML.
*/
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append(option);
    });
}

/**
* Fetch all cuisines and set their HTML.
*/
fetchCuisines = () => {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
}

/**
* Set cuisines HTML.
*/
fillCuisinesHTML = (cuisines = self.cuisines) => {
    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
    });
}

/**
* Initialize leaflet map, called from HTML.
*/
initMap = () => {
    self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
    });
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiYW50aG9ueWlub3oiLCJhIjoiY2swN3B6NXJvNDFrdDNicDBlYzJ0ZjRjMiJ9.kreM9yVml4DLo5_v9JCsBQ',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(newMap);

    updateRestaurants();
}

/* window.initMap = () => {
let loc = {
lat: 40.722216,
lng: -73.987501
};
self.map = new google.maps.Map(document.getElementById('map'), {
zoom: 12,
center: loc,
scrollwheel: false
});
updateRestaurants();
} */

/**
* Update page and map for current restaurants.
*/
updateRestaurants = () => {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    })
}

/**
* Clear current restaurants, their HTML and remove their map markers.
*/
resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    if (self.markers) {
        self.markers.forEach(marker => marker.remove());
    }
    self.markers = [];
    self.restaurants = restaurants;
}

/**
* Create all restaurants HTML and add them to the webpage.
*/
fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
}

/**
* Create restaurant HTML.
>>>add alt text and title for image
*/
createRestaurantHTML = (restaurant) => {
    const li = document.createElement('li');
    const restaurantAnchor = document.createElement('a');
    const image = document.createElement('img');
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.alt = `Photo from ${restaurant.name}`;
    image.title = image.alt;
    li.append(image);

    // >>>changed heading from h1 to h2 so there is only one h1 on the page
    const name = document.createElement('h2');
    name.innerHTML = restaurant.name;
    li.append(name);

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    li.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    li.append(address);

    const more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.href = DBHelper.urlForRestaurant(restaurant);
    // >>>add a more informative aria-label to anchor to assist screen reader users
    let ariaLabelAttr = document.createAttribute('aria-label');
    ariaLabelAttr.value = `View Details for ${restaurant.name}`;
    more.setAttributeNode(ariaLabelAttr);
    li.append(more)

    return li
}

/**
* Add markers for current restaurants to the map.
*/
addMarkersToMap = (restaurants = self.restaurants) => {
    restaurants.forEach(restaurant => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
        // >>>added event handler for keypress to map markers to allow for keyboard only users
        marker.on("keypress", onClick);
        marker.on("click", onClick);
        function onClick() {
            window.location.href = marker.options.url;
        }
        self.markers.push(marker);
    });

}
/* addMarkersToMap = (restaurants = self.restaurants) => {
restaurants.forEach(restaurant => {
// Add marker to the map
const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
google.maps.event.addListener(marker, 'click', () => {
window.location.href = marker.url
});
self.markers.push(marker);
});
} */
