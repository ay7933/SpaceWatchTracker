import { pgTable, text, serial, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const mapPreferences = pgTable("map_preferences", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  centerLat: real("center_lat").notNull().default(37.7749),
  centerLng: real("center_lng").notNull().default(-122.4194),
  zoom: real("zoom").notNull().default(10),
  selectedLayer: text("selected_layer").notNull().default("TRUE_COLOR"),
  dateFrom: timestamp("date_from"),
  dateTo: timestamp("date_to"),
  weatherOverlays: jsonb("weather_overlays").default({}),
  imageSettings: jsonb("image_settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const satelliteImageCache = pgTable("satellite_image_cache", {
  id: serial("id").primaryKey(),
  cacheKey: text("cache_key").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  bounds: jsonb("bounds").notNull(),
  layer: text("layer").notNull(),
  date: timestamp("date").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMapPreferencesSchema = createInsertSchema(mapPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSatelliteImageCacheSchema = createInsertSchema(satelliteImageCache).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MapPreferences = typeof mapPreferences.$inferSelect;
export type InsertMapPreferences = z.infer<typeof insertMapPreferencesSchema>;
export type SatelliteImageCache = typeof satelliteImageCache.$inferSelect;
export type InsertSatelliteImageCache = z.infer<typeof insertSatelliteImageCacheSchema>;
