import axios from 'axios';

class Auth {
    constructor () {
        this.token = window.localStorage.getItem('token');
        let userData = window.localStorage.getItem('user');
        this.user = userData ? JSON.parse(userData) : null;

        if (this.token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
        }
    }
    login (token, user) {
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

        this.token = token;
        this.user = user;
    }
    isAuthorized () {
        return !! this.token;
    }
    verifyEmail (emailVerifiedAt) {
        this.user.email_verified_at = emailVerifiedAt;
        window.localStorage.setItem('user', JSON.stringify(this.user));
    }
    isVerified () {
        return !! (this.user && this.user.email_verified_at);
    }
    isAdmin () {
        if (this.user) {
            return this.user.role === 'admin';
        } else {
            return false;
        }
    }
    logout () {
        // window.localStorage.clear();
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        this.user = null;
    }
}
export default new Auth();
