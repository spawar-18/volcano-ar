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


// Toggle facts and quiz panel
function toggleExplore(show) {
    const volcanoData = document.getElementById('volcano-data');
    const exploreBar = document.getElementById('explore-bar');

    if (volcanoData) {
        if (show) {
            volcanoData.classList.remove('hidden');
            if (exploreBar) exploreBar.classList.add('hidden');
        } else {
            volcanoData.classList.add('hidden');
            if (exploreBar) exploreBar.classList.remove('hidden');
        }
    }
}


// Marker Detection Logic: Show 3D Model & Explore Button when Hiro marker is scanned
window.addEventListener('load', () => {
    const marker = document.querySelector('a-marker');
    const markerContainer = document.getElementById('marker-detected-container');
    const volcanoData = document.getElementById('volcano-data');
    const exploreBar = document.getElementById('explore-bar');
    const scanPrompt = document.getElementById('scan-prompt');
    const markerStatus = document.getElementById('marker-status');

    if (marker) {
        marker.addEventListener('markerFound', () => {
            if (markerContainer) {
                markerContainer.classList.remove('hidden');
            }
            if (exploreBar) {
                exploreBar.classList.remove('hidden');
            }
            if (scanPrompt) {
                scanPrompt.classList.add('hidden');
            }
            if (markerStatus) {
                markerStatus.innerText = '✅ Volcano Model Active! Tap "Explore More" below.';
            }
        });

        marker.addEventListener('markerLost', () => {
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
        });
    }
});