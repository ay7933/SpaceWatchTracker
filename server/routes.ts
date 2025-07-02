import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const SENTINEL_HUB_INSTANCE_ID = process.env.SENTINEL_HUB_INSTANCE_ID || "04634499-7569-49aa-a4a1-b0d174c6d436";
const SENTINEL_HUB_CLIENT_ID = process.env.SENTINEL_HUB_CLIENT_ID;
const SENTINEL_HUB_CLIENT_SECRET = process.env.SENTINEL_HUB_CLIENT_SECRET;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "d444ca60f569dd9924ebe4c65311b1a3";

let sentinelHubToken: { access_token: string; expires_at: number } | null = null;

async function getSentinelHubToken(): Promise<string> {
  if (sentinelHubToken && sentinelHubToken.expires_at > Date.now()) {
    return sentinelHubToken.access_token;
  }

  if (!SENTINEL_HUB_CLIENT_ID || !SENTINEL_HUB_CLIENT_SECRET) {
    throw new Error("Sentinel Hub credentials not configured");
  }

  try {
    const response = await fetch("https://services.sentinel-hub.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: SENTINEL_HUB_CLIENT_ID,
        client_secret: SENTINEL_HUB_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get Sentinel Hub token: ${response.statusText}`);
    }

    const data = await response.json();
    sentinelHubToken = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in * 1000) - 60000, // Subtract 1 minute for safety
    };

    return sentinelHubToken.access_token;
  } catch (error) {
    // If credentials fail, the user needs to provide working credentials
    throw new Error("Sentinel Hub authentication failed. Please verify your Client ID and Client Secret are correct.");
  }
}

const satelliteRequestSchema = z.object({
  bbox: z.array(z.number()).length(4),
  layer: z.string(),
  width: z.number().min(100).max(2048),
  height: z.number().min(100).max(2048),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  maxCloudCoverage: z.number().min(0).max(100).optional(),
});

const weatherRequestSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

const geocodeRequestSchema = z.object({
  query: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Satellite imagery endpoint
  app.post("/api/satellite", async (req, res) => {
    try {
      const { bbox, layer, width, height, dateFrom, dateTo, maxCloudCoverage } = satelliteRequestSchema.parse(req.body);
      
      const cacheKey = `satellite_${bbox.join('_')}_${layer}_${width}x${height}_${dateFrom || 'latest'}_${dateTo || 'latest'}`;
      
      // Check cache first
      const cached = await storage.getCachedImage(cacheKey);
      if (cached) {
        return res.json({ imageUrl: cached.imageUrl, cached: true });
      }

      const token = await getSentinelHubToken();
      
      // Build Sentinel Hub request
      const requestBody = {
        input: {
          bounds: {
            bbox: bbox,
            properties: {
              crs: "http://www.opengis.net/def/crs/EPSG/0/4326"
            }
          },
          data: [
            {
              type: "sentinel-2-l2a",
              dataFilter: {
                timeRange: {
                  from: dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + "T00:00:00Z",
                  to: dateTo || new Date().toISOString().split('T')[0] + "T23:59:59Z"
                },
                ...(maxCloudCoverage !== undefined && {
                  maxCloudCoverage: maxCloudCoverage
                })
              }
            }
          ]
        },
        output: {
          width: width,
          height: height,
          responses: [
            {
              identifier: "default",
              format: {
                type: "image/png"
              }
            }
          ]
        },
        evalscript: getEvalscriptForLayer(layer)
      };

      const response = await fetch("https://services.sentinel-hub.com/api/v1/process", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Sentinel Hub API error: ${response.status} ${response.statusText}`);
      }

      const imageBuffer = await response.arrayBuffer();
      const base64Image = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;
      
      // Cache the result
      await storage.setCachedImage({
        cacheKey,
        imageUrl: base64Image,
        bounds: { bbox },
        layer,
        date: new Date(dateTo || new Date().toISOString()),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Cache for 24 hours
      });

      res.json({ imageUrl: base64Image, cached: false });
    } catch (error) {
      console.error("Satellite API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch satellite imagery", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Weather data endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = weatherRequestSchema.parse(req.query);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      res.json({
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind?.speed * 3.6 || 0), // Convert m/s to km/h
        windDirection: data.wind?.deg || 0,
        cloudCover: data.clouds?.all || 0,
        weather: data.weather[0]?.main || "Clear",
        description: data.weather[0]?.description || "",
        icon: data.weather[0]?.icon || "01d",
      });
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch weather data", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Geocoding endpoint
  app.get("/api/geocode", async (req, res) => {
    try {
      const { query } = geocodeRequestSchema.parse(req.query);
      
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const results = data.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon,
        displayName: `${item.name}${item.state ? `, ${item.state}` : ''}, ${item.country}`,
      }));

      res.json(results);
    } catch (error) {
      console.error("Geocoding API error:", error);
      res.status(500).json({ 
        error: "Failed to geocode location", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Map preferences endpoints
  app.get("/api/preferences/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = await storage.getMapPreferences(userId);
      res.json(preferences || {});
    } catch (error) {
      console.error("Get preferences error:", error);
      res.status(500).json({ error: "Failed to get preferences" });
    }
  });

  app.post("/api/preferences/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = await storage.updateMapPreferences(userId, req.body);
      res.json(preferences);
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getEvalscriptForLayer(layer: string): string {
  const evalscripts: Record<string, string> = {
    TRUE_COLOR: `
      //VERSION=3
      function setup() {
        return {
          input: ["B02", "B03", "B04"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(sample) {
        return [sample.B04, sample.B03, sample.B02, 1];
      }
    `,
    VEGETATION_INDEX: `
      //VERSION=3
      function setup() {
        return {
          input: ["B04", "B08"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(sample) {
        let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
        return colorBlend(ndvi, [0.0, 0.5, 1.0], [[1,0,0], [1,1,0], [0,1,0]], 1);
      }
    `,
    COLOR_INFRARED: `
      //VERSION=3
      function setup() {
        return {
          input: ["B03", "B04", "B08"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(sample) {
        return [sample.B08, sample.B04, sample.B03, 1];
      }
    `,
    AGRICULTURE: `
      //VERSION=3
      function setup() {
        return {
          input: ["B03", "B04", "B11"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(sample) {
        return [sample.B11 * 3, sample.B04 * 3, sample.B03 * 3, 1];
      }
    `,
    GEOLOGY: `
      //VERSION=3
      function setup() {
        return {
          input: ["B04", "B11", "B12"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(sample) {
        return [sample.B12 * 3, sample.B11 * 3, sample.B04 * 3, 1];
      }
    `,
    MOISTURE_INDEX: `
      //VERSION=3
      function setup() {
        return {
          input: ["B08", "B11"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(sample) {
        let ndmi = (sample.B08 - sample.B11) / (sample.B08 + sample.B11);
        return colorBlend(ndmi, [-1.0, 0.0, 1.0], [[0.8,0.4,0], [1,1,0.8], [0,0.4,1]], 1);
      }
    `,
    SWIR: `
      //VERSION=3
      function setup() {
        return {
          input: ["B11", "B12", "B04"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(sample) {
        return [sample.B12 * 3, sample.B11 * 3, sample.B04 * 3, 1];
      }
    `,
    ATMOSPHERIC_PENETRATION: `
      //VERSION=3
      function setup() {
        return {
          input: ["B12", "B11", "B04"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(sample) {
        return [sample.B12 * 3.5, sample.B11 * 3.5, sample.B04 * 3.5, 1];
      }
    `,
    BATHYMETRIC: `
      //VERSION=3
      function setup() {
        return {
          input: ["B02", "B03", "B04"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(sample) {
        return [sample.B04 * 2, sample.B03 * 2, sample.B02 * 4, 1];
      }
    `,
    COLOR_INFRARED_URBAN_: `
      //VERSION=3
      function setup() {
        return {
          input: ["B12", "B11", "B04"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(sample) {
        return [sample.B12 * 2.5, sample.B11 * 2.5, sample.B04 * 2.5, 1];
      }
    `,
  };

  return evalscripts[layer] || evalscripts.TRUE_COLOR;
}
