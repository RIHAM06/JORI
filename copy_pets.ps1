New-Item -ItemType Directory -Force -Path "assets\pets\benji" | Out-Null
New-Item -ItemType Directory -Force -Path "assets\pets\sofi" | Out-Null

$benjiFiles = Get-ChildItem -Path "C:\Users\Rehan\Desktop\FOTOS\BENJI" -File
$i = 1
foreach ($f in $benjiFiles) {
    $dest = "assets\pets\benji\benji_$i.jpeg"
    Copy-Item -Path $f.FullName -Destination $dest -Force
    $i++
}

$sofiFiles = Get-ChildItem -Path "C:\Users\Rehan\Desktop\FOTOS\SOFI" -File
$j = 1
foreach ($f in $sofiFiles) {
    $dest = "assets\pets\sofi\sofi_$j.jpeg"
    Copy-Item -Path $f.FullName -Destination $dest -Force
    $j++
}

Write-Output "Copied $($i - 1) Benji photos and $($j - 1) Sofi photos."
