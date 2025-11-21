import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Kiểm tra đăng nhập khi tải trang lần đầu (F5)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username'); // Bạn nên lưu thêm cái này ở LoginForm

    if (token && userRole) {
      setUser({ token, role: userRole, username });
    }
    setIsLoading(false);
  }, []);

  // 2. Hàm Đăng nhập
  const login = (token, userInfo) => {
    // Lưu vào localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userInfo.role);
    localStorage.setItem('username', userInfo.username || userInfo.name);

    // Cập nhật State
    setUser({ 
      token, 
      role: userInfo.role, 
      username: userInfo.username || userInfo.name 
    });
  };

  // 3. Hàm Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để dùng Context dễ hơn
export const useAuth = () => useContext(AuthContext);