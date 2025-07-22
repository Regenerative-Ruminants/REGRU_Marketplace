# Build the REGRU CLI release binary and stage it under bin/
$ErrorActionPreference = "Stop"

$root = (Get-Item "$PSScriptRoot/.." ).FullName
Set-Location "$root/cli"

cargo build -p regru --release

$binDir = "$root/bin"
if (-not (Test-Path $binDir)) { New-Item -ItemType Directory -Path $binDir | Out-Null }

Copy-Item "target/release/regru.exe" -Destination $binDir -Force
Write-Host "CLI binary staged in $binDir" 