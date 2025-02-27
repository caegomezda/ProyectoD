
function toggleSubmenu() {
    var submenu = document.getElementById('submenu');
    if (submenu.style.display === 'none' || submenu.style.display === '') {
        submenu.style.display = 'block';
    } else {
        submenu.style.display = 'none';
    }
}

function calcularRenovable() {
    const consumo = parseFloat(document.getElementById('consumo').value);
    const eolica = parseFloat(document.getElementById('eolica').value) || 0;
    const solar = parseFloat(document.getElementById('solar').value) || 0;
    const hidroelectrica = parseFloat(document.getElementById('hidroelectrica').value) || 0;
    const geotermica = parseFloat(document.getElementById('geotermica').value) || 0;

    if (isNaN(consumo) || consumo <= 0) {
        document.getElementById('resultado').innerText = "Ingrese un valor válido para el consumo.";
        return;
    }

    // Sumar la capacidad instalada total de energías renovables
    const capacidadRenovableTotal = eolica + solar + hidroelectrica + geotermica;
    
    // Calcular porcentaje de energía renovable en el consumo del usuario
    const porcentajeRenovable = (capacidadRenovableTotal / consumo) * 100;
    
    document.getElementById('resultado').innerText = `El ${porcentajeRenovable.toFixed(2)}% de su consumo podría provenir de fuentes renovables.`;
}

function cargarVideo(videoID) {
    const iframe = document.querySelector("iframe[name='content-frame']");
    if (iframe) {
        iframe.src = "https://www.youtube.com/embed/" + videoID;
    } else {
        console.error("No se encontró el iframe.");
    }
}

window.onload = function () {
    inicializarMapa();
};

function cargarMapa() {
    document.getElementById("map").src = "https://www.openstreetmap.org/export/embed.html?bbox=-90,-60,90,60&layer=mapnik&marker=12.1067,-72.0785&marker=10.8583,-75.1316&marker=51.5074,-0.1278&marker=40.7128,-74.0060&marker=48.8566,2.3522&marker=-33.8688,151.2093&marker=-23.5505,-46.6333&marker=55.7558,37.6173&marker=35.6895,139.6917&marker=37.7749,-122.4194&marker=34.0522,-118.2437&marker=-34.6037,-58.3816&marker=52.5200,13.4050&marker=45.4215,-75.6972";
}


