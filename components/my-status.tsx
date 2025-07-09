"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMyBgAffiliateStatus } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface WalletInfo {
  walletId: number
  solanaAddress: string
  nickName: string
  ethAddress: string
}

interface BgAffiliateInfo {
  treeId: number
  parentWalletId: number
  commissionPercent: number
  level: number
}

interface MyStatusData {
  isBgAffiliate: boolean
  currentWallet: WalletInfo
  bgAffiliateInfo: BgAffiliateInfo
}

export default function MyBgAffiliateStatus() {
  const [status, setStatus] = useState<MyStatusData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getMyBgAffiliateStatus()
        setStatus(data)
      } catch (err) {
        setError("Failed to fetch BG affiliate status.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStatus()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  if (!status) {
    return <div className="text-center text-muted-foreground py-8">Không có dữ liệu trạng thái.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái BG Affiliate của tôi</CardTitle>
        <CardDescription>Thông tin chi tiết về trạng thái BG Affiliate của ví hiện tại.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Là BG Affiliate:</span>
          <span>{status.isBgAffiliate ? "Có" : "Không"}</span>
        </div>
        <div className="grid gap-2">
          <h3 className="font-semibold text-lg">Thông tin ví hiện tại:</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="font-medium">ID Ví:</div>
            <div>{status.currentWallet.walletId}</div>
            <div className="font-medium">Địa chỉ Solana:</div>
            <div className="truncate">{status.currentWallet.solanaAddress}</div>
            <div className="font-medium">Biệt danh:</div>
            <div>{status.currentWallet.nickName}</div>
            <div className="font-medium">Địa chỉ ETH:</div>
            <div className="truncate">{status.currentWallet.ethAddress}</div>
          </div>
        </div>
        {status.isBgAffiliate && (
          <div className="grid gap-2">
            <h3 className="font-semibold text-lg">Thông tin BG Affiliate:</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="font-medium">ID Cây:</div>
              <div>{status.bgAffiliateInfo.treeId}</div>
              <div className="font-medium">ID Ví cha:</div>
              <div>{status.bgAffiliateInfo.parentWalletId}</div>
              <div className="font-medium">Phần trăm hoa hồng:</div>
              <div>{status.bgAffiliateInfo.commissionPercent}%</div>
              <div className="font-medium">Cấp độ:</div>
              <div>{status.bgAffiliateInfo.level}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
