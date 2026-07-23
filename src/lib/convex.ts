import { ConvexReactClient } from "convex/react";
import { CONVEX_URL } from "@/config/convex";

export const isConvexConfigured = CONVEX_URL.trim().length > 0;

export const convexClient = isConvexConfigured
  ? new ConvexReactClient(CONVEX_URL)
  : null;
