//Necessary to wrap whole page in this function for MapQuest needs
window.onload = function () {

    //MapQuest Function. Placeholder values. Doesn't really have a function yet
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
        var address = $("#addressInput").val();

        if (address) {
            address = "+" + address;
            address = address.replaceAll(" ", "+");
            queryURL += address;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var city = $("#cityInput").val();

        if (city) {
            city = "+" + city;
            city = city.replaceAll(" ", "+");
            queryURL += city;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var state = $("#stateInput").val();

        if (state) {
            state = "+" + state;
            state = state.replaceAll(" ", "+");
            queryURL += state;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var zip = $("#postalZipInput").val();

        if (zip) {
            zip = "+" + zip;
            zip = zip.replaceAll(" ", "+");
            queryURL += zip;
        }

        //Value is a placeholder. Will be changed once input fields are created.
        var country = $("#countryInput").val();

        if (country) {
            country = "+" + country;
            country = country.replaceAll(" ", "+");
            queryURL += country;
        }
        console.log(queryURL)
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

                var sWebsite = $("<p class='website'>")
                sWebsite.html("<b>Website: </b>" + stationURL);
                stationDiv.append(sWebsite);

                var sPhone = $("<p class='phone'>")
                sPhone.html("<b>Phone: </b>" + stationPhone);
                stationDiv.append(sPhone);
              
                var sComments = $("<p class='comments'>")
                sComments.html("<b>Comments: </b>" + stationComments);
                stationDiv.append(sComments);

                var sStatus = $("<p class='status'>")
                sStatus.html("<b>Status: </b>" + stationStatus);
                stationDiv.append(sStatus);


                $(".field").append(stationDiv);


                //For Mapquest API
                var stationLat = station.AddressInfo.Latitude;
                var stationLong = station.AddressInfo.Longitude;

                //puts pins in map for locations
                L.marker([stationLat, stationLong], {
                    icon: L.mapquest.icons.marker(),
                    draggable: false,
                    
                }).bindPopup(stationName).addTo(map);

            }

        })

    }

    $(".mapTest").on("click", function () {
    
       //Start and end are placeholders. Will be changed with input fields are ready
                L.mapquest.directions().route({
                  start: '350 5th Ave, New York, NY 10118',
                  end: 'One Liberty Plaza, New York, NY 10006'
                });
            })
    

    //Onclick function that retrieves radar and open charger objects
    $("#userSubmit").on("click", function () {

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

                console.log(lat + " " + long);

                getMapInfo(lat, long);

            
            }, error: function (jqXHR) {
                console.log(jqXHR)
                $(".modal").addClass("is-active");
            
            $(".modal-close").click(function() {
               $(".modal").removeClass("is-active");
            });
            }

        })
    })

}