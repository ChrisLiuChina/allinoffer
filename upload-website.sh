#!/bin/bash

# 网站文件上传脚本
# 使用方法：bash upload-website.sh 服务器IP

if [ -z "$1" ]; then
    echo "❌ 请提供服务器IP地址"
    echo "使用方法: bash upload-website.sh 服务器IP"
    exit 1
fi

SERVER_IP=$1
echo "🚀 开始上传网站文件到服务器: $SERVER_IP"

# 上传压缩包
echo "📦 上传网站文件..."
scp aoyingliuxue-website.tar.gz root@$SERVER_IP:/tmp/

# 解压并部署文件
echo "📂 部署网站文件..."
ssh root@$SERVER_IP << 'SSH_EOF'
cd /tmp
tar -xzf aoyingliuxue-website.tar.gz -C /var/www/aoyingliuxue.com/
chown -R www-data:www-data /var/www/aoyingliuxue.com/
chmod -R 755 /var/www/aoyingliuxue.com/
rm aoyingliuxue-website.tar.gz
systemctl reload nginx
SSH_EOF

echo "✅ 网站部署完成！"
echo "🌐 访问地址: http://$SERVER_IP"
