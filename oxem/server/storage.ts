import {
  users,
  lostFoundItems,
  fundraisingCampaigns,
  campusEvents,
  donations,
  eventRsvps,
  comments,
  likes,
  notifications,
  type User,
  type UpsertUser,
  type LostFoundItem,
  type InsertLostFound,
  type FundraisingCampaign,
  type InsertCampaign,
  type CampusEvent,
  type InsertEvent,
  type Donation,
  type InsertDonation,
  type EventRsvp,
  type InsertRsvp,
  type Comment,
  type InsertComment,
  type Like,
  type Notification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ilike, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(username: string, password: string, email?: string, role?: string): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Lost & Found operations
  getLostFoundItems(page?: number, limit?: number, type?: string, category?: string): Promise<LostFoundItem[]>;
  getLostFoundItem(id: string): Promise<LostFoundItem | undefined>;
  createLostFoundItem(userId: string, item: InsertLostFound): Promise<LostFoundItem>;
  updateLostFoundItem(id: string, updates: Partial<InsertLostFound>): Promise<LostFoundItem>;
  claimLostFoundItem(id: string, claimedBy: string): Promise<LostFoundItem>;
  
  // Fundraising operations
  getCampaigns(page?: number, limit?: number, category?: string): Promise<FundraisingCampaign[]>;
  getCampaign(id: string): Promise<FundraisingCampaign | undefined>;
  createCampaign(userId: string, campaign: InsertCampaign): Promise<FundraisingCampaign>;
  updateCampaign(id: string, updates: Partial<InsertCampaign>): Promise<FundraisingCampaign>;
  
  // Donation operations
  getDonationsForCampaign(campaignId: string): Promise<Donation[]>;
  createDonation(userId: string, donation: InsertDonation): Promise<Donation>;
  
  // Event operations
  getEvents(page?: number, limit?: number, category?: string): Promise<CampusEvent[]>;
  getEvent(id: string): Promise<CampusEvent | undefined>;
  createEvent(userId: string, event: InsertEvent): Promise<CampusEvent>;
  updateEvent(id: string, updates: Partial<InsertEvent>): Promise<CampusEvent>;
  
  // RSVP operations
  getRsvpsForEvent(eventId: string): Promise<EventRsvp[]>;
  createRsvp(userId: string, rsvp: InsertRsvp): Promise<EventRsvp>;
  updateRsvp(id: string, status: string): Promise<EventRsvp>;
  
  // Comment operations
  getCommentsForItem(itemId: string, itemType: string): Promise<Comment[]>;
  createComment(userId: string, comment: InsertComment): Promise<Comment>;
  
  // Like operations
  getLikesForItem(itemId: string, itemType: string): Promise<Like[]>;
  toggleLike(userId: string, itemId: string, itemType: string): Promise<boolean>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(userId: string, title: string, message: string, type: string, relatedId?: string): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  updateCampaignStatus(id: string, status: string): Promise<void>;
  deleteCampaign(id: string): Promise<void>;
  updateEventStatus(id: string, status: string): Promise<void>;
  deleteEvent(id: string): Promise<void>;
  updateLostFoundStatus(id: string, status: string): Promise<void>;
  deleteLostFoundItem(id: string): Promise<void>;
  getAnalytics(): Promise<any>;
  
  // Analytics for admin
  getAnalytics(): Promise<{
    totalUsers: number;
    totalLostFoundPosts: number;
    totalCampaigns: number;
    totalEvents: number;
    totalFundsRaised: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(username: string, password: string, email?: string, role: string = "student"): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        username,
        password,
        email,
        role,
        firstName: username,
        lastName: "",
        profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Lost & Found operations
  async getLostFoundItems(page = 0, limit = 20, type?: string, category?: string): Promise<LostFoundItem[]> {
    const whereConditions = [];
    
    if (type) {
      whereConditions.push(eq(lostFoundItems.type, type));
    }
    
    if (category) {
      whereConditions.push(eq(lostFoundItems.category, category));
    }
    
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    
    return await db
      .select()
      .from(lostFoundItems)
      .where(whereClause)
      .orderBy(desc(lostFoundItems.createdAt))
      .limit(limit)
      .offset(page * limit);
  }

  async getLostFoundItem(id: string): Promise<LostFoundItem | undefined> {
    const [item] = await db.select().from(lostFoundItems).where(eq(lostFoundItems.id, id));
    return item;
  }

  async createLostFoundItem(userId: string, item: InsertLostFound): Promise<LostFoundItem> {
    const [newItem] = await db
      .insert(lostFoundItems)
      .values({ ...item, userId })
      .returning();
    return newItem;
  }

  async updateLostFoundItem(id: string, updates: Partial<InsertLostFound>): Promise<LostFoundItem> {
    const [item] = await db
      .update(lostFoundItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lostFoundItems.id, id))
      .returning();
    return item;
  }

  async claimLostFoundItem(id: string, claimedBy: string): Promise<LostFoundItem> {
    const [item] = await db
      .update(lostFoundItems)
      .set({ claimedBy, status: "claimed", updatedAt: new Date() })
      .where(eq(lostFoundItems.id, id))
      .returning();
    return item;
  }

  // Fundraising operations
  async getCampaigns(page = 0, limit = 20, category?: string): Promise<FundraisingCampaign[]> {
    const whereClause = category ? eq(fundraisingCampaigns.category, category) : undefined;
    
    return await db
      .select()
      .from(fundraisingCampaigns)
      .where(whereClause)
      .orderBy(desc(fundraisingCampaigns.createdAt))
      .limit(limit)
      .offset(page * limit);
  }

  async getCampaign(id: string): Promise<FundraisingCampaign | undefined> {
    const [campaign] = await db.select().from(fundraisingCampaigns).where(eq(fundraisingCampaigns.id, id));
    return campaign;
  }

  async createCampaign(userId: string, campaign: InsertCampaign): Promise<FundraisingCampaign> {
    const [newCampaign] = await db
      .insert(fundraisingCampaigns)
      .values({ ...campaign, userId })
      .returning();
    return newCampaign;
  }

  async updateCampaign(id: string, updates: Partial<InsertCampaign>): Promise<FundraisingCampaign> {
    const [campaign] = await db
      .update(fundraisingCampaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(fundraisingCampaigns.id, id))
      .returning();
    return campaign;
  }

  // Donation operations
  async getDonationsForCampaign(campaignId: string): Promise<Donation[]> {
    return await db
      .select()
      .from(donations)
      .where(eq(donations.campaignId, campaignId))
      .orderBy(desc(donations.createdAt));
  }

  async createDonation(userId: string, donation: InsertDonation): Promise<Donation> {
    const [newDonation] = await db
      .insert(donations)
      .values({ ...donation, userId })
      .returning();

    // Update campaign raised amount
    await db
      .update(fundraisingCampaigns)
      .set({
        raisedAmount: sql`${fundraisingCampaigns.raisedAmount} + ${donation.amount}`,
        updatedAt: new Date(),
      })
      .where(eq(fundraisingCampaigns.id, donation.campaignId));

    return newDonation;
  }

  // Event operations
  async getEvents(page = 0, limit = 20, category?: string): Promise<CampusEvent[]> {
    const whereClause = category ? eq(campusEvents.category, category) : undefined;
    
    return await db
      .select()
      .from(campusEvents)
      .where(whereClause)
      .orderBy(desc(campusEvents.startDate))
      .limit(limit)
      .offset(page * limit);
  }

  async getEvent(id: string): Promise<CampusEvent | undefined> {
    const [event] = await db.select().from(campusEvents).where(eq(campusEvents.id, id));
    return event;
  }

  async createEvent(userId: string, event: InsertEvent): Promise<CampusEvent> {
    const [newEvent] = await db
      .insert(campusEvents)
      .values({ ...event, userId })
      .returning();
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<InsertEvent>): Promise<CampusEvent> {
    const [event] = await db
      .update(campusEvents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(campusEvents.id, id))
      .returning();
    return event;
  }

  // RSVP operations
  async getRsvpsForEvent(eventId: string): Promise<EventRsvp[]> {
    return await db
      .select()
      .from(eventRsvps)
      .where(eq(eventRsvps.eventId, eventId))
      .orderBy(desc(eventRsvps.createdAt));
  }

  async createRsvp(userId: string, rsvp: InsertRsvp): Promise<EventRsvp> {
    const [newRsvp] = await db
      .insert(eventRsvps)
      .values({ ...rsvp, userId })
      .onConflictDoUpdate({
        target: [eventRsvps.eventId, eventRsvps.userId],
        set: { status: rsvp.status },
      })
      .returning();
    return newRsvp;
  }

  async updateRsvp(id: string, status: string): Promise<EventRsvp> {
    const [rsvp] = await db
      .update(eventRsvps)
      .set({ status })
      .where(eq(eventRsvps.id, id))
      .returning();
    return rsvp;
  }

  // Comment operations
  async getCommentsForItem(itemId: string, itemType: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(and(eq(comments.itemId, itemId), eq(comments.itemType, itemType)))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(userId: string, comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values({ ...comment, userId })
      .returning();
    return newComment;
  }

  // Like operations
  async getLikesForItem(itemId: string, itemType: string): Promise<Like[]> {
    return await db
      .select()
      .from(likes)
      .where(and(eq(likes.itemId, itemId), eq(likes.itemType, itemType)));
  }

  async toggleLike(userId: string, itemId: string, itemType: string): Promise<boolean> {
    const existingLike = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.userId, userId),
          eq(likes.itemId, itemId),
          eq(likes.itemType, itemType)
        )
      );

    if (existingLike.length > 0) {
      await db
        .delete(likes)
        .where(eq(likes.id, existingLike[0].id));
      return false; // Unliked
    } else {
      await db
        .insert(likes)
        .values({ userId, itemId, itemType });
      return true; // Liked
    }
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }

  async createNotification(userId: string, title: string, message: string, type: string, relatedId?: string): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values({ userId, title, message, type, relatedId })
      .returning();
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateCampaignStatus(id: string, status: string): Promise<void> {
    await db
      .update(fundraisingCampaigns)
      .set({ status, updatedAt: new Date() })
      .where(eq(fundraisingCampaigns.id, id));
  }

  async deleteCampaign(id: string): Promise<void> {
    await db.delete(fundraisingCampaigns).where(eq(fundraisingCampaigns.id, id));
  }

  async updateEventStatus(id: string, status: string): Promise<void> {
    await db
      .update(campusEvents)
      .set({ status, updatedAt: new Date() })
      .where(eq(campusEvents.id, id));
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(campusEvents).where(eq(campusEvents.id, id));
  }

  async updateLostFoundStatus(id: string, status: string): Promise<void> {
    await db
      .update(lostFoundItems)
      .set({ status, updatedAt: new Date() })
      .where(eq(lostFoundItems.id, id));
  }

  async deleteLostFoundItem(id: string): Promise<void> {
    await db.delete(lostFoundItems).where(eq(lostFoundItems.id, id));
  }

  // Analytics for admin
  async getAnalytics() {
    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [lostFoundCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(lostFoundItems);

    const [campaignCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(fundraisingCampaigns);

    const [eventCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(campusEvents);

    const [fundsRaised] = await db
      .select({ total: sql<string>`sum(raised_amount)` })
      .from(fundraisingCampaigns);

    return {
      totalUsers: userCount.count,
      totalLostFoundPosts: lostFoundCount.count,
      totalCampaigns: campaignCount.count,
      totalEvents: eventCount.count,
      totalFundsRaised: parseFloat(fundsRaised.total || "0"),
    };
  }
}

export const storage = new DatabaseStorage();
