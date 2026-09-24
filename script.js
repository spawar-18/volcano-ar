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

// 3D Model transformation state
let currentScale = 0.5;
let currentRotationY = 0;
const MIN_SCALE = 0.1;
const MAX_SCALE = 3.0;

function applyModelTransform() {
    const model = document.getElementById('volcano-model');
    if (!model) return;

    // 1. Update A-Frame attributes
    model.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
    model.setAttribute('rotation', `0 ${currentRotationY} 0`);

    // 2. Direct Three.js Object3D manipulation for immediate GLTF rendering
    if (model.object3D) {
        model.object3D.scale.set(currentScale, currentScale, currentScale);
        model.object3D.rotation.y = (currentRotationY * Math.PI) / 180;
    }
}

// Zoom In / Zoom Out
function zoomModel(direction, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    if (direction > 0) {
        currentScale = Math.min(MAX_SCALE, +(currentScale * 1.35).toFixed(3));
    } else {
        currentScale = Math.max(MIN_SCALE, +(currentScale * 0.72).toFixed(3));
    }

    applyModelTransform();
}

// Rotate Volcano Left / Right
function rotateModel(degrees, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    currentRotationY = (currentRotationY + degrees) % 360;
    applyModelTransform();
}

// Reset Model Transformation
function resetModelTransform(event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    currentScale = 0.5;
    currentRotationY = 0;
    applyModelTransform();
}


// Keep model visible and ensure transforms stay active on every frame
AFRAME.registerComponent('persistent-volcano', {
    init: function () {
        this.marker = this.el;
    },
    tick: function () {
        // Keep marker visible if exploring
        if (isExploring && this.marker && this.marker.object3D) {
            this.marker.object3D.visible = true;
        }

        // Apply scale & rotation on every render tick so AR matrix updates don't override them
        const model = document.getElementById('volcano-model');
        if (model && model.object3D) {
            model.object3D.scale.set(currentScale, currentScale, currentScale);
            model.object3D.rotation.y = (currentRotationY * Math.PI) / 180;
        }
    }
});


// Toggle facts and quiz panel
function toggleExplore(show) {
    isExploring = show;
    const volcanoData = document.getElementById('volcano-data');
    const exploreBar = document.getElementById('explore-bar');
    const scanPrompt = document.getElementById('scan-prompt');
    const modelControls = document.getElementById('model-controls');
    const marker = document.getElementById('hiro-marker');

    if (show) {
        if (volcanoData) volcanoData.classList.remove('hidden');
        if (exploreBar) exploreBar.classList.add('hidden');
        if (scanPrompt) scanPrompt.classList.add('hidden');
        if (modelControls) modelControls.classList.remove('hidden');
        
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
    const modelControls = document.getElementById('model-controls');
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
            if (modelControls) {
                modelControls.classList.remove('hidden');
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
                    if (modelControls) {
                        modelControls.classList.add('hidden');
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