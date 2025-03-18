document.addEventListener("DOMContentLoaded", async function () {
    const tg = window.Telegram.WebApp;
    tg.expand();
    const apiUrl = window.env.API_URL;
    const telegramId = tg.initDataUnsafe.user.id;

    async function loadTasks(category, elementId) {
        try {
            const response = await fetch(`${apiUrl}/tasks/${category}?telegram_id=${telegramId}`);
            if (response.ok) {
                const tasks = await response.json();
                const taskList = document.getElementById(elementId);
                taskList.innerHTML = "";
                tasks.forEach(task => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <b>${task.title}</b><br>
                        ${task.description}<br>
                        ${category === "available" ? `<button onclick="acceptTask('${task.task_id}')">✅ Взять</button>` : ""}
                        ${category === "active" ? `<button onclick="submitTask('${task.task_id}')">📤 Сдать</button>` : ""}
                    `;
                    taskList.appendChild(li);
                });
            } else {
                console.error(`Ошибка загрузки ${category}`);
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
        }
    }

    window.acceptTask = async function (taskId) {
        try {
            const response = await fetch(`${apiUrl}/tasks/${taskId}/accept`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ telegram_id: telegramId }),
            });

            if (response.ok) {
                alert("Задание принято!");
                loadTasks("available", "available-tasks");
                loadTasks("active", "active-tasks");
            } else {
                alert("Ошибка при принятии задания");
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
        }
    };

    window.submitTask = async function (taskId) {
        try {
            const response = await fetch(`${apiUrl}/tasks/${taskId}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ telegram_id: telegramId }),
            });

            if (response.ok) {
                alert("Задание отправлено на проверку!");
                loadTasks("active", "active-tasks");
                loadTasks("completed", "completed-tasks");
            } else {
                alert("Ошибка при сдаче задания");
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
        }
    };

    window.showTab = function (tabId) {
        document.querySelectorAll(".tab-content").forEach(tab => {
            tab.classList.remove("active");
        });
        document.querySelectorAll(".tab-btn").forEach(button => {
            button.classList.remove("active");
        });

        document.getElementById(tabId).classList.add("active");
        document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add("active");
    };

    loadTasks("available", "available-tasks");
    loadTasks("active", "active-tasks");
    loadTasks("completed", "completed-tasks");
    loadTasks("history", "history-list");
});
