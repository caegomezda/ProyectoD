let datosEnergia = [];

function procesarArchivo() {
    const archivo = document.getElementById("archivoExcel").files[0];
    if (! archivo) {
        alert("Por favor, seleccione un archivo Excel.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0]; 
            const sheet = workbook.Sheets[sheetName];

            // Convertir a JSON
            datosEnergia = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (datosEnergia.length === 0) {
                alert("El archivo Excel está vacío o no tiene el formato correcto.");
                return;
            }

            // Convertir la primera fila en encabezados y las siguientes en datos
            const headers = datosEnergia[0].map(header => header.toLowerCase()); // Normalizar
            datosEnergia = datosEnergia.slice(1).map(row => {
                let obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index];
                });
                return obj;
            });

            alert("Datos cargados correctamente.");
            console.log(datosEnergia); // Para depuración

        } catch (error) {
            alert("Error al procesar el archivo. Verifique que sea un Excel válido.");
            console.error(error);
        }
    };

    reader.readAsArrayBuffer(archivo);
}
