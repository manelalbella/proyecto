document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault();



    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();



    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, password })
        });



        const data = await response.json();

        if (response.ok) {
            alert("✅ Registro exitoso. Ya puedes iniciar sesión.");
            window.location.href = "login.html"; 
        } else {
            console.warn("⚠️ Error en el registro:", data.message);
        }


    } catch (error) {
        console.error("❌ Error al registrar:", error);
        document.getElementById("message").textContent = "⚠️ Error en el registro.";
    }
});
