// Año footer
document.getElementById('year').textContent = new Date().getFullYear();

/* // Modal Constitución
const openBtns = document.querySelectorAll('[data-open]');
const closeBtns = document.querySelectorAll('[data-close]');
openBtns.forEach(btn => btn.addEventListener('click', () => {
    const sel = btn.getAttribute('data-open');
    document.querySelector(sel).showModal();
}));
closeBtns.forEach(btn => btn.addEventListener('click', (e) => {
    const dialog = e.target.closest('dialog');
    dialog?.close();
})); */

// Modal Constitución
const openBtns = document.querySelectorAll('[data-open]');
const closeBtns = document.querySelectorAll('[data-close]');

openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const sel = btn.getAttribute('data-open');
        const dialog = document.querySelector(sel);
        if (dialog) dialog.showModal();
    });
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const dialog = e.target.closest('dialog');
        if (dialog) dialog.close();
    });
});


// Tema simple (toggle fondo)
document.getElementById('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('bg-slate-50');
    document.body.classList.toggle('text-slate-900');
});

/* // Countdown configurable: set below (YYYY-MM-DDTHH:MM)
const countdownEl = document.getElementById('countdown');
countdownEl.dataset.date = countdownEl.dataset.date || new Date(new Date().getTime() + 0 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16); // +3 días por defecto
function updateCountdown() {
    const target = new Date(countdownEl.dataset.date);
    const diff = target - new Date();
    if (diff <= 0) { countdownEl.textContent = '¡Es hoy! GG WP'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
}
setInterval(updateCountdown, 1000); updateCountdown(); */

const countdownEl = document.getElementById('countdown');

function updateCountdown() {
    const now = new Date();

    // Creamos el objetivo: hoy a las 22:00
    let target = new Date();
    target.setHours(22, 0, 0, 0); // 22:00:00

    // Si ya pasó la 10pm de hoy → usar mañana a las 10pm
    if (now > target) {
        target.setDate(target.getDate() + 1);
    }

    const diff = target - now;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();


/* TORNEOS / BRACKET MOCK */

// Tabla: ordenar y sumar victorias/kills
const rankBody = document.getElementById('tablaRank');

// Ordenar por victorias
document.getElementById('sortBtn').addEventListener('click', () => {
    const rows = Array.from(rankBody.querySelectorAll('tr'));
    rows.sort((a, b) => parseInt(b.children[1].textContent) - parseInt(a.children[1].textContent));
    rows.forEach(r => rankBody.appendChild(r));
});

// Botones dinámicos
rankBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;

    if (e.target.matches('[data-add-win]')) {
        const winCell = row.children[1];
        winCell.textContent = parseInt(winCell.textContent || '0') + 1;
    }
    if (e.target.matches('[data-add-kill]')) {
        const killCell = row.children[2];
        killCell.textContent = parseInt(killCell.textContent || '0') + 1;
    }
});

// Establecer Líder: toma el primero por victorias
document.getElementById('liderBtn').addEventListener('click', () => {
    const rows = Array.from(rankBody.querySelectorAll('tr'));
    rows.sort((a, b) => parseInt(b.children[1].textContent) - parseInt(a.children[1].textContent));
    const leader = rows[0]?.children[0]?.textContent || 'Por definir';
    document.getElementById('liderActual').textContent = leader;
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Exportar CSV
document.getElementById('exportBtn').addEventListener('click', () => {
    const rows = Array.from(rankBody.querySelectorAll('tr')).map(tr => {
        return Array.from(tr.children).slice(0, 3).map(td => td.textContent.trim());
    });
    const header = ['Jugador', 'Victorias', 'Eliminaciones'];
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'clasificacion_fbp.csv';
    a.click();
    URL.revokeObjectURL(a.href);
});

/* // Tabla: ordenar y sumar "Victoria Rata"
const rankBody = document.getElementById('tablaRank');
document.getElementById('sortBtn').addEventListener('click', () => {
    const rows = Array.from(rankBody.querySelectorAll('tr'));
    rows.sort((a, b) => parseInt(b.children[1].textContent) - parseInt(a.children[1].textContent));
    rows.forEach(r => rankBody.appendChild(r));
});
rankBody.addEventListener('click', (e) => {
    if (e.target.matches('[data-add-vr]')) {
        const row = e.target.closest('tr');
        const vrCell = row.children[3];
        vrCell.textContent = parseInt(vrCell.textContent || '0') + 1;
    }
});

// Establecer Líder: toma el primero por puntos
document.getElementById('liderBtn').addEventListener('click', () => {
    const rows = Array.from(rankBody.querySelectorAll('tr'));
    rows.sort((a, b) => parseInt(b.children[1].textContent) - parseInt(a.children[1].textContent));
    const leader = rows[0]?.children[0]?.textContent || 'Por definir';
    document.getElementById('liderActual').textContent = leader;
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Exportar CSV
document.getElementById('exportBtn').addEventListener('click', () => {
    const rows = Array.from(rankBody.querySelectorAll('tr')).map(tr => {
        return Array.from(tr.children).slice(0, 4).map(td => td.textContent.trim());
    });
    const header = ['Jugador', 'Puntos', 'Victorias', 'Victorias Rata'];
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'clasificacion_fbp.csv';
    a.click();
    URL.revokeObjectURL(a.href);
}); */

// Carroñómetro simple (memoria local)
/*
const marcador = JSON.parse(localStorage.getItem('carro') || '{}');
const lista = document.getElementById('marcadorLista');
function renderMarcador() {
    lista.innerHTML = '';
    Object.entries(marcador).forEach(([name, val]) => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-3';
        li.innerHTML = `<span class='w-28'>${name}</span><div class='flex-1 h-3 bg-slate-800 rounded'><div class='h-3 bg-indigo-600 rounded' style='width:${Math.min(100, val * 10)}%'></div></div><span>${val}</span>`;
        lista.appendChild(li);
    });
}
renderMarcador();
document.getElementById('sumarBtn').addEventListener('click', () => {
    const j = document.getElementById('jugadorInput').value.trim() || 'Joel';
    const n = parseInt(document.getElementById('cantidadInput').value || '1');
    marcador[j] = (marcador[j] || 0) + n;
    localStorage.setItem('carro', JSON.stringify(marcador));
    renderMarcador();
});
*/

// Enviar por WhatsApp
/*
document.getElementById('joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const msg = encodeURIComponent(`Solicitud de ingreso FBP%0A- Nick: ${data.nick}%0A- Plataforma: ${data.plataforma}%0A- Disponibilidad: ${data.horario}`);
    // Reemplaza con tu wa.me/XXXXXXXXXXX
    window.open(`https://wa.me/51999999999?text=${msg}`, '_blank');
});
*/

// Enviar por WhatsApp
/* document.getElementById('joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Si igual querés recoger los datos del form, los dejamos
    const data = Object.fromEntries(new FormData(e.target).entries());
    const msg = `Solicitud de ingreso FBP\n- Nick: ${data.nick}\n- Plataforma: ${data.plataforma}\n- Disponibilidad: ${data.horario}`;
    
    // Esto abre el link de tu grupo directamente
    window.open('https://chat.whatsapp.com/GfwwV16Nx5LFhiGpIvwHls', '_blank');
    
    // Si también querés mostrar el mensaje en pantalla para que lo copien:
    alert(msg);
}); */

// Enviar por WhatsApp
document.getElementById('joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const msg = encodeURIComponent(
        `Solicitud de ingreso FBP\n- Nick: ${data.nick}\n- Plataforma: ${data.plataforma}\n- Disponibilidad: ${data.horario}`
    );
    // ✅ Aquí va tu número real
    window.open(`https://wa.me/51964429685?text=${msg}`, '_blank');
});


