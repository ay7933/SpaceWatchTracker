import { users, mapPreferences, satelliteImageCache, type User, type InsertUser, type MapPreferences, type InsertMapPreferences, type SatelliteImageCache, type InsertSatelliteImageCache } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMapPreferences(userId: number): Promise<MapPreferences | undefined>;
  updateMapPreferences(userId: number, preferences: Partial<InsertMapPreferences>): Promise<MapPreferences>;
  getCachedImage(cacheKey: string): Promise<SatelliteImageCache | undefined>;
  setCachedImage(cache: InsertSatelliteImageCache): Promise<SatelliteImageCache>;
  cleanExpiredCache(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private mapPreferences: Map<number, MapPreferences>;
  private imageCache: Map<string, SatelliteImageCache>;
  currentUserId: number;
  currentPrefsId: number;
  currentCacheId: number;

  constructor() {
    this.users = new Map();
    this.mapPreferences = new Map();
    this.imageCache = new Map();
    this.currentUserId = 1;
    this.currentPrefsId = 1;
    this.currentCacheId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMapPreferences(userId: number): Promise<MapPreferences | undefined> {
    return Array.from(this.mapPreferences.values()).find(
      (prefs) => prefs.userId === userId,
    );
  }

  async updateMapPreferences(userId: number, preferences: Partial<InsertMapPreferences>): Promise<MapPreferences> {
    const existing = await this.getMapPreferences(userId);
    
    if (existing) {
      const updated: MapPreferences = {
        ...existing,
        ...preferences,
        updatedAt: new Date(),
      };
      this.mapPreferences.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentPrefsId++;
      const newPrefs: MapPreferences = {
        id,
        userId,
        centerLat: 37.7749,
        centerLng: -122.4194,
        zoom: 10,
        selectedLayer: "TRUE_COLOR",
        dateFrom: null,
        dateTo: null,
        weatherOverlays: {},
        imageSettings: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        ...preferences,
      };
      this.mapPreferences.set(id, newPrefs);
      return newPrefs;
    }
  }

  async getCachedImage(cacheKey: string): Promise<SatelliteImageCache | undefined> {
    const cached = this.imageCache.get(cacheKey);
    if (cached && cached.expiresAt > new Date()) {
      return cached;
    }
    if (cached) {
      this.imageCache.delete(cacheKey);
    }
    return undefined;
  }

  async setCachedImage(cache: InsertSatelliteImageCache): Promise<SatelliteImageCache> {
    const id = this.currentCacheId++;
    const newCache: SatelliteImageCache = {
      ...cache,
      id,
      createdAt: new Date(),
    };
    this.imageCache.set(cache.cacheKey, newCache);
    return newCache;
  }

  async cleanExpiredCache(): Promise<void> {
    const now = new Date();
    for (const [key, cache] of this.imageCache.entries()) {
      if (cache.expiresAt <= now) {
        this.imageCache.delete(key);
      }
    }
  }
}

export const storage = new MemStorage();
