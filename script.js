const information = {

    crater:
        "🕳️ CRATER: The crater is the opening at the top of many volcanoes. Lava, ash and gases can escape through volcanic openings.",

    magma:
        "🔥 MAGMA: Magma is molten rock located beneath Earth's surface. When it reaches the surface, it becomes lava.",

    lava:
        "🌋 LAVA: Lava is molten rock that has erupted onto Earth's surface. It can flow down the sides of a volcano.",

    ash:
        "💨 ASH & GAS: Volcanic eruptions can release tiny rock particles called ash as well as gases such as water vapour and carbon dioxide."
};


function showInfo(part) {

    document.getElementById("info").innerText =
        information[part];
}


function erupt() {

    const info = document.getElementById("info");

    info.innerText =
        "🌋 ERUPTION! Magma rises toward the surface and can erupt as lava, ash and volcanic gases.";

    document.body.classList.add("eruption");

    setTimeout(function () {

        document.body.classList.remove("eruption");

    }, 1500);
}


function answer(correct) {

    const result =
        document.getElementById("quiz-result");

    if (correct) {

        result.innerText =
            "✅ Correct! Magma is molten rock beneath Earth's surface.";

    } else {

        result.innerText =
            "❌ Not quite. Try again!";
    }
}


let isExploring = false;
let hasDetected = false;
let markerLostTimeout = null;

// Keep model visible in AR scene even if camera tilts or moves during interaction
AFRAME.registerComponent('persistent-volcano', {
    init: function () {
        this.marker = this.el;
    },
    tick: function () {
        // If user is currently exploring or model was detected and active, enforce visibility
        if (isExploring && this.marker && this.marker.object3D) {
            this.marker.object3D.visible = true;
        }
    }
});


// Toggle facts and quiz panel
function toggleExplore(show) {
    isExploring = show;
    const volcanoData = document.getElementById('volcano-data');
    const exploreBar = document.getElementById('explore-bar');
    const scanPrompt = document.getElementById('scan-prompt');
    const marker = document.getElementById('hiro-marker');

    if (show) {
        if (volcanoData) volcanoData.classList.remove('hidden');
        if (exploreBar) exploreBar.classList.add('hidden');
        if (scanPrompt) scanPrompt.classList.add('hidden');
        
        // Ensure 3D model stays active while exploring
        if (marker && marker.object3D) {
            marker.object3D.visible = true;
        }
    } else {
        if (volcanoData) volcanoData.classList.add('hidden');
        if (exploreBar) exploreBar.classList.remove('hidden');
    }
}


// Marker Detection Logic: Show 3D Model & Explore Button when Hiro marker is scanned
window.addEventListener('load', () => {
    const marker = document.querySelector('a-marker');
    if (marker) {
        marker.setAttribute('persistent-volcano', '');
    }

    const markerContainer = document.getElementById('marker-detected-container');
    const volcanoData = document.getElementById('volcano-data');
    const exploreBar = document.getElementById('explore-bar');
    const scanPrompt = document.getElementById('scan-prompt');
    const markerStatus = document.getElementById('marker-status');

    if (marker) {
        marker.addEventListener('markerFound', () => {
            hasDetected = true;
            if (markerLostTimeout) {
                clearTimeout(markerLostTimeout);
                markerLostTimeout = null;
            }

            if (markerContainer) {
                markerContainer.classList.remove('hidden');
            }
            if (exploreBar && !isExploring) {
                exploreBar.classList.remove('hidden');
            }
            if (scanPrompt) {
                scanPrompt.classList.add('hidden');
            }
            if (markerStatus) {
                markerStatus.innerText = '✅ Volcano Model Active! Explore below.';
            }
        });

        marker.addEventListener('markerLost', () => {
            // DO NOT remove the model or hide the UI if the user is currently exploring!
            if (isExploring) {
                if (marker.object3D) {
                    marker.object3D.visible = true;
                }
                return;
            }

            // If not exploring, use a grace period (2.5s) to avoid losing model on brief hand/camera jitters
            if (markerLostTimeout) clearTimeout(markerLostTimeout);
            markerLostTimeout = setTimeout(() => {
                if (!isExploring) {
                    if (markerContainer) {
                        markerContainer.classList.add('hidden');
                    }
                    if (volcanoData) {
                        volcanoData.classList.add('hidden');
                    }
                    if (scanPrompt) {
                        scanPrompt.classList.remove('hidden');
                    }
                    if (markerStatus) {
                        markerStatus.innerText = '🔍 Point your camera at the Hiro marker to scan';
                    }
                }
            }, 2500);
        });
    }
});