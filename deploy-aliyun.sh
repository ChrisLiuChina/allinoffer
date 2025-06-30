#!/bin/bash

# 澳赢留学网站 - 阿里云部署脚本
# 使用方法：bash deploy-aliyun.sh

echo "🚀 开始部署澳赢留学网站到阿里云..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查必要工具
check_tools() {
    echo "📋 检查部署工具..."
    
    if ! command -v ssh &> /dev/null; then
        echo -e "${RED}❌ SSH 未安装${NC}"
        exit 1
    fi
    
    if ! command -v scp &> /dev/null; then
        echo -e "${RED}❌ SCP 未安装${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 工具检查完成${NC}"
}

# 创建网站压缩包
create_archive() {
    echo "📦 创建网站文件压缩包..."
    
    # 创建临时目录
    mkdir -p temp_deploy
    
    # 复制必要文件
    cp index.html temp_deploy/
    cp styles.css temp_deploy/
    cp script.js temp_deploy/
    cp logo.png temp_deploy/
    cp QR.jpg temp_deploy/
    cp README.md temp_deploy/
    
    # 创建压缩包
    tar -czf aoyingliuxue-website.tar.gz -C temp_deploy .
    
    # 清理临时目录
    rm -rf temp_deploy
    
    echo -e "${GREEN}✅ 压缩包创建完成: aoyingliuxue-website.tar.gz${NC}"
}

# 显示部署说明
show_deployment_guide() {
    echo ""
    echo -e "${YELLOW}📖 阿里云部署指南${NC}"
    echo "=================================="
    echo ""
    echo "1️⃣ 购买阿里云ECS服务器"
    echo "   - 推荐配置：2核4GB内存"
    echo "   - 系统：Ubuntu 20.04 LTS"
    echo "   - 带宽：5Mbps"
    echo ""
    echo "2️⃣ 安全组配置"
    echo "   - 开放端口：22(SSH), 80(HTTP), 443(HTTPS)"
    echo ""
    echo "3️⃣ 域名配置"
    echo "   - 购买域名（如：aoyingliuxue.com）"
    echo "   - 解析到服务器IP"
    echo ""
    echo "4️⃣ 服务器配置命令"
    echo "   ssh root@您的服务器IP"
    echo ""
    echo "5️⃣ 运行服务器配置脚本"
    echo "   bash server-setup.sh"
    echo ""
}

# 创建服务器配置脚本
create_server_script() {
    echo "🔧 创建服务器配置脚本..."
    
    cat > server-setup.sh << 'EOF'
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
EOF

    chmod +x server-setup.sh
    echo -e "${GREEN}✅ 服务器配置脚本创建完成${NC}"
}

# 创建文件上传脚本
create_upload_script() {
    echo "📤 创建文件上传脚本..."
    
    cat > upload-website.sh << 'EOF'
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
EOF

    chmod +x upload-website.sh
    echo -e "${GREEN}✅ 文件上传脚本创建完成${NC}"
}

# 主函数
main() {
    check_tools
    create_archive
    create_server_script
    create_upload_script
    show_deployment_guide
    
    echo ""
    echo -e "${GREEN}🎉 部署脚本准备完成！${NC}"
    echo ""
    echo "📋 接下来的步骤："
    echo "1. 购买阿里云ECS服务器"
    echo "2. 在服务器上运行: bash server-setup.sh"
    echo "3. 上传网站文件: bash upload-website.sh 服务器IP"
    echo "4. 配置域名和SSL证书"
    echo ""
    echo "📁 生成的文件："
    echo "- aoyingliuxue-website.tar.gz (网站文件包)"
    echo "- server-setup.sh (服务器配置脚本)"
    echo "- upload-website.sh (文件上传脚本)"
}

# 运行主函数
main 