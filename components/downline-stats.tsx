"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDownlineStatsWithFallback } from "@/lib/api"
import { Copy, Loader2, Search } from "lucide-react"
import { format } from "date-fns"
import { truncateString } from "@/lib/utils"

interface WalletInfo {
  nickName: string
  solanaAddress: string
  ethAddress: string
}

interface DetailedMember {
  walletId: number
  level: number
  commissionPercent: number
  totalCommission: number
  totalVolume: number
  totalTransactions: number
  lastTransactionDate: string
  walletInfo: WalletInfo
}

interface DownlineStatsData {
  isBgAffiliate: boolean
  totalMembers: number
  membersByLevel: { [key: string]: number }
  totalCommissionEarned: number
  totalVolume: number
  totalTransactions: number
  stats: {
    [key: string]: {
      count: number
      totalCommission: number
      totalVolume: number
      totalTransactions: number
    }
  }
  detailedMembers: DetailedMember[]
}

interface Filters {
  startDate: string
  endDate: string
  minCommission: string
  maxCommission: string
  minVolume: string
  maxVolume: string
  level: string
  sortBy: string
  sortOrder: string
}

export default function DownlineStats() {
  const [stats, setStats] = useState<DownlineStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    startDate: "",
    endDate: "",
    minCommission: "",
    maxCommission: "",
    minVolume: "",
    maxVolume: "",
    level: "",
    sortBy: "commission",
    sortOrder: "desc",
  })

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getDownlineStatsWithFallback(filters)
      setStats(data)
    } catch (err) {
      setError("Failed to fetch downline statistics.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, []) // Initial fetch

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyFilters = () => {
    fetchStats()
  }

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

  if (!stats || !stats.isBgAffiliate) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Bạn hiện không phải là thành viên BG Affiliate hoặc không có dữ liệu tuyến dưới.
      </div>
    )
  }

  return (
    <Card className="border-l-8 border-[#00c0ff]/50 border-y-0 border-r-0 rounded-none">
      <CardHeader>
        <CardTitle>Thống kê chi tiết tuyến dưới</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col gap-4  rounded-lg p-4" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
          <div className="grid gap-4 mt-0">
            <h3 className="font-semibold text-lg">Tổng quan:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-[#e0fcff] border-none flex justify-between flex-col">
                <div className="text-sm text-muted-foreground">Tổng thành viên</div>
                <div className="text-2xl font-bold">{stats.totalMembers}</div>
              </Card>
              <Card className="p-4 bg-[#e0fcff] border-none flex justify-between flex-col">
                <div className="text-sm text-muted-foreground">Tổng hoa hồng kiếm được</div>
                <div className="text-2xl font-bold">${stats.totalCommissionEarned.toFixed(2)}</div>
              </Card>
              <Card className="p-4 bg-[#e0fcff] border-none flex justify-between flex-col">
                <div className="text-sm text-muted-foreground">Tổng Volume</div>
                <div className="text-2xl font-bold">${stats.totalVolume.toFixed(2)}</div>
              </Card>
              <Card className="p-4 bg-[#e0fcff] border-none flex justify-between flex-col">
                <div className="text-sm text-muted-foreground">Tổng giao dịch</div>
                <div className="text-2xl font-bold">{stats.totalTransactions}</div>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 mt-0">
            <h3 className="font-semibold text-lg">Thống kê theo cấp độ:</h3>
            {Object.keys(stats.stats).length === 0 ? (
              <p className="text-muted-foreground">Không có thống kê theo cấp độ nào.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(stats.stats).map(([level, data]) => (
                  <Card key={level} className="p-4">
                    <CardTitle className="text-md mb-2 capitalize">{level.replace("level", "Cấp độ ")}</CardTitle>
                    <div className="grid gap-1 text-sm">
                      <div>
                        <span className="font-medium">Số lượng:</span> {data.count}
                      </div>
                      <div>
                        <span className="font-medium">Tổng hoa hồng:</span> ${data.totalCommission.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Tổng Volume:</span> ${data.totalVolume.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Tổng giao dịch:</span> {data.totalTransactions}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className=" rounded-lg p-4" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3" >
            <div>
              <label
                htmlFor="startDate"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ngày bắt đầu
              </label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ngày kết thúc
              </label>
              <Input type="date" id="endDate" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
            </div>
            <div>
              <label
                htmlFor="minCommission"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Hoa hồng tối thiểu
              </label>
              <Input
                type="number"
                id="minCommission"
                name="minCommission"
                value={filters.minCommission}
                onChange={handleFilterChange}
                placeholder="Min Commission"
              />
            </div>
            <div>
              <label
                htmlFor="maxCommission"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Hoa hồng tối đa
              </label>
              <Input
                type="number"
                id="maxCommission"
                name="maxCommission"
                value={filters.maxCommission}
                onChange={handleFilterChange}
                placeholder="Max Commission"
              />
            </div>
            <div>
              <label
                htmlFor="minVolume"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Volume tối thiểu
              </label>
              <Input
                type="number"
                id="minVolume"
                name="minVolume"
                value={filters.minVolume}
                onChange={handleFilterChange}
                placeholder="Min Volume"
              />
            </div>
            <div>
              <label
                htmlFor="maxVolume"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Volume tối đa
              </label>
              <Input
                type="number"
                id="maxVolume"
                name="maxVolume"
                value={filters.maxVolume}
                onChange={handleFilterChange}
                placeholder="Max Volume"
              />
            </div>
            <div>
              <label
                htmlFor="level"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cấp độ
              </label>
              <Input
                type="number"
                id="level"
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                placeholder="Level"
              />
            </div>
            <div>
              <label
                htmlFor="sortBy"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Sắp xếp theo
              </label>
              <Select value={filters.sortBy} onValueChange={(value) => handleSelectChange("sortBy", value)}>
                <SelectTrigger id="sortBy">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commission">Hoa hồng</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="transactions">Giao dịch</SelectItem>
                  <SelectItem value="level">Cấp độ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="sortOrder"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Thứ tự sắp xếp
              </label>
              <Select value={filters.sortOrder} onValueChange={(value) => handleSelectChange("sortOrder", value)}>
                <SelectTrigger id="sortOrder">
                  <SelectValue placeholder="Thứ tự" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Tăng dần</SelectItem>
                  <SelectItem value="desc">Giảm dần</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full h-full flex items-end ">
              <Button onClick={handleApplyFilters} className="w-full ">
                <Search className="h-4 w-4 mr-2" />
                Áp dụng bộ lọc
              </Button>
            </div>
          </div>
          <div className="grid gap-4 mt-6">
            <h3 className="font-semibold text-lg">Thành viên chi tiết:</h3>
            {stats.detailedMembers.length === 0 ? (
              <p className="text-center text-muted-foreground">Không có thành viên tuyến dưới nào phù hợp với bộ lọc.</p>
            ) : (
              <div className="overflow-x-auto border-t border-b">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#00c0ff]/50 ">
                      <TableHead className="font-semibold text-gray-950">ID Ví</TableHead>
                      <TableHead className="font-semibold text-gray-950">Biệt danh</TableHead>
                      <TableHead className="font-semibold text-gray-950">Cấp độ</TableHead>
                      <TableHead className="font-semibold text-gray-950">Phần trăm</TableHead>
                      <TableHead className="text-right font-semibold text-gray-950">Hoa hồng</TableHead>
                      <TableHead className="text-right font-semibold text-gray-950">Tổng Volume</TableHead>
                      <TableHead className="text-right font-semibold text-gray-950">Tổng GD</TableHead>
                      <TableHead className="font-semibold text-gray-950">Giao dịch cuối</TableHead>
                      <TableHead className="font-semibold text-gray-950">Địa chỉ Solana</TableHead>
                      <TableHead className="font-semibold text-gray-950">Địa chỉ ETH</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.detailedMembers.map((member) => (
                      <TableRow key={member.walletId}>
                        <TableCell>{member.walletId}</TableCell>
                        <TableCell>{member.walletInfo.nickName}</TableCell>
                        <TableCell>{member.level}</TableCell>
                        <TableCell className="text-green-500 font-semibold">{member.commissionPercent}%</TableCell>
                        <TableCell className="text-right text-[#f472b6] font-semibold">${member.totalCommission.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${member.totalVolume.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{member.totalTransactions}</TableCell>
                        <TableCell>{format(new Date(member.lastTransactionDate), "dd/MM/yyyy HH:mm")}</TableCell>
                        <TableCell className="truncate max-w-[120px] text-[#ffb300] font-semibold sm:max-w-none flex items-center">
                          {truncateString(member.walletInfo.solanaAddress, 12)}
                          <Button variant="ghost" size="icon"  onClick={() => navigator.clipboard.writeText(member.walletInfo.solanaAddress)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="truncate max-w-[120px] text-[#ffb300] font-semibold sm:max-w-none">
                          {truncateString(member.walletInfo.ethAddress, 12)}
                          <Button variant="ghost" size="icon"  onClick={() => navigator.clipboard.writeText(member.walletInfo.ethAddress)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
