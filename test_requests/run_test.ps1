param(
  [string]$Api = "http://127.0.0.1:8000"
)

Set-Location $PSScriptRoot

Write-Host "Posting checkout …"
$body = Get-Content ./checkout.json -Raw
$quote = Invoke-RestMethod -Method Post -Uri "$Api/api/checkout" -ContentType 'application/json' -Body $body
$quote | Format-List
if (-not $quote.order_id) { Write-Error 'quote failed'; exit 1 }

$orderId = $quote.order_id
Write-Host "Posting details for order $orderId …"
$detailsBody = (Get-Content ./details.json -Raw).Replace('<ORDER_ID>', $orderId)
Invoke-RestMethod -Method Post -Uri "$Api/api/order/$orderId/details" -ContentType 'application/json' -Body $detailsBody | Write-Host

Write-Host "Fetching full order …"
Invoke-RestMethod -Uri "$Api/api/order/$orderId" | ConvertTo-Json -Depth 6 | Write-Host 