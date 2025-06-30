#!/bin/bash

# 阿里云服务器配置脚本
# 在服务器上运行此脚本

echo "🚀 开始配置阿里云服务器..."

# 更新系统
echo "📦 更新系统包..."
apt update && apt upgrade -y

# 安装Nginx
echo "🌐 安装Nginx..."
apt install nginx -y

# 安装SSL证书工具
echo "🔒 安装SSL证书工具..."
apt install certbot python3-certbot-nginx -y

# 创建网站目录
echo "📁 创建网站目录..."
mkdir -p /var/www/aoyingliuxue.com
chown -R www-data:www-data /var/www/aoyingliuxue.com

# 配置Nginx
echo "⚙️ 配置Nginx..."
cat > /etc/nginx/sites-available/aoyingliuxue.com << 'NGINX_EOF'
server {
    listen 80;
    server_name aoyingliuxue.com www.aoyingliuxue.com;
    root /var/www/aoyingliuxue.com;
    index index.html;

    # 启用Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 缓存设置
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 主页
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}

# HTTPS配置（SSL证书配置后启用）
# server {
#     listen 443 ssl http2;
#     server_name aoyingliuxue.com www.aoyingliuxue.com;
#     root /var/www/aoyingliuxue.com;
#     index index.html;
#     
#     ssl_certificate /etc/letsencrypt/live/aoyingliuxue.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/aoyingliuxue.com/privkey.pem;
#     
#     # SSL配置
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
#     ssl_prefer_server_ciphers off;
#     
#     # 其他配置同上...
# }
NGINX_EOF

# 启用网站配置
ln -sf /etc/nginx/sites-available/aoyingliuxue.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
nginx -t

# 重启Nginx
systemctl restart nginx
systemctl enable nginx

echo "✅ 服务器配置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 上传网站文件到 /var/www/aoyingliuxue.com/"
echo "2. 配置域名解析到服务器IP"
echo "3. 申请SSL证书：certbot --nginx -d aoyingliuxue.com"
echo "4. 测试网站访问"
