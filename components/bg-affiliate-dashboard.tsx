"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLang } from "@/app/lang"
import { useResponsive } from "@/hooks/use-mobile"
import CommissionHistory from "./commission-history"
import MyBgAffiliateStatus from "./my-status"
import BgAffiliateStats from "./affiliate-stats"
import AffiliateTree from "./affiliate-tree"
import DownlineStats from "./downline-stats"
import UpdateCommission from "./update-commission"

export default function BgAffiliateDashboard() {
  const [activeTab, setActiveTab] = useState("downline-stats")
  const { t } = useLang()
  const { isMobile, isTablet, isDesktop } = useResponsive()

  const tabOptions = [
    { value: "downline-stats", label: t("dashboard.downlineStats") },
    { value: "commission-history", label: t("dashboard.commissionHistory") },
    { value: "affiliate-stats", label: t("dashboard.affiliateStats") },
    { value: "affiliate-tree", label: t("dashboard.affiliateTree") },
    // { value: "update-commission", label: t("dashboard.updateCommission") },
    // { value: "my-status", label: t("dashboard.myStatus") },
  ]

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="w-full h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        {/* Mobile & Tablet: Dropdown select */}
        <div className="lg:hidden w-full bg-background border-b sticky top-14 z-30 py-4" style={{ zIndex: 10 }}>
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full max-w-sm mx-auto">
              <SelectValue placeholder={t("dashboard.selectTab")} />
            </SelectTrigger>
            <SelectContent>
              {tabOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: Vertical sidebar */}
        <div className="hidden lg:block lg:fixed top-20 left-0 w-[280px] xl:w-[320px] z-20 h-full md:h-fit">
          <TabsList className="flex flex-col justify-around items-start bg-transparent w-full h-full p-4 space-y-2">
            {tabOptions.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="w-full text-left justify-start text-sm xl:text-base"
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="lg:ml-[280px] xl:ml-[320px] md:w-auto w-full h-full">
          <TabsContent className="border-none p-3 sm:p-4 lg:p-6 h-full" value="commission-history">
            <CommissionHistory />
          </TabsContent>
          <TabsContent className="border-none p-3 sm:p-4 lg:p-6 h-full" value="my-status">
            <MyBgAffiliateStatus />
          </TabsContent>
          <TabsContent className="border-none p-3 sm:p-4 lg:p-6 h-full" value="affiliate-stats">
            <BgAffiliateStats />
          </TabsContent>
          <TabsContent className="border-none p-3 sm:p-4 lg:p-6 h-full" value="affiliate-tree">
            <AffiliateTree />
          </TabsContent>
          <TabsContent className="border-none p-3 sm:p-4 lg:p-6 h-full" value="downline-stats">
            <DownlineStats />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
