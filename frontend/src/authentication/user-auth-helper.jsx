export class UserAuthHelper {
  static LOCAL_STORAGE_KEY = 'auth';

  static loginUser(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = atob(base64);
    const userData = JSON.parse(payload);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(userData));
  }

  static isLoggedIn() {
    return !!localStorage.getItem(this.LOCAL_STORAGE_KEY);
  }

  static getUserUsername() {
    return this.getStoredUser()?.username;
  }

  static logoutUser() {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }

  static getStoredUser() {
    const storedUser = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (!storedUser) {
      return undefined;
    }
    return JSON.parse(storedUser);
  }
}
