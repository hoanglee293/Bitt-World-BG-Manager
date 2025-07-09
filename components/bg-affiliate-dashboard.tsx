"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CommissionHistory from "./commission-history"
import MyBgAffiliateStatus from "./my-status"
import BgAffiliateStats from "./affiliate-stats"
import AffiliateTree from "./affiliate-tree"
import DownlineStats from "./downline-stats"

export default function BgAffiliateDashboard() {
  const [activeTab, setActiveTab] = useState("commission-history")

  return (
    <Tabs defaultValue="commission-history" onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="commission-history">Lịch sử hoa hồng</TabsTrigger>
        <TabsTrigger value="my-status">Trạng thái của tôi</TabsTrigger>
        <TabsTrigger value="affiliate-stats">Thống kê Affiliate</TabsTrigger>
        <TabsTrigger value="affiliate-tree">Cây Affiliate</TabsTrigger>
        <TabsTrigger value="downline-stats">Thống kê tuyến dưới</TabsTrigger>
      </TabsList>
      <TabsContent value="commission-history">
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
    </Tabs>
  )
}
