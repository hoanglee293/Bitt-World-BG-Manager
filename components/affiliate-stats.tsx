"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBgAffiliateStatsWithFallback } from "@/lib/api"
import { Loader2 } from "lucide-react"


export default function BgAffiliateStats() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getBgAffiliateStatsWithFallback()
        setStats(data)
      } catch (err) {
        setError("Failed to fetch BG affiliate statistics.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
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

  if (!stats) {
    return <div className="text-center text-muted-foreground py-8">Không có dữ liệu thống kê.</div>
  }
  console.log("stats", stats)
  return (
    <Card className="border-l-8 border-[#00c0ff]/50 border-y-0 border-r-0 rounded-none h-full">
      <CardHeader>
        <CardTitle>Thống kê BG Affiliate</CardTitle>
        <CardDescription>Tổng quan về hiệu suất BG Affiliate của bạn.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 mx-4 rounded-lg" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
        {/* <div className="flex items-center justify-between">
          <span className="font-medium">Là BG Affiliate:</span>
          <span>{stats.isBgAffiliate ? "Có" : "Không"}</span>
        </div> */}
        {stats.treeInfo.rootWallet &&
          <div className="grid gap-2">
            <h3 className="font-semibold text-lg">Thông tin cây:</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="font-medium">ID Cây:</div>
              <div>{stats.treeInfo.treeId}</div>
              <div className="font-medium">Ví gốc:</div>
              <div className="truncate">{stats.treeInfo.rootWallet?.substring(0, 7)}...{stats.treeInfo.rootWallet?.substring(stats.treeInfo.rootWallet.length - 4)}</div>
              <div className="font-medium">Tổng phần trăm hoa hồng:</div>
              <div>{stats.treeInfo.totalCommissionPercent}%</div>
            </div>
          </div>
        }
        {stats.nodeInfo.parentWallet &&
          <div className="grid gap-2 border-t pt-4">
            <h3 className="font-semibold text-lg">Thông tin ví cha của bạn:</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="font-medium">ID Cây:</div>
              <div>{stats.nodeInfo.treeId}</div>
              <div className="font-medium">Ví cha:</div>
              <div className="truncate">{stats.nodeInfo.parentWallet?.substring(0, 7)}...{stats.nodeInfo.parentWallet?.substring(stats.nodeInfo.parentWallet.length - 4)}</div>
              <div className="font-medium">Phần trăm hoa hồng:</div>
              <div>{stats.nodeInfo.commissionPercent}%</div>
              <div className="font-medium">Cấp độ:</div>
              <div>{stats.nodeInfo.level}</div>
            </div>
          </div>
        }
        {stats.totalEarnings &&
          <div className="flex items-center justify-between text-lg font-bold border-t pt-4 ">
            <span>Tổng thu nhập:</span>
            <span>${stats.totalEarnings.toFixed(2)}</span>
          </div>
        }
      </CardContent>
    </Card>
  )
}
