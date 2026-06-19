document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'An error occurred during sign in');
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                localStorage.setItem('userRole', data.role);

                showToast('Welcome back! Signed in successfully.', 'success');

                setTimeout(() => {
                    if (data.role === 'organizer' || data.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/dashboard';
                    }
                }, 1000);

            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const roleOptions = document.querySelectorAll('.role-option');
        roleOptions.forEach(option => {
            option.addEventListener('click', function () {
                roleOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                const radio = this.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const role = document.querySelector('input[name="role"]:checked').value;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, email, password, role })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'An error occurred while creating your account');
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                localStorage.setItem('userRole', data.role);

                showToast('Account created successfully! Welcome aboard.', 'success');

                setTimeout(() => {
                    if (data.role === 'organizer' || data.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/dashboard';
                    }
                }, 1000);

            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    }
});
