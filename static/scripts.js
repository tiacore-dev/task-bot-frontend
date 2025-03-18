document.addEventListener("DOMContentLoaded", async function () {
    const tg = window.Telegram.WebApp;
    tg.expand();  // Разворачиваем Mini App

    const apiUrl = window.env.API_URL;
    const telegramData = tg.initDataUnsafe.user;

    if (!telegramData) {
        alert("Ошибка: Telegram Web App не передал данные.");
        return;
    }

    document.getElementById("login-btn")?.addEventListener("click", async function () {
        logDebug("🔹 Вход в систему...");

        try {
            const response = await fetch(`${apiUrl}/account/auth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    telegram_id: telegramData.id,
                    username: telegramData.username
                }),
            });

            const data = await response.json();
            logDebug("📌 Ответ сервера:", JSON.stringify(data));

            if (response.ok) {
                document.getElementById("user-info").innerHTML = `Привет, ${data.username || "пользователь"}!`;
                document.getElementById("tasks-btn").style.display = "block";
            } else {
                alert(data.detail || "Ошибка авторизации");
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
            alert("Ошибка сети при авторизации.");
        }
    });

    document.getElementById("tasks-btn")?.addEventListener("click", function () {
        window.location.href = "/tasks.html"; // Перенаправляем на страницу с заданиями
    });
});

// 📌 Логирование в debug-log
function logDebug(message) {
    console.log(message);
    document.getElementById("debug-log")?.innerText += `\n${message}`;
}
