"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Copy, Share } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface WhatsAppPreviewProps {
  dailySummary: string
  pricingUpdate: string
}

export function WhatsAppPreview({ dailySummary, pricingUpdate }: WhatsAppPreviewProps) {
  const [activeTab, setActiveTab] = useState<"daily" | "pricing">("daily")
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Message copied successfully",
    })
  }

  const currentMessage = activeTab === "daily" ? dailySummary : pricingUpdate

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          WhatsApp Preview
        </CardTitle>
        <div className="flex gap-2">
          <Badge
            variant={activeTab === "daily" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveTab("daily")}
          >
            Daily Summary
          </Badge>
          <Badge
            variant={activeTab === "pricing" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveTab("pricing")}
          >
            Pricing Update
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={currentMessage}
          readOnly
          className="min-h-[200px] font-mono text-sm"
          placeholder="Message will appear here..."
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(currentMessage)}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Message
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
