# ⛳ 0. Move to Git root no matter where script is run
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path "$scriptDir\.."
Set-Location $repoRoot
Write-Host "📁 Current directory: $pwd"

# 🛠 1. Build the project
Write-Host "`n🚧 Building project..."
Push-Location (Join-Path $PSScriptRoot "topwar")
npm run build
Pop-Location

# 💡 1-1. Add forced change to index.html
Add-Content "topwar/build/index.html" "`n<!-- force deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') -->"

# 📦 2. Prepare gh-pages worktree
Write-Host "`n📦 Setting up gh-pages worktree..."
Remove-Item ".gh-pages-tmp" -Recurse -Force -ErrorAction SilentlyContinue
git worktree remove ".gh-pages-tmp" -f 2>$null
git worktree add ".gh-pages-tmp" gh-pages

# 🧹 3. Clean previous content
Write-Host "`n🧹 Cleaning previous gh-pages content..."
Remove-Item ".gh-pages-tmp\*" -Recurse -Force

# 📨 4. Copy built files
Write-Host "`n📤 Copying built files..."
Copy-Item "topwar/build/*" ".gh-pages-tmp/" -Recurse

# ✅ 5. Commit and push
Write-Host "`n🔒 Committing and pushing..."
Push-Location (Join-Path $PSScriptRoot ".gh-pages-tmp")
git add .

$commitMsg = "🚀 Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
if (git commit -m $commitMsg) {
    git push origin gh-pages
    Write-Host "✅ Push complete!"
} else {
    Write-Host "✅ Nothing to commit. Skipping push."
}
Pop-Location

# 🧼 6. Cleanup
Write-Host "`n🧼 Cleaning up..."
git worktree remove ".gh-pages-tmp" -f
Remove-Item ".gh-pages-tmp" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n🎉 Deployment complete!"
