const API_URL = "backend";

async function apiRequest(endpoint, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(API_URL + endpoint, options);

    let data;
    try {
        data = await res.json();
    } catch (err) {
        throw new Error("Invalid server response");
    }

    if (!res.ok || data.success === false) {
        throw new Error(data.message || "API error");
    }

    return data;
}