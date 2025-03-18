document.addEventListener("DOMContentLoaded", async function () {
    const tg = window.Telegram.WebApp;
    tg.expand(); // Разворачиваем Mini App на весь экран

    const apiUrl = window.env.API_URL;

    function logDebug(message) {
        console.log(message);
        document.getElementById("debug-log").innerText += `\n${message}`;
    }

    logDebug("📌 Mini App загружен, API_URL: " + apiUrl);

    document.getElementById("auth-btn")?.addEventListener("click", async function () {
        logDebug("🔹 Нажата кнопка 'Войти через Telegram'");

        const telegramData = tg.initDataUnsafe; // Все данные от Telegram
        if (!telegramData || !telegramData.user) {
            alert("Ошибка: Telegram Web App не передал данные.");
            return;
        }

        logDebug("📌 Данные для отправки на бэкенд:", JSON.stringify(telegramData));

        try {
            const response = await fetch(`${apiUrl}/account/auth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(telegramData),  // Отправляем все
            });

            const data = await response.json();
            logDebug("📌 Ответ сервера:", JSON.stringify(data));

            if (response.ok) {
                document.getElementById("user-info").innerHTML = `Привет, ${data.user.username || "пользователь"}!`;
                localStorage.setItem("jwt_token", data.token);

                // Перенаправляем на страницу заданий
                setTimeout(() => {
                    window.location.href = "/tasks";
                }, 1000);
            } else {
                alert(data.detail || "Ошибка авторизации");
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
            alert("Ошибка сети при авторизации.");
        }
    });
});
