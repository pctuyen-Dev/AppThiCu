# ==========================================
# UNETI EXAM - BUILD RELEASE
# ==========================================

param (
    [string]$Version = "",
    [switch]$NonInteractive = $false
)

$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$client = Join-Path $root "client"
$packageJson = Join-Path $client "package.json"
$release = Join-Path $client "release"

Write-Host "========================================="
Write-Host "        UNETI EXAM - BUILD RELEASE"
Write-Host "========================================="
Write-Host ""

# Kiểm tra project
if (-not (Test-Path $packageJson)) {
    Write-Host "Khong tim thay client/package.json" -ForegroundColor Red
    if (-not $NonInteractive) { Pause }
    exit 1
}

# Nhập version nếu chưa truyền
$version = $Version
while ($version -notmatch '^\d+\.\d+\.\d+$') {
    $version = Read-Host "Nhap version (vi du: 1.0.0)"

    if ($version -notmatch '^\d+\.\d+\.\d+$') {
        Write-Host "Version khong hop le. Hay nhap dang: 1.0.0" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Version: $version"
Write-Host ""

# Đọc package.json
$package = Get-Content $packageJson -Raw | ConvertFrom-Json

# Cập nhật version
$package.version = $version

# Ghi lại package.json (UTF-8 không BOM để tránh lỗi JSON parse khi build)
$json = $package | ConvertTo-Json -Depth 20
[System.IO.File]::WriteAllText($packageJson, $json, (New-Object System.Text.UTF8Encoding $false))

Write-Host "[1/5] Da cap nhat version." -ForegroundColor Green

# Xóa bản build cũ
if (Test-Path $release) {
    Write-Host ""
    Write-Host "[2/5] Dang xoa ban build cu..." -ForegroundColor Cyan

    Remove-Item $release -Recurse -Force

    Write-Host "Da xoa ban build cu." -ForegroundColor Green
}

# Tạo lại thư mục release
New-Item -ItemType Directory -Path $release -Force | Out-Null

# Đi vào client
Set-Location $client

# Build React + TypeScript
Write-Host ""
Write-Host "[3/5] Dang build React + TypeScript..." -ForegroundColor Cyan

npm run build

if ($LASTEXITCODE -ne 0) {
    throw "Build React that bai."
}

Write-Host "Build React thanh cong." -ForegroundColor Green

# Build Electron
Write-Host ""
Write-Host "[4/5] Dang tao file EXE..." -ForegroundColor Cyan

npx electron-builder

if ($LASTEXITCODE -ne 0) {
    throw "Build Electron that bai."
}

Write-Host "Build Electron thanh cong." -ForegroundColor Green

# Hoàn thành
Write-Host ""
Write-Host "[5/5] HOAN THANH!" -ForegroundColor Green
Write-Host ""
Write-Host "Version: $version"
Write-Host ""
Write-Host "File EXE nam trong:"
Write-Host "$release"
Write-Host ""

# Mở thư mục release
Start-Process explorer.exe $release

Write-Host "========================================="
Write-Host "          BUILD THANH CONG"
Write-Host "========================================="
Write-Host ""

if (-not $NonInteractive) { Pause }