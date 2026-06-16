import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Define basic types
interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
}

interface Reservation {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  tableNum: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
  reservations: Reservation[];
}

// Ensure database directory and file exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
  const initialData: DatabaseSchema = {
    users: [
      {
        id: "user_seed_1",
        name: "山本健太",
        phone: "0912-345-678",
        email: "yamamoto@example.com",
        password: "password123"
      }
    ],
    reservations: [
      {
        id: "res_seed_1",
        userId: "user_seed_1",
        name: "山本健太",
        phone: "0912-345-678",
        email: "yamamoto@example.com",
        date: "2026-06-25",
        time: "18:30",
        guests: 4,
        notes: "希望安排靠窗、榻榻米座位。慶祝結婚週年週年。",
        tableNum: 6,
        status: "confirmed",
        createdAt: new Date().toISOString()
      },
      {
        id: "res_seed_2",
        userId: "user_seed_1",
        name: "山本健太",
        phone: "0912-345-678",
        email: "yamamoto@example.com",
        date: "2026-07-10",
        time: "12:00",
        guests: 2,
        notes: "無特別要求。",
        tableNum: 3,
        status: "pending",
        createdAt: new Date().toISOString()
      }
    ]
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
}

// Read and write helper functions
function readDb(): DatabaseSchema {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading DB file, returning empty schema:", err);
    return { users: [], reservations: [] };
  }
}

function writeDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing DB file:", err);
  }
}

// Enable JSON body parsing
app.use(express.json());

// Express Auth Middleware
const authenticateUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "未授權，請先登入" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "無效的驗證驗證" });
    return;
  }

  const db = readDb();
  // Simplified token is "token_userId"
  const userId = token.replace("token_", "");
  const user = db.users.find(u => u.id === userId);

  if (!user) {
    res.status(401).json({ error: "使用者不存在或連線已逾期" });
    return;
  }

  // Attach user context without password
  (req as any).user = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone
  };
  next();
};

// --- AUTH API ROUTES ---

// 1. Register User
app.post("/api/auth/register", (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(400).json({ error: "所有欄位均為必填" });
    return;
  }

  const db = readDb();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    res.status(400).json({ error: "該電子信箱已被註冊" });
    return;
  }

  const newUser: User = {
    id: "user_" + Math.random().toString(36).substr(2, 9),
    name,
    email,
    phone,
    password
  };

  db.users.push(newUser);
  writeDb(db);

  // Return user info and artificial token
  res.status(201).json({
    message: "註冊成功！",
    token: "token_" + newUser.id,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone
    }
  });
});

// 2. Login User
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "信箱與密碼均為必填" });
    return;
  }

  const db = readDb();
  const user = db.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    res.status(401).json({ error: "信箱或密碼錯誤，請重新確認" });
    return;
  }

  res.json({
    message: "登入成功！歡迎回來",
    token: "token_" + user.id,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    }
  });
});

// 3. Get Current User Session Info
app.get("/api/auth/me", authenticateUser, (req, res) => {
  res.json({ user: (req as any).user });
});

// --- RESERVATION API ROUTES ---

// 1. Get Reservations for logged-in user
app.get("/api/reservations", authenticateUser, (req, res) => {
  const user = (req as any).user;
  const db = readDb();
  const userReservations = db.reservations
    .filter(r => r.userId === user.id)
    .sort((a, b) => new Date(b.date + "T" + b.time).getTime() - new Date(a.date + "T" + a.time).getTime());

  res.json(userReservations);
});

// 2. Create Reservation (Supports registering user details or default logged in user)
app.post("/api/reservations", authenticateUser, (req, res) => {
  const currentUser = (req as any).user;
  const { name, phone, email, date, time, guests, notes } = req.body;

  if (!name || !phone || !email || !date || !time || !guests) {
    res.status(400).json({ error: "請填寫完整的預約資訊（姓名、電話、信箱、日期、時間、人數）" });
    return;
  }

  const guestCount = parseInt(guests, 10);
  if (isNaN(guestCount) || guestCount <= 0) {
    res.status(400).json({ error: "人數必須大於 0" });
    return;
  }

  const db = readDb();

  // Assign a random table number (e.g., between 1 and 15) for additional polish
  const tableNum = Math.floor(Math.random() * 15) + 1;

  const newReservation: Reservation = {
    id: "res_" + Math.random().toString(36).substr(2, 9),
    userId: currentUser.id,
    name,
    phone,
    email,
    date,
    time,
    guests: guestCount,
    notes: notes || "",
    tableNum,
    status: "confirmed", // Automatically confirmed for visual joy of booking
    createdAt: new Date().toISOString()
  };

  db.reservations.push(newReservation);
  writeDb(db);

  res.status(201).json({
    message: "預約成功！雅庵全體同仁期待您的光臨。",
    reservation: newReservation
  });
});

// 3. Cancel Reservation
app.delete("/api/reservations/:id", authenticateUser, (req, res) => {
  const currentUser = (req as any).user;
  const { id } = req.params;

  const db = readDb();
  const resIndex = db.reservations.findIndex(r => r.id === id && r.userId === currentUser.id);

  if (resIndex === -1) {
    res.status(404).json({ error: "找不到該筆訂位紀錄" });
    return;
  }

  // Cancel reservation rather than physical delete, to make it look premium
  db.reservations[resIndex].status = "cancelled";
  writeDb(db);

  res.json({
    message: "訂位已成功取消。",
    reservation: db.reservations[resIndex]
  });
});

// --- VITE MIDDLEWARE SETUP FOR DEV/PROD ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
