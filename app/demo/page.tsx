"use client"

import { useLang } from "@/app/lang"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LangChange } from "@/app/lang/LangChange"

export default function DemoPage() {
  const { t, lang } = useLang()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t("messages.welcome")}</h1>
          <p className="text-muted-foreground">
            {t("common.loadingData")} - {t("auth.login")} - {t("auth.logout")}
          </p>
          <Badge variant="outline">
            {t("languages.english")} | {t("languages.vietnamese")} | {t("languages.korea")} | {t("languages.japan")}
          </Badge>
        </div>

        <LangChange />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.downlineStats")}</CardTitle>
              <CardDescription>{t("stats.totalMembers")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-sm text-muted-foreground">{t("stats.activeMembers")}: 987</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.commissionHistory")}</CardTitle>
              <CardDescription>{t("commission.totalCommission")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$12,345.67</p>
              <p className="text-sm text-muted-foreground">{t("commission.pendingCommission")}: $1,234.56</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.affiliateStats")}</CardTitle>
              <CardDescription>{t("affiliate.totalReferrals")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">567</p>
              <p className="text-sm text-muted-foreground">{t("affiliate.directReferrals")}: 89</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("common.error")} & {t("common.success")} {t("messages.messages")}</CardTitle>
            <CardDescription>{t("errors.networkError")} - {t("messages.dataUpdated")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="destructive">{t("errors.unauthorized")}</Badge>
              <Badge variant="destructive">{t("errors.forbidden")}</Badge>
              <Badge variant="destructive">{t("errors.notFound")}</Badge>
              <Badge variant="default">{t("messages.completed")}</Badge>
              <Badge variant="secondary">{t("messages.failed")}</Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">{t("common.cancel")}</Button>
              <Button>{t("common.save")}</Button>
              <Button variant="destructive">{t("common.delete")}</Button>
              <Button variant="secondary">{t("common.edit")}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dateTime.dateTime")}</CardTitle>
            <CardDescription>{t("dateTime.today")} - {t("dateTime.yesterday")} - {t("dateTime.thisWeek")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">{t("dateTime.today")}</p>
                <p className="text-muted-foreground">{t("dateTime.dateFormat")}</p>
              </div>
              <div>
                <p className="font-medium">{t("dateTime.thisMonth")}</p>
                <p className="text-muted-foreground">{t("dateTime.timeFormat")}</p>
              </div>
              <div>
                <p className="font-medium">{t("dateTime.thisYear")}</p>
                <p className="text-muted-foreground">{t("dateTime.dateTimeFormat")}</p>
              </div>
              <div>
                <p className="font-medium">{t("dateTime.lastWeek")}</p>
                <p className="text-muted-foreground">{t("dateTime.lastMonth")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Current Language: <strong>{lang}</strong></p>
          <p>{t("messages.welcome")} - {t("navigation.home")} - {t("navigation.dashboard")}</p>
        </div>
      </div>
    </div>
  )
} 