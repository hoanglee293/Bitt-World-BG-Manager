"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAffiliateTreeWithFallback } from "@/lib/api"
import { Loader2, Users, User, Crown, TrendingUp } from "lucide-react"
import { format } from "date-fns"

interface ReferrerInfo {
  solanaAddress: string
  nickName: string
}

interface TreeInfo {
  treeId: number
  referrer: ReferrerInfo | null
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



// Tree Node Component
function TreeNodeComponent({ 
  node,
  level
}: { 
  node: DownlineNode
  level: number
}) {
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-blue-50 border-blue-200 text-blue-800"
      case 2: return "bg-green-50 border-green-200 text-green-800"
      case 3: return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case 4: return "bg-purple-50 border-purple-200 text-purple-800"
      default: return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return <Crown className="h-4 w-4" />
      case 2: return <Users className="h-4 w-4" />
      case 3: return <User className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  return (
    <div 
      className="flex items-center gap-2 p-3 rounded-lg border transition-all hover:shadow-md"
      style={{ marginLeft: `${(level - 1) * 24}px` }}
    >
      {/* Node content */}
      <div className={`flex items-center gap-2 p-2 rounded-md border ${getLevelColor(node.level)}`}>
        {getLevelIcon(node.level)}
        <div className="flex flex-col min-w-0">
          <div className="font-medium truncate">{node.walletInfo.nickName}</div>
          <div className="text-xs opacity-75 truncate">
            {node.solanaAddress.substring(0, 8)}...{node.solanaAddress.substring(node.solanaAddress.length - 6)}
          </div>
        </div>
      </div>
      
      {/* Commission badge */}
      <Badge variant="secondary" className="ml-auto">
        <TrendingUp className="h-3 w-3 mr-1" />
        {node.commissionPercent}%
      </Badge>
      
      {/* Level indicator */}
      <Badge variant="outline" className="text-xs">
        Lv.{node.level}
      </Badge>
    </div>
  )
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
        const data = await getAffiliateTreeWithFallback()
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

  // Group nodes by level for statistics
  const nodesByLevel = treeData.downlineNodes.reduce((acc, node) => {
    acc[node.level] = (acc[node.level] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  return (
    <div className="space-y-6 border-l-8 border-[#00c0ff]/50 border-y-0 border-r-0 rounded-none p-4">
      {/* Tree Info Card */}
      <Card className="border-none" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Thông tin cây Affiliate
          </CardTitle>
          <CardDescription>
            Cấu trúc cây affiliate và thống kê thành viên tuyến dưới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{treeData.treeInfo.treeId}</div>
              <div className="text-sm text-blue-600">ID</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{treeData.downlineNodes.length}</div>
              <div className="text-sm text-green-600">Tổng thành viên</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{treeData.treeInfo.totalCommissionPercent}%</div>
              <div className="text-sm text-yellow-600">Tổng hoa hồng</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(nodesByLevel).length}</div>
              <div className="text-sm text-purple-600">Số cấp độ</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Người giới thiệu:</h4>
            {treeData.treeInfo.referrer ? (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{treeData.treeInfo.referrer.nickName}</span>
                <Badge variant="outline" className="text-xs">
                  {treeData.treeInfo.referrer.solanaAddress.substring(0, 8)}...
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-muted-foreground">Không có người giới thiệu</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground mt-1">
              Tạo ngày: {format(new Date(treeData.treeInfo.createdAt), "dd/MM/yyyy HH:mm")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tree Structure Card */}
      <Card className="border-none" style={{ boxShadow: "0px 3px 10px 9px #1f1f1f14" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Cấu trúc cây Affiliate
          </CardTitle>
          <CardDescription>
            Xem cấu trúc phân cấp và thông tin chi tiết từng thành viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {treeData.downlineNodes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có thành viên tuyến dưới nào.</p>
              <p className="text-sm">Bắt đầu mời bạn bè để xây dựng mạng lưới affiliate của bạn!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Level Statistics */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(nodesByLevel).map(([level, count]) => (
                  <Badge key={level} variant="secondary" className="text-sm">
                    Cấp {level}: {count} thành viên
                  </Badge>
                ))}
              </div>

              {/* Tree Structure */}
              <div className="border rounded-lg p-4 bg-white space-y-2">
                {treeData.downlineNodes
                  .sort((a, b) => a.level - b.level)
                  .map((node) => (
                    <TreeNodeComponent
                      key={node.nodeId}
                      node={node}
                      level={node.level}
                    />
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
