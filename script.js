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

    const infoElem = document.getElementById("info");
    if (infoElem && information[part]) {
        infoElem.innerText = information[part];
    }
}


function erupt() {

    const info = document.getElementById("info");
    if (info) {
        info.innerText =
            "🌋 ERUPTION! Magma rises toward the surface and can erupt as lava, ash and volcanic gases.";
    }

    document.body.classList.add("eruption-active");

    setTimeout(function () {
        document.body.classList.remove("eruption-active");
    }, 1500);
}


function answer(correct) {

    const result = document.getElementById("quiz-result");
    if (!result) return;

    if (correct) {
        result.innerText =
            "✅ Correct! Magma is molten rock beneath Earth's surface.";
        result.style.color = "#2ecc71";
    } else {
        result.innerText =
            "❌ Not quite. Try again!";
        result.style.color = "#e74c3c";
    }
}