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
import { LoginForm } from "./components/LoginForm"
import { SignUpForm } from "./components/SignUpForm"

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    // Using 'background-secondary' color defined in index.css
    <div className="flex min-h-screen w-full items-center justify-center bg-background-secondary p-4">
      {/* Using 'shadow-custom-lg' defined in index.css */}
      <Card className="w-full max-w-md shadow-custom-lg animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Welcome back! Login to continue."
              : "Create a new account to get started."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLogin ? <LoginForm /> : <SignUpForm />}
        </CardContent>
        
        <CardFooter className="flex-col items-center justify-center text-sm">
          <p className="text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              className="px-2"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up now" : "Login"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AuthPage