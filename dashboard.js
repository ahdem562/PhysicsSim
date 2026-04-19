window.onload = async function () {
    try {
        const session = await apiRequest("/check_session.php");

        if (!session.logged_in) {
            window.location.href = "index.html";
            return;
        }

        await loadSimulations();
    } catch (err) {
        window.location.href = "index.html";
    }
};

async function loadSimulations() {
    try {
        const result = await apiRequest("/load_simulations.php");

        const container = document.getElementById("sim-list");
        container.innerHTML = "";

        if (!result.simulations || result.simulations.length === 0) {
            container.innerHTML = "<p>No saved simulations yet.</p>";
            return;
        }

        result.simulations.forEach(sim => {
            const div = document.createElement("div");
            div.className = "sim-card";

            div.innerHTML = `
        <h3>${escapeHtml(sim.sim_name)}</h3>
        <p>Saved: ${escapeHtml(sim.created_at)}</p>
        <button onclick="loadSim(${sim.id})">Load</button>
        <button onclick="deleteSim(${sim.id})">Delete</button>
      `;

            container.appendChild(div);
        });
    } catch (err) {
        alert("Error loading simulations: " + err.message);
    }
}

async function loadSim(id) {
    try {
        const result = await apiRequest("/load_simulations.php");
        const sim = result.simulations.find(s => Number(s.id) === Number(id));

        if (!sim) {
            alert("Simulation not found");
            return;
        }

        const state = JSON.parse(sim.particle_data_json);

        if (window.engine && typeof window.engine.loadState === "function") {
            window.engine.loadState(state);
            alert("Simulation loaded");
        } else {
            console.log("Loaded state:", state);
            alert("Simulation data loaded in console. engine.loadState() is not connected yet.");
        }
    } catch (err) {
        alert("Load failed: " + err.message);
    }
}

async function deleteSim(id) {
    try {
        await apiRequest("/delete_simulation.php", "POST", { id });
        await loadSimulations();
    } catch (err) {
        alert("Delete failed: " + err.message);
    }
}

async function saveSimulation() {
    try {
        let state;

        if (window.engine && typeof window.engine.getState === "function") {
            state = window.engine.getState();
        } else {
            state = {
                particles: [],
                gravity: document.getElementById("gravity")?.value ?? 9.8,
                bounce: document.getElementById("bounce")?.value ?? 0.8,
                airResistance: document.getElementById("airToggle")?.checked ?? false
            };
        }

        const simName = prompt("Enter a name for this simulation:", "My Simulation");
        if (!simName) return;

        await apiRequest("/save_simulation.php", "POST", {
            name: simName,
            data: state
        });

        alert("Simulation saved!");
        await loadSimulations();
    } catch (err) {
        alert("Save failed: " + err.message);
    }
}

async function logout() {
    try {
        await apiRequest("/logout.php");
    } catch (err) {
    }

    window.location.href = "index.html";
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
} //edited