# Script para probar DOM y Consola de Edge headless
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$dumpDom = & $edgePath --headless --disable-gpu --dump-dom "http://localhost:5555/"
$dumpDom | Out-File -FilePath "C:\Users\Rehan\.gemini\antigravity-ide\brain\68deb8ed-13c3-40f6-b6a4-537f338f4be8\scratch\edge_dom_test.html" -Encoding utf8

Write-Host "DOM dump saved, length: $($dumpDom.Length)"
