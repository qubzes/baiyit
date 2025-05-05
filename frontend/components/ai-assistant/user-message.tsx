import { Card } from "@/components/ui/card";

interface UserMessageProps {
  text: string;
  timestamp: string;
}

export function UserMessage({ text, timestamp }: UserMessageProps) {
  return (
    <div className="flex flex-col items-end max-w-[80%] ml-auto">
      <div className="flex items-start space-x-2">
        <Card className="p-3 bg-accent-sky text-white border-accent-sky shadow-sm">
          <p>{text}</p>
        </Card>
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          U
        </div>
      </div>
      <span className="text-xs text-gray-400 mt-1 mr-10">
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
