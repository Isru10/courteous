import { z } from "zod"

// User validation schemas
export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["customer", "admin"]).default("customer"),
})

export const signUpSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(6),
})

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// Product validation schemas
export const productSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1),
  description: z.string().min(10),
  brand: z.string().min(1),
  country: z.string().min(1),
  price: z.number().positive(),
  images: z.array(z.string().url()).min(1),
  inventory: z.number().int().min(0),
  featured: z.boolean().default(false),
})

// Review validation schemas
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10).max(500),
  productId: z.string(),
})

// Order validation schemas
export const orderItemSchema = z.object({
  productId: z.string(),
  title: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().url(),
})

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  subtotal: z.number().positive(),
  total: z.number().positive(),
  status: z.enum(["pending", "paid", "on_route", "delivered", "cancelled"]).default("pending"),
})

export type User = z.infer<typeof userSchema>
export type SignUp = z.infer<typeof signUpSchema>
export type SignIn = z.infer<typeof signInSchema>
export type Product = z.infer<typeof productSchema>
export type Review = z.infer<typeof reviewSchema>
export type OrderItem = z.infer<typeof orderItemSchema>
export type Order = z.infer<typeof orderSchema>
