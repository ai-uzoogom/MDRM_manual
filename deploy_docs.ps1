<#
.SYNOPSIS
    MDRM Document Deployment Script
.DESCRIPTION
    Automates the deployment process for MDRM documentation:
    1. Checks for changes in the repository.
    2. Commits any changes.
    3. Pushes to the remote repository.
    4. Deploys to GitHub Pages using mkdocs.
    Includes robust error handling and pauses for user review.
#>

$ErrorActionPreference = "Stop"

# Use UTF-8 encoding for output
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MDRM 매뉴얼 배포 스크립트 시작" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# 1. Check Directory
Write-Host "[1/5] 현재 경로 확인 중..." -ForegroundColor Yellow
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $scriptPath
Write-Host "현재 경로: $scriptPath"
Write-Host "✓ 경로 이동 완료" -ForegroundColor Green
Write-Host ""

# 2. Add Changes
Write-Host "[2/5] 변경 사항 스테이징 (git add)..." -ForegroundColor Yellow
try {
    git add .
    if ($LASTEXITCODE -ne 0) { throw "git add 실패" }
}
catch {
    Write-Error "git add 실행 중 오류 발생: $_"
    Read-Host "엔터 키를 눌러 종료합니다..."
    exit 1
}
Write-Host "✓ 변경 사항 스테이징 완료" -ForegroundColor Green
Write-Host ""

# 3. Commit Changes
Write-Host "[3/5] 변경 사항 커밋 (git commit)..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    try {
        git commit -m "update via deploy script"
        if ($LASTEXITCODE -ne 0) { throw "git commit 실패" }
        Write-Host "✓ 커밋 완료" -ForegroundColor Green
    }
    catch {
        Write-Error "git commit 실행 중 오류 발생: $_"
        Read-Host "엔터 키를 눌러 종료합니다..."
        exit 1
    }
}
else {
    Write-Host "- 변경 사항이 없어 커밋을 건너뜁니다." -ForegroundColor Gray
}
Write-Host ""

# 4. Push to Remote
Write-Host "[4/5] 원격 저장소 푸시 (git push)..." -ForegroundColor Yellow
try {
    git push origin main
    if ($LASTEXITCODE -ne 0) { throw "git push 실패" }
    Write-Host "✓ 푸시 완료" -ForegroundColor Green
}
catch {
    Write-Error "git push 실행 중 오류 발생 (인증 문제나 충돌 확인 필요): $_"
    Read-Host "엔터 키를 눌러 종료합니다..."
    exit 1
}
Write-Host ""

# 5. Deploy to GitHub Pages
Write-Host "[5/5] GitHub Pages 배포 (mkdocs gh-deploy)..." -ForegroundColor Yellow
try {
    mkdocs gh-deploy --force
    if ($LASTEXITCODE -ne 0) { throw "mkdocs deploy 실패" }
    Write-Host "✓ 배포 성공!" -ForegroundColor Green
}
catch {
    Write-Error "mkdocs 배포 중 오류 발생: $_"
    Read-Host "엔터 키를 눌러 종료합니다..."
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "모든 작업이 성공적으로 완료되었습니다." -ForegroundColor Cyan
Write-Host "========================================"
Read-Host "엔터 키를 눌러 종료합니다..."
