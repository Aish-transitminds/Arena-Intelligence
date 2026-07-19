import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Ticket,
  MapPin,
  CalendarDays,
  Clock,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  CreditCard
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getBookedTickets, bookTicket, type TicketItem } from "@/lib/bookingStore";

export const Route = createFileRoute("/fan/tickets")({
  head: () => ({
    meta: [
      { title: "My Tickets — Arena Intelligence" },
      { name: "description", content: "Manage, transfer, and view all your event tickets" },
    ],
  }),
  component: FanTicketsPage,
});

const UPCOMING_EVENTS = [
  {
    id: "evt-1",
    title: "Coldplay: Music of the Spheres",
    date: "August 22, 2026",
    time: "19:00 IST",
    venue: "Narendra Modi Stadium",
    price: 450,
    availableSeats: 1420,
    image: "https://images.unsplash.com/photo-1540039155733-d7696d4ebaf7?auto=format&fit=crop&q=80&w=1000",
    section: "A",
    row: "14",
  },
  {
    id: "evt-2",
    title: "FIFA World Cup Finals",
    date: "July 19, 2026",
    time: "20:30 IST",
    venue: "Narendra Modi Stadium",
    price: 850,
    availableSeats: 56,
    image: "https://images.unsplash.com/photo-1518605368461-1ee7c5332f7a?auto=format&fit=crop&q=80&w=1000",
    section: "VIP",
    row: "2",
  }
];

function FanTicketsPage() {
  const [activeTab, setActiveTab] = useState<"my-tickets" | "buy">("my-tickets");
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  
  // Purchase Flow State
  const [selectedEventId, setSelectedEventId] = useState(UPCOMING_EVENTS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    setTickets(getBookedTickets());
    const handleUpdate = () => setTickets(getBookedTickets());
    window.addEventListener("arena-tickets-updated", handleUpdate);
    return () => window.removeEventListener("arena-tickets-updated", handleUpdate);
  }, []);

  const selectedEvent = UPCOMING_EVENTS.find(e => e.id === selectedEventId)!;
  const totalPrice = selectedEvent.price * quantity;

  const handlePurchase = () => {
    setIsPurchasing(true);
    // Simulate network request
    setTimeout(() => {
      bookTicket({
        event: selectedEvent.title,
        date: selectedEvent.date,
        time: selectedEvent.time,
        venue: selectedEvent.venue,
        section: selectedEvent.section,
        row: selectedEvent.row,
        seat: String(Math.floor(Math.random() * 100)),
        price: selectedEvent.price,
      }, quantity);
      
      setIsPurchasing(false);
      setPurchaseSuccess(true);
      
      setTimeout(() => {
        setPurchaseSuccess(false);
        setActiveTab("my-tickets");
        setQuantity(1);
      }, 2000);
    }, 1500);
  };

  return (
    <AppShell themeVariant="fan" title="My Tickets" subtitle="Manage and purchase event passes">
      <div className="max-w-4xl mx-auto pb-24">
        
        {/* Tabs */}
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-8 backdrop-blur-md border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab("my-tickets")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "my-tickets" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <Ticket className="size-4" />
            My Tickets
          </button>
          <button
            onClick={() => setActiveTab("buy")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "buy" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="size-4" />
            Buy Tickets
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "my-tickets" ? (
            <motion.div
              key="my-tickets"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {tickets.length === 0 ? (
                <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-white/20 bg-white/5">
                  <Ticket className="size-16 text-slate-600 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold text-white mb-2">You have not booked any tickets yet.</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-8">
                    Ready for the next big match? Browse our upcoming events and secure your seats today.
                  </p>
                  <button
                    onClick={() => setActiveTab("buy")}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tickets.map((tkt) => (
                    <div key={tkt.id} className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 shadow-2xl group flex flex-col h-full">
                      <div className="p-6 border-b border-white/10 relative overflow-hidden flex-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-xs font-bold text-primary tracking-widest uppercase mb-1">
                                {tkt.ticketType}
                              </p>
                              <h3 className="text-xl font-black text-white">{tkt.event}</h3>
                            </div>
                            <QRCodeSVG value={tkt.qrCode} size={64} className="bg-white p-1 rounded-lg shadow-sm" />
                          </div>
                          
                          <div className="space-y-2 mt-6">
                            <div className="flex items-center gap-3 text-slate-300 text-sm">
                              <CalendarDays className="size-4 text-emerald-400" />
                              <span>{tkt.date}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300 text-sm">
                              <Clock className="size-4 text-emerald-400" />
                              <span>{tkt.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300 text-sm">
                              <MapPin className="size-4 text-emerald-400" />
                              <span>{tkt.venue}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-950 p-6 flex justify-between items-center relative">
                        {/* Ticket notches */}
                        <div className="absolute -top-3 -left-3 size-6 rounded-full bg-[#0B1A23] border border-white/10" />
                        <div className="absolute -top-3 -right-3 size-6 rounded-full bg-[#0B1A23] border border-white/10" />
                        
                        <div className="grid grid-cols-3 gap-6 w-full text-center">
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Section</p>
                            <p className="text-lg font-black text-white">{tkt.section}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Row</p>
                            <p className="text-lg font-black text-white">{tkt.row}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Seat</p>
                            <p className="text-lg font-black text-primary">{tkt.seat}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="buy"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Event Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4">Select an Event</h3>
                  {UPCOMING_EVENTS.map((event) => (
                    <div 
                      key={event.id}
                      onClick={() => setSelectedEventId(event.id)}
                      className={`cursor-pointer rounded-3xl p-3 flex gap-4 transition-all duration-300 border-2 ${
                        selectedEventId === event.id 
                          ? "bg-slate-900 border-primary shadow-[0_0_30px_rgba(16,185,129,0.15)]" 
                          : "bg-slate-900/40 border-white/5 hover:bg-slate-900/80 hover:border-white/10"
                      }`}
                    >
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        {selectedEventId === event.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[2px]">
                            <CheckCircle2 className="size-8 text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>
                      <div className="py-2 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-white text-lg leading-tight mb-1">{event.title}</h4>
                          <p className="text-sm text-slate-400 flex items-center gap-1"><CalendarDays className="size-3" /> {event.date} • {event.time}</p>
                          <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="size-3" /> {event.venue}</p>
                        </div>
                        <div className="font-black text-primary">${event.price} <span className="text-xs text-slate-500 font-medium">/ ticket</span></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Panel */}
                <div className="bg-slate-900 rounded-3xl border border-white/10 p-8 shadow-2xl h-fit sticky top-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="size-5 text-primary" />
                    Checkout Details
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-slate-400 mb-2">Selected Event</p>
                      <p className="text-lg font-bold text-white">{selectedEvent.title}</p>
                      <p className="text-sm text-slate-500 mt-1">{selectedEvent.date} at {selectedEvent.time}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-b border-white/10 py-6">
                      <div>
                        <p className="text-sm font-semibold text-slate-400 mb-1">Quantity</p>
                        <p className="text-xs text-slate-500">{selectedEvent.availableSeats} seats left</p>
                      </div>
                      <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-xl border border-white/5">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="size-8 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                          disabled={quantity <= 1 || isPurchasing}
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="font-black text-white w-4 text-center">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="size-8 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                          disabled={quantity >= 10 || isPurchasing}
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-slate-300">Total Price</p>
                      <p className="text-3xl font-black text-white">${totalPrice}</p>
                    </div>

                    <button
                      onClick={handlePurchase}
                      disabled={isPurchasing || purchaseSuccess}
                      className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-80"
                    >
                      {purchaseSuccess ? (
                        <>
                          <CheckCircle2 className="size-5" /> Payment Successful!
                        </>
                      ) : isPurchasing ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Pay ${totalPrice}</>
                      )}
                    </button>
                    
                    <p className="text-xs text-center text-slate-500 flex items-center justify-center gap-1">
                      <Lock className="size-3" /> Secure 256-bit encrypted transaction
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
