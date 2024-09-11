const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Location access granted", position);
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Error with geolocation:", error);
            if (error.code === error.PERMISSION_DENIED) {
                alert("Location access is required to use this feature.");
            }
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
} else {
    alert("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0,0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Mohsin Practicing"
}).addTo(map)

const markers = {};

// Listen for 'receive-location' event
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // Set the map view to the user's location
    map.setView([latitude, longitude], 16);

    // If the marker exists, update its position
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    // Else, create a new marker for the user
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Listen for 'user-disconnected' event
socket.on('user-disconnected', (id) => {
    // If the marker exists, remove it from the map
    if (markers[id]) {
        map.removeLayer(markers[id]);  // Remove marker from the map
        delete markers[id];            // Remove marker from the markers object
    }
});