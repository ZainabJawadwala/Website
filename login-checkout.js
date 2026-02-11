/* ============ SIMPLIFIED LOGIN SYSTEM - WORKING ============ */

console.log('📝 Login script loading...');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM fully loaded, initializing login...\n');
    
    // Get all elements
    const loginLink = document.getElementById('loginLink');
    const bannerLoginBtn = document.getElementById('bannerLoginBtn');
    const browseBtn = document.getElementById('browseBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginBtn = document.getElementById('closeLogin');
    
    // Debug logging
    console.log('🔍 Elements found:');
    console.log('  ✓ loginLink:', !!loginLink);
    console.log('  ✓ bannerLoginBtn:', !!bannerLoginBtn);
    console.log('  ✓ loginModal:', !!loginModal);
    console.log('  ✓ closeLoginBtn:', !!closeLoginBtn, '\n');
    
    if (!loginModal) {
        console.error('❌ CRITICAL ERROR: loginModal not found!');
        return;
    }
    
    // ===== MODAL FUNCTIONS =====
    function showLoginModal() {
        console.log('🟢 [SHOW] Login modal');
        loginModal.classList.remove('hidden');
    }
    
    function closeLoginModal() {
        console.log('🔴 [CLOSE] Login modal');
        loginModal.classList.add('hidden');
    }
    
    // ===== CLICK HANDLERS =====
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            console.log('👆 [CLICK] Login link in header');
            e.preventDefault();
            showLoginModal();
        });
    }
    
    if (bannerLoginBtn) {
        bannerLoginBtn.addEventListener('click', () => {
            console.log('👆 [CLICK] Banner login button');
            showLoginModal();
        });
    }
    
    if (browseBtn) {
        browseBtn.addEventListener('click', () => {
            console.log('👆 [CLICK] Browse products button');
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => {
            console.log('👆 [CLICK] Close button (×)');
            closeLoginModal();
        });
    }
    
    // Close modal when clicking outside
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            console.log('👆 [CLICK] Outside modal area');
            closeLoginModal();
        }
    });
    
    // ===== TABS =====
    const emailTabBtn = document.getElementById('emailTabBtn');
    const phoneTabBtn = document.getElementById('phoneTabBtn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (emailTabBtn) {
        emailTabBtn.addEventListener('click', () => {
            console.log('📧 [TAB] Switched to Email login');
            emailTabBtn.classList.add('active');
            phoneTabBtn.classList.remove('active');
            tabContents.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === 'email');
            });
        });
    }
    
    if (phoneTabBtn) {
        phoneTabBtn.addEventListener('click', () => {
            console.log('📱 [TAB] Switched to Phone login');
            phoneTabBtn.classList.add('active');
            emailTabBtn.classList.remove('active');
            tabContents.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === 'phone');
            });
        });
    }
    
    // ===== FORM VISIBILITY TOGGLE =====
    const toggleSignupBtn = document.getElementById('toggleSignup');
    const toggleLoginBtn = document.getElementById('toggleLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (toggleSignupBtn) {
        toggleSignupBtn.addEventListener('click', () => {
            console.log('📝 [TOGGLE] Showing signup form');
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        });
    }
    
    if (toggleLoginBtn) {
        toggleLoginBtn.addEventListener('click', () => {
            console.log('🔐 [TOGGLE] Showing login form');
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }
    
    // ===== EMAIL LOGIN FORM =====
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const msg = document.getElementById('loginMsg');
            
            console.log('🔐 [SUBMIT] Email login form:', email);
            
            const users = JSON.parse(localStorage.getItem('ajj_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                console.log('✅ [SUCCESS] Login successful for:', user.email);
                localStorage.setItem('ajj_user', JSON.stringify(user));
                msg.textContent = '✅ Login successful!';
                msg.style.color = 'green';
                setTimeout(() => {
                    closeLoginModal();
                    loginForm.reset();
                }, 1200);
            } else {
                console.log('❌ [ERROR] Invalid credentials');
                msg.textContent = '❌ Invalid email or password';
                msg.style.color = 'red';
            }
        });
    }
    
    // ===== SIGNUP FORM =====
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value;
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const phone = document.getElementById('signupPhone').value;
            const password = document.getElementById('signupPassword').value;
            const msg = document.getElementById('signupMsg');
            
            console.log('📝 [SUBMIT] Signup form:', username);
            
            const users = JSON.parse(localStorage.getItem('ajj_users') || '[]');
            
            if (users.find(u => u.email === email)) {
                msg.textContent = '❌ Email already registered';
                msg.style.color = 'red';
                return;
            }
            
            if (users.find(u => u.username === username)) {
                msg.textContent = '❌ Username taken';
                msg.style.color = 'red';
                return;
            }
            
            const newUser = { username, name, email, phone, password };
            users.push(newUser);
            localStorage.setItem('ajj_users', JSON.stringify(users));
            localStorage.setItem('ajj_user', JSON.stringify(newUser));
            
            console.log('✅ [SUCCESS] Account created:', username);
            msg.textContent = '✅ Account created!';
            msg.style.color = 'green';
            
            setTimeout(() => {
                closeLoginModal();
                signupForm.reset();
            }, 1200);
        });
    }
    
    // ===== PHONE + OTP =====
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const phoneLoginForm = document.getElementById('phoneLoginForm');
    
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', () => {
            const phone = document.getElementById('phoneLoginNumber').value;
            
            if (!phone || phone.length < 10) {
                alert('❌ Enter valid phone number');
                return;
            }
            
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            localStorage.setItem('ajj_otp_' + phone, JSON.stringify({ otp, time: Date.now() }));
            
            console.log('📱 [OTP] Sent to:', phone, '| Code:', otp);
            
            document.getElementById('otpSection').classList.remove('hidden');
            document.getElementById('phoneLoginBtn').disabled = false;
            
            alert(`✅ OTP sent!\n\nDemo OTP: ${otp}`);
        });
    }
    
    if (phoneLoginForm) {
        phoneLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('phoneLoginNumber').value;
            const otp = document.getElementById('otpInput').value;
            const msg = document.getElementById('phoneLoginMsg');
            
            const storedData = JSON.parse(localStorage.getItem('ajj_otp_' + phone) || 'null');
            
            console.log('🔐 [VERIFY] OTP for:', phone);
            
            if (!storedData || storedData.otp !== otp) {
                msg.textContent = '❌ Invalid OTP';
                msg.style.color = 'red';
                return;
            }
            
            console.log('✅ [SUCCESS] OTP verified');
            localStorage.setItem('ajj_user', JSON.stringify({ phone, loginType: 'phone' }));
            msg.textContent = '✅ Login successful!';
            msg.style.color = 'green';
            
            setTimeout(() => {
                closeLoginModal();
                phoneLoginForm.reset();
                document.getElementById('otpSection').classList.add('hidden');
            }, 1200);
        });
    }
    
    // ===== GOOGLE LOGIN =====
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            const username = prompt('Enter username for Google login:');
            if (username) {
                console.log('🔵 [GOOGLE] Login:', username);
                localStorage.setItem('ajj_user', JSON.stringify({ username, loginType: 'google' }));
                alert('✅ Login successful with Google!');
                closeLoginModal();
            }
        });
    }
    
    console.log('\n✅ LOGIN SYSTEM READY!\n');
    console.log('📌 How to debug:');
    console.log('   1. Open browser console (F12)');
    console.log('   2. Click "Login" button');
    console.log('   3. Watch console for debug messages\n');
});

/* ============ CUSTOMIZATION & CART (from ajjewels.js) ============ */
// This section continues from ajjewels.js - Maps, Payment, Checkout
