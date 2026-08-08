@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
set "ACTION=%~1"
set "DEPLOY=%~2"

if "%ACTION%"=="" goto menu
goto run

:menu
echo.
echo Maintenance Mode
echo ----------------
echo 1. Turn ON
echo 2. Turn OFF
echo 3. Toggle
echo 4. Status
echo 5. Turn ON and Deploy Live
echo 6. Turn OFF and Deploy Live
echo 7. Toggle and Deploy Live
echo.
set /p CHOICE=Select an option [1-7]: 

if "%CHOICE%"=="1" set "ACTION=on"
if "%CHOICE%"=="2" set "ACTION=off"
if "%CHOICE%"=="3" set "ACTION=toggle"
if "%CHOICE%"=="4" set "ACTION=status"
if "%CHOICE%"=="5" (
  set "ACTION=on"
  set "DEPLOY=deploy"
)
if "%CHOICE%"=="6" (
  set "ACTION=off"
  set "DEPLOY=deploy"
)
if "%CHOICE%"=="7" (
  set "ACTION=toggle"
  set "DEPLOY=deploy"
)

if not defined ACTION (
  echo.
  echo Invalid selection.
  exit /b 1
)

if /I not "%ACTION%"=="status" if not defined DEPLOY (
  echo.
  set /p DEPLOY_CHOICE=Deploy to live site now? [Y/n]: 
  if "%DEPLOY_CHOICE%"=="" set "DEPLOY_CHOICE=Y"
  if /I "%DEPLOY_CHOICE%"=="Y" set "DEPLOY=deploy"
)

:run
pushd "%PROJECT_ROOT%" >nul
if errorlevel 1 (
  echo Could not open project directory.
  exit /b 1
)

call node "%SCRIPT_DIR%maintenance-mode.mjs" %ACTION%
set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" goto done

if /I "%DEPLOY%"=="deploy" (
  echo.
  echo Building project...
  call npm.cmd run build
  set "EXIT_CODE=%ERRORLEVEL%"
  if not "%EXIT_CODE%"=="0" goto done

  echo.
  echo Deploying to Cloudflare Pages...
  call npx.cmd wrangler pages deploy dist --project-name ravneetedits --branch main --commit-dirty=true
  set "EXIT_CODE=%ERRORLEVEL%"
)

:done
popd >nul
exit /b %EXIT_CODE%
