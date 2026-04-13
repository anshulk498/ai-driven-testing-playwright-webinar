# Project Restructure Script
Write-Host "Restructuring Project..." -ForegroundColor Cyan
Write-Host ""

# Move agents
Write-Host "Moving agents..." -ForegroundColor Yellow
if (Test-Path "agents\browser-agent.ts") {
    Move-Item "agents\*.ts" "src\agents\" -Force
    Write-Host "  Agents moved" -ForegroundColor Green
}

# Move workflows
Write-Host "Moving workflows..." -ForegroundColor Yellow
if (Test-Path "workflows\generate-test.ts") {
    Move-Item "workflows\*.ts" "src\workflows\" -Force
    Write-Host "  Workflows moved" -ForegroundColor Green
}

# Move config
Write-Host "Moving config..." -ForegroundColor Yellow
if (Test-Path "config\mcp-config.json") {
    Move-Item "config\mcp-config.json" "src\config\" -Force
    Write-Host "  Config moved" -ForegroundColor Green
}

# Move E2E tests
Write-Host "Organizing tests..." -ForegroundColor Yellow
$e2eTests = @("create-alert.spec.ts", "create-core-obligation.final.spec.ts", "verify-obligation-export.spec.ts")
foreach ($test in $e2eTests) {
    if (Test-Path "tests\$test") {
        Move-Item "tests\$test" "tests\e2e\" -Force
    }
}

# Move example tests
$exampleTests = @("example.spec.ts", "seed.spec.ts", "tic-tac-toe.spec.ts", "x-wins-top-row.spec.ts")
foreach ($test in $exampleTests) {
    if (Test-Path "tests\$test") {
        Move-Item "tests\$test" "tests\examples\" -Force
    }
}
Write-Host "  Tests organized" -ForegroundColor Green

# Move documentation
Write-Host "Moving documentation..." -ForegroundColor Yellow
$docFiles = @("BUILD_COMPLETE.md", "GETTING_STARTED.md", "MCP_INTEGRATION_PLAN.md", "CONTENT_CENTER_GUIDE.md", "CONTENT_CENTER_TESTS.md")
foreach ($doc in $docFiles) {
    if (Test-Path $doc) {
        Move-Item $doc "docs\guides\" -Force
    }
}

# Move test plans
if (Test-Path "specs\TEST_PLAN.md") { Move-Item "specs\TEST_PLAN.md" "docs\test-plans\" -Force }
if (Test-Path "ALERT_TEST_STEPS.md") { Move-Item "ALERT_TEST_STEPS.md" "docs\test-plans\" -Force }
if (Test-Path "specs\EXPORT_TEST_SUMMARY.md") { Move-Item "specs\EXPORT_TEST_SUMMARY.md" "docs\test-plans\" -Force }
Write-Host "  Documentation moved" -ForegroundColor Green

# Move demo script
Write-Host "Moving scripts..." -ForegroundColor Yellow
if (Test-Path "demo.ts") {
    Move-Item "demo.ts" "scripts\" -Force
    Write-Host "  Demo moved" -ForegroundColor Green
}

# Clean up screenshots
Write-Host "Cleaning screenshots..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Filter "*.png" -File | Move-Item -Destination "test-results\" -Force -ErrorAction SilentlyContinue
Write-Host "  Screenshots moved" -ForegroundColor Green

# Remove empty directories
Write-Host "Cleaning up..." -ForegroundColor Yellow
$emptyDirs = @("agents", "workflows", "config", "specs")
foreach ($dir in $emptyDirs) {
    if ((Test-Path $dir) -and ((Get-ChildItem $dir -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0)) {
        Remove-Item $dir -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "  Cleanup complete" -ForegroundColor Green

Write-Host ""
Write-Host "Project restructure complete!" -ForegroundColor Green
Write-Host ""
Write-Host "New Structure:" -ForegroundColor Cyan
Write-Host "  src/agents/          (AI agents)"
Write-Host "  src/workflows/       (Workflows)"
Write-Host "  src/utils/           (Utilities)"
Write-Host "  src/config/          (Config)"
Write-Host "  tests/e2e/           (E2E tests)"
Write-Host "  tests/examples/      (Examples)"
Write-Host "  tests/generated/     (Generated)"
Write-Host "  docs/guides/         (Guides)"
Write-Host "  docs/test-plans/     (Plans)"
Write-Host "  scripts/             (Scripts)"
Write-Host ""
