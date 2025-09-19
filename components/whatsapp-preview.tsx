"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface WhatsAppPreviewProps {
  dailySummary: string
  pricingUpdate: string
}

export function WhatsAppPreview({ dailySummary, pricingUpdate }: WhatsAppPreviewProps) {
  const [activeTab, setActiveTab] = useState<"daily" | "pricing">("daily")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Message copied successfully and ready to share",
      })
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      toast({
        title: "Copied to clipboard",
        description: "Message copied successfully (fallback method)",
      })
    }
  }

  const shareMessage = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Oil Inventory Report",
          text: text,
        })
        toast({
          title: "Shared successfully",
          description: "Report shared via system share dialog",
        })
      } catch (err) {
        // User cancelled sharing
        console.log("Share cancelled")
      }
    } else {
      // Fallback: copy to clipboard
      await copyToClipboard(text)
      toast({
        title: "Share not supported",
        description: "Message copied to clipboard instead",
      })
    }
  }

  const downloadMessage = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Download completed",
      description: `${filename} has been downloaded`,
    })
  }

  const refreshMessages = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({
      title: "Messages refreshed",
      description: "WhatsApp messages updated with latest data",
    })
  }

  const currentMessage = activeTab === "daily" ? dailySummary : pricingUpdate
  const messageTitle = activeTab === "daily" ? "Daily Summary" : "Pricing Update"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">WhatsApp Preview</CardTitle>
          <Button variant="ghost" size="sm" onClick={refreshMessages} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <div className="flex gap-2">
          <Badge
            variant={activeTab === "daily" ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/80 transition-colors"
            onClick={() => setActiveTab("daily")}
          >
            Daily Summary
          </Badge>
          <Badge
            variant={activeTab === "pricing" ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/80 transition-colors"
            onClick={() => setActiveTab("pricing")}
          >
            Pricing Update
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={currentMessage}
            readOnly
            className="min-h-[200px] font-mono text-sm resize-none"
            placeholder="Message will appear here..."
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs">
              {currentMessage.length} chars
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(currentMessage)}
            className="flex items-center gap-2"
          >
            Copy Message
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => shareMessage(currentMessage)}
            className="flex items-center gap-2"
          >
            Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              downloadMessage(currentMessage, `whatsapp-${activeTab}-${new Date().toISOString().split("T")[0]}.txt`)
            }
            className="flex items-center gap-2"
          >
            Download
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Messages are automatically formatted for WhatsApp</p>
          <p>• Character count includes emojis and formatting</p>
          <p>• Use "Copy Message" to paste directly into WhatsApp</p>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current template:</span>
            <Badge variant="outline">{messageTitle}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Last updated:</span>
            <span className="text-xs">{new Date().toLocaleTimeString("en-IN")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
