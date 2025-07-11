"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCommissionHistoryWithFallback } from "@/lib/api"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

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

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getCommissionHistoryWithFallback()
        setHistory(data)
      } catch (err) {
        setError("Failed to fetch commission history.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
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

  return (
    <Card className="border-l-8 border-[#00c0ff]/50 border-y-0 border-r-0 rounded-none">
      <CardHeader>
        <CardTitle>Trung Tâm Giới Thiệu</CardTitle>
        <CardDescription>Xem lịch sử hoa hồng của bạn từ các giao dịch.</CardDescription>
      </CardHeader>
      <CardContent className="px-4 mx-4 rounded-lg" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground">Không có lịch sử hoa hồng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="relative">
              <Table className="w-full relative">
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Ví nhận hoa hồng</TableHead>
                    <TableHead >Số tiền hoa hồng</TableHead>
                    <TableHead className="text-right">Cấp độ</TableHead>
                    <TableHead className="text-right">Ngày tạo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="max-h-[80vh] overflow-y-auto">
                  {history.map((entry) => (
                    <TableRow key={entry.bacr_id}>
                      <TableCell>{entry.bacr_id}</TableCell>
                      <TableCell>{entry.bacr_order_id}</TableCell>
                      <TableCell className=" truncate max-w-[150px] sm:max-w-none text-yellow-500 font-semibold">
                        {entry.bacr_wallet.substring(0, 4)}...{entry.bacr_wallet.substring(entry.bacr_wallet.length - 4)}
                      </TableCell>
                      <TableCell >
                        ${Number.parseFloat(entry.bacr_commission_amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{entry.bacr_level}</TableCell>
                      <TableCell className="text-right">{format(new Date(entry.bacr_created_at), "dd/MM/yyyy HH:mm")}</TableCell>
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
