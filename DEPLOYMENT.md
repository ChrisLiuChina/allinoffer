# 澳赢留学网站部署指南

## 🎯 部署前检查清单

### ✅ 文件完整性检查
- [x] index.html - 主页面
- [x] styles.css - 样式文件
- [x] script.js - JavaScript功能
- [x] logo.png - 公司logo
- [x] QR.jpg - 二维码图片
- [x] README.md - 项目说明

### ✅ 功能测试
- [ ] 响应式设计测试（手机、平板、桌面）
- [ ] 表单提交功能测试
- [ ] 导航链接测试
- [ ] 图片加载测试
- [ ] 动画效果测试

### ✅ 内容检查
- [ ] 联系信息是否正确
- [ ] 电话号码是否有效
- [ ] 邮箱地址是否正确
- [ ] 微信二维码是否清晰
- [ ] 公司地址是否准确

## 🚀 推荐部署方案

### 方案一：GitHub Pages（免费）
**优点：** 完全免费、操作简单、自动HTTPS
**缺点：** 域名较长
**适用：** 快速上线、预算有限

### 方案二：Netlify/Vercel（免费）
**优点：** 免费、自动部署、自定义域名
**缺点：** 免费版有流量限制
**适用：** 专业展示、需要自定义域名

### 方案三：云服务器（付费）
**优点：** 完全控制、高性能、自定义域名
**缺点：** 需要技术维护、有成本
**适用：** 企业级应用、需要高可用性

## 📝 部署步骤

### GitHub Pages部署
```bash
# 1. 创建GitHub仓库
# 2. 推送代码
git remote add origin https://github.com/用户名/仓库名.git
git branch -M main
git push -u origin main

# 3. 启用GitHub Pages
# 进入仓库设置 -> Pages -> Source选择main分支
```

### Netlify部署
1. 访问 https://netlify.com
2. 注册并登录
3. 点击"New site from Git"
4. 选择GitHub并授权
5. 选择仓库，设置部署选项
6. 点击"Deploy site"

### 云服务器部署
```bash
# 1. 连接服务器
ssh root@服务器IP

# 2. 安装Nginx
sudo apt update
sudo apt install nginx

# 3. 上传文件
scp -r ./* root@服务器IP:/var/www/html/

# 4. 配置Nginx
sudo nano /etc/nginx/sites-available/default
# 设置域名和SSL证书

# 5. 重启Nginx
sudo systemctl restart nginx
```

## 🔧 域名配置

### 购买域名
推荐域名注册商：
- 阿里云万网
- 腾讯云
- GoDaddy

### DNS解析配置
```
类型: A记录
主机记录: @
记录值: 服务器IP或CDN地址
TTL: 600
```

### SSL证书配置
- 使用Let's Encrypt免费证书
- 或购买商业SSL证书

## 📊 性能优化建议

### 图片优化
- 压缩图片大小
- 使用WebP格式
- 实现懒加载

### 代码优化
- 压缩CSS和JavaScript
- 启用Gzip压缩
- 使用CDN加速

### 缓存策略
- 设置浏览器缓存
- 使用CDN缓存
- 配置服务器缓存

## 🔍 部署后检查

### 功能测试
- [ ] 所有页面正常加载
- [ ] 表单提交正常
- [ ] 响应式设计正常
- [ ] 图片和资源加载正常

### 性能测试
- [ ] 页面加载速度 < 3秒
- [ ] 移动端性能良好
- [ ] SEO优化检查

### 安全检查
- [ ] HTTPS证书正常
- [ ] 表单安全验证
- [ ] 无敏感信息泄露

## 📞 技术支持

如遇到部署问题，可以：
1. 查看部署平台文档
2. 检查错误日志
3. 联系技术支持
4. 寻求专业帮助

---
*最后更新：2024年* 