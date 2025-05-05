import { Card } from "@/components/ui/card";

export function AITypingIndicator() {
  return (
    <div className="flex items-start space-x-2 max-w-[80%]">
      <div className="w-8 h-8 rounded-full bg-primary-navy flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        B
      </div>
      <Card className="p-3 bg-gray-50 border-gray-200 shadow-sm">
        <div className="flex space-x-2">
          <div
            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </Card>
    </div>
  );
}
