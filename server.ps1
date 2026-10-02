$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:5555/")
try {
    $listener.Start()
} catch {
    Write-Output "Port might already be in use or error: $_"
}

Write-Output "Server running on http://localhost:5555/"
$basePath = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
Write-Output "Serving directory: $basePath"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath)) { 
            $urlPath = "index.html" 
        }
        
        $filePath = Join-Path $basePath $urlPath
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = "application/octet-stream"
            if ($ext -eq ".html") { $mime = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $mime = "text/css; charset=utf-8" }
            elseif ($ext -eq ".js") { $mime = "application/javascript; charset=utf-8" }
            elseif ($ext -eq ".json") { $mime = "application/json; charset=utf-8" }
            elseif ($ext -eq ".png") { $mime = "image/png" }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $mime = "image/jpeg" }
            elseif ($ext -eq ".svg") { $mime = "image/svg+xml" }
            elseif ($ext -eq ".webp") { $mime = "image/webp" }
            elseif ($ext -eq ".ics") { $mime = "text/calendar; charset=utf-8" }
            
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.OutputStream.Write($err, 0, $err.Length)
        }
        $response.Close()
    } catch {
        # continue loop
    }
}
