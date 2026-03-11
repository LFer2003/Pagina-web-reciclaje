<?php
header('Content-Type: application/json');

// 1. Conexión a la base de datos
$dsn = "mysql:host=localhost;dbname=proyecto;charset=utf8mb4";
$username = "root";
$password = "";

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Error de conexión"]);
    exit;
}

// 2. Simulación automática
$materiales = ["Plástico", "Papel", "Metal"];
$material = $materiales[array_rand($materiales)];

$peso = round(mt_rand(1, 500) / 100, 2);
$calidad = round(rand(70, 100), 1);

$precios = [
    "Plástico" => 1200,
    "Papel" => 500,
    "Metal" => 3000
];

$precio = $precios[$material] * $peso;
$puntos = intval($peso * 10 + ($calidad / 10));

// 3. Guardar en la BD
try {
    $stmt = $pdo->prepare("
        INSERT INTO lecturas (material, peso, calidad, precio, puntos)
        VALUES (:material, :peso, :calidad, :precio, :puntos)
    ");

    $stmt->execute([
        ":material" => $material,
        ":peso" => $peso,
        ":calidad" => $calidad,
        ":precio" => $precio,
        ":puntos" => $puntos
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "No se pudo guardar"]);
    exit;
}

// 4. Respuesta limpia
echo json_encode([
    "success" => true,
    "material" => $material,
    "peso" => $peso,
    "calidad" => $calidad,
    "precio" => round($precio),
    "puntos" => $puntos
]);

exit;
