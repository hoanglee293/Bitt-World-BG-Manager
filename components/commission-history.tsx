"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getCommissionHistoryWithFallback } from "@/lib/api"
import { format } from "date-fns"
import { Loader2, Wallet, Calendar, DollarSign, Hash, TrendingUp } from "lucide-react"
import { useLang } from "@/app/lang"
import { useResponsive } from "@/hooks/use-mobile"

interface CommissionEntry {
  bacr_id: number
  bacr_tree_id: number
  bacr_order_id: number
  bacr_wallet: string
  bacr_commission_amount: string
  bacr_level: number
  bacr_created_at: string
}

export default function CommissionHistory() {
  const [history, setHistory] = useState<CommissionEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, lang } = useLang()
  const { isMobile, isTablet } = useResponsive()

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getCommissionHistoryWithFallback()
        setHistory(data)
      } catch (err) {
        setError(t("errors.networkError"))
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [])

  // Get date format based on current language
  const getDateFormat = () => {
    switch (lang) {
      case 'vi':
        return 'dd/MM/yyyy'
      case 'kr':
        return 'yyyy/MM/dd'
      case 'jp':
        return 'yyyy/MM/dd'
      default:
        return 'MM/dd/yyyy'
    }
  }

  // Format wallet address for display
  const formatWalletAddress = (wallet: string) => {
    if (wallet.length <= 8) return wallet
    return `${wallet.substring(0, 4)}...${wallet.substring(wallet.length - 4)}`
  }

  // Format commission amount
  const formatAmount = (amount: string) => {
    const num = Number.parseFloat(amount)
    return `$${num.toFixed(6)}`
  }

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

  // Mobile Card Layout
  if (isMobile || isTablet) {
    return (
      <Card className="border-l-8 border-[#00c0ff]/50 border-y-0 border-r-0 rounded-none h-full">
        <CardHeader>
          <CardTitle>{t("commission.history")}</CardTitle>
          <CardDescription>{t("commission.historyDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 mx-4 rounded-lg pb-0" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">{t("commission.noHistory")}</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {history.map((entry) => (
                <Card key={entry.bacr_id} className="border border-border/50 hover:border-border transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">#{entry.bacr_order_id}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {t("auth.level")} {entry.bacr_level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Wallet Address */}
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-yellow-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">{t("commission.receivingWallet")}</p>
                          <p className="text-sm font-mono text-yellow-500 font-semibold truncate">
                            {formatWalletAddress(entry.bacr_wallet)}
                          </p>
                        </div>
                      </div>

                      {/* Commission Amount */}
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">{t("commission.amount")}</p>
                          <p className="text-lg font-bold text-green-500">
                            {formatAmount(entry.bacr_commission_amount)}
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">{t("commission.date")}</p>
                          <p className="text-sm">
                            {format(new Date(entry.bacr_created_at), getDateFormat() + " HH:mm")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Desktop Table Layout
  return (
    <Card className="border-l-8 border-[#00c0ff]/50 border-y-0 border-r-0 rounded-none h-full">
      <CardHeader>
        <CardTitle>{t("commission.history")}</CardTitle>
        <CardDescription>{t("commission.historyDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 mx-4 rounded-lg pb-0" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t("commission.noHistory")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="relative">
              <Table className="w-full relative">
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>{t("common.id")}</TableHead>
                    <TableHead>{t("commission.orderId")}</TableHead>
                    <TableHead>{t("commission.receivingWallet")}</TableHead>
                    <TableHead className="text-right sticky right-0 bg-background">{t("commission.amount")}</TableHead>
                    <TableHead className="text-right">{t("auth.level")}</TableHead>
                    <TableHead className="text-right">{t("commission.date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="max-h-[80vh] overflow-y-auto">
                  {history.map((entry) => (
                    <TableRow key={entry.bacr_id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{entry.bacr_id}</TableCell>
                      <TableCell className="font-mono text-sm">#{entry.bacr_order_id}</TableCell>
                      <TableCell className="font-mono text-sm text-yellow-500 font-semibold">
                        {formatWalletAddress(entry.bacr_wallet)}
                      </TableCell>
                      <TableCell className="text-right sticky right-0 bg-background font-bold text-green-500">
                        {formatAmount(entry.bacr_commission_amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          {entry.bacr_level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {format(new Date(entry.bacr_created_at), getDateFormat() + " HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
