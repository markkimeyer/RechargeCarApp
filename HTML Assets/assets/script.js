//Necessary to wrap whole page in this function for MapQuest needs
window.onload = function () {

    var startAddress = "";

    //MapQuest Function. Placeholder values. Doesn't really have a function yet
    L.mapquest.key = 'lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24';


    var map = L.mapquest.map('map', {
        center: [34.05513, -118.25703],
        layers: L.mapquest.tileLayer('light'),
        zoom: 9
    });

    //Function to take inputs and put them in the queryURL
    function buildQueryURL() {

        var queryURL = 'https://api.radar.io/v1/geocode/forward?query=';

        //Value is a placeholder. Will be changed once input fields are created.
        var address = $("#addressInput").val();

        if (address) {
            startAddress += address + " ";
            address = "+" + address;
            address = address.replaceAll(" ", "+");
            queryURL += address;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var city = $("#cityInput").val();

        if (city) {
            startAddress += city + " ";
            city = "+" + city;
            city = city.replaceAll(" ", "+");
            queryURL += city;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var state = $("#stateInput").val();

        if (state) {
            startAddress += state + " ";
            state = "+" + state;
            state = state.replaceAll(" ", "+");
            queryURL += state;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var zip = $("#postalZipInput").val();

        if (zip) {
            startAddress += zip + " ";
            zip = "+" + zip;
            zip = zip.replaceAll(" ", "+");
            queryURL += zip;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var country = $("#countryInput").val();

        if (country) {
            startAddress += country;
            country = "+" + country;
            country = country.replaceAll(" ", "+");
            queryURL += country;
        }

        console.log(startAddress);
        console.log(queryURL)
        return queryURL
    }

    //Function to return info from latitude and longitude
    function getMapInfo(latitude, longitude) {

        $(".field").empty()

        var chargeURL = "https://api.openchargemap.io/v3/poi/?output=json&latitude=" + latitude + "&longitude=" + longitude + "&maxresults=10";

        $.ajax({
            method: "GET",
            url: chargeURL
        }).then(function (response) {
            console.log(response);

            L.mapquest.key = 'lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24';

            map = L.mapquest.map('map', {
                center: [latitude, longitude],
                layers: L.mapquest.tileLayer('light'),
                zoom: 11
            });

            for (var i = 0; i < 5; i++) {
                var station = response[i];

                var stationName = station.AddressInfo.Title;
                var stationAddress = station.AddressInfo.AddressLine1;
                var stationTown = station.AddressInfo.Town;
                var stationState = station.AddressInfo.StateOrProvince;
                var stationZip = station.AddressInfo.Postcode;
                var stationURL = station.AddressInfo.RelatedURL;
                var stationPhone = station.AddressInfo.ContactTelephone1;
                var stationComments = station.AddressInfo.AccessComments;
                var stationStatus = station.UsageType.Title;

                var stationDiv = $("<div class='card' id='station'>")

                var sName = $("<h3 class='card-header-title'>");
                sName.html(stationName);
                stationDiv.append(sName);

                var sAddress = $("<p class='address'>")
                sAddress.html(stationAddress);
                stationDiv.append(sAddress);

                var sTown = $("<p class='town'>")
                sTown.html(stationTown + ", " + stationState + " " + stationZip);
                stationDiv.append(sTown);

                if (stationURL !== null) {
                    var sWebsite = $("<p class='website'>")
                    sWebsite.html("<b>Website: </b>" + stationURL);
                    stationDiv.append(sWebsite);
                }

                if (stationPhone !== null) {
                    var sPhone = $("<p class='phone'>")
                    sPhone.html("<b>Phone: </b>" + stationPhone);
                    stationDiv.append(sPhone);
                }

                if (stationComments !== null) {
                    var sComments = $("<p class='comments'>")
                    sComments.html("<b>Comments: </b>" + stationComments);
                    stationDiv.append(sComments);
                }

                if (stationStatus !== "Unknown") {
                    var sStatus = $("<p class='status'>")
                    sStatus.html("<b>Status: </b>" + stationStatus);
                    stationDiv.append(sStatus);
                }

                var sButton = $("<button class='button is-black directBtn'>");
                sButton.text("Get Directions!");
                stationDiv.append(sButton);


                $(".field").append(stationDiv);


                //For Mapquest API
                var stationLat = station.AddressInfo.Latitude;
                var stationLong = station.AddressInfo.Longitude;

                //puts pins in map for locations
                L.marker([stationLat, stationLong], {
                    icon: L.mapquest.icons.marker(),
                    draggable: false,
                    zoom: 14
                }).bindPopup(stationName).addTo(map);

            }

        })

    }

    //Onclick event to render directions to map
    $(document).on("click", ".directBtn", function () {
       
       map.remove()

       $("#stationField").empty()

        L.mapquest.key = 'lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24';

        L.mapquest.geocoding().geocode(startAddress, createMap);

        function createMap(error, response) {
          var location = response.results[0].locations[0];
          var latLng = location.displayLatLng;
          L.mapquest.map('map', {
            center: latLng,
            layers: L.mapquest.tileLayer('light'),
            zoom: 14
          });
        }

        var endAddress = $(this).parent().children(".address").text() + " " + $(this).parent().children(".town").text()

        //Need to figure out how to delete old route when new route is put in

        L.mapquest.directions().route({
            start: startAddress,
            end: endAddress,
        });


    })

    //Onclick function that retrieves radar and open charger objects
    $("#userSubmit").on("click", function () {


        var radarURL = buildQueryURL();

        $.ajax({
            url: radarURL,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "prj_test_pk_00195690c8304f5476bd6724bb7b514f8b7f5250")
            }, success: function (data) {
                map.remove()

                var lat = data.addresses[0].latitude;
                var long = data.addresses[0].longitude;

                console.log(lat + " " + long);

                getMapInfo(lat, long);


            }, error: function (jqXHR) {
                console.log(jqXHR)

                $(".modal").addClass("is-active");

                $(".modal-close").click(function () {
                    $(".modal").removeClass("is-active");
                   
                });
            }

        })
    })

}