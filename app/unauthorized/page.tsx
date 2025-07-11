"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-800">Truy cập bị từ chối</CardTitle>
            <CardDescription className="text-red-600">
              Bạn không phải là BG Affiliate hoặc chưa được cấp quyền
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Chỉ dành cho BG Affiliate</span>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Làm thế nào để trở thành BG Affiliate?</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Đăng nhập bằng Telegram để được xác thực</li>
                  <li>• Liên hệ với admin để được thêm vào hệ thống BG Affiliate</li>
                  <li>• Hoặc được mời bởi một BG Affiliate hiện có</li>
                  <li>• Tuân thủ các điều khoản và điều kiện của hệ thống</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <Button 
                onClick={() => router.push('/login')}
                className="flex-1"
              >
                Đăng nhập khác
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Nếu bạn nghĩ đây là lỗi, vui lòng</p>
              <p>
                <a href="mailto:support@bg-affiliate.com" className="text-primary hover:underline">
                  liên hệ hỗ trợ
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 