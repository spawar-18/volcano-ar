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


// Marker Detection Logic: Show volcano data ONLY when Hiro marker is scanned
window.addEventListener('load', () => {
    const marker = document.querySelector('a-marker');
    const volcanoData = document.getElementById('volcano-data');
    const scanPrompt = document.getElementById('scan-prompt');
    const markerStatus = document.getElementById('marker-status');

    if (marker) {
        marker.addEventListener('markerFound', () => {
            if (volcanoData) {
                volcanoData.classList.remove('hidden');
            }
            if (scanPrompt) {
                scanPrompt.classList.add('hidden');
            }
            if (markerStatus) {
                markerStatus.innerText = '✅ Marker Detected! Explore volcano parts & quiz below.';
            }
        });

        marker.addEventListener('markerLost', () => {
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