
//Function to take inputs and put them in the queryURL
function buildQueryURL() {
 
 var queryURL = 'https://api.radar.io/v1/geocode/forward?query=';
 console.log(queryURL)

 //Value is a placeholder. Will be changed once input fields are created.
 var address = "+" + "Upper Ground";

 if (address) {
 address = address.replaceAll(" ", "+");
 queryURL += address;
 console.log(queryURL);
 console.log(address);
 }

//Value is a placeholder. Will be changed once input fields are created.
 var city = "+" + "London"

 if (city) {
 city = city.replaceAll(" ", "+");
 queryURL += city;
 console.log(city);
 console.log(queryURL)
}

//Value is a placeholder. Will be changed once input fields are created.
var state = "+" + ""

if (state) {
    state = state.replaceAll(" ", "+");
    queryURL += state;
    console.log(state);
    console.log(queryURL)
}

//Value is a placeholder. Will be changed once input fields are created.
var zip = "+" + "SE1 9PX"

if (zip) {
    zip = zip.replaceAll(" ", "+");
    queryURL += zip;
    console.log(zip);
    console.log(queryURL)
}

//Value is a placeholder. Will be changed once input fields are created.
var country = "+" + "UK"

if (country) {
    country = country.replaceAll(" ", "+");
    queryURL += country;
    console.log(country);
    console.log(queryURL)
}
return queryURL
}

//Function to return info from latitude and longitude
function getMapInfo(latitude, longitude) {
    // var chargeKey = "6375c58d-f6df-4c4c-a52f-484acaf89aaf";
    
var chargeURL = "https://api.openchargemap.io/v3/poi/?output=json&latitude=" + latitude + "&longitude=" + longitude + "&maxresults=10";

$.ajax({
    method: "GET",
    url: chargeURL
}).then(function(response) {
    console.log(response);
})

}

//Onclick function that retrieves radar and open charger objects
$(".test").on("click", function() {

var radarURL = buildQueryURL();
console.log(radarURL)

$.ajax({
    url: radarURL,
    beforeSend: function(xhr) {
         xhr.setRequestHeader("Authorization", "prj_test_pk_00195690c8304f5476bd6724bb7b514f8b7f5250")
    }, success: function(data){
        console.log(data);

        var lat = data.addresses[0].latitude;
        var long = data.addresses[0].longitude;
       
        getMapInfo(lat, long);
    }
})
})
