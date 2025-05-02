import { Card } from "@/components/ui/card"

interface AIMessageProps {
  text: string
  timestamp: string
}

export function AIMessage({ text, timestamp }: AIMessageProps) {
  return (
    <div className="flex flex-col max-w-[80%]">
      <div className="flex items-start space-x-2">
        <div className="w-8 h-8 rounded-full bg-primary-navy flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          B
        </div>
        <Card className="p-3 bg-gray-50 border-gray-200 shadow-sm">
          <p className="text-gray-800">{text}</p>
        </Card>
      </div>
      <span className="text-xs text-gray-400 mt-1 ml-10">
        {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  )
}
