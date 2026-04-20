document.addEventListener("DOMContentLoaded", () => {

  const gravitySlider = document.getElementById("gravity");
  const bounceSlider = document.getElementById("bounce");
  const airToggle = document.getElementById("airToggle");
  const repulsionSlider = document.getElementById("repulsion");
 
  gravitySlider.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value);
    window.engine.setGravity(value);
  });

  bounceSlider.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value);
    window.engine.setBounce(value);
  });

  airToggle.addEventListener("change", (e) => {
    const enabled = e.target.checked;
    window.engine.toggleAirResistance(enabled);
  });

  if (repulsionSlider) {
    repulsionSlider.addEventListener("input", (e) => {
      window.engine.setRepulsion(parseFloat(e.target.value));
    });
  }

});
