import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { api } from "@shared/routes";
import { users } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import createMemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const MemoryStore = createMemoryStore(session);

declare global {
  namespace Express {
    interface User extends import("@shared/schema").User {}
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({ checkPeriod: 86400000 }),
    })
  );

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || user.password !== password) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  };

  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByUsername(input.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(input);
      req.login(user, (err) => {
        if (err) throw err;
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal error" });
      }
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, requireAuth, (req, res) => {
    res.json(req.user);
  });

  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post(api.products.create.path, requireAuth, async (req, res) => {
    if (!req.user!.isAdmin) {
      return res.status(401).json({ message: "Must be admin" });
    }
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) res.status(400).json({ message: err.errors[0].message });
      else res.status(500).json({ message: "Internal error" });
    }
  });

  app.delete(api.products.delete.path, requireAuth, async (req, res) => {
    if (!req.user!.isAdmin) {
      return res.status(401).json({ message: "Must be admin" });
    }
    const id = parseInt(req.params.id);
    await storage.deleteProduct(id);
    res.json({ success: true });
  });

  app.get(api.messages.list.path, requireAuth, async (req, res) => {
    const msgs = await storage.getMessages(req.user!.id, req.user!.isAdmin);
    res.json(msgs);
  });

  app.post(api.messages.send.path, requireAuth, async (req, res) => {
    try {
      const input = api.messages.send.input.parse(req.body);
      const msg = await storage.createMessage({
        senderId: req.user!.id,
        receiverId: input.receiverId || null,
        content: input.content
      });
      res.status(201).json(msg);
    } catch (err) {
      if (err instanceof z.ZodError) res.status(400).json({ message: err.errors[0].message });
      else res.status(500).json({ message: "Internal error" });
    }
  });

  async function ensureAdminExists() {
    try {
      const admin = await storage.getUserByUsername('hoanghuequynh');
      if (!admin) {
        await db.insert(users).values({
          username: 'hoanghuequynh',
          password: 'hoanghuequynh2092009',
          isAdmin: true
        });
      }
      
      const allProducts = await storage.getProducts();
      if (allProducts.length === 0) {
        await storage.createProduct({
          name: "Áo Thun Ulzzang Form Rộng",
          description: "Áo thun nam nữ form rộng tay lỡ style hàn quốc",
          price: 99000,
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
          externalLink: "https://taobao.com"
        });
        await storage.createProduct({
          name: "Giày Sneaker Nam Nữ",
          description: "Giày thể thao nam nữ bản đẹp chuẩn",
          price: 250000,
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
          externalLink: "https://taobao.com"
        });
        await storage.createProduct({
          name: "Balo Thời Trang",
          description: "Balo nam nữ thời trang đi học đi làm siêu bền",
          price: 150000,
          imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
          externalLink: "https://taobao.com"
        });
      }
    } catch (e) {
      console.error("Failed to seed database:", e);
    }
  }

  ensureAdminExists();

  return httpServer;
}
