// Mock data based on the provided API documentation
const mockCommissionHistory = [
  {
    bacr_id: 1,
    bacr_tree_id: 1,
    bacr_order_id: 12345,
    bacr_wallet: "ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567",
    bacr_commission_amount: "25.500000",
    bacr_level: 1,
    bacr_created_at: "2024-01-15T10:30:00.000Z",
  },
  {
    bacr_id: 2,
    bacr_tree_id: 1,
    bacr_order_id: 12346,
    bacr_wallet: "XYZ789ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234",
    bacr_commission_amount: "15.000000",
    bacr_level: 2,
    bacr_created_at: "2024-01-16T11:00:00.000Z",
  },
  {
    bacr_id: 3,
    bacr_tree_id: 1,
    bacr_order_id: 12347,
    bacr_wallet: "ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567",
    bacr_commission_amount: "10.250000",
    bacr_level: 1,
    bacr_created_at: "2024-01-17T12:15:00.000Z",
  },
  {
    bacr_id: 4,
    bacr_tree_id: 1,
    bacr_order_id: 12348,
    bacr_wallet: "XYZ789ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234",
    bacr_commission_amount: "5.750000",
    bacr_level: 3,
    bacr_created_at: "2024-01-18T13:45:00.000Z",
  },
]

const mockMyBgAffiliateStatus = {
  isBgAffiliate: true,
  currentWallet: {
    walletId: 123456,
    solanaAddress: "ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567",
    nickName: "CurrentUser",
    ethAddress: "0xDEF456789ABC123DEF456789ABC123DEF456789A",
  },
  bgAffiliateInfo: {
    treeId: 1,
    parentWalletId: 789012,
    commissionPercent: 25.0,
    level: 1,
  },
}

const mockBgAffiliateStats = {
  isBgAffiliate: true,
  treeInfo: {
    treeId: 1,
    rootWallet: "ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567",
    totalCommissionPercent: 70.0,
  },
  nodeInfo: {
    treeId: 1,
    parentWallet: "XYZ789ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234",
    commissionPercent: 25.0,
    level: 1,
  },
  totalEarnings: 125.5,
}

const mockAffiliateTree = {
  isBgAffiliate: true,
  treeInfo: {
    treeId: 1,
    referrer: {
      solanaAddress: "ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567",
      nickName: "ReferrerUser",
    },
    totalCommissionPercent: 70.0,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  downlineNodes: [
    {
      nodeId: 2,
      solanaAddress: "XYZ789ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234",
      commissionPercent: 35.0,
      effectiveFrom: "2024-01-15T10:30:00.000Z",
      level: 1,
      walletInfo: {
        nickName: "User1",
        solanaAddress: "XYZ789ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234",
        ethAddress: "0xDEF456...",
      },
    },
    {
      nodeId: 3,
      solanaAddress: "JKL012MNO345PQR678STU901VWX234YZA567ABC123DEF456GHI789",
      commissionPercent: 20.0,
      effectiveFrom: "2024-01-20T14:00:00.000Z",
      level: 2,
      walletInfo: {
        nickName: "User2",
        solanaAddress: "JKL012MNO345PQR678STU901VWX234YZA567ABC123DEF456GHI789",
        ethAddress: "0xABC123...",
      },
    },
  ],
}

const mockDownlineStats = {
  isBgAffiliate: true,
  totalMembers: 5,
  membersByLevel: {
    level1: 2,
    level2: 3,
  },
  totalCommissionEarned: 125.5,
  totalVolume: 5000.0,
  totalTransactions: 25,
  stats: {
    level1: {
      count: 2,
      totalCommission: 75.0,
      totalVolume: 3000.0,
      totalTransactions: 15,
    },
    level2: {
      count: 3,
      totalCommission: 50.5,
      totalVolume: 2000.0,
      totalTransactions: 10,
    },
  },
  detailedMembers: [
    {
      walletId: 789012,
      level: 1,
      commissionPercent: 25.0,
      totalCommission: 75.0,
      totalVolume: 3000.0,
      totalTransactions: 15,
      lastTransactionDate: "2024-01-15T10:30:00.000Z",
      walletInfo: {
        nickName: "User1",
        solanaAddress: "ABC123...",
        ethAddress: "0xDEF456...",
      },
    },
    {
      walletId: 123457,
      level: 1,
      commissionPercent: 30.0,
      totalCommission: 50.0,
      totalVolume: 2000.0,
      totalTransactions: 10,
      lastTransactionDate: "2024-01-16T11:00:00.000Z",
      walletInfo: {
        nickName: "User3",
        solanaAddress: "DEF456...",
        ethAddress: "0xGHI789...",
      },
    },
    {
      walletId: 123458,
      level: 2,
      commissionPercent: 15.0,
      totalCommission: 30.0,
      totalVolume: 1000.0,
      totalTransactions: 5,
      lastTransactionDate: "2024-01-17T12:00:00.000Z",
      walletInfo: {
        nickName: "User4",
        solanaAddress: "JKL012...",
        ethAddress: "0xMNO345...",
      },
    },
    {
      walletId: 123459,
      level: 2,
      commissionPercent: 10.0,
      totalCommission: 20.0,
      totalVolume: 800.0,
      totalTransactions: 4,
      lastTransactionDate: "2024-01-18T13:00:00.000Z",
      walletInfo: {
        nickName: "User5",
        solanaAddress: "PQR678...",
        ethAddress: "0xSTU901...",
      },
    },
    {
      walletId: 123460,
      level: 3,
      commissionPercent: 5.0,
      totalCommission: 10.0,
      totalVolume: 200.0,
      totalTransactions: 1,
      lastTransactionDate: "2024-01-19T14:00:00.000Z",
      walletInfo: {
        nickName: "User6",
        solanaAddress: "VWX234...",
        ethAddress: "0xYZA567...",
      },
    },
  ],
}

const simulateApiCall = <T,>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 500) // Simulate network delay
  })
}

export const getCommissionHistory = () => simulateApiCall(mockCommissionHistory)
export const getMyBgAffiliateStatus = () => simulateApiCall(mockMyBgAffiliateStatus)
export const getBgAffiliateStats = () => simulateApiCall(mockBgAffiliateStats)
export const getAffiliateTree = () => simulateApiCall(mockAffiliateTree)

export const getDownlineStats = (filters: any) => {
  // Simulate filtering and sorting on mock data
  let filteredMembers = [...mockDownlineStats.detailedMembers]

  if (filters.startDate) {
    const start = new Date(filters.startDate)
    filteredMembers = filteredMembers.filter((member) => new Date(member.lastTransactionDate) >= start)
  }
  if (filters.endDate) {
    const end = new Date(filters.endDate)
    filteredMembers = filteredMembers.filter((member) => new Date(member.lastTransactionDate) <= end)
  }
  if (filters.minCommission) {
    filteredMembers = filteredMembers.filter(
      (member) => member.totalCommission >= Number.parseFloat(filters.minCommission),
    )
  }
  if (filters.maxCommission) {
    filteredMembers = filteredMembers.filter(
      (member) => member.totalCommission <= Number.parseFloat(filters.maxCommission),
    )
  }
  if (filters.minVolume) {
    filteredMembers = filteredMembers.filter((member) => member.totalVolume >= Number.parseFloat(filters.minVolume))
  }
  if (filters.maxVolume) {
    filteredMembers = filteredMembers.filter((member) => member.totalVolume <= Number.parseFloat(filters.maxVolume))
  }
  if (filters.level) {
    filteredMembers = filteredMembers.filter((member) => member.level === Number.parseInt(filters.level))
  }

  if (filters.sortBy && filters.sortOrder) {
    filteredMembers.sort((a, b) => {
      let valA: any
      let valB: any

      switch (filters.sortBy) {
        case "commission":
          valA = a.totalCommission
          valB = b.totalCommission
          break
        case "volume":
          valA = a.totalVolume
          valB = b.totalVolume
          break
        case "transactions":
          valA = a.totalTransactions
          valB = b.totalTransactions
          break
        case "level":
          valA = a.level
          valB = b.level
          break
        default:
          return 0
      }

      if (filters.sortOrder === "asc") {
        return valA - valB
      } else {
        return valB - valA
      }
    })
  }

  const totalCommissionEarned = filteredMembers.reduce((sum, member) => sum + member.totalCommission, 0)
  const totalVolume = filteredMembers.reduce((sum, member) => sum + member.totalVolume, 0)
  const totalTransactions = filteredMembers.reduce((sum, member) => sum + member.totalTransactions, 0)
  const membersByLevel = filteredMembers.reduce((acc: { [key: string]: number }, member) => {
    const levelKey = `level${member.level}`
    acc[levelKey] = (acc[levelKey] || 0) + 1
    return acc
  }, {})

  const statsByLevel: {
    [key: string]: { count: number; totalCommission: number; totalVolume: number; totalTransactions: number }
  } = {}
  filteredMembers.forEach((member) => {
    const levelKey = `level${member.level}`
    if (!statsByLevel[levelKey]) {
      statsByLevel[levelKey] = { count: 0, totalCommission: 0, totalVolume: 0, totalTransactions: 0 }
    }
    statsByLevel[levelKey].count++
    statsByLevel[levelKey].totalCommission += member.totalCommission
    statsByLevel[levelKey].totalVolume += member.totalVolume
    statsByLevel[levelKey].totalTransactions += member.totalTransactions
  })

  return simulateApiCall({
    ...mockDownlineStats,
    totalMembers: filteredMembers.length,
    membersByLevel,
    totalCommissionEarned,
    totalVolume,
    totalTransactions,
    stats: statsByLevel,
    detailedMembers: filteredMembers,
  })
}
