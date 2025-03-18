document.addEventListener("DOMContentLoaded", async function () {
    const tg = window.Telegram.WebApp;
    tg.expand();
    const apiUrl = window.env.API_URL;
    async function loadTasks(category, elementId) {
        const apiUrl = `${apiUrl}/api/tasks` + category;  // Укажи бэкенд

        const response = await fetch(apiUrl, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("jwt_token") }
        });

        if (response.ok) {
            const tasks = await response.json();
            const list = document.getElementById(elementId);
            list.innerHTML = "";
            tasks.forEach(task => {
                const li = document.createElement("li");
                li.textContent = task.description;
                list.appendChild(li);
            });
        } else {
            console.error("Ошибка загрузки " + category);
        }
    }

    if (window.location.pathname === "/tasks") {
        loadTasks("available", "available-tasks");
        loadTasks("active", "active-tasks");
        loadTasks("completed", "completed-tasks");
        loadTasks("history", "history-list");
    }
});

function showTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });
    document.querySelectorAll(".tab-btn").forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById(tabId).classList.add("active");
    document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add("active");
}
