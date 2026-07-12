import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ChevronLeft,
  Ticket,
  Share2,
  Gift,
  TrendingUp,
                  className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyTicket}
                  className="flex-1 py-3 rounded-xl font-bold text-white transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)", boxShadow: "0 4px 15px rgba(14,159,110,0.3)" }}
                >
                  Confirm Purchase
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
