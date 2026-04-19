document.addEventListener("DOMContentLoaded", () => {

    const gravitySlider = document.getElementById("gravity");
    const bounceSlider = document.getElementById("bounce");
    const airToggle = document.getElementById("airToggle");

    // Gravity control
    gravitySlider.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);

        if (window.engine && typeof window.engine.setGravity === "function") {
            window.engine.setGravity(value);
        } else {
            console.log("Gravity changed:", value);
        }
    });

    // Bounce control
    bounceSlider.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);

        if (window.engine && typeof window.engine.setBounce === "function") {
            window.engine.setBounce(value);
        } else {
            console.log("Bounce changed:", value);
        }
    });

    // Air resistance toggle
    airToggle.addEventListener("change", (e) => {
        const enabled = e.target.checked;

        if (window.engine && typeof window.engine.toggleAirResistance === "function") {
            window.engine.toggleAirResistance(enabled);
        } else {
            console.log("Air resistance:", enabled);
        }
    });

});