if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}
window.onload = loadSimulations;

async function loadSimulations(id) {
  try {
    const sims = await apiRequest("/simulations/${id}");

    const container = document.getElementById("sim-list");
    container.innerHTML = "";

    sims.forEach(sim => {
      const div = document.createElement("div");

      div.innerHTML = `
        <h3>${sim.name}</h3>
        <button onclick="loadSim('${sim.id}')">Load</button>
        <button onclick="deleteSim('${sim.id}')">Delete</button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    alert("Error loading simulations");
  }
}

function loadSim(id) {
  alert("Load simulation " + id);

}

async function deleteSim(id) {
  try {
    await apiRequest(`/simulations/${id}`, "DELETE");
    loadSimulations();
  } catch (err) {
    alert("Delete failed");
  }
}
async function saveSimulation() {
  try {
    const state = window.engine.getState();

    await apiRequest("/simulations", "POST", {
      name: "My Simulation",
      data: state
    });

    alert("Simulation saved!");
    loadSimulations();

  } catch (err) {
    alert("Save failed");
  }
}
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}