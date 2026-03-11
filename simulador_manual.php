<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["success" => false, "error" => "No se recibió JSON"]);
  exit;
}

$material = strtolower($data["material"] ?? "");
$peso = floatval($data["peso"] ?? 0);
$operacion = strtolower($data["operacion"] ?? "");

if (!$material || $peso <= 0 || !$operacion) {
  echo json_encode(["success" => false, "error" => "Datos incompletos"]);
  exit;
}

$precios = [
  "plastico" => ["vender" => 200, "comprar" => 300],
  "papel"    => ["vender" => 100, "comprar" => 150],
  "metal"    => ["vender" => 600, "comprar" => 800],
];

if (!isset($precios[$material])) {
  echo json_encode(["success" => false, "error" => "Material no válido"]);
  exit;
}

$total = $peso * $precios[$material][$operacion];

echo json_encode([
  "success" => true,
  "material" => $material,
  "peso" => $peso,
  "operacion" => $operacion,
  "total" => $total
]);
?>
