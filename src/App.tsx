import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Plus,
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  PieChart,
  Settings,
  Moon,
  Sun,
  Trash2,
  TrendingUp,
  X,
  User,
  History as HistoryIcon,
  ShoppingCart,
  Clock,
  ChevronRight,
  AlertCircle,
  PiggyBank,
  Zap,
  Target,
  Bell,
  Calendar as CalendarIcon,
  ChevronDown,
  CreditCard,
  Layers,
  Sparkles,
  CheckCircle2,
  Filter,
  ArrowRightLeft,
  Search,
  MoreVertical,
  Activity,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

/** * WEALTHFLOW VERCEL DEPLOYMENT CONFIG (DARK ONLY)
 * API: Bun + Elysia
 * Styling: Tailwind CSS 3 Compatible
 * Theme: Permanent Dark
 * Fix: DatePicker Library Loading via CDN
 */

const API_BASE = "https://api-bun-elysia.vercel.app";

// --- Global Styles Hook ---
const useArchitecturalStyles = () => {
  useEffect(() => {
    // Inject Fonts
    if (!document.getElementById("wf-font-import")) {
      const link = document.createElement("link");
      link.id = "wf-font-import";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Kanit:wght@200;300;400;500;600;700&display=swap";
      document.head.appendChild(link);
    }

    // Inject Flatpickr CSS
    if (!document.getElementById("flatpickr-css")) {
      const flink = document.createElement("link");
      flink.id = "flatpickr-css";
      flink.rel = "stylesheet";
      flink.href =
        "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
      document.head.appendChild(flink);
    }

    const style = document.createElement("style");
    style.id = "wf-core-styles";
    style.innerHTML = `
      body {
        font-family: 'Plus Jakarta Sans', 'Kanit', sans-serif;
        background-color: #020617; /* Deep Navy Black */
        color: #f1f5f9;
        margin: 0;
        overflow-x: hidden;
      }

      .surface-glass {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .premium-shadow {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }

      .active-nav-glow {
        background: #4f46e5;
        box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
      }

      input, select, button { outline: none !important; border: none !important; }
      
      input[type=number]::-webkit-inner-spin-button, 
      input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
      }

      /* Flatpickr Dark Theme Fixes */
      .flatpickr-calendar { 
        z-index: 100000 !important; 
        background: #0f172a !important;
        color: #f1f5f9 !important;
        border-radius: 20px !important; 
        border: 1px solid rgba(255,255,255,0.1) !important; 
        box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important; 
        font-family: 'Kanit', sans-serif !important;
        margin-top: 10px !important;
      }
      .flatpickr-day { color: #94a3b8 !important; }
      .flatpickr-day.selected { background: #4f46e5 !important; border-color: #4f46e5 !important; color: white !important; }
      .flatpickr-day:hover { background: #1e293b !important; }
      .flatpickr-month, .flatpickr-weekday { color: #f1f5f9 !important; fill: #f1f5f9 !important; }
      .flatpickr-current-month .flatpickr-monthDropdown-months { background: #0f172a !important; }
      .flatpickr-calendar:before, .flatpickr-calendar:after { display: none !important; }
      
      /* Hide the original flatpickr input when using altInput */
      input.flatpickr-input:not(.flatpickr-alt-input) { display: none !important; }

      .toast-container {
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 100001;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .hero-card-surface {
        background-color: #1e1b4b;
        background-image: 
          radial-gradient(at 0% 0%, #312e81 0, transparent 50%), 
          radial-gradient(at 100% 100%, #1e1b4b 0, transparent 50%);
        position: relative;
        overflow: hidden;
      }

       .text-gradient {
        background: linear-gradient(to right, #818cf8, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById("wf-core-styles")?.remove();
  }, []);
};

// --- Toast Component ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = type === "success" ? "bg-emerald-500" : "bg-rose-500";
  const Icon = type === "success" ? Check : AlertCircle;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`${bgClass} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px]`}
    >
      <div className="bg-white/20 p-1.5 rounded-xl">
        <Icon size={18} />
      </div>
      <p className="font-bold text-sm tracking-wide">{message}</p>
    </motion.div>
  );
};

// --- Sub-components ---
const Badge = ({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "success" | "danger" | "warning" }) => {
  const styles = {
    primary: "bg-indigo-500/10 text-indigo-400",
    success: "bg-emerald-500/10 text-emerald-400",
    danger: "bg-rose-500/10 text-rose-400",
    warning: "bg-amber-500/10 text-amber-400",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const TransactionItem = ({ tx, onDelete }) => {
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  const date = new Date(tx.date);
  const formattedDate = !isNaN(date.getTime())
    ? `${date.getDate()} ${months[date.getMonth()]}`
    : "--";

  const catMap = {
    อาหาร: { icon: "🍔", color: "bg-orange-500/10 text-orange-400" },
    เดินทาง: { icon: "🚗", color: "bg-blue-500/10 text-blue-400" },
    ช้อปปิ้ง: { icon: "🛍️", color: "bg-pink-500/10 text-pink-400" },
    เงินเก็บ: { icon: "🏦", color: "bg-indigo-500/10 text-indigo-400" },
    รายได้เสริม: { icon: "💰", color: "bg-emerald-500/10 text-emerald-400" },
    "การยืม/ผ่อน": { icon: "💳", color: "bg-slate-500/10 text-slate-400" },
  };

  const info = catMap[tx.category] || {
    icon: "💸",
    color: "bg-slate-500/10 text-slate-400",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="surface-glass p-4 rounded-[1.5rem] flex items-center justify-between group transition-all hover:bg-slate-900 border border-transparent hover:border-slate-800"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${info.color}`}
        >
          {info.icon}
        </div>
        <div>
          <p className="font-bold text-slate-100 text-sm leading-tight">
            {tx.note || tx.category}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {formattedDate}
            </span>
            <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
              {tx.category}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p
          className={`text-base font-bold tracking-tight ${tx.type === "income" ? "text-emerald-400" : "text-rose-400"}`}
        >
          {tx.type === "income" ? "+" : "-"} ฿
          {(Number(tx.amount) || 0).toLocaleString()}
        </p>
        <button
          onClick={() => onDelete(tx.id)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-950/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};

// --- Main App ---
export default function App() {
  useArchitecturalStyles();
  const dateInputRef = useRef(null);
  const fpRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState("transaction");
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [commitments, setCommitments] = useState([]);

  const [newTx, setNewTx] = useState({
    amount: "",
    type: "expense",
    category: "อาหาร",
    date: new Date().toISOString().split("T")[0],
    note: "",
    commitmentId: "",
  });

  const [newCm, setNewCm] = useState({
    title: "",
    targetAmount: "",
    type: "lend",
    person: "",
    category: "การยืม/ผ่อน",
  });

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Data Refresh
  const refreshData = useCallback(async () => {
    try {
      const userRes = await fetch(`${API_BASE}/bank-api/users/me`);
      const userData = await userRes.json();
      setCurrentUser(userData);

      const txRes = await fetch(`${API_BASE}/bank-api/transactions/all`);
      const txData = await txRes.json();
      setTransactions(Array.isArray(txData) ? txData : []);

      if (userData.person_code) {
        const cmRes = await fetch(
          `${API_BASE}/bank-api/commitments/${userData.person_code}`,
        );
        const cmData = await cmRes.json();
        setCommitments(Array.isArray(cmData) ? cmData : []);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("API Error:", err);
      setIsLoading(false);
      addToast("เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว", "error");
    }
  }, []);

  // Load Flatpickr Script from CDN
  useEffect(() => {
    if (!window.flatpickr) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/flatpickr";
      script.async = true;
      script.onload = () => {
        // Load Thai translation after main script
        const langScript = document.createElement("script");
        langScript.src =
          "https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/th.js";
        langScript.async = true;
        document.head.appendChild(langScript);
      };
      document.head.appendChild(script);
    }
    refreshData();
  }, [refreshData]);

  // Date Picker Init
  useEffect(() => {
    if (showAddModal && modalType === "transaction") {
      const initTimer = setTimeout(() => {
        if (window.flatpickr && dateInputRef.current) {
          if (fpRef.current) fpRef.current.destroy();
          // Access Thai locale via window if loaded
          const locale = window.flatpickr.l10ns?.th || "default";

          fpRef.current = window.flatpickr(dateInputRef.current, {
            locale: locale,
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "j F Y",
            defaultDate: newTx.date,
            disableMobile: true,
            onChange: (_, ds) => setNewTx((p) => ({ ...p, date: ds })),
          });
        }
      }, 400); // Wait for modal animation
      return () => {
        clearTimeout(initTimer);
        if (fpRef.current) fpRef.current.destroy();
      };
    }
  }, [showAddModal, modalType]);

  // Actions
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!newTx.amount) return;
    try {
      const res = await fetch(`${API_BASE}/bank-api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTx, amount: parseFloat(newTx.amount) }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewTx({
          amount: "",
          type: "expense",
          category: "อาหาร",
          date: new Date().toISOString().split("T")[0],
          note: "",
          commitmentId: "",
        });
        addToast("บันทึกรายการสำเร็จ");
        refreshData();
      } else {
        addToast("ไม่สามารถบันทึกรายการได้", "error");
      }
    } catch (err) {
      addToast("เกิดข้อผิดพลาดทางระบบ", "error");
    }
  };

  const handleAddCommitment = async (e) => {
    e.preventDefault();
    if (!newCm.targetAmount || !currentUser) return;
    try {
      const res = await fetch(`${API_BASE}/bank-api/commitments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCm,
          person_code: currentUser.person_code,
          targetAmount: parseFloat(newCm.targetAmount),
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewCm({
          title: "",
          targetAmount: "",
          type: "lend",
          person: "",
          category: "การยืม/ผ่อน",
        });
        addToast("สร้างรายการติดตามสำเร็จ");
        refreshData();
      } else {
        addToast("ไม่สามารถสร้างรายการได้", "error");
      }
    } catch (err) {
      addToast("เกิดข้อผิดพลาดทางระบบ", "error");
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("คุณต้องการลบธุรกรรมนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`${API_BASE}/bank-api/transactions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        addToast("ลบรายการสำเร็จ");
        refreshData();
      } else {
        addToast("ไม่สามารถลบรายการได้", "error");
      }
    } catch (err) {
      addToast("เกิดข้อผิดพลาดทางระบบ", "error");
    }
  };

  const deleteCommitment = async (id) => {
    if (
      !window.confirm("ยืนยันลบรายการติดตาม? ยอดที่เหลือจะถูกปรับปรุงเข้าบัญชี")
    )
      return;
    try {
      const res = await fetch(
        `${API_BASE}/bank-api/commitments/${currentUser.person_code}/${id}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        addToast("ลบรายการติดตามสำเร็จ");
        refreshData();
      } else {
        addToast("ไม่สามารถลบรายการได้", "error");
      }
    } catch (err) {
      addToast("เกิดข้อผิดพลาดทางระบบ", "error");
    }
  };

  const stats = useMemo(() => {
    const inc = transactions
      .filter((t) => t.type === "income")
      .reduce((s, c) => s + (Number(c.amount) || 0), 0);
    const exp = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, c) => s + (Number(c.amount) || 0), 0);
    const sav = transactions
      .filter((t) => t.category === "เงินเก็บ")
      .reduce((s, c) => s + (Number(c.amount) || 0), 0);
    return { inc, exp, sav };
  }, [transactions]);

  const chartData = useMemo(() => {
    const days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      })
      .reverse();
    return days.map((date) => {
      const dayVal = transactions
        .filter((t) => t.date === date)
        .reduce(
          (a, c) =>
            a + (c.type === "income" ? Number(c.amount) : -Number(c.amount)),
          0,
        );
      return { name: date.split("-")[2], val: dayVal };
    });
  }, [transactions]);

  if (isLoading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-indigo-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-current border-t-transparent rounded-full mb-8"
        />
        <span className="text-slate-500 font-bold text-xs animate-pulse tracking-[0.2em] uppercase">
          กำลังเตรียมระบบ...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      {/* Toast System */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              message={t.message}
              type={t.type}
              onClose={() => removeToast(t.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex min-h-screen transition-colors duration-500">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-24 xl:w-72 h-screen fixed border-r border-white/5 bg-slate-800/40 backdrop-blur-2xl z-50">
          <div className="p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-indigo-600/20 glow-on-hover transition-all">
              <Activity size={24} className="text-white" />
            </div>
            <div className="hidden xl:block">
              <span className="font-black text-2xl tracking-tighter block leading-none">
                Flow.
              </span>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                Finance OS
              </span>
            </div>
          </div>

          <nav className="flex-1 px-6 space-y-2 mt-12">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "หน้าแรก" },
              { id: "history", icon: PieChart, label: "วิเคราะห์" },
              { id: "commitments", icon: Clock, label: "ติดตามยอด" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative group ${activeTab === item.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}
              >
                <item.icon
                  size={20}
                  className={
                    activeTab === item.id
                      ? "text-white"
                      : "group-hover:text-indigo-400"
                  }
                />
                <span className="hidden xl:block font-bold text-sm tracking-tight">
                  {item.label}
                </span>
                {activeTab === item.id && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -right-6 w-1 h-8 bg-indigo-500 rounded-full blur-sm"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="p-8 hidden xl:block">
            <div className="p-5 rounded-3xl bg-indigo-600/5 border border-indigo-500/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center">
                <User size={18} className="text-slate-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1">
                  Active Wallet
                </p>
                <p className="text-sm font-bold truncate text-slate-200">
                  {currentUser?.person_code}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Workspace */}
        <main className="flex-1 lg:ml-72 p-6 lg:p-12 pb-36 mx-auto w-full">
          <header className="flex items-center justify-between mb-12 px-2">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-gradient">
                สวัสดี, User 👋
              </h2>
              <p className="flex gap-2 text-slate-500 text-sm font-medium mt-1">
                วันนี้คุณใช้จ่ายไปเท่าไหร่แล้ว?
              </p>
            </div>
            <div className="gap-4 hidden md:flex items-center">
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                  สถานะระบบ: ปกติ
                </p>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dash"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                  {/* HERO CARD */}
                  <div className="xl:col-span-8">
                    <div className="hero-card-surface rounded-[2.5rem] p-8 sm:p-12 min-h-[340px] md:min-h-[430px] flex flex-col justify-between shadow-2xl premium-shadow ring-1 ring-white/10">
                      <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                          backgroundImage:
                            "radial-gradient(white 1.5px, transparent 0)",
                          backgroundSize: "32px 32px",
                        }}
                      ></div>

                      <div className="relative z-10 ">
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex items-center gap-3 text-white/50 font-bold uppercase tracking-[0.4em] text-[10px] leading-none">
                            <Wallet size={14} /> ยอดเงินที่ใช้ได้
                          </div>
                          <div className="bg-white/5 backdrop-blur-md ring-1 ring-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-inner">
                            <PiggyBank size={18} className="text-indigo-400" />
                            <span className="text-xs font-bold text-white/90 leading-none">
                              เงินเก็บ: ฿{stats.sav.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-end md:items-baseline gap-2 md:gap-4 mt-4">
                          <span className="text-5xl font-light text-white/40 leading-none">
                            ฿
                          </span>
                          <h1 className="text-6xl md:text-7xl sm:text-[8rem] font-black text-white tracking-tighter leading-none select-none">
                            {(
                              Number(currentUser?.balance) || 0
                            ).toLocaleString()}
                          </h1>
                        </div>
                      </div>

                      <div className="relative z-10 flex flex-wrap gap-4">
                        <button
                          onClick={() => {
                            setModalType("transaction");
                            setShowAddModal(true);
                          }}
                          className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95 flex items-center justify-center"
                        >
                          <Plus size={16} />
                          <span className="hidden md:inline ml-2">บันทึกรายการ.</span>
                        </button>
                        <button
                          onClick={() => {
                            setModalType("commitment");
                            setShowAddModal(true);
                          }}
                          className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center"
                        >
                          <Clock size={16} />
                          <span className="hidden md:inline ml-2">สร้างรายการติดตาม</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SUMMARY */}
                  <div className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
                    <div className="surface-glass rounded-[2rem] p-8 group transition-all border-white/5 hover:border-emerald-500/20">
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                          <ArrowUpRight size={22} strokeWidth={3} />
                        </div>
                        <Badge variant="success">รายรับ</Badge>
                      </div>
                      <h3 className="text-4xl font-black text-white tracking-tighter leading-none">
                        ฿{stats.inc.toLocaleString()}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">
                        สะสมทั้งหมด
                      </p>
                    </div>
                    <div className="surface-glass rounded-[2rem] p-8 group transition-all border-white/5 hover:border-rose-500/20">
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400">
                          <ArrowDownLeft size={22} strokeWidth={3} />
                        </div>
                        <Badge variant="danger">รายจ่าย</Badge>
                      </div>
                      <h3 className="text-4xl font-black text-white tracking-tighter leading-none">
                        ฿{stats.exp.toLocaleString()}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">
                        ใช้จ่ายทั้งหมด
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 surface-glass  rounded-[3rem] p-8">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="font-black text-lg flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                          <TrendingUp size={18} />
                        </div>
                        แนวโน้ม 7 วันล่าสุด
                      </h3>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>{" "}
                          รายจ่าย
                        </span>
                      </div>
                    </div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={transactions.slice(-7)}>
                          <defs>
                            <linearGradient
                              id="colorVal"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#6366f1"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="#6366f1"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#1e293b"
                            vertical={false}
                            opacity={0.5}
                          />
                          <XAxis dataKey="date" hide />
                          <YAxis hide />
                          <Tooltip
                            contentStyle={{
                              background: "#0f172a",
                              border: "1px solid #1e293b",
                              borderRadius: "16px",
                              fontSize: "12px",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                            }}
                            itemStyle={{ color: "#818cf8", fontWeight: "800" }}
                            cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#6366f1"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorVal)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="lg:col-span-2 surface-glass rounded-[3rem] p-8 h-full">
                      <h3 className="font-black text-lg mb-6 flex items-center justify-between">
                        <span>รายการล่าสุด</span>
                        <button
                          onClick={() => setActiveTab("history")}
                          className="text-[10px] text-indigo-400 font-black uppercase tracking-widest p-2 hover:bg-indigo-500/10 rounded-xl transition-all"
                        >
                          View All
                        </button>
                      </h3>
                      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[300px]">
                        {transactions.length > 0 ? (
                          transactions
                            .slice(-5)
                            .reverse()
                            .map((tx) => (
                              <TransactionItem
                                key={tx.id}
                                tx={tx}
                                onDelete={() => {}}
                              />
                            ))
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3 py-12">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-500 flex items-center justify-center">
                              <HistoryIcon size={24} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                              ไม่มีข้อมูลรายการ
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                key="hist"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    ประวัติธุรกรรมทั้งหมด
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {transactions.map((tx) => (
                    <TransactionItem
                      key={tx.id}
                      tx={tx}
                      onDelete={deleteTransaction}
                    />
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-40 surface-glass rounded-[2.5rem] border-dashed border-2 border-slate-800">
                      <HistoryIcon
                        size={48}
                        className="mx-auto text-slate-700 mb-6"
                      />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                        ไม่พบรายการประวัติ
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "commitments" && (
              <motion.div
                key="comm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    รายการติดตามการเงิน
                  </h3>
                  <button
                    onClick={() => {
                      setModalType("commitment");
                      setShowAddModal(true);
                    }}
                    className="w-11 h-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-indigo-500/40 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {commitments.map((cm) => {
                    const progress = Math.min(
                      100,
                      (Number(cm.currentAmount || 0) /
                        Number(cm.targetAmount)) *
                        100,
                    );
                    return (
                      <div
                        key={cm.id}
                        className="surface-glass rounded-[2rem] p-10 relative group hover:bg-slate-900 border-white/5 hover:border-indigo-500/20 transition-all"
                      >
                        <button
                          onClick={() => deleteCommitment(cm.id)}
                          className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="flex justify-between items-start mb-10 leading-none">
                          <div className="flex gap-5">
                            <div
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${cm.type === "lend" ? "bg-purple-500/10 text-purple-500" : "bg-indigo-500/10 text-indigo-400"}`}
                            >
                              {cm.type === "lend" ? (
                                <User size={26} />
                              ) : (
                                <ShoppingCart size={26} />
                              )}
                            </div>
                            <div>
                              <h4 className="font-black text-xl tracking-tight mb-2 leading-none text-white">
                                {cm.title}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                                @{cm.person || "บุคคลทั่วไป"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 leading-none">
                              ยอดค้าง
                            </p>
                            <p className="text-2xl font-black text-indigo-400 tracking-tighter leading-none">
                              ฿
                              {(
                                Number(cm.targetAmount) -
                                Number(cm.currentAmount || 0)
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>ชำระแล้ว {Math.round(progress)}%</span>
                            <span>
                              ยอดเป้าหมาย: ฿
                              {Number(cm.targetAmount).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setNewTx((p) => ({
                              ...p,
                              type: cm.type === "lend" ? "income" : "expense",
                              commitmentId: cm.id,
                              note: `ชำระ: ${cm.title}`,
                              category: "การยืม/ผ่อน",
                            }));
                            setModalType("transaction");
                            setShowAddModal(true);
                          }}
                          className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] mt-8 tracking-[0.2em] uppercase shadow-lg hover:bg-indigo-500 active:scale-95 transition-all"
                        >
                          บันทึกการชำระเงิน
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Mobile Dock */}
        {/* Modern Floating Navigation (Mobile) */}
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[80%] lg:hidden h-20 bg-[#0f172a]/80 backdrop-blur-2xl rounded-3xl z-50 flex items-center justify-around px-8 ring-1 ring-white/10 shadow-2xl">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`p-3.5 rounded-2xl transition-all ${activeTab === "dashboard" ? "text-indigo-400 bg-indigo-400/10" : "text-slate-500"}`}
          >
            <LayoutDashboard size={22} />
          </button>

          <button
            onClick={() => {
              setModalType("transaction");
              setShowAddModal(true);
            }}
            className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white -mt-14 shadow-2xl shadow-indigo-600/40 border-4 border-[#020617] active:scale-90 transition-all"
          >
            <Plus size={28} strokeWidth={3} />
          </button>

          <button
            onClick={() => setActiveTab("commitments")}
            className={`p-3.5 rounded-2xl transition-all ${activeTab === "commitments" ? "text-indigo-400 bg-indigo-400/10" : "text-slate-500"}`}
          >
            <Clock size={22} />
          </button>
        </nav>
      </div>

      {/* Modal Interface */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-[#0f172a] w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl p-10 sm:p-14 relative max-h-[96vh] overflow-y-auto border border-white/5"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-10 right-10 w-11 h-11 flex items-center justify-center bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-12">
                <h2 className="text-3xl font-black tracking-tighter  text-white leading-tigh">
                  {modalType === "transaction" ? "บันทึกรายการ" : "ติดตามยอด"}
                </h2>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">
                  กรอกข้อมูลให้ครบถ้วน
                </p>
              </div>

              <form
                onSubmit={
                  modalType === "transaction"
                    ? handleAddTransaction
                    : handleAddCommitment
                }
                className="space-y-10"
              >
                <div className="flex p-1.5 bg-slate-900 rounded-2xl ring-1 ring-white/10">
                  {(modalType === "transaction"
                    ? ["expense", "income"]
                    : ["lend", "installment"]
                  ).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        modalType === "transaction"
                          ? setNewTx((p) => ({ ...p, type: t }))
                          : setNewCm((p) => ({ ...p, type: t }))
                      }
                      className={`flex-1 py-4 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all leading-none ${(modalType === "transaction" ? newTx.type : newCm.type) === t ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {t === "expense"
                        ? "รายจ่าย"
                        : t === "income"
                          ? "รายรับ"
                          : t === "lend"
                            ? "ให้ยืม"
                            : "ผ่อนชำระ"}
                    </button>
                  ))}
                </div>

                <div className="text-center py-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] block mb-4 leading-none">
                    จำนวนเงิน (บาท)
                  </label>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-4xl font-light text-indigo-500/30 leading-none">
                      ฿
                    </span>
                    <input
                      type="number"
                      step="any"
                      required
                      autoFocus
                      value={
                        modalType === "transaction"
                          ? newTx.amount
                          : newCm.targetAmount
                      }
                      onChange={(e) =>
                        modalType === "transaction"
                          ? setNewTx((p) => ({ ...p, amount: e.target.value }))
                          : setNewCm((p) => ({
                              ...p,
                              targetAmount: e.target.value,
                            }))
                      }
                      className="w-full bg-transparent text-7xl font-black text-center text-white tracking-tighter placeholder:text-slate-800 leading-none rounded-2xl"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {modalType === "transaction" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-3">
                      <label className="text-[10px] font-black text-slate-500 ml-4 uppercase tracking-widest leading-none">
                        หมวดหมู่
                      </label>
                      <div className="relative leading-none">
                        <select
                          value={newTx.category}
                          onChange={(e) =>
                            setNewTx((p) => ({
                              ...p,
                              category: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900  p-4.5 rounded-2xl font-bold text-white appearance-none cursor-pointer ring-1 ring-white/10 focus:border-indigo-500 transition-colors"
                        >
                          <option>อาหาร</option>
                          <option>เดินทาง</option>
                          <option>ช้อปปิ้ง</option>
                          <option>เงินเก็บ</option>
                          <option>รายได้เสริม</option>
                          <option>การยืม/ผ่อน</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <label className="text-[10px] font-black text-slate-500 ml-4 uppercase tracking-widest leading-none">
                        วันที่
                      </label>
                      <input
                        ref={dateInputRef}
                        type="text"
                        className="w-full bg-slate-900 p-4 rounded-2xl font-bold text-white outline-none cursor-pointer leading-none ring-1 ring-white/10 focus:border-indigo-500 transition-colors"
                        placeholder="เลือกวันที่..."
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {modalType === "commitment" && (
                  <div className="flex flex-col space-y-3">
                    <label className="text-[10px] font-black text-slate-500 ml-4 uppercase tracking-widest leading-none">
                      บุคคล / บัญชีที่เกี่ยวข้อง
                    </label>
                    <input
                      type="text"
                      value={newCm.person}
                      onChange={(e) =>
                        setNewCm((p) => ({ ...p, person: e.target.value }))
                      }
                      className="w-full bg-slate-900 p-4 rounded-2xl font-bold text-white leading-none placeholder:text-slate-700 ring-1 ring-white/10 focus:border-indigo-500 transition-colors"
                      placeholder="ชื่อคนหรือแหล่งที่มา..."
                    />
                  </div>
                )}

                <div className="flex flex-col space-y-3">
                  <label className="text-[10px] font-black text-slate-500 ml-4 uppercase tracking-widest leading-none">
                    หมายเหตุ / คำอธิบาย
                  </label>
                  <input
                    type="text"
                    value={
                      modalType === "transaction" ? newTx.note : newCm.title
                    }
                    onChange={(e) =>
                      modalType === "transaction"
                        ? setNewTx((p) => ({ ...p, note: e.target.value }))
                        : setNewCm((p) => ({ ...p, title: e.target.value }))
                    }
                    className="w-full bg-slate-900 p-4 rounded-2xl font-bold text-white leading-none placeholder:text-slate-700 ring-1 ring-white/10 outline-none transition-colors"
                    placeholder="ระบุรายละเอียด..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-7 bg-indigo-600 text-white text-xl font-black rounded-[2rem] mt-6 shadow-2xl hover:bg-indigo-500 active:scale-[0.98] transition-all uppercase tracking-widest leading-none shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                >
                  ยืนยันทำรายการ.
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
