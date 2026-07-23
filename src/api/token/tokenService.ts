import { jwtDecode } from "jwt-decode";

class TokenService {
  static setToken(token: string, useSessionOnly = false): void {
    if (useSessionOnly) {
      sessionStorage.setItem("token", token);
    } else {
      localStorage.setItem("token", token);
    }
  }

  static getToken(): string | null {
    return sessionStorage.getItem("token") || localStorage.getItem("token");
  }

  static decodeToken(): { id: string; role: string, memberId: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<{ id: string; role: string; memberId: string }>(token);
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  static getRole(): string | null {
    return this.decodeToken()?.role || null;
  }

  static getMemberId(): string | null {
    return this.decodeToken()?.memberId || null;
  }

  static getUserId(): string | null {
    return this.decodeToken()?.id || null;
  }

  static removeToken(): void {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
  }
}

export default TokenService;
