// 导航栏功能
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 汉堡菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接时关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 考虑固定导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // 表单提交处理
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        const submitBtn = consultationForm.querySelector('button[type="submit"]');
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 获取表单数据
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            // 加强校验
            if (!validateForm(data)) return;
            // 禁用按钮防止重复提交
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '提交中...';
            }
            // 模拟提交
            setTimeout(() => {
                showMessage('感谢您的咨询！我们会尽快与您联系。', 'success');
                this.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '提交咨询';
                }
            }, 1500);
            // 3秒后恢复按钮
            setTimeout(() => {
                if (submitBtn) submitBtn.disabled = false;
            }, 3000);
        });
    }

    // 数字动画效果
    animateNumbers();
    
    // 滚动动画
    initScrollAnimations();

    // 微信号点击复制功能
    const wechatId = document.getElementById('wechatId');
    if (wechatId) {
        let canCopy = true;
        wechatId.setAttribute('aria-label', '点击复制微信号');
        wechatId.setAttribute('tabindex', '0');
        wechatId.addEventListener('click', function() {
            if (!canCopy) return;
            canCopy = false;
            const text = this.textContent.trim();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showMessage('微信号已复制', 'success');
                });
            } else {
                // 兼容旧浏览器
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showMessage('微信号已复制', 'success');
                } catch (err) {}
                document.body.removeChild(textarea);
            }
            setTimeout(() => { canCopy = true; }, 3000);
        });
        // 支持键盘回车复制
        wechatId.addEventListener('keydown', function(e) {
            if ((e.key === 'Enter' || e.key === ' ') && canCopy) {
                wechatId.click();
            }
        });
    }

    // 加载成功案例数据
    loadCases();
});

// 加载成功案例数据
async function loadCases() {
    try {
        const response = await fetch('http://localhost:4001/api/cases');
        const cases = await response.json();
        
        const casesGrid = document.querySelector('.cases-grid');
        if (casesGrid && cases.length > 0) {
            // 清空现有内容
            casesGrid.innerHTML = '';
            
            // 渲染案例数据
            cases.forEach(caseItem => {
                const caseCard = document.createElement('div');
                caseCard.className = 'case-card';
                caseCard.innerHTML = `
                    <div class="case-header">
                        <h3>${caseItem.title}</h3>
                        <span class="case-result">录取成功</span>
                    </div>
                    ${caseItem.imageUrl ? `<div class="case-image">
                        <img src="http://localhost:4001${caseItem.imageUrl}" alt="${caseItem.title}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:12px;">
                    </div>` : ''}
                    <p class="case-details">${caseItem.description || '通过我们的专业指导，成功获得理想院校录取。'}</p>
                    <div class="case-tags">
                        <span class="tag">专业服务</span>
                        <span class="tag">免中介费</span>
                        <span class="tag">成功录取</span>
                    </div>
                `;
                casesGrid.appendChild(caseCard);
            });
        } else if (casesGrid) {
            // 如果没有案例数据，显示默认内容
            casesGrid.innerHTML = `
                <div class="case-card">
                    <div class="case-header">
                        <h3>张同学</h3>
                        <span class="case-result">录取成功</span>
                    </div>
                    <p class="case-school">墨尔本大学 - 商科硕士</p>
                    <p class="case-details">
                        张同学本科毕业于国内211大学，通过我们的专业指导，
                        成功申请到墨尔本大学商科硕士项目，获得全额奖学金。
                    </p>
                    <div class="case-tags">
                        <span class="tag">GPA 3.8</span>
                        <span class="tag">雅思 7.0</span>
                        <span class="tag">全额奖学金</span>
                    </div>
                </div>
                <div class="case-card">
                    <div class="case-header">
                        <h3>李同学</h3>
                        <span class="case-result">录取成功</span>
                    </div>
                    <p class="case-school">悉尼大学 - 计算机科学本科</p>
                    <p class="case-details">
                        李同学通过我们的指导，成功申请到悉尼大学计算机科学专业，
                        并获得了部分奖学金支持。
                    </p>
                    <div class="case-tags">
                        <span class="tag">高考成绩优秀</span>
                        <span class="tag">雅思 6.5</span>
                        <span class="tag">部分奖学金</span>
                    </div>
                </div>
                <div class="case-card">
                    <div class="case-header">
                        <h3>王同学</h3>
                        <span class="case-result">录取成功</span>
                    </div>
                    <p class="case-school">昆士兰大学 - 工程硕士</p>
                    <p class="case-details">
                        王同学本科背景较弱，通过我们的专业规划和指导，
                        成功申请到昆士兰大学工程硕士项目。
                    </p>
                    <div class="case-tags">
                        <span class="tag">GPA 3.2</span>
                        <span class="tag">雅思 6.5</span>
                        <span class="tag">背景提升</span>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('加载成功案例失败:', error);
        // 加载失败时显示默认内容
        const casesGrid = document.querySelector('.cases-grid');
        if (casesGrid) {
            casesGrid.innerHTML = `
                <div class="case-card">
                    <div class="case-header">
                        <h3>张同学</h3>
                        <span class="case-result">录取成功</span>
                    </div>
                    <p class="case-school">墨尔本大学 - 商科硕士</p>
                    <p class="case-details">
                        张同学本科毕业于国内211大学，通过我们的专业指导，
                        成功申请到墨尔本大学商科硕士项目，获得全额奖学金。
                    </p>
                    <div class="case-tags">
                        <span class="tag">GPA 3.8</span>
                        <span class="tag">雅思 7.0</span>
                        <span class="tag">全额奖学金</span>
                    </div>
                </div>
                <div class="case-card">
                    <div class="case-header">
                        <h3>李同学</h3>
                        <span class="case-result">录取成功</span>
                    </div>
                    <p class="case-school">悉尼大学 - 计算机科学本科</p>
                    <p class="case-details">
                        李同学通过我们的指导，成功申请到悉尼大学计算机科学专业，
                        并获得了部分奖学金支持。
                    </p>
                    <div class="case-tags">
                        <span class="tag">高考成绩优秀</span>
                        <span class="tag">雅思 6.5</span>
                        <span class="tag">部分奖学金</span>
                    </div>
                </div>
                <div class="case-card">
                    <div class="case-header">
                        <h3>王同学</h3>
                        <span class="case-result">录取成功</span>
                    </div>
                    <p class="case-school">昆士兰大学 - 工程硕士</p>
                    <p class="case-details">
                        王同学本科背景较弱，通过我们的专业规划和指导，
                        成功申请到昆士兰大学工程硕士项目。
                    </p>
                    <div class="case-tags">
                        <span class="tag">GPA 3.2</span>
                        <span class="tag">雅思 6.5</span>
                        <span class="tag">背景提升</span>
                    </div>
                </div>
            `;
        }
    }
}

// 表单验证
function validateForm(data) {
    const errors = [];
    if (!data.name || data.name.trim().length < 2 || data.name.length > 20) {
        errors.push('请输入2-20位有效姓名');
    }
    if (!data.phone || !/^1[3-9]\d{9}$/.test(data.phone)) {
        errors.push('请输入有效的手机号码');
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 40) {
        errors.push('请输入有效的邮箱地址');
    }
    if (!data.service) {
        errors.push('请选择服务类型');
    }
    if (data.message && data.message.length > 200) {
        errors.push('需求描述请控制在200字以内');
    }
    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return false;
    }
    return true;
}

// 显示消息
function showMessage(message, type) {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = message;
    
    // 添加样式
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#10b981';
    } else {
        messageDiv.style.background = '#ef4444';
    }
    
    // 添加到页面
    document.body.appendChild(messageDiv);
    
    // 显示动画
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 5000);
}

// 数字动画
function animateNumbers() {
    const statItems = document.querySelectorAll('.stat-item h3');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent);
                animateNumber(target, 0, finalNumber, 2000);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statItems.forEach(item => {
        observer.observe(item);
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current + (element.textContent.includes('+') ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.service-card, .case-card, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 服务卡片悬停效果
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// 联系表单增强
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    formInputs.forEach(input => {
        // 焦点效果
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // 实时验证
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(field.type) {
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = '请输入有效的邮箱地址';
            }
            break;
        case 'tel':
            if (value && !/^1[3-9]\d{9}$/.test(value)) {
                isValid = false;
                errorMessage = '请输入有效的手机号码';
            }
            break;
        case 'text':
            if (field.name === 'name' && value && value.length < 2) {
                isValid = false;
                errorMessage = '姓名至少需要2个字符';
            }
            break;
    }
    
    // 显示或隐藏错误信息
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!isValid) {
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.9rem;
                margin-top: 0.5rem;
                animation: fadeIn 0.3s ease;
            `;
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
        field.style.borderColor = '#ef4444';
    } else {
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '#10b981';
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .service-card, .case-card, .contact-item {
        transition: all 0.3s ease;
    }
    
    .form-group {
        transition: transform 0.3s ease;
    }
    
    .field-error {
        animation: fadeIn 0.3s ease;
    }
`;
document.head.appendChild(style); 