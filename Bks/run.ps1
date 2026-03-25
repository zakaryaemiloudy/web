# Find Java 17 installation
$javaLocations = @(
    "C:\Program Files\Java",
    "C:\Program Files\Eclipse Adoptium",
    "C:\Program Files\Microsoft",
    "C:\Program Files\Zulu",
    "C:\Program Files\BellSoft",
    "$env:USERPROFILE\.jdks"
)

$javaHome = $null

foreach ($loc in $javaLocations) {
    $expandedLoc = [Environment]::ExpandEnvironmentVariables($loc)
    if (Test-Path $expandedLoc) {
        $jdkDirs = Get-ChildItem -Path $expandedLoc -Directory -ErrorAction SilentlyContinue |
                   Where-Object { $_.Name -match '17|jdk-17' } |
                   Select-Object -First 1
        if ($jdkDirs) {
            $javaHome = $jdkDirs.FullName
            break
        }
    }
}

# If no Java 17 found, use any available JDK
if (-not $javaHome) {
    foreach ($loc in $javaLocations) {
        $expandedLoc = [Environment]::ExpandEnvironmentVariables($loc)
        if (Test-Path $expandedLoc) {
            $jdkDirs = Get-ChildItem -Path $expandedLoc -Directory -ErrorAction SilentlyContinue |
                       Where-Object { $_.Name -match 'jdk|java|openjdk' } |
                       Sort-Object Name |
                       Select-Object -First 1
            if ($jdkDirs) {
                $javaHome = $jdkDirs.FullName
                break
            }
        }
    }
}

if ($javaHome) {
    Write-Host "Using JAVA_HOME: $javaHome"
    $env:JAVA_HOME = $javaHome
    $env:PATH = "$javaHome\bin;$env:PATH"
} else {
    Write-Host "No Java installation found!"
    exit 1
}

# Run Gradle
Set-Location "C:\Users\walid\Downloads\Bks\Bks"
Write-Host "Cleaning and running application..."
.\gradlew.bat clean bootRun --no-daemon
