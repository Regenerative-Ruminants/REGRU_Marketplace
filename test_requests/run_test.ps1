param(
  [string]$Api = "http://127.0.0.1:8000"
)

Write-Host "Posting checkout …"
$quote = curl.exe -s -X POST "$Api/api/checkout" -H "Content-Type: application/json" --data-binary "@checkout.json" | ConvertFrom-Json
$quote | Format-List

if (-not $quote.order_id) { Write-Error "quote failed"; exit 1 }

$oid = $quote.order_id
Write-Host "Posting details for order $oid …"
$detUrl = "$Api/api/order/$oid/details"
curl.exe -s -X POST $detUrl -H "Content-Type: application/json" --data-binary "@details.json"

Write-Host "Fetching full order …"
curl.exe -s "$Api/api/order/$oid" | ConvertFrom-Json | Format-List 