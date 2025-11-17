# QR Menu Platform - Development Startup Script
# This script starts both backend and frontend servers

Write-Host "🚀 Starting QR Menu Platform..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exist
if (-not (Test-Path ".\backend\node_modules")) {
    Write-Host "❌ Backend dependencies not installed!" -ForegroundColor Red
    Write-Host "Run: cd backend && npm install" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path ".\frontend\node_modules")) {
    Write-Host "❌ Frontend dependencies not installed!" -ForegroundColor Red
    Write-Host "Run: cd frontend && npm install" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Dependencies found" -ForegroundColor Green
Write-Host ""

# Function to stop processes on exit
function Stop-Servers {
    Write-Host "`n`n🛑 Shutting down servers..." -ForegroundColor Yellow
    if ($backendJob) { Stop-Job -Job $backendJob; Remove-Job -Job $backendJob }
    if ($frontendJob) { Stop-Job -Job $frontendJob; Remove-Job -Job $frontendJob }
    Write-Host "✅ Servers stopped" -ForegroundColor Green
    exit
}

# Register exit handler
Register-EngineEvent PowerShell.Exiting -Action { Stop-Servers }

Write-Host "📦 Starting Backend Server (Port 5000)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\Ricos\Desktop\Digital Menu\backend"
    npm run dev
}

Start-Sleep -Seconds 2

Write-Host "🎨 Starting Frontend Server (Port 5173)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\Ricos\Desktop\Digital Menu\frontend"
    npm run dev
}

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ Servers are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "📊 Server Status:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "📝 Demo Login Credentials:" -ForegroundColor Cyan
Write-Host "   Email:    admin@restaurant.com" -ForegroundColor White
Write-Host "   Password: Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Quick Links:" -ForegroundColor Cyan
Write-Host "   Login:        http://localhost:5173/login" -ForegroundColor White
Write-Host "   Register:     http://localhost:5173/register" -ForegroundColor White
Write-Host "   Demo Menu:    http://localhost:5173/demo-restaurant" -ForegroundColor White
Write-Host ""
Write-Host "💡 Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Server Logs:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Stream logs from both servers
try {
    while ($true) {
        $backendOutput = Receive-Job -Job $backendJob -ErrorAction SilentlyContinue
        $frontendOutput = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
        
        if ($backendOutput) {
            Write-Host ("[BACKEND]  {0}" -f $backendOutput) -ForegroundColor Blue
        }
        
        if ($frontendOutput) {
            Write-Host ("[FRONTEND] {0}" -f $frontendOutput) -ForegroundColor Magenta
        }
        
        Start-Sleep -Milliseconds 500
    }
} finally {
    Stop-Servers
}
