# Test Chatbot Script

$baseUrl = "http://localhost:8080"

# 1. Register a test user
Write-Host "=== Registering test user ===" -ForegroundColor Cyan
$registerBody = @{
    nom = "Test"
    prenom = "User"
    email = "chatbot.test@example.com"
    motDePasse = "Test1234"
    telephone = "0600000000"
    role = "USER"
} | ConvertTo-Json

try {
    $registerResult = Invoke-RestMethod -Uri "$baseUrl/api/auth/inscription" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "Registration successful!" -ForegroundColor Green
    $registerResult | ConvertTo-Json
} catch {
    Write-Host "Registration failed (user may already exist)" -ForegroundColor Yellow
}

# 2. Login
Write-Host "`n=== Logging in ===" -ForegroundColor Cyan
$loginBody = @{
    email = "chatbot.test@example.com"
    motDePasse = "Test1234"
} | ConvertTo-Json

try {
    $loginResult = Invoke-RestMethod -Uri "$baseUrl/api/auth/connexion" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResult.token
    Write-Host "Login successful! Token received." -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Trying to read response..." -ForegroundColor Yellow
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Test chatbot health
Write-Host "`n=== Testing Chatbot Health ===" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/api/chatbot/health" -Method GET -Headers $headers
    Write-Host "Health check passed!" -ForegroundColor Green
    $health | ConvertTo-Json
} catch {
    Write-Host "Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Get suggestions
Write-Host "`n=== Getting Suggestions ===" -ForegroundColor Cyan
try {
    $suggestions = Invoke-RestMethod -Uri "$baseUrl/api/chatbot/suggestions" -Method GET -Headers $headers
    Write-Host "Suggestions retrieved!" -ForegroundColor Green
    $suggestions | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Failed to get suggestions: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Test chatbot messages
$testMessages = @(
    "Bonjour",
    "Suis-je eligible pour donner du sang?",
    "Quel est le stock disponible?",
    "Comment se deroule un don de sang?",
    "Quels sont les groupes sanguins compatibles?",
    "Merci beaucoup!"
)

foreach ($msg in $testMessages) {
    Write-Host "`n=== Testing: '$msg' ===" -ForegroundColor Cyan

    $chatBody = @{
        message = $msg
        sessionId = "test-session-001"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/chatbot/message" -Method POST -Body $chatBody -Headers $headers
        Write-Host "Response type: $($response.type)" -ForegroundColor Yellow
        Write-Host "Response:" -ForegroundColor Green
        Write-Host $response.reponse
        if ($response.suggestions) {
            Write-Host "Suggestions: $($response.suggestions -join ', ')" -ForegroundColor Magenta
        }
    } catch {
        Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
    }

    Start-Sleep -Milliseconds 500
}

Write-Host "`n=== All tests completed! ===" -ForegroundColor Cyan
