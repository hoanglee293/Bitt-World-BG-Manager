"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Loader2, Shield, Users } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useLang } from "@/app/lang"

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLang()

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      window.open(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline`)
    } catch (error) {
      toast.error(t("auth.googleConnectionError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleTelegramLogin = () => {
    setIsLoading(true)
    try {
      const ref = sessionStorage.getItem('ref') || ''
      const telegramUrl = `${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}=${ref}`
      window.open(telegramUrl, '_self')
    } catch (error) {
      toast.error(t("auth.telegramConnectionError"))
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#03a7a7b3]/70 to-[#079325b3]/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-blue-50/70 to-indigo-100/70 rounded-xl">
        <Card className="shadow-xl w-full h-full rounded-xl bg-theme-blue-300">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="logo" className="rounded-lg" />
            </div>
            <CardTitle className="text-2xl pt-4 uppercase">BG Affiliate</CardTitle>
            <CardDescription className="text-black text-sm">
              {t("auth.connectWalletToAccess")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-12"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <img
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="google"
                    className="mr-2 h-8 w-8"
                  />
                )}
                <span className="text-white text-base">{t("auth.connectViaGoogle")}</span>
              </Button>
            </div>

            <div className="pt-6 text-center">
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-black" />
                  <span className="text-black">{t("auth.highSecurity")}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-black" />
                  <span className="text-black">{t("auth.affiliateSystem")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 