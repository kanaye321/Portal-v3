import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSite } from "@/context/SiteContext";
import { cn } from "@/lib/utils";
import { 
  Lock, Eye, EyeOff, Save, Plus, Trash2, Edit2, Image, Link as LinkIcon, 
  LayoutDashboard, Settings, LogOut, GripVertical, Navigation, FileText, 
  Mail, Phone, MapPin, ChevronUp, ChevronDown, Star, Bot, Menu, X
} from "lucide-react";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("header");
  const [saved, setSaved] = useState(false);

  const {
    siteName, setSiteName, siteTagline, setSiteTagline,
    navItems, setNavItems, ctaButtonText, setCtaButtonText, ctaButtonLink, setCtaButtonLink,
    heroTitle1, setHeroTitle1, heroTitle2, setHeroTitle2, heroDescription, setHeroDescription,
    heroPrimaryBtn, setHeroPrimaryBtn, heroSecondaryBtn, setHeroSecondaryBtn,
    stats, setStats, categories, setCategories, footerCopyright, setFooterCopyright,
    featuredCategories, setFeaturedCategories, chatApiKey, setChatApiKey,
    chatEndpoint, setChatEndpoint,
    saveConfig, isSaving,
  } = useSite();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      localStorage.setItem("admin_auth", "true");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_auth");
  };

  const handleSave = async () => {
    await saveConfig();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addNavItem = () => {
    const newId = Math.max(...navItems.map(n => n.id), 0) + 1;
    setNavItems([...navItems, { id: newId, name: "New Page", href: "/new", visible: true }]);
  };

  const updateNavItem = (id: number, field: string, value: string | boolean) => {
    setNavItems(navItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeNavItem = (id: number) => {
    setNavItems(navItems.filter(item => item.id !== id));
  };

  const moveNavItem = (id: number, direction: "up" | "down") => {
    const index = navItems.findIndex(item => item.id === id);
    if ((direction === "up" && index === 0) || (direction === "down" && index === navItems.length - 1)) return;
    const newItems = [...navItems];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    setNavItems(newItems);
  };

  const addCategory = () => {
    const newId = Math.max(...categories.map(c => c.id), 0) + 1;
    setCategories([...categories, { id: newId, name: "New Category", links: [] }]);
  };

  const updateCategory = (id: number, name: string) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, name } : cat));
  };

  const removeCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const addLinkToCategory = (catId: number) => {
    setCategories(categories.map(cat => {
      if (cat.id === catId) {
        const newLinkId = Math.max(...cat.links.map(l => l.id), 0) + 1;
        return { ...cat, links: [...cat.links, { id: newLinkId, name: "New Link", url: "#" }] };
      }
      return cat;
    }));
  };

  const updateLink = (catId: number, linkId: number, field: "name" | "url", value: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === catId) {
        return { ...cat, links: cat.links.map(link => link.id === linkId ? { ...link, [field]: value } : link) };
      }
      return cat;
    }));
  };

  const removeLink = (catId: number, linkId: number) => {
    setCategories(categories.map(cat => {
      if (cat.id === catId) {
        return { ...cat, links: cat.links.filter(link => link.id !== linkId) };
      }
      return cat;
    }));
  };

  const updateStat = (id: number, field: "value" | "label", value: string) => {
    setStats(stats.map(stat => stat.id === id ? { ...stat, [field]: value } : stat));
  };

  const addFeaturedCategory = () => {
    const newId = Math.max(...featuredCategories.map(c => c.id), 0) + 1;
    setFeaturedCategories([...featuredCategories, { id: newId, title: "New Category", links: [] }]);
  };

  const updateFeaturedCategory = (id: number, title: string) => {
    setFeaturedCategories(featuredCategories.map(cat => cat.id === id ? { ...cat, title } : cat));
  };

  const removeFeaturedCategory = (id: number) => {
    setFeaturedCategories(featuredCategories.filter(cat => cat.id !== id));
  };

  const addLinkToFeaturedCategory = (catId: number) => {
    setFeaturedCategories(featuredCategories.map(cat => {
      if (cat.id === catId) {
        const newLinkId = cat.links.length > 0 ? Math.max(...cat.links.map(l => l.id)) + 1 : 1;
        return { ...cat, links: [...cat.links, { id: newLinkId, name: "New Link", url: "https://", tooltip: "Enter link description" }] };
      }
      return cat;
    }));
  };

  const updateFeaturedLink = (catId: number, linkId: number, field: "name" | "url" | "tooltip", value: string) => {
    setFeaturedCategories(featuredCategories.map(cat => {
      if (cat.id === catId) {
        return { ...cat, links: cat.links.map(link => link.id === linkId ? { ...link, [field]: value } : link) };
      }
      return cat;
    }));
  };

  const removeFeaturedLink = (catId: number, linkId: number) => {
    setFeaturedCategories(featuredCategories.map(cat => {
      if (cat.id === catId) {
        return { ...cat, links: cat.links.filter(link => link.id !== linkId) };
      }
      return cat;
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
            <p className="text-slate-600 mt-2">Sign in to manage the portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-12" placeholder="Enter password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-lg font-bold">SRPH Admin</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={cn(
        "w-full lg:w-64 bg-slate-900 text-white p-6 flex flex-col fixed lg:h-full z-40 transition-transform duration-300",
        mobileMenuOpen ? "translate-y-0" : "-translate-y-full lg:translate-y-0"
      )}>
        <div className="hidden lg:block mb-8">
          <h1 className="text-xl font-bold">SRPH Admin</h1>
          <p className="text-slate-400 text-sm">Portal Management</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {[
            { id: "header", icon: Navigation, label: "Header & Navigation" },
            { id: "hero", icon: FileText, label: "Hero Section" },
            { id: "featured", icon: Star, label: "Featured Quick Links" },
            { id: "stats", icon: LayoutDashboard, label: "Statistics" },
            { id: "quicklinks", icon: LinkIcon, label: "All Quick Links" },
            { id: "footer", icon: Mail, label: "Footer" },
            { id: "chatbot", icon: Bot, label: "AI Chatbot" },
            { id: "images", icon: Image, label: "Images" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${activeTab === item.id ? "bg-green-600" : "hover:bg-slate-800"}`}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-slate-700 space-y-1">
          <button onClick={() => setLocation("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm">
            <LayoutDashboard className="h-4 w-4" /> View Portal
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm text-red-400">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
            {activeTab === "header" && "Header & Navigation"}
            {activeTab === "hero" && "Hero Section"}
            {activeTab === "featured" && "Featured Quick Links"}
            {activeTab === "stats" && "Statistics"}
            {activeTab === "quicklinks" && "All Quick Links"}
            {activeTab === "footer" && "Footer"}
            {activeTab === "chatbot" && "AI Chatbot Settings"}
            {activeTab === "images" && "Images"}
            {activeTab === "settings" && "Settings"}
          </h2>
          <button onClick={handleSave} className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm ${saved ? "bg-green-100 text-green-600" : "bg-green-600 text-white hover:bg-green-700"}`}>
            <Save className="h-4 w-4" /> {isSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="max-w-4xl">
          {activeTab === "header" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  Site Branding
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Site Name</label>
                    <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tagline</label>
                    <input type="text" value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-green-600" />
                    Navigation Menu
                  </h3>
                  <button onClick={addNavItem} className="flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-full transition-colors">
                    <Plus className="h-4 w-4" /> Add Tab
                  </button>
                </div>
                <div className="space-y-3">
                  {navItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex sm:flex-col gap-1 order-last sm:order-first">
                        <button onClick={() => moveNavItem(item.id, "up")} className="p-1 text-slate-400 hover:text-slate-600 bg-white rounded border border-slate-200"><ChevronUp className="h-3 w-3" /></button>
                        <button onClick={() => moveNavItem(item.id, "down")} className="p-1 text-slate-400 hover:text-slate-600 bg-white rounded border border-slate-200"><ChevronDown className="h-3 w-3" /></button>
                      </div>
                      <input type="text" value={item.name} onChange={(e) => updateNavItem(item.id, "name", e.target.value)} className="w-full sm:flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium" placeholder="Tab Name" />
                      <input type="text" value={item.href} onChange={(e) => updateNavItem(item.id, "href", e.target.value)} className="w-full sm:flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium" placeholder="/path" />
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          <input type="checkbox" checked={item.visible} onChange={(e) => updateNavItem(item.id, "visible", e.target.checked)} className="rounded text-green-600 focus:ring-green-500" /> Visible
                        </label>
                        <button onClick={() => removeNavItem(item.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  CTA Button
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Button Text</label>
                    <input type="text" value={ctaButtonText} onChange={(e) => setCtaButtonText(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Button Link</label>
                    <input type="text" value={ctaButtonLink} onChange={(e) => setCtaButtonLink(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Hero Text</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title Line 1</label>
                    <input type="text" value={heroTitle1} onChange={(e) => setHeroTitle1(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title Line 2 (Green)</label>
                    <input type="text" value={heroTitle2} onChange={(e) => setHeroTitle2(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Hero Buttons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <h4 className="text-sm font-bold text-green-800 mb-3 uppercase tracking-wider">Primary Button</h4>
                    <div className="space-y-3">
                      <input type="text" value={heroPrimaryBtn.text} onChange={(e) => setHeroPrimaryBtn({ ...heroPrimaryBtn, text: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Text" />
                      <input type="text" value={heroPrimaryBtn.href} onChange={(e) => setHeroPrimaryBtn({ ...heroPrimaryBtn, href: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Link" />
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Secondary Button</h4>
                    <div className="space-y-3">
                      <input type="text" value={heroSecondaryBtn.text} onChange={(e) => setHeroSecondaryBtn({ ...heroSecondaryBtn, text: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Text" />
                      <input type="text" value={heroSecondaryBtn.href} onChange={(e) => setHeroSecondaryBtn({ ...heroSecondaryBtn, href: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Link" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "featured" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={addFeaturedCategory} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-all shadow-sm">
                  <Plus className="h-4 w-4" /> Add Category
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredCategories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 group relative">
                    <button onClick={() => removeFeaturedCategory(cat.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="mb-4">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">Category Title</label>
                      <input type="text" value={cat.title} onChange={(e) => updateFeaturedCategory(cat.id, e.target.value)} className="w-full text-lg font-bold text-slate-800 border-b border-transparent hover:border-slate-200 focus:border-green-500 focus:outline-none bg-transparent py-1 transition-all" />
                    </div>
                    <div className="space-y-3 mb-5">
                      {cat.links.map((link) => (
                        <div key={link.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 group/link">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <input type="text" value={link.name} onChange={(e) => updateFeaturedLink(cat.id, link.id, "name", e.target.value)} className="text-sm font-bold text-slate-700 bg-transparent border-none focus:ring-0 w-full p-0" placeholder="Link Name" />
                            <button onClick={() => removeFeaturedLink(cat.id, link.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover/link:opacity-100 transition-all">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200">
                              <LinkIcon className="h-3 w-3 text-slate-400 shrink-0" />
                              <input type="text" value={link.url} onChange={(e) => updateFeaturedLink(cat.id, link.id, "url", e.target.value)} className="text-[11px] text-slate-500 bg-transparent border-none focus:ring-0 w-full p-0" placeholder="https://" />
                            </div>
                            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200">
                              <Bot className="h-3 w-3 text-slate-400 shrink-0" />
                              <input type="text" value={link.tooltip || ""} onChange={(e) => updateFeaturedLink(cat.id, link.id, "tooltip", e.target.value)} className="text-[11px] text-slate-500 bg-transparent border-none focus:ring-0 w-full p-0" placeholder="Hover Tooltip Text" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addLinkToFeaturedCategory(cat.id)} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:border-green-300 hover:text-green-600 transition-all flex items-center justify-center gap-2">
                      <Plus className="h-3 w-3" /> Add Link
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-green-600" />
                Live Statistics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center group">
                    <div className="space-y-2">
                      <input type="text" value={stat.value} onChange={(e) => updateStat(stat.id, "value", e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded text-2xl font-bold text-center text-green-600" />
                      <input type="text" value={stat.label} onChange={(e) => updateStat(stat.id, "label", e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-center" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quicklinks" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={addCategory} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Plus className="h-4 w-4" /> Add Category</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <input type="text" value={cat.name} onChange={(e) => updateCategory(cat.id, e.target.value)} className="font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-green-500 focus:outline-none" />
                      <button onClick={() => removeCategory(cat.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="space-y-2 mb-3">
                      {cat.links.map(link => (
                        <div key={link.id} className="flex flex-col gap-1 group p-2 bg-slate-50 rounded">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-slate-300" />
                            <input type="text" value={link.name} onChange={(e) => updateLink(cat.id, link.id, "name", e.target.value)} className="flex-1 text-sm font-medium text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-green-500 focus:outline-none" placeholder="Link name" />
                            <button onClick={() => removeLink(cat.id, link.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"><Trash2 className="h-3 w-3" /></button>
                          </div>
                          <input type="text" value={link.url} onChange={(e) => updateLink(cat.id, link.id, "url", e.target.value)} className="ml-6 text-xs text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-green-500 focus:outline-none" placeholder="https://example.com" />
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addLinkToCategory(cat.id)} className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"><Plus className="h-3 w-3" /> Add link</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "footer" && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Copyright Text</h3>
              <input type="text" value={footerCopyright} onChange={(e) => setFooterCopyright(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          )}

          {activeTab === "chatbot" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Bot className="h-5 w-5 text-green-600" />
                  AI Chatbot Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">API Key (x-api-key)</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={chatApiKey} 
                        onChange={(e) => setChatApiKey(e.target.value)} 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-12" 
                        placeholder="Enter Samsung Agent API Key" 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">This key is used for authentication with the Samsung Agent API (x-api-key header).</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">API Endpoint URL</label>
                    <input 
                      type="text" 
                      value={chatEndpoint} 
                      onChange={(e) => setChatEndpoint(e.target.value)} 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                      placeholder="https://agent.sec.samsung.net/api/v1/run/..." 
                    />
                    <p className="text-xs text-slate-500 mt-2">The full URL of the Samsung Agent API runner. Must include the flow ID.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <Bot className="h-5 w-5 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 mb-1">Samsung Agent API Information</h4>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      The chatbot integrates with Samsung's internal AI Agent platform. Make sure the endpoint URL is correct and the API key has the necessary permissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "images" && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Hero Image</h3>
              <p className="text-sm text-slate-600">Manage site images here.</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Global Settings</h3>
              <p className="text-sm text-slate-600">Configure site-wide settings here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
