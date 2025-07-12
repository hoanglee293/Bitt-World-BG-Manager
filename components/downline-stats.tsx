"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDownlineStatsWithFallback } from "@/lib/api"
import { Copy, Loader2, Search, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { truncateString } from "@/lib/utils"
import { useLang } from "@/app/lang"
import { cn } from "@/lib/utils"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "@/styles/datepicker.css"

interface WalletInfo {
  nickName: string
  solanaAddress: string
  ethAddress: string
  createdAt: string
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
  const { t, lang } = useLang()
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
      setStats(data as DownlineStatsData)
    } catch (err) {
      setError(t("errors.networkError"))
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

  const handleDateChange = (name: 'startDate' | 'endDate', date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd')
      setFilters((prev) => ({ ...prev, [name]: formattedDate }))
    } else {
      setFilters((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleApplyFilters = () => {
    fetchStats()
  }

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

  // Get locale for react-datepicker
  const getDatePickerLocale = () => {
    switch (lang) {
      case 'vi':
        return 'vi'
      case 'kr':
        return 'ko'
      case 'jp':
        return 'ja'
      default:
        return 'en'
    }
  }

  // Custom input component for date picker
  const CustomDateInput = React.forwardRef<HTMLButtonElement, any>(({ value, onClick, placeholder }, ref) => (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-start text-left font-normal text-xs sm:text-sm",
        !value && "text-muted-foreground"
      )}
      onClick={onClick}
      ref={ref}
    >
      <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
      {value || placeholder}
    </Button>
  ))
  CustomDateInput.displayName = "CustomDateInput"

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

  if (!stats || !stats.isBgAffiliate) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {t("messages.accessDenied")}
      </div>
    )
  }

  return (
    <Card className="border-l-8 border-[#00c0ff]/50 border-y-0 border-r-0 rounded-none">
      <CardHeader className="px-3 sm:px-6">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl">{t("dashboard.downlineStats")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:gap-6 px-3 sm:px-6">
        {/* Overview Section */}
        <div className="flex flex-col gap-3 sm:gap-4 rounded-lg p-3 sm:p-4" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
          <div className="grid gap-3 sm:gap-4 mt-0">
            <h3 className="font-semibold text-base sm:text-lg lg:text-xl">{t("stats.overview")}:</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <Card className="p-2 sm:p-4 bg-[#e0fcff] border-none flex justify-between flex-col" style={{ boxShadow: "0px 0px 10px 0x #1f1f1f14" }}>
                <div className="text-xs sm:text-sm text-muted-foreground">{t("stats.totalMembers")}</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.totalMembers}</div>
              </Card>
              <Card className="p-2 sm:p-4 bg-[#e0fcff] border-none flex justify-between flex-col">
                <div className="text-xs sm:text-sm text-muted-foreground">{t("commission.totalCommission")}</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">${stats.totalCommissionEarned.toFixed(6)}</div>
              </Card>
              <Card className="p-2 sm:p-4 bg-[#e0fcff] border-none flex justify-between flex-col">
                <div className="text-xs sm:text-sm text-muted-foreground">{t("stats.totalVolume")}</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">${stats.totalVolume.toFixed(6)}</div>
              </Card>
              <Card className="p-2 sm:p-4 bg-[#e0fcff] border-none flex justify-between flex-col">
                <div className="text-xs sm:text-sm text-muted-foreground">{t("stats.totalTransactions")}</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.totalTransactions}</div>
              </Card>
            </div>
          </div>

          {/* By Level Section */}
          <div className="grid gap-3 sm:gap-4 mt-0">
            <h3 className="font-semibold text-base sm:text-lg lg:text-xl">{t("stats.byLevel")}:</h3>
            {Object.keys(stats.stats).length === 0 ? (
              <p className="text-muted-foreground text-sm sm:text-base">{t("stats.noLevelStats")}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {Object.entries(stats.stats).map(([level, data]) => (
                  <Card key={level} className="p-2 sm:p-4">
                    <CardTitle className="text-sm sm:text-base lg:text-lg mb-2 capitalize">{level.replace("level", t("auth.level") + " ")}</CardTitle>
                    <div className="grid gap-1 text-xs sm:text-sm">
                      <div>
                        <span className="font-medium">{t("stats.count")}:</span> {data.count}
                      </div>
                      <div>
                        <span className="font-medium">{t("commission.totalCommission")}:</span> ${data.totalCommission.toFixed(6)}
                      </div>
                      <div>
                        <span className="font-medium">{t("stats.totalVolume")}:</span> ${data.totalVolume.toFixed(6)}
                      </div>
                      <div>
                        <span className="font-medium">{t("stats.totalTransactions")}:</span> {data.totalTransactions}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="rounded-lg p-3 sm:p-4" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block"
              >
                {t("dateTime.startDate")}
              </label>
              <DatePicker
                selected={filters.startDate ? new Date(filters.startDate) : null}
                onChange={(date) => handleDateChange('startDate', date)}
                customInput={<CustomDateInput />}
                placeholderText={t("dateTime.startDate")}
                dateFormat={getDateFormat()}
                locale={getDatePickerLocale()}
                className="w-full"
                popperClassName="z-50"
                popperPlacement="bottom-start"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block"
              >
                {t("dateTime.endDate")}
              </label>
              <DatePicker
                selected={filters.endDate ? new Date(filters.endDate) : null}
                onChange={(date) => handleDateChange('endDate', date)}
                customInput={<CustomDateInput />}
                placeholderText={t("dateTime.endDate")}
                dateFormat={getDateFormat()}
                locale={getDatePickerLocale()}
                className="w-full"
                popperClassName="z-50"
                popperPlacement="bottom-start"
              />
            </div>

            {/* Min Commission */}
            <div>
              <label
                htmlFor="minCommission"
                className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block"
              >
                {t("commission.minCommission")}
              </label>
              <Input
                type="number"
                id="minCommission"
                name="minCommission"
                value={filters.minCommission}
                onChange={handleFilterChange}
                placeholder={t("commission.minCommission")}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>

            {/* Max Commission */}
            <div>
              <label
                htmlFor="maxCommission"
                className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block"
              >
                {t("commission.maxCommission")}
              </label>
              <Input
                type="number"
                id="maxCommission"
                name="maxCommission"
                value={filters.maxCommission}
                onChange={handleFilterChange}
                placeholder={t("commission.maxCommission")}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>

            {/* Min Volume */}
            <div>
              <label
                htmlFor="minVolume"
                className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block"
              >
                {t("stats.minVolume")}
              </label>
              <Input
                type="number"
                id="minVolume"
                name="minVolume"
                value={filters.minVolume}
                onChange={handleFilterChange}
                placeholder={t("stats.minVolume")}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>

            {/* Max Volume */}
            <div>
              <label
                htmlFor="maxVolume"
                className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block"
              >
                {t("stats.maxVolume")}
              </label>
              <Input
                type="number"
                id="maxVolume"
                name="maxVolume"
                value={filters.maxVolume}
                onChange={handleFilterChange}
                placeholder={t("stats.maxVolume")}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>

            {/* Level */}
            <div>
              <label
                htmlFor="level"
                className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block"
              >
                {t("auth.level")}
              </label>
              <Input
                type="number"
                id="level"
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                placeholder={t("auth.level")}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>

            {/* Sort By */}
            <div>
              <label
                htmlFor="sortBy"
                className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block"
              >
                {t("common.sort")} {t("common.by")}
              </label>
              <Select value={filters.sortBy} onValueChange={(value) => handleSelectChange("sortBy", value)}>
                <SelectTrigger id="sortBy" className="text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder={t("common.sort")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commission">{t("commission.commission")}</SelectItem>
                  <SelectItem value="volume">{t("stats.volume")}</SelectItem>
                  <SelectItem value="transactions">{t("stats.transactions")}</SelectItem>
                  <SelectItem value="level">{t("auth.level")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div>
              <label
                htmlFor="sortOrder"
                className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block"
              >
                {t("common.sortOrder")}
              </label>
              <Select value={filters.sortOrder} onValueChange={(value) => handleSelectChange("sortOrder", value)}>
                <SelectTrigger id="sortOrder" className="text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder={t("common.sortOrder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">{t("common.ascending")}</SelectItem>
                  <SelectItem value="desc">{t("common.descending")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Apply Filters Button */}
            <div className="sm:col-span-2 lg:col-span-1 flex items-end">
              <Button onClick={handleApplyFilters} className="w-full text-xs sm:text-sm h-8 sm:h-10">
                <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {t("common.applyFilters")}
              </Button>
            </div>
          </div>

          {/* Detailed Members Section */}
          <div className="grid gap-3 sm:gap-4 mt-4 sm:mt-6">
            <h3 className="font-semibold text-base sm:text-lg lg:text-xl">{t("affiliate.detailedMembers")}:</h3>
            {stats.detailedMembers.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm sm:text-base">{t("affiliate.noMembersFound")}</p>
            ) : (
              <>
                {/* Mobile Card Layout */}
                <div className="block lg:hidden space-y-3">
                  {stats.detailedMembers.map((member) => (
                    <Card key={member.walletId} className="p-3 sm:p-4">
                      <div className="space-y-2 sm:space-y-3">
                        {/* Header Row */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">#{member.walletId}</span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {t("auth.level")} {member.level}
                              </span>
                            </div>
                            <h4 className="font-semibold text-sm sm:text-base">{member.walletInfo.nickName}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-green-500 font-semibold text-sm sm:text-base">{member.commissionPercent}%</div>
                            <div className="text-[#f472b6] font-semibold text-sm sm:text-base">${member.totalCommission.toFixed(6)}</div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div className="bg-gray-50 p-2 rounded">
                            <div className="text-muted-foreground">{t("stats.totalVolume")}</div>
                            <div className="font-semibold">${member.totalVolume.toFixed(6)}</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <div className="text-muted-foreground">{t("stats.totalTransactions")}</div>
                            <div className="font-semibold">{member.totalTransactions}</div>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div>
                            <div className="text-muted-foreground">{t("affiliate.lastTransaction")}</div>
                            <div className="font-medium">
                              {member.lastTransactionDate ? format(new Date(member.lastTransactionDate), getDateFormat() + " HH:mm") : "---"}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">{t("affiliate.createdAccount")}</div>
                            <div className="font-medium">
                              {member.walletInfo?.createdAt ? format(new Date(member.walletInfo?.createdAt), getDateFormat() + " HH:mm") : "---"}
                            </div>
                          </div>
                        </div>

                        {/* Solana Address */}
                        <div className="pt-2 border-t">
                          <div className="text-muted-foreground text-xs mb-1">{t("affiliate.solanaAddress")}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#ffb300] font-semibold text-xs sm:text-sm flex-1 break-all">
                              {member.walletInfo.solanaAddress}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => navigator.clipboard.writeText(member.walletInfo.solanaAddress)}
                              className="h-6 w-6 flex-shrink-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden lg:block overflow-x-auto border-t border-b rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#00c0ff]/50">
                        <TableHead className="font-semibold text-xs sm:text-sm text-gray-950 px-1 sm:px-3 py-2">{t("affiliate.walletId")}</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm text-gray-950 px-1 sm:px-3 py-2">{t("affiliate.nickname")}</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm text-gray-950 px-1 sm:px-3 py-2">{t("auth.level")}</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm text-gray-950 px-1 sm:px-3 py-2">{t("commission.percentage")}</TableHead>
                        <TableHead className="text-right font-semibold text-xs sm:text-sm text-gray-950 px-1 sm:px-3 py-2">{t("commission.commission")}</TableHead>
                        <TableHead className="text-right font-semibold text-xs sm:text-sm text-gray-950 px-1 sm:px-3 py-2">{t("stats.totalVolume")}</TableHead>
                        <TableHead className="text-right font-semibold text-xs sm:text-sm text-gray-950 px-1 sm:px-3 py-2">{t("stats.totalTransactions")}</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm text-gray-950 px-1 sm:px-3 py-2">{t("affiliate.lastTransaction")}</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm text-gray-950 px-1 sm:px-3 py-2">{t("affiliate.createdAccount")}</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm text-gray-950 px-1 sm:px-3 py-2">{t("affiliate.solanaAddress")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.detailedMembers.map((member) => (
                        <TableRow key={member.walletId} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm px-1 sm:px-3 py-2">{member.walletId}</TableCell>
                          <TableCell className="text-xs sm:text-sm px-1 sm:px-3 py-2">{member.walletInfo.nickName}</TableCell>
                          <TableCell className="text-xs sm:text-sm px-1 sm:px-3 py-2">{member.level}</TableCell>
                          <TableCell className="text-green-500 text-xs sm:text-sm px-1 sm:px-3 py-2 font-semibold">{member.commissionPercent}%</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm px-1 sm:px-3 py-2 text-[#f472b6] font-semibold">${member.totalCommission.toFixed(6)}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm px-1 sm:px-3 py-2">${member.totalVolume.toFixed(6)}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm px-1 sm:px-3 py-2">{member.totalTransactions}</TableCell>
                          <TableCell className="text-xs sm:text-sm px-1 sm:px-3 py-2">{member.lastTransactionDate ? format(new Date(member.lastTransactionDate), getDateFormat() + " HH:mm") : "---"}</TableCell>
                          <TableCell className="text-xs sm:text-sm px-1 sm:px-3 py-2">{member.walletInfo?.createdAt ? format(new Date(member.walletInfo?.createdAt), getDateFormat() + " HH:mm") : "---"}</TableCell>
                          <TableCell className="truncate max-w-[80px] sm:max-w-[120px] text-[#ffb300] font-semibold text-xs sm:text-sm px-1 sm:px-3 py-2">
                            <div className="flex items-center gap-1">
                              <span>{truncateString(member.walletInfo.solanaAddress, 8)}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => navigator.clipboard.writeText(member.walletInfo.solanaAddress)}
                                className="h-6 w-6 sm:h-8 sm:w-8"
                              >
                                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
