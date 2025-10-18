import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("student").notNull(), // student, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lost & Found items
export const lostFoundItems = pgTable("lost_found_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // "lost" or "found"
  category: varchar("category"), // electronics, clothing, books, etc.
  location: text("location"),
  tags: text("tags").array(),
  imageUrls: text("image_urls").array(),
  status: varchar("status").default("active").notNull(), // active, claimed, resolved
  claimedBy: varchar("claimed_by").references(() => users.id),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fundraising campaigns
export const fundraisingCampaigns = pgTable("fundraising_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goalAmount: decimal("goal_amount", { precision: 10, scale: 2 }).notNull(),
  raisedAmount: decimal("raised_amount", { precision: 10, scale: 2 }).default("0"),
  imageUrl: text("image_url"),
  category: varchar("category"), // education, emergency, sports, etc.
  status: varchar("status").default("active").notNull(), // active, paused, completed, cancelled
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign donations
export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").references(() => fundraisingCampaigns.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  anonymous: boolean("anonymous").default(false),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Campus events
export const campusEvents = pgTable("campus_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  imageUrl: text("image_url"),
  category: varchar("category"), // academic, cultural, sports, tech, etc.
  maxAttendees: integer("max_attendees"),
  status: varchar("status").default("active").notNull(), // active, cancelled, completed
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event RSVPs
export const eventRsvps = pgTable("event_rsvps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => campusEvents.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  status: varchar("status").default("attending").notNull(), // attending, interested, not_attending
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments for posts/items
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  itemId: varchar("item_id").notNull(), // can reference any item (lost_found, campaign, event)
  itemType: varchar("item_type").notNull(), // lost_found, campaign, event
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Likes for posts/items
export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  itemId: varchar("item_id").notNull(),
  itemType: varchar("item_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // claim, donation, rsvp, comment, like, etc.
  relatedId: varchar("related_id"), // ID of related item
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const userRelations = relations(users, ({ many }) => ({
  lostFoundItems: many(lostFoundItems),
  campaigns: many(fundraisingCampaigns),
  events: many(campusEvents),
  donations: many(donations),
  rsvps: many(eventRsvps),
  comments: many(comments),
  likes: many(likes),
  notifications: many(notifications),
}));

export const lostFoundRelations = relations(lostFoundItems, ({ one, many }) => ({
  user: one(users, {
    fields: [lostFoundItems.userId],
    references: [users.id],
  }),
  claimedByUser: one(users, {
    fields: [lostFoundItems.claimedBy],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
}));

export const campaignRelations = relations(fundraisingCampaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [fundraisingCampaigns.userId],
    references: [users.id],
  }),
  donations: many(donations),
  comments: many(comments),
  likes: many(likes),
}));

export const eventRelations = relations(campusEvents, ({ one, many }) => ({
  user: one(users, {
    fields: [campusEvents.userId],
    references: [users.id],
  }),
  rsvps: many(eventRsvps),
  comments: many(comments),
  likes: many(likes),
}));

export const donationRelations = relations(donations, ({ one }) => ({
  campaign: one(fundraisingCampaigns, {
    fields: [donations.campaignId],
    references: [fundraisingCampaigns.id],
  }),
  user: one(users, {
    fields: [donations.userId],
    references: [users.id],
  }),
}));

export const rsvpRelations = relations(eventRsvps, ({ one }) => ({
  event: one(campusEvents, {
    fields: [eventRsvps.eventId],
    references: [campusEvents.id],
  }),
  user: one(users, {
    fields: [eventRsvps.userId],
    references: [users.id],
  }),
}));

export const commentRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const likeRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertLostFoundSchema = createInsertSchema(lostFoundItems).omit({
  id: true,
  userId: true,
  likes: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCampaignSchema = createInsertSchema(fundraisingCampaigns).omit({
  id: true,
  userId: true,
  raisedAmount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(campusEvents).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertRsvpSchema = createInsertSchema(eventRsvps).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLostFound = z.infer<typeof insertLostFoundSchema>;
export type LostFoundItem = typeof lostFoundItems.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type FundraisingCampaign = typeof fundraisingCampaigns.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type CampusEvent = typeof campusEvents.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type EventRsvp = typeof eventRsvps.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
