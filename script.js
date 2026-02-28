// --- FONDO MATRIX ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

const chars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリ1234567890ABCXYZ";
const charArr = chars.split('');
const fontSize = 16;
let columns = canvas.width / fontSize;
let drops = Array(Math.floor(columns)).fill(1);

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = fontSize + "px monospace";
    drops.forEach((y, i) => {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        ctx.fillText(text, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(draw, 33);

// --- LÓGICA DE TERMINAL E INSTRUCCIONES ---
const input = document.getElementById('commandInput');
const output = document.getElementById('output');
const promptText = document.getElementById('promptText');
const pistaBtn = document.getElementById('pistaBtn');

let autenticado = false;
let fasePassword = false;
let nombreAgente = "";

// Configuración del acertijo: "HO FRGLJR HV JUDWLV" (Desplazamiento +3)
const FRASE_CIFRADA = "HO FRGLJR HV JUDWLV";
const SOLUCION = "EL CODIGO ES GRATIS";

function imprimir(texto, clase = "") {
    const p = document.createElement('p');
    p.innerHTML = texto;
    if (clase) p.className = clase;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
}

// Mensaje de inicio
imprimir("SISTEMA DE SEGURIDAD 'ORACLE' V.7.2", "highlight");
imprimir("SISTEMA BLOQUEADO. REQUIERE IDENTIFICACIÓN.");
imprimir("------------------------------------------");
imprimir("PASO 1: Ingrese su nombre de agente.");
promptText.innerText = "NOMBRE:";

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const val = input.value.trim();
        input.value = "";
        if (!autenticado) manejarLogin(val);
        else procesarComando(val.toLowerCase());
    }
});

function manejarLogin(val) {
    if (!fasePassword) {
        nombreAgente = val || "Recluta";
        imprimir(`ID REGISTRADA: AGENTE ${nombreAgente.toUpperCase()}`, "success");
        
        // Instrucciones Claras
        imprimir("<br>PASO 2: PRUEBA DE CRIPTOGRAFÍA", "highlight");
        imprimir("INSTRUCCIONES:");
        imprimir("1. Analice la frase cifrada que se muestra abajo.");
        imprimir("2. Use un desplazamiento de alfabeto (César) para hallar el original.");
        imprimir("3. Escriba la frase completa respetando los espacios.");
        imprimir("<br>FRASE A DESCIFRAR:");
        imprimir(`<span class='highlight' style='font-size: 1.4em; letter-spacing: 3px;'>${FRASE_CIFRADA}</span>`);
        
        fasePassword = true;
        promptText.innerText = "DESCIFRADO:";
        pistaBtn.classList.remove("hidden");
    } else {
        if (val.toUpperCase() === SOLUCION) {
            autenticado = true;
            pistaBtn.classList.add("hidden");
            imprimir("[OK] CÓDIGO CORRECTO. DESBLOQUEANDO NÚCLEO...", "success");
            setTimeout(() => {
                output.innerHTML = "";
                imprimir(`SESIÓN INICIADA: AGENTE ${nombreAgente.toUpperCase()}`, "highlight");
                imprimir("Escriba 'ayuda' para ver la lista de protocolos operativos.");
                promptText.innerText = `${nombreAgente.toLowerCase()}@oracle:~$`;
            }, 1200);
        } else {
            imprimir("[X] ERROR: DESCIFRADO INCORRECTO. VUELVA A INTENTAR.", "error");
        }
    }
}

pistaBtn.addEventListener('click', () => {
    imprimir("<br>--- SOPORTE TÉCNICO ---", "warning");
    imprimir("TIPO DE CIFRADO: César (Rotación).");
    imprimir("CLAVE: Cada letra fue movida <span class='highlight'>3 posiciones hacia adelante</span> (A se convirtió en D).");
    imprimir("PROCEDIMIENTO: Reste 3 posiciones a cada letra de la frase.");
    pistaBtn.classList.add("hidden"); // Se oculta tras usarla para mayor dificultad
});

function procesarComando(cmd) {
    const cmdList = {
        "ayuda": "Protocolos: estado, escanear, borrar, salir",
        "estado": "NÚCLEO: Estable. MEMORIA: 89% libre. CONEXIÓN: Proxy-Encadenado.",
        "escanear": "Escaneando... <span class='success'>No se encontraron balizas enemigas.</span>",
        "borrar": "CLEAR",
        "salir": "REBOOT"
    };

    if (cmd === "borrar") { output.innerHTML = ""; return; }
    if (cmd === "salir") { location.reload(); return; }
    
    imprimir(`<span class="prompt">${nombreAgente.toLowerCase()}@oracle:~$</span> ${cmd}`);
    if (cmdList[cmd]) imprimir(cmdList[cmd]);
    else if (cmd !== "") imprimir(`Comando '${cmd}' no reconocido. Acceso denegado.`, "error");
}

document.querySelector('.terminal-container').addEventListener('click', () => input.focus());