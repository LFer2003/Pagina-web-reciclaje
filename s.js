function simularLectura() {
    fetch("lectura_automatica.php")
        .then(r => r.json())
        .then(data => {
            if (!data.success) {
                alert("Error: " + data.error);
                return;
            }

            // Mostrar en pantalla
            document.getElementById("classEl").textContent = data.material;
            document.getElementById("weightEl").textContent = data.peso;
            document.getElementById("qualityEl").textContent = data.calidad;
            document.getElementById("priceEl").textContent = data.precio;
            document.getElementById("pointsEl").textContent = data.puntos;

            alert("Lectura guardada con éxito. ID: " + data.id);
        })
        .catch(err => {
            alert("Error de red: " + err.message);
        });
}
