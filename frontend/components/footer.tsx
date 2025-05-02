import Link from "next/link"
import { Github, Instagram, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-primary-navy text-white py-8 mt-auto border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-xl font-bold mb-3">Baiyit</h3>
            <p className="text-white/80">
              The world&apos;s first AI-first shopping concierge that finds, compares, and purchases exactly what you need.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <Button variant="ghost" asChild className="flex items-center gap-2 text-white/80 hover:text-white">
              <Link href="https://status.baiyit.com" target="_blank">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                All services are online
              </Link>
            </Button>

            <div className="flex space-x-6">
              <Link href="#" className="text-white/80 hover:text-white transition-transform hover:scale-110">
                <Twitter size={24} />
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-transform hover:scale-110">
                <Instagram size={24} />
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-transform hover:scale-110">
                <Github size={24} />
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-transform hover:scale-110">
                <Youtube size={24} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/20 text-center text-white/70">
          <p>© {new Date().getFullYear()} Baiyit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
