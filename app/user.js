class User {
    static login(form) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        data = formDataToJson(data);
        axios.post(`/auth/login`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                toastr.success('You have successfully logged in. Welcome');
                location.href = 'adminDashboard.html';
                localStorage.setItem(JWT_TOKEN_NAME, response.data.jwt);
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static forgotPassword(form) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        data = formDataToJson(data);
        axios.post(`/auth/forgot-password`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                toastr.success(response.data && response.data.message ||
                    'Please click on the link sent to your email to change your password');
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static logout() {
        localStorage.removeItem(JWT_TOKEN_NAME);
        location.href = 'adminLogin.html';
    }
}

const loginForm = $('#login-form');
loginForm.on('submit', (e) => {
    e.preventDefault();
    User.login(loginForm);
});

const forgotPasswordForm = $('#forgot-password-form');
forgotPasswordForm.on('submit', (e) => {
    e.preventDefault();
    User.forgotPassword(forgotPasswordForm);
});



