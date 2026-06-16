export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Reservation {
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

export type ViewState = "home" | "book" | "my-reservations" | "login" | "register";
