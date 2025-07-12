"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBgAffiliateStatsWithFallback } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { useLang } from "@/app/lang"

export default function BgAffiliateStats() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLang()

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
  }, []) // Removed t dependency to prevent infinite loop

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("common.loading")}</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{t("errors.networkError")}</div>
  }

  if (!stats) {
    return <div className="text-center text-muted-foreground py-8">{t("common.noData")}</div>
  }
  console.log("stats", stats)
  return (
    <Card className="border-l-8 border-[#00c0ff]/50 border-y-0 border-r-0 rounded-none h-full">
      <CardHeader>
        <CardTitle>{t("dashboard.affiliateStats")}</CardTitle>
        <CardDescription>{t("messages.welcome")} {t("auth.bgAffiliate")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 mx-4 rounded-lg" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
        {/* <div className="flex items-center justify-between">
          <span className="font-medium">{t("auth.bgAffiliate")}:</span>
          <span>{stats.isBgAffiliate ? t("common.yes") : t("common.no")}</span>
        </div> */}
        {stats.treeInfo.rootWallet &&
          <div className="grid gap-2">
            <h3 className="font-semibold text-lg">{t("affiliate.tree")} {t("common.view")}:</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="font-medium">{t("affiliate.tree")} ID:</div>
              <div>{stats.treeInfo.treeId}</div>
              <div className="font-medium">{t("affiliate.tree")} {t("affiliate.walletAddress")}:</div>
              <div className="truncate">{stats.treeInfo.rootWallet?.solanaAddress.substring(0, 7)}...{stats.treeInfo.rootWallet?.solanaAddress.substring(stats.treeInfo.rootWallet.solanaAddress.length - 4)}</div>
              <div className="font-medium">{t("commission.totalCommission")} {t("commission.percentage")}:</div>
              <div>{stats.treeInfo.totalCommissionPercent}%</div>
            </div>
          </div>
        }
        {stats.nodeInfo.parentWallet &&
          <div className="grid gap-2 border-t pt-4">
            <h3 className="font-semibold text-lg">{t("affiliate.upline")} {t("affiliate.walletAddress")}:</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="font-medium">{t("affiliate.tree")} ID:</div>
              <div>{stats.nodeInfo.treeId}</div>
              <div className="font-medium">{t("affiliate.upline")}:</div>
              <div className="truncate">{stats.nodeInfo.parentWallet?.solanaAddress.substring(0, 7)}...{stats.nodeInfo.parentWallet?.solanaAddress.substring(stats.nodeInfo.parentWallet.solanaAddress.length - 4)}</div>
              <div className="font-medium">{t("commission.commissionRate")}:</div>
              <div>{stats.nodeInfo.commissionPercent}%</div>
              <div className="font-medium">{t("auth.level")}:</div>
              <div>{stats.nodeInfo.level}</div>
            </div>
          </div>
        }
        {stats.totalEarnings &&
          <div className="flex items-center justify-between text-lg font-bold border-t pt-4 ">
            <span>{t("commission.totalCommission")}:</span>
            <span>${stats.totalEarnings.toFixed(6)}</span>
          </div>
        }
      </CardContent>
    </Card>
  )
}
