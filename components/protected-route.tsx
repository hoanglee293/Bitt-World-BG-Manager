"use client"

import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireBgAffiliate?: boolean
}

export default function ProtectedRoute({ children, requireBgAffiliate = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Check if user has required data for BG Affiliate
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && requireBgAffiliate) {
      // For BG Affiliate, user must be a BG Affiliate
      if (!user.isBgAffiliate) {
        toast.error("Bạn không phải là BG Affiliate")
        router.push('/unauthorized')
      }
    }
  }, [isLoading, isAuthenticated, user, requireBgAffiliate, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Đang xác thực...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requireBgAffiliate && user && !user.isBgAffiliate) {
    return null
  }

  return <>{children}</>
} 