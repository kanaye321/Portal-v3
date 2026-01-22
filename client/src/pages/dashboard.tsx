import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowRight, MessageCircle, Send, X, Search, BookOpen, Headphones, Shield, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSite } from "@/context/SiteContext";
import { cn } from "@/lib/utils";
import businessIllustration from "@/assets/business-illustration.png";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Dashboard() {
  const { heroTitle1, heroTitle2, heroDescription, heroPrimaryBtn, heroSecondaryBtn, stats, categories, footerCopyright, featuredCategories, chatApiKey } = useSite();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm the SRPH MIS Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const JIRA_URL = "https://jira.sec.samsung.net/secure/CreateIssue.jspa?issuetype=14300&pid=22000";

  const scrollToSystems = () => {
    const element = document.getElementById("quick-access-tools");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          apiKey: chatApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble connecting right now. Please try again later or contact IT Support for immediate assistance." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatUrl = (url: string): string => {
    if (!url || url === "#") return "#";
    const trimmedUrl = url.trim();
    if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
      return trimmedUrl;
    }
    if (trimmedUrl.startsWith("/")) {
      return trimmedUrl;
    }
    return `https://${trimmedUrl}`;
  };

  return (
    <DashboardLayout>
      {/* Featured Quick Links Section - 3 Column Boxes */}
      <div id="quick-access-tools" className="bg-slate-50 py-10 px-6 scroll-mt-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">Quick Access Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">{category.title}</h3>
                <ul className="space-y-3">
                  {category.links.map((link) => (
                    <li key={link.id} className="relative group/item">
                      <a 
                        href={formatUrl(link.url)} 
                        target={link.url !== "#" && !link.url.startsWith("/") ? "_blank" : undefined}
                        rel={link.url !== "#" && !link.url.startsWith("/") ? "noopener noreferrer" : undefined}
                        className="text-sm text-slate-700 hover:text-green-600 font-medium transition-colors flex items-center gap-2 group"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-green-500 transition-colors shrink-0" />
                        {link.name}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-slate-300" />
                      </a>
                      {/* Small Popup on Hover */}
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover/item:block z-10 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg pointer-events-none">
                        <p className="font-bold mb-1">Information:</p>
                        <p className="opacity-80 line-clamp-2">{link.tooltip || "Click to open this link"}</p>
                        <div className="absolute left-4 top-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-800"></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section - Compact Version */}
      <div className="bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-bold leading-tight">
              <span className="text-slate-900">{heroTitle1} </span>
              <span className="text-green-600">{heroTitle2}</span>
            </h1>
            <p className="text-sm text-slate-600 max-w-xl">{heroDescription}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button onClick={() => setChatOpen(true)} className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm">
                <MessageCircle className="h-4 w-4" /> Ask AI Assistant
              </button>
              <button onClick={() => window.open(JIRA_URL, "_blank")} className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-600 px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                <Headphones className="h-4 w-4" /> IT Support
              </button>
            </div>
          </div>
          <div className="hidden lg:block w-48 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
            <img src={businessIllustration} alt="SRPH" className="w-full h-auto" />
          </div>
        </div>
      </div>

      {/* What You Can Do Section */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="text-center mb-12 lg:mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">Everything you need, all in one place</h2>
          <p className="text-slate-600 text-sm sm:text-base">Access company resources quickly and efficiently</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[
            { title: "Find Systems", description: "Access all enterprise applications from Management, HR, Marketing, Sales, and more", icon: Search, onClick: scrollToSystems },
            { title: "Knowledge Base", description: "Browse documentation, guides, and training materials for all systems", icon: BookOpen },
            { title: "IT Support", description: "Submit tickets through IT-VOC or IT4U for technical assistance", icon: Headphones, href: JIRA_URL },
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={item.onClick}
              className={cn(
                "text-center space-y-4 p-6 rounded-xl hover:bg-slate-50 transition-colors border sm:border-0",
                item.onClick || item.href ? "cursor-pointer" : ""
              )}
            >
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="block space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <item.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm">{item.description}</p>
                </a>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <item.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm">{item.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Need Help Section */}
      <div className="bg-green-600 py-12 lg:py-16 px-6">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Need Help Finding Something?</h2>
          <p className="text-base sm:text-lg text-green-100">Use our AI Assistant or contact IT Support for immediate assistance.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setChatOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-3 rounded font-semibold hover:bg-green-50 transition-colors">
              <MessageCircle className="h-5 w-5" /> Ask AI Assistant
            </button>
            <button onClick={() => window.open(JIRA_URL, "_blank")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-green-700 transition-colors">
              Contact IT Support
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-lg sm:text-xl font-bold text-center mb-8">All Enterprise Systems & Quick Links</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-x-4 gap-y-8 mb-12">
            {categories.map((cat) => (
              <div key={cat.id} className="min-w-0">
                <h4 className="font-bold text-white text-xs sm:text-sm mb-3 truncate border-b border-slate-800 pb-1">{cat.name}</h4>
                <ul className="space-y-1.5">
                  {cat.links.map((link) => (
                    <li key={link.id}>
                      <a 
                        href={formatUrl(link.url)} 
                        target={link.url !== "#" && !link.url.startsWith("/") ? "_blank" : undefined}
                        rel={link.url !== "#" && !link.url.startsWith("/") ? "noopener noreferrer" : undefined}
                        className="text-slate-400 hover:text-green-400 text-[10px] sm:text-xs transition-colors block truncate"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-[10px] sm:text-sm">
            <p>{footerCopyright}</p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {chatOpen ? (
          <div className="w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold text-sm sm:text-base">SRPH MIS Assistant</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:bg-green-700 p-1 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${msg.role === "user" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 px-3 py-2 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 p-3 flex gap-2">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
                placeholder="Ask about any system..." 
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage} 
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setChatOpen(true)} className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110">
            <MessageCircle className="h-6 w-6" />
          </button>
        )}
      </div>
    </DashboardLayout>
  );
}
