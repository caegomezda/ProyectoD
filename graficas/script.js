let datosEnergia = [];  //se inicia con un array vacio, para cargar los datos del archivo de excel
let chartInstance;      //instancia de una clase Chart para las graficas

//[1].  Verifica que se han cargado datos del archivo, y los carga al DATA para graficar
function cargarDatos() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];
    if (!file) {
        alert('Seleccione un archivo Excel');
        return;
    }
    
    //Este código se usa para leer un archivo Excel (.xlsx) en JavaScript usando la librería xlsx de SheetJS.
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];  //la primera hoja del archivo seleccionado
        const sheet = workbook.Sheets[sheetName];
        datosEnergia = XLSX.utils.sheet_to_json(sheet);  //llena el array vacio con los datos de la hoja
        alert('Datos cargados correctamente');
    };
    reader.readAsArrayBuffer(file);
    //Uint8Array(e.target.result); → Convierte el archivo en bytes.
    //XLSX.read(data, { type: 'array' }); → Carga el archivo Excel.
    //Podemos acceder a los datos con workbook.Sheets y XLSX.utils.sheet_to_json().
}

//[1]. Cuando se hace clic en la grafica deseada, 
// recibe el tipoGrafica(pie, bar, line) y el filtro (por continente, por pais)
function cargarGrafica(tipo, filtro) {
    if (datosEnergia.length === 0) {
        alert('Primero cargue los datos desde un archivo Excel');
        return;
    }
    console.log(datosEnergia);
    
    const selectComparacion = document.getElementById('tipoComparacion');
    selectComparacion.innerHTML = ''; // Limpiar select antes de agregar opciones
    selectComparacion.style.display = 'none';

    if (filtro === 'continente') {
        const datos = filtrarDatos('continente');
        mostrarGrafica(tipo, datos, 'Producción energía eólica por país o continente', 'graficaGeneral');
    } else {
        selectComparacion.style.display = 'block';  //Hace visible el elemento selectComparacion
        let continentes = [...new Set(datosEnergia.map(d => d.continente))]; //Genera una lista única de continentes a partir del array datosEnergia.
        continentes.forEach(cont => {
            let option = document.createElement('option');
            option.value = cont;
            option.textContent = cont;
            selectComparacion.appendChild(option);
        });

        selectComparacion.onchange = () => {
            const continenteSeleccionado = selectComparacion.value;
            const datos = filtrarDatosPorContinente(continenteSeleccionado);
            mostrarGrafica(tipo, datos, 'Producción por pais o continente', 'graficaGeneral');
        };
    }
}

function filtrarDatos(filtro) {
    let agrupado = {};
    datosEnergia.forEach(d => {
        let clave = d[filtro];
        if (!agrupado[clave]) {
            agrupado[clave] = { produccion: 0};
        }
        agrupado[clave].produccion += d.produccion;
        // agrupado[clave].consumo += d.consumo;
    });
    return {
        etiquetas: Object.keys(agrupado),
        produccion: Object.values(agrupado).map(v => v.produccion),
        // consumo: Object.values(agrupado).map(v => v.consumo)
    };
    //devuelve un array con los nombres de los países (las claves del objeto).
    //Object.keys(agrupado) Se usa este array como etiquetas en la gráfic
    //.map(v => v.produccion) extrae solo los valores de producción
}

function filtrarDatosPorContinente(continente) {
    let agrupado = {};
    //Filtra los datos para que solo incluya los que coincidan con el continente seleccionado
    datosEnergia.filter(d => d.continente === continente).forEach(d => {
        let clave = d.pais;  //Se define clave como el nombre del país (d.pais). d es la fila
        if (!agrupado[clave]) {  //verifica si el país ya está en el objeto agrupado.
            agrupado[clave] = { produccion: 0};
        }
        agrupado[clave].produccion += d.produccion;  //acumulador de la columna produccion
        // agrupado[clave].consumo += d.consumo;        //acumulador de la columna consumo
    });
    return {
        etiquetas:  Object.keys(agrupado),  //
        produccion: Object.values(agrupado).map(v => v.produccion),
        // consumo:    Object.values(agrupado).map(v => v.consumo)
    };
    //devuelve un array con los nombres de los países (las claves del objeto).
    //Object.keys(agrupado) Se usa este array como etiquetas en la gráfic
    //.map(v => v.produccion) extrae solo los valores de producción
}

function mostrarGrafica(tipo, datos, titulo, canvasId) {
    console.log(datos)
    const ctx = document.getElementById(canvasId).getContext('2d');
    // Verificar si hay un gráfico previo en el canvas y destruirlo
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Generar colores aleatorios o predefinidos
    const colores = datos.etiquetas.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);


    let config = {
        type: tipo,
        data: {
            labels: datos.etiquetas,
            datasets: [
                {
                    label: 'Producción',
                    data: datos.produccion,
                    backgroundColor: colores,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    font: { size: 18 },
                    padding: { top: 10, bottom: 20 }
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            let dataset = tooltipItem.dataset;
                            let total = dataset.data.reduce((a, b) => a + b, 0);
                            let porcentaje = ((tooltipItem.raw / total) * 100).toFixed(2) + '%';
                            return dataset.label + ': ' + tooltipItem.raw + ' (' + porcentaje + ')';
                        }
                    }
                }
            }
        }
    };

    chartInstance = new Chart(ctx, config);
}
