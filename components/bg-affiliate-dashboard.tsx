"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CommissionHistory from "./commission-history"
import MyBgAffiliateStatus from "./my-status"
import BgAffiliateStats from "./affiliate-stats"
import AffiliateTree from "./affiliate-tree"
import DownlineStats from "./downline-stats"
import UpdateCommission from "./update-commission"

export default function BgAffiliateDashboard() {
  const [activeTab, setActiveTab] = useState("downline-stats")

  return (
    <Tabs defaultValue="downline-stats" onValueChange={setActiveTab} className="w-full flex flex-1">
      <div className="fixed top-20 left-0 w-[300px] z-20 h-full">
        <TabsList className="flex flex-col justify-around items-start bg-transparent w-full">
          <TabsTrigger value="downline-stats">Thống kê tuyến dưới</TabsTrigger>
          <TabsTrigger value="commission-history">Lịch sử hoa hồng</TabsTrigger>
          <TabsTrigger value="affiliate-stats">Thống kê Affiliate</TabsTrigger>
          <TabsTrigger value="affiliate-tree">Cây Affiliate</TabsTrigger>
          <TabsTrigger value="update-commission">Cập nhật phần trăm hoa hồng tuyến dưới</TabsTrigger>
          {/* <TabsTrigger value="my-status">Trạng thái của tôi</TabsTrigger> */}
        </TabsList>
      </div>
      <TabsContent className="border-none" value="commission-history">
        <CommissionHistory />
      </TabsContent>
      <TabsContent value="my-status">
        <MyBgAffiliateStatus />
      </TabsContent>
      <TabsContent value="affiliate-stats">
        <BgAffiliateStats />
      </TabsContent>
      <TabsContent value="affiliate-tree">
        <AffiliateTree />
      </TabsContent>
      <TabsContent value="downline-stats">
        <DownlineStats />
      </TabsContent>
      <TabsContent value="update-commission">
        <UpdateCommission />
      </TabsContent>
    </Tabs>
  )
}
