import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/LoginForm"
import { SignUpForm } from "@/components/auth/SignUpForm"

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    // Dùng màu nền 'background-secondary' bạn đã định nghĩa trong index.css
    <div className="flex min-h-screen w-full items-center justify-center bg-background-secondary p-4">
      {/* Dùng 'shadow-custom-lg' bạn đã định nghĩa */}
      <Card className="w-full max-w-md shadow-custom-lg animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Chào mừng trở lại! Đăng nhập để tiếp tục."
              : "Tạo tài khoản mới để bắt đầu."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLogin ? <LoginForm /> : <SignUpForm />}
        </CardContent>
        
        <CardFooter className="flex-col items-center justify-center text-sm">
          <p className="text-muted-foreground">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
            <Button
              variant="link"
              className="px-2"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AuthPage