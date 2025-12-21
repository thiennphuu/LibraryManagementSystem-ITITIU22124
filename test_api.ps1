$uri = "http://localhost:8080/api/books"
$maxRetries = 10
$retryCount = 0

Write-Host "Testing API endpoint: $uri"
Write-Host "Waiting for server to start..."

while ($retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri $uri -Method Get -ErrorAction Stop -UseBasicParsing
        Write-Host "✓ Success! Status Code: $($response.StatusCode)"
        Write-Host "Response Body:"
        Write-Host $response.Content
        exit 0
    } catch {
        $retryCount++
        if ($_.Exception.Response.StatusCode -eq 403) {
            Write-Host "✗ Got 403 Forbidden - Security configuration issue!"
            Write-Host "Error: $($_.Exception.Message)"
            exit 1
        } elseif ($_.Exception.Response.StatusCode) {
            Write-Host "Got status code: $($_.Exception.Response.StatusCode)"
        }

        if ($retryCount -lt $maxRetries) {
            Write-Host "Retry $retryCount/$maxRetries - waiting 2 seconds..."
            Start-Sleep -Seconds 2
        }
    }
}

Write-Host "✗ Failed - Server did not respond after $maxRetries attempts"
exit 1

