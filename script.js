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
let isAutoRotating = false;
let markerLostTimeout = null;

// 3D Model transformation state (Full 360 Yaw + Pitch tilt)
let currentScale = 0.5;
let currentRotationY = 0;
let currentRotationX = 0;
const MIN_SCALE = 0.1;
const MAX_SCALE = 3.0;

function applyModelTransform() {
    const model = document.getElementById('volcano-model');
    if (!model) return;

    // 1. Update A-Frame attributes
    model.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
    model.setAttribute('rotation', `${currentRotationX} ${currentRotationY} 0`);

    // 2. Direct Three.js Object3D manipulation for immediate GLTF rendering
    if (model.object3D) {
        model.object3D.scale.set(currentScale, currentScale, currentScale);
        model.object3D.rotation.y = (currentRotationY * Math.PI) / 180;
        model.object3D.rotation.x = (currentRotationX * Math.PI) / 180;
    }
}

// Toggle 360° Continuous Auto Rotation
function toggleAutoRotate(event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    isAutoRotating = !isAutoRotating;
    const spinBtn = document.getElementById('btn-spin-360');
    if (spinBtn) {
        if (isAutoRotating) {
            spinBtn.classList.add('active');
        } else {
            spinBtn.classList.remove('active');
        }
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

// Rotate Volcano Left / Right (360° continuous)
function rotateModel(degrees, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    // Stop auto-rotation when user manually steps
    if (isAutoRotating) {
        toggleAutoRotate();
    }

    currentRotationY = (currentRotationY + degrees) % 360;
    if (currentRotationY < 0) currentRotationY += 360;
    applyModelTransform();
}

// Reset Model Transformation
function resetModelTransform(event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    if (isAutoRotating) {
        toggleAutoRotate();
    }

    currentScale = 0.5;
    currentRotationY = 0;
    currentRotationX = 0;
    applyModelTransform();
}


// Keep model visible and enforce transforms on every frame
AFRAME.registerComponent('persistent-volcano', {
    init: function () {
        this.marker = this.el;
    },
    tick: function () {
        // Keep marker visible if exploring
        if (isExploring && this.marker && this.marker.object3D) {
            this.marker.object3D.visible = true;
        }

        // Auto 360° spin loop
        if (isAutoRotating) {
            currentRotationY = (currentRotationY + 0.6) % 360;
        }

        // Apply scale & rotation on every render tick so AR matrix updates don't override them
        const model = document.getElementById('volcano-model');
        if (model && model.object3D) {
            model.object3D.scale.set(currentScale, currentScale, currentScale);
            model.object3D.rotation.y = (currentRotationY * Math.PI) / 180;
            model.object3D.rotation.x = (currentRotationX * Math.PI) / 180;
        }
    }
});


// Multi-Touch (Pinch-to-Zoom & 360 Drag Rotate) + Mouse Gestures
(function setupTouchAndMouseGestures() {
    let isSingleDragging = false;
    let isPinching = false;

    // Single touch / Mouse tracking
    let startX = 0;
    let startY = 0;
    let initialRotY = 0;
    let initialRotX = 0;

    // Two finger pinch tracking
    let initialPinchDist = 0;
    let initialScaleOnPinch = 0.5;
    let initialPinchAngle = 0;

    function getTouchDistance(t1, t2) {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return Math.hypot(dx, dy);
    }

    function getTouchAngle(t1, t2) {
        return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * (180 / Math.PI);
    }

    function isInteractiveTarget(target) {
        return target && target.closest('button, .controls, .quiz, .scan-card, .sheet-top-bar, .sheet-header');
    }

    // --- TOUCH EVENTS (Phone Screen) ---
    function onTouchStart(e) {
        if (isInteractiveTarget(e.target)) return;

        if (e.touches.length === 1) {
            // Single finger drag to rotate 360°
            isSingleDragging = true;
            isPinching = false;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            initialRotY = currentRotationY;
            initialRotX = currentRotationX;

            if (isAutoRotating) toggleAutoRotate();
        } else if (e.touches.length === 2) {
            // Two fingers: Pinch-to-zoom & twist
            isSingleDragging = false;
            isPinching = true;
            initialPinchDist = getTouchDistance(e.touches[0], e.touches[1]);
            initialScaleOnPinch = currentScale;
            initialPinchAngle = getTouchAngle(e.touches[0], e.touches[1]);
            initialRotY = currentRotationY;

            if (isAutoRotating) toggleAutoRotate();
        }
    }

    function onTouchMove(e) {
        if (isInteractiveTarget(e.target)) return;

        if (isSingleDragging && e.touches.length === 1) {
            e.preventDefault(); // Prevent page pull/scroll during 3D rotation
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;

            // Full 360° horizontal rotation + vertical pitch tilt
            currentRotationY = (initialRotY + deltaX * 0.7) % 360;
            if (currentRotationY < 0) currentRotationY += 360;

            currentRotationX = Math.max(-60, Math.min(60, initialRotX + deltaY * 0.4));
            applyModelTransform();
        } else if (isPinching && e.touches.length === 2) {
            e.preventDefault(); // Prevent default mobile browser pinch-zoom
            const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
            if (initialPinchDist > 0) {
                const scaleFactor = currentDist / initialPinchDist;
                currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, +(initialScaleOnPinch * scaleFactor).toFixed(3)));
            }

            // Two-finger twist rotation
            const currentAngle = getTouchAngle(e.touches[0], e.touches[1]);
            const angleDelta = currentAngle - initialPinchAngle;
            currentRotationY = (initialRotY + angleDelta) % 360;
            if (currentRotationY < 0) currentRotationY += 360;

            applyModelTransform();
        }
    }

    function onTouchEnd(e) {
        if (e.touches.length === 0) {
            isSingleDragging = false;
            isPinching = false;
        } else if (e.touches.length === 1) {
            // Transition from pinch to single drag
            isPinching = false;
            isSingleDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            initialRotY = currentRotationY;
            initialRotX = currentRotationX;
        }
    }

    // --- MOUSE EVENTS (Desktop Testing) ---
    let isMouseDown = false;
    function onMouseDown(e) {
        if (isInteractiveTarget(e.target) || e.button !== 0) return;
        isMouseDown = true;
        startX = e.clientX;
        startY = e.clientY;
        initialRotY = currentRotationY;
        initialRotX = currentRotationX;
        if (isAutoRotating) toggleAutoRotate();
    }

    function onMouseMove(e) {
        if (!isMouseDown) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        currentRotationY = (initialRotY + deltaX * 0.6) % 360;
        if (currentRotationY < 0) currentRotationY += 360;

        currentRotationX = Math.max(-60, Math.min(60, initialRotX + deltaY * 0.35));
        applyModelTransform();
    }

    function onMouseUp() {
        isMouseDown = false;
    }

    function onWheel(e) {
        if (isInteractiveTarget(e.target)) return;
        e.preventDefault();
        if (e.deltaY < 0) {
            currentScale = Math.min(MAX_SCALE, +(currentScale * 1.1).toFixed(3));
        } else {
            currentScale = Math.max(MIN_SCALE, +(currentScale * 0.9).toFixed(3));
        }
        applyModelTransform();
    }

    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onWheel, { passive: false });
})();


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