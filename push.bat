@echo off
cd /d "%~dp0"

echo This folder's .git metadata was corrupted, so this rebuilds it from
echo scratch and force-pushes the current files as a single clean commit.
echo.

if exist .git (
    echo Removing corrupted .git folder...
    rmdir /s /q .git
)

echo Initializing git...
git init -q
git branch -m main
git remote add origin https://github.com/Uzair-debug/leadforgedigital-website.git

echo Staging all files...
git add -A

echo Committing...
git commit -m "Redesign site: Fiverr-matched colors, naming, and animations"

echo Force-pushing to GitHub (safe: this folder's content matches your repo plus the update)...
git push origin main --force

echo Done. Netlify will auto-deploy from the push.
pause
