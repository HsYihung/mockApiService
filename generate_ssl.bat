@echo off

REM 檢查是否安裝了 openssl
where openssl >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo openssl could not be found, please install it.
    exit /b 1
)

REM 檢查並創建 certs 資料夾
IF NOT EXIST "certs" (
    echo certs directory does not exist, creating it.
    mkdir certs
)

REM 移動至 certs 資料夾
cd certs

REM 生成自簽名憑證
openssl req -x509 -new -nodes -sha256 -utf8 -days 3650 -newkey rsa:2048 -keyout server.key -out server.crt -config ssl.conf

REM 詢問是否生成 PKCS#12 文件
set /p generate_pfx="Do you want to generate PKCS#12 file? (y/N): "

REM 默認設置為否
IF "%generate_pfx%"=="" set generate_pfx=n

IF /I "%generate_pfx%"=="y" (
    openssl pkcs12 -export -in server.crt -inkey server.key -out server.pfx
    echo PKCS#12 file generated successfully.
) ELSE (
    echo PKCS#12 file was not generated.
)

echo SSL certificate generated successfully.
pause
