param()

$src = "c:\Users\Rehan\Desktop\PROYECTOS\Jonathan"
$dest1 = "C:\Users\Rehan\Desktop\Jonathan_Web_Netlify"
$dest2 = "C:\Users\Rehan\Desktop\DGT\PROYECTOS\Jonathan_Web_Netlify"
$dest3 = "C:\Users\Rehan\Desktop\DGT\PROYECTOS\Jonathan"
$dest4 = "C:\Users\Rehan\Desktop\PROYECTOS\WEB JORI"
$dest5 = "C:\Users\Rehan\Desktop\JORI WEB"

foreach ($d in @($dest1, $dest2, $dest3, $dest4, $dest5)) {
    if (!(Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
    Copy-Item -Path "$src\*" -Destination $d -Recurse -Force
    Write-Host "Synced to $d"
}

Write-Host "All sync completed!"
