//MapQuest Function. Placeholder values. Doesn't really have a function yet
window.onload = function () {

    //Placeholder map
    L.mapquest.key = 'lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24';

    var map = L.mapquest.map('map', {
        center: [40.7128, -74.0059],
        layers: L.mapquest.tileLayer('map'),
        zoom: 13
    });


    //Function to take inputs and put them in the queryURL
    function buildQueryURL() {

        var queryURL = 'https://api.radar.io/v1/geocode/forward?query=';

        //Value is a placeholder. Will be changed once input fields are created.
        var address = "+" + "1508 Sumter Ave N";

        if (address) {
            address = address.replaceAll(" ", "+");
            queryURL += address;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var city = "+" + "Golden Valley"

        if (city) {
            city = city.replaceAll(" ", "+");
            queryURL += city;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var state = "+" + "MN"

        if (state) {
            state = state.replaceAll(" ", "+");
            queryURL += state;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var zip = "+" + "55427"

        if (zip) {
            zip = zip.replaceAll(" ", "+");
            queryURL += zip;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var country = "+" + "US"

        if (country) {
            country = country.replaceAll(" ", "+");
            queryURL += country;
        }

        return queryURL
    }

    //Function to return info from latitude and longitude
    function getMapInfo(latitude, longitude) {

        var chargeURL = "https://api.openchargemap.io/v3/poi/?output=json&latitude=" + latitude + "&longitude=" + longitude + "&maxresults=10";

        $.ajax({
            method: "GET",
            url: chargeURL
        }).then(function (response) {
            console.log(response);

            L.mapquest.key = 'lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24';

            var map = L.mapquest.map('map', {
                center: [latitude, longitude],
                layers: L.mapquest.tileLayer('map'),
                zoom: 13
            });

            for (var i = 0; i < 5; i++) {
                var station = response[i];

                //For rendering on page
                var stationName = station.AddressInfo.Title;
                var stationAddress = station.AddressInfo.AddressLine1;
                var stationTown = station.AddressInfo.Town;
                var stationState = station.AddressInfo.StateOrProvince;
                var stationZip = station.AddressInfo.Postcode;
                var stationURL = station.AddressInfo.RelatedURL;
                var stationPhone = station.AddressInfo.ContactTelephone1;
                var stationComments = station.AddressInfo.AccessComments;

                var stationStatus = station.UsageType.Title;

                //For Mapquest API
                var stationLat = station.AddressInfo.Latitude;
                var stationLong = station.AddressInfo.Longitude;

                //puts pins in map for locations
                L.marker([stationLat, stationLong], {
                    icon: L.mapquest.icons.marker(),
                    draggable: false
                }).bindPopup(stationName).addTo(map);

                //Directions function for mapquest. Will not live here.
                // L.mapquest.directions().route({
                //   start: '350 5th Ave, New York, NY 10118',
                //   end: 'One Liberty Plaza, New York, NY 10006'
                // });

            }

        })

    }

    //Onclick function that retrieves radar and open charger objects
    $(".test").on("click", function () {

        //Empties placeholder map
        map.remove()

        var radarURL = buildQueryURL();

        $.ajax({
            url: radarURL,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "prj_test_pk_00195690c8304f5476bd6724bb7b514f8b7f5250")
            }, success: function (data) {


                var lat = data.addresses[0].latitude;
                var long = data.addresses[0].longitude;

                getMapInfo(lat, long);
            }, error: function (jqXHR) {
                //Enter error functions here
            }

        })
    })



}