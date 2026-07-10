@echo off
REM OPEP - RSA Key Generation Script (Windows)
REM Usage: scripts\generate-keys.bat
REM Or via npm: npm run keygen (requires bash on Windows)

setlocal enabledelayedexpansion

set KEYS_DIR=apps\api\keys

echo === OPEP RSA Key Generation ===
echo Keys directory: %KEYS_DIR%

REM Create keys directory if it doesn't exist
if not exist "%KEYS_DIR%" mkdir "%KEYS_DIR%"

REM Check if openssl is available
where openssl >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: openssl is not installed.
    echo Install it from: https://slproweb.com/products/Win32OpenSSL.html
    echo Or use Git Bash which includes openssl.
    exit /b 1
)

REM Check if keys already exist
if exist "%KEYS_DIR%\private.pem" (
    echo WARNING: RSA keys already exist in %KEYS_DIR%
    set /p confirm="Overwrite? (y/N): "
    if /i not "!confirm!"=="y" (
        echo Aborted.
        exit /b 0
    )
)

REM Generate RSA 2048-bit private key
echo Generating RSA 2048-bit private key...
openssl genrsa -out "%KEYS_DIR%\private.pem" 2048

REM Extract public key
echo Extracting public key...
openssl rsa -in "%KEYS_DIR%\private.pem" -pubout -out "%KEYS_DIR%\public.pem"

echo.
echo === Keys generated successfully ===
echo Private key: %KEYS_DIR%\private.pem
echo Public key:  %KEYS_DIR%\public.pem
echo.
echo To use these keys, set in .env:
echo RSA_PRIVATE_KEY_PATH=./keys/private.pem
echo RSA_PUBLIC_KEY_PATH=./keys/public.pem

endlocal
