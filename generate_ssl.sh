#!/bin/bash

# 檢查是否安裝了 openssl
if ! command -v openssl &> /dev/null; then
    echo "openssl could not be found, please install it."
    exit 1
fi

if [ ! -d "./certs" ]; then
    echo "certs directory does not exist, creating it."
    mkdir ./certs
fi

cd ./certs

# 生成自簽名憑證
openssl req -x509 -new -nodes -sha256 -utf8 -days 3650 -newkey rsa:2048 -keyout server.key -out server.crt -config ssl.conf

# 詢問是否生成 PKCS#12 文件
read -p "Do you want to generate PKCS#12 file? (y/N): " generate_pfx

# 默認設置為否
generate_pfx=${generate_pfx:-n}

if [[ "$generate_pfx" =~ ^[Yy]$ ]]; then
    openssl pkcs12 -export -in server.crt -inkey server.key -out server.pfx
    echo "PKCS#12 file generated successfully."
else
    echo "PKCS#12 file was not generated."
fi

echo "SSL certificate generated successfully."