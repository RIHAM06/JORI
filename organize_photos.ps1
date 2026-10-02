$cats = @('roblox', 'minecraft', 'arena_breakout', 'nosotros')
foreach ($c in $cats) {
    $files = Get-ChildItem -Path "assets/gallery/$c" -File | Where-Object { $_.Name -notlike "${c}_*" } | Sort-Object Name
    $i = 1
    foreach ($f in $files) {
        $ext = $f.Extension
        $newName = "${c}_${i}${ext}"
        Copy-Item -Path $f.FullName -Destination "assets/gallery/$c/$newName" -Force
        $i++
    }
}
Write-Host "Done copying aliases!"
