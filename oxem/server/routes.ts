import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, hashPassword, verifyPassword } from "./auth";
import {
  insertLostFoundSchema,
  insertCampaignSchema,
  insertEventSchema,
  insertDonationSchema,
  insertRsvpSchema,
  insertCommentSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Auth routes
  app.post('/api/auth/signup', async (req: any, res) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser(username, hashedPassword, email, "student");
      
      req.session.regenerate((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Failed to create session" });
        }
        req.session.userId = user.id;
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post('/api/auth/login', async (req: any, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      req.session.regenerate((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Failed to create session" });
        }
        req.session.userId = user.id;
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post('/api/auth/logout', (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Lost & Found routes
  app.get('/api/lost-found', async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 0;
      const limit = parseInt(req.query.limit as string) || 20;
      const type = req.query.type as string;
      const category = req.query.category as string;
      
      const items = await storage.getLostFoundItems(page, limit, type, category);
      res.json(items);
    } catch (error) {
      console.error("Error fetching lost & found items:", error);
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.get('/api/lost-found/:id', async (req, res) => {
    try {
      const item = await storage.getLostFoundItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching lost & found item:", error);
      res.status(500).json({ message: "Failed to fetch item" });
    }
  });

  app.post('/api/lost-found', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertLostFoundSchema.parse(req.body);
      
      const item = await storage.createLostFoundItem(userId, validatedData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating lost & found item:", error);
      res.status(500).json({ message: "Failed to create item" });
    }
  });

  app.patch('/api/lost-found/:id/claim', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const item = await storage.claimLostFoundItem(req.params.id, userId);
      res.json(item);
    } catch (error) {
      console.error("Error claiming item:", error);
      res.status(500).json({ message: "Failed to claim item" });
    }
  });

  // Fundraising routes
  app.get('/api/campaigns', async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 0;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string;
      
      const campaigns = await storage.getCampaigns(page, limit, category);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get('/api/campaigns/:id', async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post('/api/campaigns', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertCampaignSchema.parse(req.body);
      
      const campaign = await storage.createCampaign(userId, validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.get('/api/campaigns/:id/donations', async (req, res) => {
    try {
      const donations = await storage.getDonationsForCampaign(req.params.id);
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  app.post('/api/campaigns/:id/donate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const donationData = {
        ...insertDonationSchema.parse(req.body),
        campaignId: req.params.id,
      };
      
      const donation = await storage.createDonation(userId, donationData);
      res.status(201).json(donation);
    } catch (error) {
      console.error("Error creating donation:", error);
      res.status(500).json({ message: "Failed to create donation" });
    }
  });

  // Events routes
  app.get('/api/events', async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 0;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string;
      
      const events = await storage.getEvents(page, limit, category);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/events/:id', async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post('/api/events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertEventSchema.parse(req.body);
      
      const event = await storage.createEvent(userId, validatedData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.get('/api/events/:id/rsvps', async (req, res) => {
    try {
      const rsvps = await storage.getRsvpsForEvent(req.params.id);
      res.json(rsvps);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({ message: "Failed to fetch RSVPs" });
    }
  });

  app.post('/api/events/:id/rsvp', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const rsvpData = {
        ...insertRsvpSchema.parse(req.body),
        eventId: req.params.id,
      };
      
      const rsvp = await storage.createRsvp(userId, rsvpData);
      res.status(201).json(rsvp);
    } catch (error) {
      console.error("Error creating RSVP:", error);
      res.status(500).json({ message: "Failed to create RSVP" });
    }
  });

  // Comments routes
  app.get('/api/comments/:itemType/:itemId', async (req, res) => {
    try {
      const { itemType, itemId } = req.params;
      const comments = await storage.getCommentsForItem(itemId, itemType);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertCommentSchema.parse(req.body);
      
      const comment = await storage.createComment(userId, validatedData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Likes routes
  app.get('/api/likes/:itemType/:itemId', async (req, res) => {
    try {
      const { itemType, itemId } = req.params;
      const likes = await storage.getLikesForItem(itemId, itemType);
      res.json(likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ message: "Failed to fetch likes" });
    }
  });

  app.post('/api/likes/toggle', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { itemId, itemType } = req.body;
      
      const liked = await storage.toggleLike(userId, itemId, itemType);
      res.json({ liked });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Notifications routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Admin routes
  const requireAdmin = async (req: any, res: any, next: any) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      next();
    } catch (error) {
      console.error("Error checking admin role:", error);
      res.status(500).json({ message: "Failed to verify admin access" });
    }
  };

  app.get('/api/admin/users', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch('/api/admin/campaigns/:id/status', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateCampaignStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating campaign status:", error);
      res.status(500).json({ message: "Failed to update campaign status" });
    }
  });

  app.delete('/api/admin/campaigns/:id', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      await storage.deleteCampaign(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  app.patch('/api/admin/events/:id/status', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateEventStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating event status:", error);
      res.status(500).json({ message: "Failed to update event status" });
    }
  });

  app.delete('/api/admin/events/:id', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  app.patch('/api/admin/lost-found/:id/status', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateLostFoundStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating lost found status:", error);
      res.status(500).json({ message: "Failed to update lost found status" });
    }
  });

  app.delete('/api/admin/lost-found/:id', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      await storage.deleteLostFoundItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting lost found item:", error);
      res.status(500).json({ message: "Failed to delete lost found item" });
    }
  });

  // Analytics routes (admin only)
  app.get('/api/analytics', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        // Handle real-time messages (notifications, updates, etc.)
        console.log('Received WebSocket message:', data);
        
        // Broadcast to all connected clients
        wss.clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
