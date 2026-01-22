import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { siteConfig } from "@shared/schema";
import { eq } from "drizzle-orm";

const defaultNavItems = [
  { id: 1, name: "Home", href: "/", visible: true },
  { id: 2, name: "Systems", href: "/systems", visible: true },
  { id: 3, name: "IT Support", href: "/support", visible: true },
  { id: 4, name: "Knowledge Base", href: "/kb", visible: true },
  { id: 5, name: "Contact", href: "/contact", visible: true },
];

const defaultStats = [
  { id: 1, value: "50+", label: "Enterprise Systems" },
  { id: 2, value: "24/7", label: "IT Support Available" },
  { id: 3, value: "10K+", label: "Employees Connected" },
  { id: 4, value: "99.9%", label: "System Uptime" },
];

const defaultCategories = [
  { id: 1, name: "Management", links: [
    { id: 1, name: "HQ) CPMS", url: "#" }, { id: 2, name: "HQ) GCMS", url: "#" }, { id: 3, name: "HQ) GPPM", url: "#" },
    { id: 4, name: "HQ) PLM", url: "#" }, { id: 5, name: "HQ) SEGAM", url: "#" }, { id: 6, name: "HQ) Global EHS", url: "#" },
  ]},
  { id: 2, name: "Common", links: [{ id: 1, name: "Samsung Semiconductor", url: "#" }]},
  { id: 3, name: "Service", links: [{ id: 1, name: "AP) GSPN", url: "#" }, { id: 2, name: "AP) GMIS", url: "#" }]},
  { id: 4, name: "HR", links: [{ id: 1, name: "HQ) GHRP Portal", url: "#" }]},
  { id: 5, name: "IT Support", links: [{ id: 1, name: "IT-VOC", url: "#" }, { id: 2, name: "IT4U", url: "#" }, { id: 3, name: "N-ERP(SET)", url: "#" }, { id: 4, name: "N-ERP(DS)", url: "#" }]},
  { id: 6, name: "Marketing", links: [{ id: 1, name: "VD GTM", url: "#" }, { id: 2, name: "HQ) mNet", url: "#" }, { id: 3, name: "AP) GSBN-PVI", url: "#" }, { id: 4, name: "MCS System", url: "#" }]},
  { id: 7, name: "Sales", links: [{ id: 1, name: "HQ) GSBN", url: "#" }]},
  { id: 8, name: "PRM System", links: [{ id: 1, name: "PRM System (SENZ)", url: "#" }, { id: 2, name: "PRM System (SEPCO)", url: "#" }, { id: 3, name: "PRM System (SAVINA)", url: "#" }]},
  { id: 9, name: "Logistics", links: [{ id: 1, name: "HQ) GSCM", url: "#" }, { id: 2, name: "HQ) GLS", url: "#" }, { id: 3, name: "AP) GLP", url: "#" }]},
  { id: 10, name: "Video Conference", links: [{ id: 1, name: "KNOX Connect", url: "#" }, { id: 2, name: "KNOX Meeting (SET)", url: "#" }]},
  { id: 11, name: "Purchasing", links: [{ id: 1, name: "HQ) G-SRM", url: "#" }, { id: 2, name: "HQ) GMCM", url: "#" }, { id: 3, name: "HQ) PES", url: "#" }]},
];

const defaultFeaturedCategories = [
  { id: 1, title: "IT Support Tools", links: [
    { id: 1, name: "IT-VOC", url: "https://itvoc.samsung.com" },
    { id: 2, name: "IT4U", url: "https://it4u.samsung.com" },
    { id: 3, name: "Service Desk", url: "https://servicedesk.samsung.com" },
  ]},
  { id: 2, title: "HR & Employee Services", links: [
    { id: 1, name: "GHRP Portal", url: "https://ghrp.samsung.com" },
    { id: 2, name: "Employee Benefits", url: "https://benefits.samsung.com" },
    { id: 3, name: "Leave Management", url: "https://leave.samsung.com" },
  ]},
  { id: 3, title: "Productivity & Collaboration", links: [
    { id: 1, name: "KNOX Connect", url: "https://knox.samsung.com" },
    { id: 2, name: "Confluence", url: "https://confluence.samsung.com" },
    { id: 3, name: "Email & Calendar", url: "https://mail.samsung.com" },
  ]},
];

const defaultSiteConfig = {
  id: "default",
  siteName: "SRPH MIS",
  siteTagline: "Employee Portal",
  navItems: defaultNavItems,
  ctaButtonText: "IT Support",
  ctaButtonLink: "/support",
  heroTitle1: "Welcome to",
  heroTitle2: "SRPH MIS Portal",
  heroDescription: "Your one-stop access to all enterprise applications, tools, and resources. Find everything you need to work efficiently and stay connected.",
  heroPrimaryBtn: "Browse All Systems",
  heroSecondaryBtn: "IT Support",
  stats: defaultStats,
  categories: defaultCategories,
  footerCopyright: "© 2024 SRPH MIS. All rights reserved.",
  featuredCategories: defaultFeaturedCategories,
  chatApiKey: "",
  chatEndpoint: "https://agent.sec.samsung.net/api/v1/run/d98b0949-3362-46b8-947a-16084bb3a710",
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/config", async (req, res) => {
    try {
      const config = await db.select().from(siteConfig).where(eq(siteConfig.id, "default")).limit(1);
      
      if (config.length === 0) {
        await db.insert(siteConfig).values({
          id: "default",
          siteName: defaultSiteConfig.siteName,
          siteTagline: defaultSiteConfig.siteTagline,
          navItems: defaultSiteConfig.navItems,
          ctaButtonText: defaultSiteConfig.ctaButtonText,
          ctaButtonLink: defaultSiteConfig.ctaButtonLink,
          heroTitle1: defaultSiteConfig.heroTitle1,
          heroTitle2: defaultSiteConfig.heroTitle2,
          heroDescription: defaultSiteConfig.heroDescription,
          heroPrimaryBtn: defaultSiteConfig.heroPrimaryBtn,
          heroSecondaryBtn: defaultSiteConfig.heroSecondaryBtn,
          stats: defaultSiteConfig.stats,
          categories: defaultSiteConfig.categories,
          footerCopyright: defaultSiteConfig.footerCopyright,
          featuredCategories: defaultSiteConfig.featuredCategories,
          chatApiKey: defaultSiteConfig.chatApiKey,
          chatEndpoint: defaultSiteConfig.chatEndpoint,
        });
        return res.json(defaultSiteConfig);
      }
      
      res.json(config[0]);
    } catch (error) {
      console.error("Error fetching config:", error);
      res.json(defaultSiteConfig);
    }
  });

  app.post("/api/config", async (req, res) => {
    try {
      const configData = req.body;
      
      const existing = await db.select().from(siteConfig).where(eq(siteConfig.id, "default")).limit(1);
      
      if (existing.length === 0) {
        await db.insert(siteConfig).values({
          id: "default",
          ...configData,
          updatedAt: new Date(),
        });
      } else {
        await db.update(siteConfig)
          .set({
            ...configData,
            updatedAt: new Date(),
          })
          .where(eq(siteConfig.id, "default"));
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving config:", error);
      res.status(500).json({ error: "Failed to save configuration" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, apiKey } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const config = await db.select().from(siteConfig).where(eq(siteConfig.id, "default")).limit(1);
      const endpoint = config[0]?.chatEndpoint || "https://agent.sec.samsung.net/api/v1/run/0006b561-d753-433e-a30e-736b73e2350c";

      if (!apiKey) {
        return res.json({ 
          response: "I apologize, but the AI service is not configured yet. Please ask your administrator to set up the API key in the admin settings. In the meantime, you can contact IT Support directly for assistance." 
        });
      }

      console.log(`Connecting to AI Agent at: ${endpoint}`);
      
      const response = await fetch(
        `${endpoint}${endpoint.includes('?') ? '&' : '?'}stream=false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({
            input_type: "chat",
            output_type: "chat",
            input_value: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      let aiResponse = "I apologize, but I couldn't process your request. Please try again.";
      
      // Handle the specific response structure from the Samsung AI API
      if (data.outputs && data.outputs.length > 0) {
        const output = data.outputs[0];
        if (output.outputs && output.outputs.length > 0) {
          const result = output.outputs[0].results?.message;
          if (result && result.text) {
            aiResponse = result.text;
          } else if (typeof output.outputs[0].results === 'string') {
            aiResponse = output.outputs[0].results;
          }
        }
      } else if (data.result) {
        aiResponse = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
      } else if (data.response) {
        aiResponse = data.response;
      } else if (data.text) {
        aiResponse = data.text;
      }

      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Chat API error:", error);
      res.json({ 
        response: "I'm having trouble connecting to the AI service right now. Please try again later or contact IT Support for immediate assistance." 
      });
    }
  });

  return httpServer;
}
