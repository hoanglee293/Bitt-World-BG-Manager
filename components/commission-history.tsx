"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCommissionHistory } from "@/lib/api"
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
        const data = await getCommissionHistory()
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
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử hoa hồng</CardTitle>
        <CardDescription>Xem lịch sử hoa hồng của bạn từ các giao dịch.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground">Không có lịch sử hoa hồng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Ví nhận hoa hồng</TableHead>
                  <TableHead className="text-right">Số tiền hoa hồng</TableHead>
                  <TableHead>Cấp độ</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.bacr_id}>
                    <TableCell>{entry.bacr_id}</TableCell>
                    <TableCell>{entry.bacr_order_id}</TableCell>
                    <TableCell className="font-medium truncate max-w-[150px] sm:max-w-none">
                      {entry.bacr_wallet}
                    </TableCell>
                    <TableCell className="text-right">
                      ${Number.parseFloat(entry.bacr_commission_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>{entry.bacr_level}</TableCell>
                    <TableCell>{format(new Date(entry.bacr_created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
