"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAffiliateTree } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

interface ReferrerInfo {
  solanaAddress: string
  nickName: string
}

interface TreeInfo {
  treeId: number
  referrer: ReferrerInfo
  totalCommissionPercent: number
  createdAt: string
}

interface WalletInfo {
  nickName: string
  solanaAddress: string
  ethAddress: string
}

interface DownlineNode {
  nodeId: number
  solanaAddress: string
  commissionPercent: number
  effectiveFrom: string
  level: number
  walletInfo: WalletInfo
}

interface AffiliateTreeData {
  isBgAffiliate: boolean
  treeInfo: TreeInfo
  downlineNodes: DownlineNode[]
}

export default function AffiliateTree() {
  const [treeData, setTreeData] = useState<AffiliateTreeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTree = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getAffiliateTree()
        setTreeData(data)
      } catch (err) {
        setError("Failed to fetch affiliate tree data.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTree()
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

  if (!treeData || !treeData.isBgAffiliate) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Bạn hiện không phải là thành viên BG Affiliate hoặc không có dữ liệu cây.
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cây Affiliate</CardTitle>
        <CardDescription>Xem cấu trúc cây affiliate và các thành viên tuyến dưới của bạn.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <h3 className="font-semibold text-lg">Thông tin cây:</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="font-medium">ID Cây:</div>
            <div>{treeData.treeInfo.treeId}</div>
            <div className="font-medium">Người giới thiệu:</div>
            <div>
              {treeData.treeInfo.referrer.nickName} ({treeData.treeInfo.referrer.solanaAddress.substring(0, 8)}...)
            </div>
            <div className="font-medium">Tổng phần trăm hoa hồng:</div>
            <div>{treeData.treeInfo.totalCommissionPercent}%</div>
            <div className="font-medium">Ngày tạo:</div>
            <div>{format(new Date(treeData.treeInfo.createdAt), "dd/MM/yyyy HH:mm")}</div>
          </div>
        </div>

        <div className="grid gap-2">
          <h3 className="font-semibold text-lg">Các nút tuyến dưới:</h3>
          {treeData.downlineNodes.length === 0 ? (
            <p className="text-muted-foreground">Không có thành viên tuyến dưới nào.</p>
          ) : (
            <div className="grid gap-4">
              {treeData.downlineNodes.map((node) => (
                <Card key={node.nodeId} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="font-medium">ID Nút:</div>
                    <div>{node.nodeId}</div>
                    <div className="font-medium">Biệt danh:</div>
                    <div>{node.walletInfo.nickName}</div>
                    <div className="font-medium">Địa chỉ Solana:</div>
                    <div className="truncate">{node.solanaAddress}</div>
                    <div className="font-medium">Địa chỉ ETH:</div>
                    <div className="truncate">{node.walletInfo.ethAddress}</div>
                    <div className="font-medium">Phần trăm hoa hồng:</div>
                    <div>{node.commissionPercent}%</div>
                    <div className="font-medium">Cấp độ:</div>
                    <div>{node.level}</div>
                    <div className="font-medium">Có hiệu lực từ:</div>
                    <div>{format(new Date(node.effectiveFrom), "dd/MM/yyyy HH:mm")}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
