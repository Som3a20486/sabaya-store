"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const VISITOR_KEY = "sabaya_visitor_id";
const HEARTBEAT_INTERVAL = 10 * 1000;

export default function VisitorTracker() {
  useEffect(() => {
    let visitorId = localStorage.getItem(VISITOR_KEY);

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, visitorId);
    }

    const updateVisitor = async () => {
      try {
        const now = new Date().toISOString();

        const { error } = await supabase
          .from("site_visitors")
          .upsert(
            {
              visitor_id: visitorId,
              last_seen: now,
              created_at: now,
            },
            {
              onConflict: "visitor_id",
            }
          );

        if (error) {
          console.error(
            "Visitor tracking error:",
            error
          );
        }
      } catch (error) {
        console.error(
          "Visitor tracker error:",
          error
        );
      }
    };

    updateVisitor();

    const interval = setInterval(
      updateVisitor,
      HEARTBEAT_INTERVAL
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}