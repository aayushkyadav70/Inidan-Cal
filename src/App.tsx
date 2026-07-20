import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Download,
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Plus, 
  Trash2, 
  X, 
  Upload, 
  Sparkles, 
  Info,
  Check,
  Droplet,
  Scale,
  Dumbbell,
  Share2,
  Instagram,
  MapPin,
  Sun,
  Moon,
  WifiOff,
  Smartphone,
  Laptop,
  Globe,
  ChevronDown,
  Copy,
  Terminal
} from 'lucide-react';
import { CalorieGoals, FoodEntry, FoodAnalysisResult } from './types';
import { INDIAN_FOOD_DB, DBFoodItem, parseDescriptionToLocalMatch, ParsedMatch } from './foodDatabase';

// Helper to get fully qualified API URL in Native / Hybrid App environments
const getApiUrl = (endpoint: string): string => {
  const isNative = typeof window !== 'undefined' && (
    (window as any).Capacitor ||
    window.location.protocol === 'file:' ||
    window.location.origin.startsWith('capacitor://') ||
    window.location.origin.startsWith('http://localhost:80')
  );

  if (isNative) {
    const DEPLOY_SERVER = "https://ais-pre-52i4vh4kawbh4cskvpphw2-638346396264.asia-southeast1.run.app";
    return `${DEPLOY_SERVER}${endpoint}`;
  }
  return endpoint;
};

// AI Scan Limit Helpers
const getAiScanCountForToday = (): number => {
  const stored = localStorage.getItem('ai_scan_history');
  if (!stored) return 0;
  try {
    const dates: string[] = JSON.parse(stored);
    const todayStr = new Date().toDateString();
    return dates.filter(d => d === todayStr).length;
  } catch (e) {
    return 0;
  }
};

const incrementAiScanCount = () => {
  const stored = localStorage.getItem('ai_scan_history');
  let dates: string[] = [];
  if (stored) {
    try { dates = JSON.parse(stored); } catch (e) {}
  }
  const todayStr = new Date().toDateString();
  dates.push(todayStr);
  if (dates.length > 50) dates = dates.slice(-50);
  localStorage.setItem('ai_scan_history', JSON.stringify(dates));
};

const DEFAULT_GOALS: CalorieGoals = { calories: 2000, protein: 120, carbs: 250, fat: 65 };

const AVATARS = [
  { id: 'muscle_rohit', name: 'Muscle Rohit', emoji: '💪', title: 'Gym Bro', desc: 'Protein champion' },
  { id: 'yoga_priya', name: 'Yoga Priya', emoji: '🧘', title: 'Yoga Queen', desc: 'Mindful macros' },
  { id: 'keto_kiran', name: 'Keto Kiran', emoji: '🍳', title: 'Low-Carb Star', desc: 'Precision tracker' },
  { id: 'athlete_arjun', name: 'Athlete Arjun', emoji: '⚡', title: 'Cardio King', desc: 'Deficit speedster' },
];

const CHEAT_FOODS = [
  { id: 'vada_pav', name: 'Vada Pav (1 pc)', emoji: '🥯', cal: 300, protein: 5, carbs: 42, fat: 12, burnTime: '50 mins of local train power-walk' },
  { id: 'misal_pav', name: 'Misal Pav (1 plate)', emoji: '🍲', cal: 450, protein: 12, carbs: 55, fat: 20, burnTime: '65 mins of cycling Marine Drive' },
  { id: 'pav_bhaji', name: 'Pav Bhaji (1 plate)', emoji: '🍛', cal: 600, protein: 11, carbs: 70, fat: 28, burnTime: '85 mins of intense Garba' },
  { id: 'sev_puri', name: 'Sev Puri (6 pcs)', emoji: '🧆', cal: 240, protein: 4, carbs: 36, fat: 8, burnTime: '35 mins of jogging Juhu Beach' },
  { id: 'bhel_puri', name: 'Bhel Puri (1 plate)', emoji: '🥗', cal: 210, protein: 4, carbs: 38, fat: 5, burnTime: '30 mins of Suryanamaskar' },
  { id: 'samosa', name: 'Samosa (1 pc)', emoji: '🥟', cal: 308, protein: 5, carbs: 32, fat: 18, burnTime: '45 mins of Bhangra' },
  { id: 'chole_bhature', name: 'Chole Bhature (2 pcs)', emoji: '🍲', cal: 650, protein: 12, carbs: 75, fat: 34, burnTime: '90 mins of heavy Gym pump' },
  { id: 'panipuri', name: 'Pani Puri (6 pcs)', emoji: '🧆', cal: 180, protein: 3, carbs: 28, fat: 6, burnTime: '25 mins of Juhu Beach stroll' },
  { id: 'butter_chicken', name: 'Butter Chicken (1 plate)', emoji: '🍗', cal: 490, protein: 28, carbs: 14, fat: 36, burnTime: '70 mins of brisk walking' },
  { id: 'gulab_jamun', name: 'Gulab Jamun (2 pcs)', emoji: '🍯', cal: 350, protein: 4, carbs: 55, fat: 13, burnTime: '50 mins of cycling' },
  { id: 'veg_momos', name: 'Veg Momos (6 pcs)', emoji: '🥟', cal: 220, protein: 6, carbs: 40, fat: 4, burnTime: '30 mins of dance cardio' },
  { id: 'cheese_chilli_toast', name: 'Cheese Chilli Toast (1 pc)', emoji: '🥪', cal: 350, protein: 10, carbs: 32, fat: 20, burnTime: '50 mins of treadmill run' },
  { id: 'masala_dosa', name: 'Masala Dosa (1 plate)', emoji: '🥞', cal: 387, protein: 7, carbs: 54, fat: 15, burnTime: '55 mins of active core work' },
  { id: 'jalebi', name: 'Jalebi (2 pcs)', emoji: '🍥', cal: 300, protein: 2, carbs: 58, fat: 8, burnTime: '45 mins of bodyweight squats' },
  { id: 'kaju_katli', name: 'Kaju Katli (2 pcs)', emoji: '🍬', cal: 150, protein: 3, carbs: 18, fat: 8, burnTime: '22 mins of high-intensity skip rope' },
];

const QUICK_ADD = [
  // Staples
  { name: "Roti (1 medium)", calories: 120, protein: 3, carbs: 18, fat: 3.7 },
  { name: "Jeera Rice (1 cup)", calories: 215, protein: 4.5, carbs: 46, fat: 1.2 },
  { name: "Yellow Dal Tadka (1 bowl)", calories: 180, protein: 11, carbs: 28, fat: 4.5 },
  { name: "Aloo Paratha (1 pc)", calories: 290, protein: 6, carbs: 45, fat: 10 },
  // Curries & Dry Mains
  { name: "Paneer Butter Masala (1 bowl)", calories: 340, protein: 12, carbs: 12, fat: 28 },
  { name: "Dal Makhani (1 bowl)", calories: 280, protein: 12, carbs: 32, fat: 12 },
  { name: "Mixed Veg Sabji (1 bowl)", calories: 150, protein: 4, carbs: 16, fat: 8 },
  { name: "Palak Paneer (1 bowl)", calories: 220, protein: 14, carbs: 8, fat: 16 },
  { name: "Rajma Masala (1 bowl)", calories: 240, protein: 12, carbs: 38, fat: 5 },
  { name: "Chole Masala (1 bowl)", calories: 260, protein: 10, carbs: 42, fat: 6 },
  { name: "Chicken Tikka Masala (1 bowl)", calories: 360, protein: 32, carbs: 10, fat: 21 },
  { name: "Egg Curry (2 eggs)", calories: 240, protein: 14, carbs: 6, fat: 18 },
  // Breakfasts & Snacks
  { name: "Idli (2 pcs) with Sambar", calories: 160, protein: 5, carbs: 32, fat: 1.5 },
  { name: "Plain Dosa with Chutney", calories: 210, protein: 4, carbs: 29, fat: 8 },
  { name: "Poha (1 plate)", calories: 220, protein: 4, carbs: 41, fat: 4.5 },
  { name: "Upma (1 plate)", calories: 240, protein: 5, carbs: 38, fat: 7 },
  { name: "Samosa (1 pc)", calories: 250, protein: 4, carbs: 32, fat: 12 },
  { name: "Chole Bhature (1 plate)", calories: 550, protein: 14, carbs: 72, fat: 24 },
  // Dairy & Sides
  { name: "Plain Curd (1 cup)", calories: 100, protein: 6, carbs: 8, fat: 4.5 },
  { name: "Cucumber Raita (1 cup)", calories: 80, protein: 4, carbs: 7, fat: 3.5 }
];

export default function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Theme Toggle State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide button if already running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBtn(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };
  
  // Onboarding State
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('onboarded') === 'true';
  });
  const [onboardStep, setOnboardStep] = useState<number>(0);
  
  const [onboardName, setOnboardName] = useState<string>(() => localStorage.getItem('onboard_name') || '');
  const [onboardAge, setOnboardAge] = useState<string>(() => localStorage.getItem('onboard_age') || '25');
  const [onboardGender, setOnboardGender] = useState<'male' | 'female' | 'other'>(() => (localStorage.getItem('onboard_gender') as any) || 'male');
  const [onboardWeight, setOnboardWeight] = useState<string>(() => localStorage.getItem('onboard_weight') || '65'); // in kg
  const [onboardHeight, setOnboardHeight] = useState<string>(() => localStorage.getItem('onboard_height') || '170'); // in cm
  const [onboardActivity, setOnboardActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active'>(() => (localStorage.getItem('onboard_activity') as any) || 'moderate');
  const [onboardGoal, setOnboardGoal] = useState<'lose' | 'maintain' | 'gain'>(() => (localStorage.getItem('onboard_goal') as any) || 'maintain');
  const [onboardPace, setOnboardPace] = useState<'slow' | 'moderate' | 'aggressive'>(() => (localStorage.getItem('onboard_pace') as any) || 'moderate');

  const [computedCal, setComputedCal] = useState<string>('2000');
  const [computedProtein, setComputedProtein] = useState<string>('120');
  const [computedCarbs, setComputedCarbs] = useState<string>('250');
  const [computedFat, setComputedFat] = useState<string>('65');

  const calculateOnboardingMacros = () => {
    const ageNum = Math.max(1, Number(onboardAge) || 25);
    const wtNum = Math.max(1, Number(onboardWeight) || 65);
    const htNum = Math.max(1, Number(onboardHeight) || 170);

    // Mifflin-St Jeor Equation BMR
    let bmr = 10 * wtNum + 6.25 * htNum - 5 * ageNum;
    if (onboardGender === 'male') {
      bmr += 5;
    } else if (onboardGender === 'female') {
      bmr -= 161;
    } else {
      bmr -= 80; // neutral ground
    }

    // Activity level factor
    let factor = 1.375; // light
    if (onboardActivity === 'sedentary') factor = 1.2;
    else if (onboardActivity === 'light') factor = 1.375;
    else if (onboardActivity === 'moderate') factor = 1.55;
    else if (onboardActivity === 'active') factor = 1.725;

    const tdee = Math.round(bmr * factor);

    let calories = tdee;
    let protein = 1.5 * wtNum; // standard protein target (1.5g per kg)
    
    if (onboardGoal === 'lose') {
      let deficit = 450;
      let proteinMultiplier = 1.8;
      
      if (onboardPace === 'slow') {
        deficit = 200;
        proteinMultiplier = 1.6;
      } else if (onboardPace === 'aggressive') {
        deficit = 750;
        proteinMultiplier = 2.0; // high protein to preserve muscle mass in high deficit
      }
      
      const safetyCap = onboardGender === 'female' ? 1200 : 1400;
      calories = Math.max(safetyCap, tdee - deficit); // deficit with safety cap
      protein = proteinMultiplier * wtNum; // preserved muscle mass
    } else if (onboardGoal === 'gain') {
      let surplus = 350;
      let proteinMultiplier = 1.8;
      
      if (onboardPace === 'slow') {
        surplus = 150;
        proteinMultiplier = 1.7; // lean bulk
      } else if (onboardPace === 'aggressive') {
        surplus = 600;
        proteinMultiplier = 2.0; // fast hypertrophy surplus environment
      }
      
      calories = tdee + surplus; // surplus
      protein = proteinMultiplier * wtNum; // building blocks
    }

    calories = Math.round(calories);
    protein = Math.round(protein);

    // Fat: 25% of calories
    let fat = Math.round((calories * 0.25) / 9);

    // Carbs: balance of remaining calories
    const proteinCal = protein * 4;
    const fatCal = fat * 9;
    let carbs = Math.round((calories - proteinCal - fatCal) / 4);
    if (carbs < 50) carbs = 50;

    return { calories, protein, carbs, fat };
  };

  // Synchronize dynamic macros step
  useEffect(() => {
    if (onboardStep === 6) {
      const suggested = calculateOnboardingMacros();
      setComputedCal(suggested.calories.toString());
      setComputedProtein(suggested.protein.toString());
      setComputedCarbs(suggested.carbs.toString());
      setComputedFat(suggested.fat.toString());
    }
  }, [onboardStep, onboardAge, onboardGender, onboardWeight, onboardHeight, onboardGoal, onboardActivity, onboardPace]);

  const [goals, setGoals] = useState<CalorieGoals>(() => {
    const stored = localStorage.getItem('goals');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_GOALS;
      }
    }
    return DEFAULT_GOALS;
  });

  const [entries, setEntries] = useState<FoodEntry[]>([]);

  // Water Tracker State
  const [waterIntake, setWaterIntake] = useState<number>(0); // in ml
  const [waterGoal, setWaterGoal] = useState<number>(2000); // default 2L

  // Weight Tracker State
  const [currentWeightLog, setCurrentWeightLog] = useState<string>('');
  const [dismissedFeedback, setDismissedFeedback] = useState<boolean>(false);
  const [weightHistory, setWeightHistory] = useState<{ date: string; weight: number }[]>(() => {
    const stored = localStorage.getItem('weight_history');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Overlays / Modals State
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareCopySuccess, setShareCopySuccess] = useState(false);
  
  // Dynamic Meal Suggestion State
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [suggestedMeals, setSuggestedMeals] = useState<any[] | null>(null);
  const [isGymFocus, setIsGymFocus] = useState<boolean>(() => {
    const stored = localStorage.getItem('gym_focus');
    if (stored !== null) return stored === 'true';
    return onboardGoal === 'gain' || onboardActivity === 'active' || onboardActivity === 'moderate';
  });
  const [isVegOnly, setIsVegOnly] = useState<boolean>(() => {
    const stored = localStorage.getItem('veg_only');
    return stored === 'true';
  });

  // Offline status tracking
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return !navigator.onLine;
    }
    return false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // AI Food Analysis Scan Mode State
  const [scanMode, setScanMode] = useState<'photo' | 'describe'>('photo');
  const [descriptionText, setDescriptionText] = useState('');
  const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);
  const [base64PhotoData, setBase64PhotoData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);

  // AI Scan Limit State
  const [aiScansToday, setAiScansToday] = useState<number>(0);

  useEffect(() => {
    setAiScansToday(getAiScanCountForToday());
  }, []);

  // Local Direct Matching States
  const [localMatches, setLocalMatches] = useState<ParsedMatch[]>([]);
  const [dirSearchQuery, setDirSearchQuery] = useState('');
  const [dirSelectedCategory, setDirSelectedCategory] = useState('All');

  useEffect(() => {
    if (scanMode === 'describe') {
      const parsed = parseDescriptionToLocalMatch(descriptionText);
      setLocalMatches(parsed);
    } else {
      setLocalMatches([]);
    }
  }, [descriptionText, scanMode]);


  // Manual Add Form State
  const [manualTab, setManualTab] = useState<'search' | 'custom'>('search');
  const [mName, setMName] = useState('');
  const [mCal, setMCal] = useState('');
  const [mProtein, setMProtein] = useState('');
  const [mCarbs, setMCarbs] = useState('');
  const [mFat, setMFat] = useState('');

  // Editable fields for AI Result Form
  const [rName, setRName] = useState('');
  const [rCal, setRCal] = useState('');
  const [rProtein, setRProtein] = useState('');
  const [rCarbs, setRCarbs] = useState('');
  const [rFat, setRFat] = useState('');

  // Settings Goals Form State
  const [gName, setGName] = useState(onboardName);
  const [gCal, setGCal] = useState(goals.calories.toString());
  const [gProtein, setGProtein] = useState(goals.protein.toString());
  const [gCarbs, setGCarbs] = useState(goals.carbs.toString());
  const [gFat, setGFat] = useState(goals.fat.toString());

  // Desi Fitness Avatar State
  const [desiAvatar, setDesiAvatar] = useState<string>(() => localStorage.getItem('desi_avatar') || 'muscle_rohit');

  // Helper to dynamically rename 'Muscle Rohit' to user's custom name
  const getAvatarInfo = (id: string) => {
    const av = AVATARS.find(a => a.id === id) || AVATARS[0];
    if (av.id === 'muscle_rohit') {
      return {
        ...av,
        name: `Muscle ${onboardName || 'Rohit'}`
      };
    }
    return av;
  };

  // Workout Sound System States
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicTitle, setMusicTitle] = useState("Tap play to ignite your workout!");
  const [musicLyrics, setMusicLyrics] = useState("💪 Sweat is just fat crying. Let's crush those goals!");
  const [selectedMood, setSelectedMood] = useState("dhol_trap");
  const [customMusicPrompt, setCustomMusicPrompt] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cheat Day Meter States
  const [selectedCheat, setSelectedCheat] = useState("samosa");

  // Mobile & PWA Export Guide States
  const [activeAppCenterTab, setActiveAppCenterTab] = useState<'pwa' | 'apk'>('pwa');
  const [showCopiedText, setShowCopiedText] = useState<string | null>(null);
  const [isAppCenterOpen, setIsAppCenterOpen] = useState(false);

  const fetchWorkoutMusic = async () => {
    setMusicLoading(true);
    setMusicPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    let moodPrompt = "Generate a high-energy, fast-paced Indian gym workout beat with heavy Punjabi dhol, modern trap bass, and energetic fitness vibes.";
    if (selectedMood === 'yoga_ambient') {
      moodPrompt = "Generate a peaceful, tranquil Himalayan yoga track with Indian bamboo flute, sitar waves, and deep meditative ambient drone.";
    } else if (selectedMood === 'aesthetic_house') {
      moodPrompt = "Generate a chic, high-tempo Indian progressive synthwave aesthetic house workout loop with energetic tabla accents.";
    } else if (selectedMood === 'custom' && customMusicPrompt.trim()) {
      moodPrompt = customMusicPrompt.trim();
    }

    try {
      const response = await fetch(getApiUrl("/api/generate-workout-music"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: moodPrompt }),
      });
      
      const data = await response.json();
      
      let audioUrl = "";
      if (data.fallback) {
        audioUrl = data.fallbackUrl;
        setMusicTitle(data.title || "Gym Bass Hype Fallback");
      } else {
        // Decode base64 audio into a playable Blob URL
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
        setMusicTitle("🔥 Custom Lyria Gym Vibe");
      }
      
      setMusicLyrics(data.lyrics || "💪 Get moving, let's burn those calories!");
      
      // Initialize or reuse Audio
      const newAudio = new Audio(audioUrl);
      newAudio.loop = true;
      audioRef.current = newAudio;
      
      newAudio.onended = () => setMusicPlaying(false);
      newAudio.onpause = () => setMusicPlaying(false);
      newAudio.onplay = () => setMusicPlaying(true);
      
      await newAudio.play();
      setMusicPlaying(true);
    } catch (err) {
      console.error("Music Generation Error:", err);
      // fallback
      const fallbackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      setMusicTitle("Desi Gym Bass Hype (Power Beat)");
      setMusicLyrics("💪 [ENERGY BURST] Lift heavy, eat clean, look aesthetic!");
      const newAudio = new Audio(fallbackUrl);
      newAudio.loop = true;
      audioRef.current = newAudio;
      try {
        await newAudio.play();
        setMusicPlaying(true);
      } catch (playErr) {
        console.error("Autoplay blocked or audio failed", playErr);
      }
    } finally {
      setMusicLoading(false);
    }
  };

  const togglePlayMusic = async () => {
    if (!audioRef.current) {
      await fetchWorkoutMusic();
      return;
    }
    
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setMusicPlaying(true);
      } catch {
        await fetchWorkoutMusic();
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format YYYY-MM-DD
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateToday = (d: Date) => {
    return formatDateKey(d) === formatDateKey(new Date());
  };

  const isDateYesterday = (d: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDateKey(d) === formatDateKey(yesterday);
  };

  const getRelativeDateLabel = (d: Date) => {
    if (isDateToday(d)) return 'Today';
    if (isDateYesterday(d)) return 'Yesterday';
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Indian Nutrition Tips database
  const INDIAN_TIPS = [
    {
      title: "Roasted Chana Power",
      text: "100g of roasted chana has 19g of high-quality plant protein and is rich in slow-digesting complex carbs. An elite, low-glycemic pre-workout muscle fueling snack!",
      icon: "🌾"
    },
    {
      title: "Sattu: The Desi Protein Shake",
      text: "Made from roasted Bengal gram, sattu powder with cold water & lemon is a potent recovery drink. It cools the system, aids digestion, and keeps you full for hours.",
      icon: "🥤"
    },
    {
      title: "Iron Absorption Hack",
      text: "Plant-based iron in spinach or dals (non-heme iron) is hard to absorb. Squeezing a fresh lemon (Vitamin C) on it instantly boosts absorption by up to 3x!",
      icon: "🍋"
    },
    {
      title: "Casein Recovery from Paneer",
      text: "Paneer contains casein protein, which digests slowly over 6-8 hours. Having a light paneer bhurji or grilled paneer before bed supports continuous overnight muscle synthesis.",
      icon: "🧀"
    },
    {
      title: "Makhana Snack Alternative",
      text: "Makhana (fox nuts) are packed with calcium and protein but are incredibly low in fat. 30g of dry-roasted makhana contains just 105 kcal. Ditch potato chips!",
      icon: "🍿"
    },
    {
      title: "Paneer vs Tofu Macro Tip",
      text: "For fat loss, substitute paneer with Tofu. Tofu has 50% fewer calories and 60% less fat than regular paneer, while maintaining almost the same protein ratio!",
      icon: "🥗"
    },
    {
      title: "Dahi: Gut & Muscle Synthesis",
      text: "Thick curd/dahi is a great source of calcium and high-quality milk proteins. It contains active probiotics that strengthen the gut, speeding up protein breakdown and absorption.",
      icon: "🥛"
    }
  ];

  // Rotating Nutrition Tips index changer
  const [nutritionTipIdx, setNutritionTipIdx] = useState(() => Math.floor(Math.random() * 7));

  const handleNextTip = () => {
    setNutritionTipIdx((prev) => (prev + 1) % 7);
  };

  // Streak calculation from localStorage data
  const getStreakCount = () => {
    let streak = 0;
    const today = new Date();
    // Scan backwards up to 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = `entries:${formatDateKey(d)}`;
      const stored = localStorage.getItem(key);
      let hasLogs = false;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          hasLogs = Array.isArray(parsed) && parsed.length > 0;
        } catch {}
      }
      if (hasLogs) {
        streak++;
      } else {
        // If we skipped today, the streak is still alive if yesterday has logs!
        if (i === 0) {
          continue;
        }
        break;
      }
    }
    return streak;
  };

  // 7-day history status check
  const getPastSevenDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = `entries:${formatDateKey(d)}`;
      const stored = localStorage.getItem(key);
      let totalsForDay = { calories: 0, protein: 0 };
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            totalsForDay = parsed.reduce((acc, entry) => ({
              calories: acc.calories + (entry.calories || 0),
              protein: acc.protein + (entry.protein || 0)
            }), { calories: 0, protein: 0 });
          }
        } catch {}
      }
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
        date: d,
        dateKey: formatDateKey(d),
        calories: Math.round(totalsForDay.calories),
        protein: Math.round(totalsForDay.protein),
        isActive: isDateToday(d) || formatDateKey(d) === formatDateKey(currentDate),
        hasLogs: totalsForDay.calories > 0
      });
    }
    return days;
  };

  const displayDateStr = (d: Date) => {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Load entries on date change
  useEffect(() => {
    const key = `entries:${formatDateKey(currentDate)}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries([]);
      }
    } else {
      setEntries([]);
    }
  }, [currentDate]);

  // Load water intake on date change
  useEffect(() => {
    const key = `water:${formatDateKey(currentDate)}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setWaterIntake(Number(stored) || 0);
    } else {
      setWaterIntake(0);
    }
  }, [currentDate]);

  const adjustWater = (amount: number) => {
    const key = `water:${formatDateKey(currentDate)}`;
    const newIntake = Math.max(0, waterIntake + amount);
    setWaterIntake(newIntake);
    localStorage.setItem(key, newIntake.toString());
  };

  const getWeightFeedback = () => {
    if (weightHistory.length < 2) return null;
    const current = weightHistory[0].weight;
    const previous = weightHistory[1].weight;
    const diff = current - previous;
    const absDiff = Math.abs(diff).toFixed(1);
    
    const currentAvatarInfo = getAvatarInfo(desiAvatar);
    const avatarEmoji = currentAvatarInfo.emoji;
    const avatarName = currentAvatarInfo.name;

    if (diff === 0) {
      return {
        type: 'maintain',
        text: `Weight is rock solid! ${avatarEmoji} ${avatarName} says: "Superb consistency! Maintaining is a skill of its own. Keep keeping on!"`,
        bg: 'bg-indigo-50 border-indigo-200 text-indigo-900 dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-200'
      };
    }

    if (onboardGoal === 'lose') {
      if (diff < 0) {
        return {
          type: 'congratulate',
          text: `📉 Down by -${absDiff} kg! 🎉 ${avatarEmoji} ${avatarName} is absolutely thrilled: "Sensational! Your fat loss target is getting closer every day. Keep burning, champion!"`,
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-200'
        };
      } else {
        return {
          type: 'encourage',
          text: `📈 Up by +${absDiff} kg. ${avatarEmoji} ${avatarName} says: "Don't sweat temporary fluctuations! It's likely temporary water weight or muscle fullness. Stay consistent with your deficit!"`,
          bg: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-200'
        };
      }
    } else if (onboardGoal === 'gain') {
      if (diff > 0) {
        return {
          type: 'congratulate',
          text: `📈 Up by +${absDiff} kg! 🏋️ ${avatarEmoji} ${avatarName} is hyped: "Epic bulking progress! That's new muscle tissue being constructed. Keep lifting heavy and hit that protein!"`,
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-200'
        };
      } else {
        return {
          type: 'encourage',
          text: `📉 Down by -${absDiff} kg. ${avatarEmoji} ${avatarName} says: "Keep the calories high! Eat a little extra roasted chana or paneer to ensure you are in a clean surplus for muscle gains!"`,
          bg: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-200'
        };
      }
    } else {
      const direction = diff > 0 ? 'Up' : 'Down';
      const directionEmoji = diff > 0 ? '📈' : '📉';
      return {
        type: 'maintain',
        text: `${directionEmoji} Fluctuation of ${diff > 0 ? '+' : '-'}${absDiff} kg. ${avatarEmoji} ${avatarName} says: "Excellent job staying within your maintenance range! Keep balancing your macros."`,
        bg: 'bg-indigo-50 border-indigo-200 text-indigo-900 dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-200'
      };
    }
  };

  const logWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const wt = parseFloat(currentWeightLog);
    if (!wt || wt <= 0) return;

    const dateStr = formatDateKey(currentDate);
    const filteredHistory = weightHistory.filter(item => item.date !== dateStr);
    const updatedHistory = [
      { date: dateStr, weight: wt },
      ...filteredHistory
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setWeightHistory(updatedHistory);
    localStorage.setItem('weight_history', JSON.stringify(updatedHistory));
    setCurrentWeightLog('');
    setDismissedFeedback(false);
    
    if (isDateToday(currentDate)) {
      setOnboardWeight(wt.toString());
    }
  };

  const deleteWeightLog = (dateToDelete: string) => {
    const updatedHistory = weightHistory.filter(item => item.date !== dateToDelete);
    setWeightHistory(updatedHistory);
    localStorage.setItem('weight_history', JSON.stringify(updatedHistory));
  };

  // Beautiful High-Res Canvas Drawing for social sharing
  const drawMacroCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with beautiful deep rich Indian theme background
    const gradient = ctx.createLinearGradient(0, 0, 800, 800);
    gradient.addColorStop(0, '#110D0A'); // Deep rich charcoal black
    gradient.addColorStop(1, '#231B13'); // Warm deep royal bronze
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 800);

    // Draw elegant decorative radial elements/curves (Mandala-like feel)
    ctx.strokeStyle = 'rgba(180, 150, 100, 0.08)';
    ctx.lineWidth = 1;
    
    // Top-left design circles
    ctx.beginPath(); ctx.arc(0, 0, 150, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 120, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 90, 0, Math.PI * 2); ctx.stroke();

    // Bottom-right design circles
    ctx.beginPath(); ctx.arc(800, 800, 180, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(800, 800, 150, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(800, 800, 120, 0, Math.PI * 2); ctx.stroke();

    // Header text
    ctx.fillStyle = '#EBE3D5'; // Premium bone white
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // "INDIAN CAL" Brand
    ctx.font = 'bold 32px Georgia, serif';
    ctx.fillText('🇮🇳 INDIAN CAL', 400, 65);

    // Subtitle with user's name
    ctx.fillStyle = '#B49664'; // Elegant light gold/brass
    ctx.font = 'bold 12px monospace';
    const subtitleText = onboardName ? `${onboardName.toUpperCase()}'S DAILY MACRO SUMMARY` : 'DAILY MACRO SUMMARY';
    ctx.fillText(subtitleText, 400, 105);

    // Beautiful subtle divider line
    ctx.strokeStyle = 'rgba(180, 150, 100, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(320, 125);
    ctx.lineTo(480, 125);
    ctx.stroke();

    // Active Avatar badge
    const activeAvatarObj = getAvatarInfo(desiAvatar);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = 'rgba(180, 150, 100, 0.15)';
    ctx.lineWidth = 1;

    // Draw a pill badge container for avatar
    const badgeWidth = 240;
    const badgeHeight = 44;
    const badgeX = 400 - badgeWidth / 2;
    const badgeY = 150;
    
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 22);
    } else {
      ctx.rect(badgeX, badgeY, badgeWidth, badgeHeight);
    }
    ctx.fill();
    ctx.stroke();

    // Draw text inside avatar badge
    ctx.fillStyle = '#EBE3D5';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${activeAvatarObj.emoji}  ${activeAvatarObj.name} • ${activeAvatarObj.title}`, 400, 172);

    // Draw Concentric Circles at Center
    const ringCenterX = 400;
    const ringCenterY = 380;

    // Helper to draw circle tracks
    const drawTrack = (radius: number) => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(ringCenterX, ringCenterY, radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Helper to draw active progress fill
    const drawProgressArc = (radius: number, percent: number, color: string) => {
      const cappedPercent = Math.min(100, Math.max(0, percent));
      if (cappedPercent <= 0) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      // Start from top (-Math.PI / 2)
      ctx.arc(ringCenterX, ringCenterY, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * cappedPercent) / 100);
      ctx.stroke();
    };

    // Draw Protein, Carbs, Fat Concentric rings
    const rProtein = 110;
    const rCarbs = 85;
    const rFat = 60;

    drawTrack(rProtein);
    drawProgressArc(rProtein, (totals.protein / goals.protein) * 100, '#EF4444'); // Red

    drawTrack(rCarbs);
    drawProgressArc(rCarbs, (totals.carbs / goals.carbs) * 100, '#06B6D4'); // Cyan

    drawTrack(rFat);
    drawProgressArc(rFat, (totals.fat / goals.fat) * 100, '#F59E0B'); // Amber

    // Inside Center Text Panel
    // Calories Consumed Number
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillText(Math.round(totals.calories).toString(), ringCenterX, ringCenterY - 10);

    // Goal Subtitle
    ctx.fillStyle = '#A0A0A0';
    ctx.font = '14px sans-serif';
    ctx.fillText(`of ${goals.calories} kcal`, ringCenterX, ringCenterY + 22);

    // Date Text
    ctx.fillStyle = '#B49664';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(displayDateStr(currentDate).toUpperCase(), ringCenterX, ringCenterY + 45);

    // Progress Table/Details below Thali Rings
    const boxX = 80;
    const boxY = 540;
    const boxW = 640;
    const boxH = 150;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(boxX, boxY, boxW, boxH, 16);
    } else {
      ctx.rect(boxX, boxY, boxW, boxH);
    }
    ctx.fill();
    ctx.stroke();

    // Draw grid headers
    const cols = [
      { label: 'PROTEIN', value: `${Math.round(totals.protein)}g / ${goals.protein}g`, pct: Math.round((totals.protein / goals.protein) * 100), color: '#EF4444', x: 190 },
      { label: 'CARBOHYDRATES', value: `${Math.round(totals.carbs)}g / ${goals.carbs}g`, pct: Math.round((totals.carbs / goals.carbs) * 100), color: '#06B6D4', x: 400 },
      { label: 'DIETARY FAT', value: `${Math.round(totals.fat)}g / ${goals.fat}g`, pct: Math.round((totals.fat / goals.fat) * 100), color: '#F59E0B', x: 610 }
    ];

    cols.forEach(col => {
      // Header Label
      ctx.fillStyle = '#8E8E8E';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(col.label, col.x, boxY + 32);

      // Value grams
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(col.value, col.x, boxY + 62);

      // Percentage pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(col.x - 45, boxY + 82, 90, 22, 11);
      } else {
        ctx.rect(col.x - 45, boxY + 82, 90, 22);
      }
      ctx.fill();

      ctx.fillStyle = col.color;
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`${col.pct}% Full`, col.x, boxY + 93);

      // Simple bar visualizer
      const barY = boxY + 118;
      const barW = 100;
      const barH = 5;
      
      // Gray track background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(col.x - barW / 2, barY, barW, barH);

      // Filled track
      ctx.fillStyle = col.color;
      ctx.fillRect(col.x - barW / 2, barY, Math.min(barW, (col.pct * barW) / 100), barH);
    });

    // Streak or Motivational Footer Tip inside Canvas
    ctx.fillStyle = '#8E8E8E';
    ctx.font = 'italic 12.5px sans-serif';
    const streakDays = getStreakCount();
    const motivationalQuote = streakDays > 0 
      ? `🔥 KEEP IT GOING! On a magnificent ${streakDays}-day streak of clean eating!`
      : `🎯 FUEL YOUR SUCCESS: "Your body is your temple. Fuel it mindfully today."`;
    ctx.fillText(motivationalQuote, 400, boxY + boxH + 32);

    // Watermark at bottom
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = '10.5px sans-serif';
    ctx.fillText('DESIGNED & TRACKED WITH INDIAN CAL', 400, 770);
  };

  const handleDownloadShareImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    drawMacroCanvas(canvas);
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `IndianCal_Macro_Summary_${formatDateKey(currentDate)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Canvas export failed", e);
    }
  };

  const handleCopyShareText = () => {
    const activeAvatarObj = getAvatarInfo(desiAvatar);
    const streakDays = getStreakCount();
    const streakText = streakDays > 0 ? `🔥 Current Streak: ${streakDays} days\n` : '';
    const shareTitle = onboardName 
      ? `🇮🇳 ${onboardName}'s Indian Cal Macro Progress (${displayDateStr(currentDate)})`
      : `🇮🇳 My Indian Cal Macro Progress (${displayDateStr(currentDate)})`;
    const text = `${shareTitle}

${streakText}⚡ Calories: ${Math.round(totals.calories)} / ${goals.calories} kcal
🥩 Protein: ${Math.round(totals.protein)}g / ${goals.protein}g
🍞 Carbs: ${Math.round(totals.carbs)}g / ${goals.carbs}g
🥑 Fat: ${Math.round(totals.fat)}g / ${goals.fat}g

"${activeAvatarObj.emoji} ${activeAvatarObj.name} says: Let's crush those goals, champion!"
Join me on Indian Cal and build your ideal physique with authentic food tracking! 🌟`;

    navigator.clipboard.writeText(text).then(() => {
      setShareCopySuccess(true);
      setTimeout(() => setShareCopySuccess(false), 2000);
    }).catch((err) => {
      console.error("Failed to copy text", err);
    });
  };

  // Circumference helpers for the rings
  const getCircumference = (r: number) => 2 * Math.PI * r;
  const getDashoffset = (r: number, percentage: number) => {
    const c = getCircumference(r);
    const clamped = Math.max(0, Math.min(100, percentage));
    return c - (clamped / 100) * c;
  };

  // Totals calculations
  const totals = entries.reduce((acc, entry) => ({
    calories: acc.calories + (entry.calories || 0),
    protein: acc.protein + (entry.protein || 0),
    carbs: acc.carbs + (entry.carbs || 0),
    fat: acc.fat + (entry.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Save utility
  const saveEntriesForDate = (date: Date, newEntries: FoodEntry[]) => {
    const key = `entries:${formatDateKey(date)}`;
    localStorage.setItem(key, JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const addEntry = async (entry: Omit<FoodEntry, 'id' | 'time' | 'date'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: 'e' + Date.now() + Math.random().toString(36).slice(2, 7),
      time: new Date().toISOString(),
      date: formatDateKey(currentDate)
    };
    const updated = [...entries, newEntry];
    saveEntriesForDate(currentDate, updated);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    saveEntriesForDate(currentDate, updated);
  };

  // Date Navigation handlers
  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  // Preset loading handler
  const handleQuickAdd = (item: typeof QUICK_ADD[0]) => {
    addEntry({
      name: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      source: 'manual'
    });
  };

  // Goal update handler
  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoals: CalorieGoals = {
      calories: Math.max(0, Number(gCal) || DEFAULT_GOALS.calories),
      protein: Math.max(0, Number(gProtein) || DEFAULT_GOALS.protein),
      carbs: Math.max(0, Number(gCarbs) || DEFAULT_GOALS.carbs),
      fat: Math.max(0, Number(gFat) || DEFAULT_GOALS.fat)
    };
    localStorage.setItem('goals', JSON.stringify(newGoals));
    setGoals(newGoals);

    if (gName.trim()) {
      localStorage.setItem('onboard_name', gName.trim());
      setOnboardName(gName.trim());
    }

    setIsSettingsOpen(false);
  };

  // Manual Add submit handler
  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim()) return;
    addEntry({
      name: mName,
      calories: Math.max(0, Number(mCal) || 0),
      protein: Math.max(0, Number(mProtein) || 0),
      carbs: Math.max(0, Number(mCarbs) || 0),
      fat: Math.max(0, Number(mFat) || 0),
      source: 'manual'
    });
    setMName('');
    setMCal('');
    setMProtein('');
    setMCarbs('');
    setMFat('');
    setIsManualOpen(false);
  };

  const toggleGymFocus = (val: boolean) => {
    setIsGymFocus(val);
    localStorage.setItem('gym_focus', val ? 'true' : 'false');
    // Re-fetch suggestions if modal is open
    if (isSuggestOpen) {
      fetchMealSuggestions(val, isVegOnly);
    }
  };

  const toggleVegOnly = (val: boolean) => {
    setIsVegOnly(val);
    localStorage.setItem('veg_only', val ? 'true' : 'false');
    // Re-fetch suggestions if modal is open
    if (isSuggestOpen) {
      fetchMealSuggestions(isGymFocus, val);
    }
  };

  const fetchMealSuggestions = async (gymVal?: boolean, vegVal?: boolean) => {
    setIsSuggestLoading(true);
    setSuggestError(null);
    setSuggestedMeals(null);

    // Compute remaining targets
    const remainingCalories = Math.max(-5000, Math.round(goals.calories - totals.calories));
    const remainingProtein = Math.max(-500, Math.round(goals.protein - totals.protein));
    const remainingCarbs = Math.max(-1000, Math.round(goals.carbs - totals.carbs));
    const remainingFat = Math.max(-200, Math.round(goals.fat - totals.fat));

    const activeGymValue = gymVal !== undefined ? gymVal : isGymFocus;
    const activeVegValue = vegVal !== undefined ? vegVal : isVegOnly;

    // Simulate an organic loading delay for delightful UI feedback
    setTimeout(() => {
      try {
        const isItemVeg = (foodItem: DBFoodItem): boolean => {
          const nameLower = foodItem.name.toLowerCase();
          
          const nonVegKeywords = [
            'chicken', 'fish', 'mutton', 'meat', 'shrimp', 'prawn', 'pork', 'beef', 'murgh', 'anda', 'keema', 'bhurji'
          ];
          
          const hasNonVegKeyword = nonVegKeywords.some(keyword => {
            if (keyword === 'keema' && (nameLower.includes('soya') || nameLower.includes('soyabean'))) return false;
            if (keyword === 'bhurji' && (nameLower.includes('paneer') || nameLower.includes('soya') || nameLower.includes('soyabean'))) return false;
            return nameLower.includes(keyword);
          });
          
          if (hasNonVegKeyword) return false;
          
          if (nameLower.includes('egg') && !nameLower.includes('eggplant')) {
            return false;
          }
          if (nameLower.includes('omelette') || nameLower.includes('omlet') || nameLower.includes('half fry') || nameLower.includes('half-fry') || nameLower.includes('sunny side up')) {
            return false;
          }

          if (foodItem.aliases) {
            for (const alias of foodItem.aliases) {
              const aliasLower = alias.toLowerCase();
              const hasAliasNonVeg = nonVegKeywords.some(keyword => {
                if (keyword === 'keema' && (aliasLower.includes('soya') || aliasLower.includes('soyabean'))) return false;
                if (keyword === 'bhurji' && (aliasLower.includes('paneer') || aliasLower.includes('soya') || aliasLower.includes('soyabean'))) return false;
                return aliasLower.includes(keyword);
              });
              if (hasAliasNonVeg) return false;
              if (aliasLower.includes('egg') && !aliasLower.includes('eggplant')) return false;
              if (aliasLower.includes('omelette') || aliasLower.includes('omlet') || aliasLower.includes('half fry') || aliasLower.includes('half-fry') || aliasLower.includes('sunny side up')) return false;
            }
          }

          return true;
        };

        const allowedFoods = INDIAN_FOOD_DB.filter(food => {
          if (activeVegValue) {
            return isItemVeg(food);
          }
          return true;
        });

        if (allowedFoods.length === 0) {
          setSuggestedMeals([]);
          setIsSuggestLoading(false);
          return;
        }

        const scoreItem = (food: DBFoodItem) => {
          let score = 100;

          // Calorie fit
          if (remainingCalories > 150) {
            const calDiff = remainingCalories - food.calories;
            if (calDiff < 0) {
              score -= Math.abs(calDiff) * 0.4; // Penalize going over budget
            } else {
              // Reward fitting nicely in remaining budget
              const ratio = food.calories / remainingCalories;
              if (ratio > 0.3 && ratio <= 0.85) {
                score += 35;
              } else if (ratio > 0.85) {
                score += 10;
              } else {
                score += ratio * 15;
              }
            }
          } else {
            // Budget is very small or negative: prefer very low calorie foods
            score -= food.calories * 0.6;
          }

          // Protein bonus (especially for Gym Focus)
          if (activeGymValue) {
            const density = food.protein / (food.calories || 1);
            score += density * 150;
            score += food.protein * 2.5;
          } else {
            score += food.protein * 1.0;
          }

          // Carbs check
          if (remainingCarbs <= 0) {
            if (food.carbs > 5) score -= food.carbs * 1.5;
          } else {
            const carbsDiff = remainingCarbs - food.carbs;
            if (carbsDiff < 0) {
              score -= Math.abs(carbsDiff) * 0.8;
            } else {
              score += (food.carbs / remainingCarbs) * 10;
            }
          }

          // Fat check
          if (remainingFat <= 0) {
            if (food.fat > 2) score -= food.fat * 2.5;
          } else {
            const fatDiff = remainingFat - food.fat;
            if (fatDiff < 0) {
              score -= Math.abs(fatDiff) * 1.2;
            } else {
              score += (food.fat / remainingFat) * 8;
            }
          }

          return score;
        };

        // Group 1: High-Protein Main Meals
        const group1 = allowedFoods.filter(food => {
          const isMainCat = ["Dairy & Gym Staples", "Dals & Curries"].includes(food.category);
          const isProteinHigh = food.protein >= 8;
          const nameL = food.name.toLowerCase();
          const hasProteinTerm = ["soya", "paneer", "chicken", "egg", "dal", "chole", "rajma", "tofu"].some(t => nameL.includes(t));
          return isMainCat || isProteinHigh || hasProteinTerm;
        });

        // Group 2: Grain, Bread, & South Indian Breakfast Staples
        const group2 = allowedFoods.filter(food => {
          const isStapleCat = ["Breads & Staples", "Rice & Grains", "Breakfast & South Indian"].includes(food.category);
          const nameL = food.name.toLowerCase();
          const hasStapleTerm = ["roti", "paratha", "poha", "upma", "dosa", "rice", "khichdi", "idli", "chapati", "phulka"].some(t => nameL.includes(t));
          return isStapleCat || hasStapleTerm;
        });

        // Group 3: Light Snacks, Refreshments, Salads & Supplements
        const group3 = allowedFoods.filter(food => {
          const isSnackCat = ["Fruits & Salads", "Street Food & Snacks"].includes(food.category);
          const nameL = food.name.toLowerCase();
          const hasSnackTerm = ["chaas", "salad", "buttermilk", "sattu", "whey", "curd", "dahi", "sprouts", "soup", "coffee", "tea", "chai", "cucumber", "fruit"].some(t => nameL.includes(t));
          const isLight = food.calories < 180;
          return isSnackCat || hasSnackTerm || isLight;
        });

        const scoredGroup1 = group1.map(food => ({ food, score: scoreItem(food) })).sort((a, b) => b.score - a.score);
        const scoredGroup2 = group2.map(food => ({ food, score: scoreItem(food) })).sort((a, b) => b.score - a.score);
        const scoredGroup3 = group3.map(food => ({ food, score: scoreItem(food) })).sort((a, b) => b.score - a.score);

        const finalSelected: DBFoodItem[] = [];
        
        let g1Idx = 0, g2Idx = 0, g3Idx = 0;
        
        // Interleave to provide balanced 10 options
        while (finalSelected.length < 10) {
          let added = false;
          if (g1Idx < scoredGroup1.length && finalSelected.length < 10) {
            const item = scoredGroup1[g1Idx].food;
            if (!finalSelected.some(f => f.id === item.id)) {
              finalSelected.push(item);
            }
            g1Idx++;
            added = true;
          }
          if (g2Idx < scoredGroup2.length && finalSelected.length < 10) {
            const item = scoredGroup2[g2Idx].food;
            if (!finalSelected.some(f => f.id === item.id)) {
              finalSelected.push(item);
            }
            g2Idx++;
            added = true;
          }
          if (g3Idx < scoredGroup3.length && finalSelected.length < 10) {
            const item = scoredGroup3[g3Idx].food;
            if (!finalSelected.some(f => f.id === item.id)) {
              finalSelected.push(item);
            }
            g3Idx++;
            added = true;
          }
          if (!added) break;
        }

        // Fallback: fill up to 10 with any allowed foods not already added
        while (finalSelected.length < 10 && allowedFoods.length > finalSelected.length) {
          const extra = allowedFoods.find(x => !finalSelected.some(f => f.id === x.id));
          if (extra) {
            finalSelected.push(extra);
          } else {
            break;
          }
        }

        const suggestions = finalSelected.map((item) => {
          let trend_label = "";
          let why_fits = "";

          const nameLower = item.name.toLowerCase();
          const isProteinRich = item.protein >= 10;

          if (nameLower.includes("soya")) {
            trend_label = "🌱 Pure Veg Muscle Builder";
          } else if (nameLower.includes("paneer")) {
            trend_label = "🧀 Rich Desi Paneer Power";
          } else if (nameLower.includes("chicken")) {
            trend_label = "🍗 Gym Bro Ultimate Fuel";
          } else if (nameLower.includes("egg") && !nameLower.includes("eggplant")) {
            trend_label = "🍳 Quick Egg Charge";
          } else if (nameLower.includes("roti") || nameLower.includes("chapati") || nameLower.includes("phulka")) {
            trend_label = "🫓 Lean Roti Staple";
          } else if (nameLower.includes("paratha")) {
            trend_label = "🍽️ Traditional Stuffed Feast";
          } else if (nameLower.includes("poha") || nameLower.includes("upma")) {
            trend_label = "⚡ Pure Energy Morning Starter";
          } else if (nameLower.includes("khichdi")) {
            trend_label = "🥣 Soothing Desi Comfort Fuel";
          } else if (nameLower.includes("chaas") || nameLower.includes("buttermilk")) {
            trend_label = "🥤 Refreshing Chilled Chaas";
          } else if (nameLower.includes("sattu")) {
            trend_label = "🌾 Sattu Super Stamina Drink";
          } else if (nameLower.includes("whey")) {
            trend_label = "🥛 Quick Whey Shake";
          } else if (nameLower.includes("salad")) {
            trend_label = "🥗 Clean Green fiber & detox";
          } else if (nameLower.includes("curd") || nameLower.includes("dahi")) {
            trend_label = "🥣 Cool Probiotic Dahi Shield";
          } else if (isProteinRich) {
            trend_label = "💪 High-Protein Champ Force";
          } else if (item.category === "Sweets & Desserts") {
            trend_label = "🍬 Small Cheat Treat Portion";
          } else if (item.calories < 120) {
            trend_label = "🍿 Light Calorie Saver";
          } else {
            trend_label = "🍛 Authentic Desi Gravy Fit";
          }

          if (remainingCalories <= 150) {
            why_fits = `An ultra-light choice containing only ${item.calories} calories, making it exceptionally safe for your tight remaining calorie budget today.`;
          } else if (activeGymValue && item.protein >= 8) {
            why_fits = `Provides a massive ${item.protein}g of muscle-building protein for just ${item.calories} kcal, aligning perfectly with your Gym Focus objectives.`;
          } else {
            why_fits = `Offers a well-rounded mix of ${item.protein}g protein and ${item.carbs}g carbs, helping you comfortably satisfy your remaining goals.`;
          }

          return {
            meal_name: item.name,
            portion: item.serving,
            calories: item.calories,
            protein_g: item.protein,
            carbs_g: item.carbs,
            fat_g: item.fat,
            why_fits,
            trend_label
          };
        });

        setSuggestedMeals(suggestions);
      } catch (err: any) {
        console.error(err);
        setSuggestError(err.message || 'Could not fetch suggestions. Please try again.');
      } finally {
        setIsSuggestLoading(false);
      }
    }, 450);
  };

  // Image upload pipeline & resizing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1024;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          const scale = MAX_DIM / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setPreviewImgUrl(jpegDataUrl);
          setBase64PhotoData(jpegDataUrl.split(',')[1]);
          setAnalysisError(null);
          setAnalysisResult(null);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Trigger file selection input
  const triggerCameraInput = () => {
    fileInputRef.current?.click();
  };

  // Reset scan state values
  const resetScanState = () => {
    setPreviewImgUrl(null);
    setBase64PhotoData(null);
    setDescriptionText('');
    setAnalysisResult(null);
    setAnalysisError(null);
    setIsAnalyzing(false);
    setLocalMatches([]);
    setDirSearchQuery('');
    setDirSelectedCategory('All');
  };

  // AI Analyze call
  const handleAIAnalyze = async () => {
    // Check daily scan limit
    const todayCount = getAiScanCountForToday();
    if (todayCount >= 3) {
      setAnalysisError('Daily AI usage limit reached (3 scans per day). Please use our Direct Search or Manual Add options to log your meals without any limits!');
      return;
    }

    if (scanMode === 'photo' && !base64PhotoData) {
      setAnalysisError('Please take or upload a food photo first.');
      return;
    }
    if (scanMode === 'describe' && !descriptionText.trim()) {
      setAnalysisError('Please enter a short description of what you ate.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch(getApiUrl('/api/analyze-food'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scanMode === 'describe' ? descriptionText : undefined,
          image: scanMode === 'photo' ? {
            mimeType: 'image/jpeg',
            data: base64PhotoData
          } : undefined
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `Server responded with status ${response.status}`);
      }

      const result: FoodAnalysisResult = await response.json();
      setAnalysisResult(result);
      
      // Increment AI scan limit
      incrementAiScanCount();
      setAiScansToday(getAiScanCountForToday());

      // Populate edit fields
      setRName(result.dish_name);
      setRCal(Math.round(result.calories).toString());
      setRProtein(result.protein_g.toString());
      setRCarbs(result.carbs_g.toString());
      setRFat(result.fat_g.toString());
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'Error occurred during AI food evaluation. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Log from AI result fields
  const handleAISaveToLog = () => {
    if (!rName.trim()) return;
    addEntry({
      name: rName,
      calories: Math.max(0, Number(rCal) || 0),
      protein: Math.max(0, Number(rProtein) || 0),
      carbs: Math.max(0, Number(rCarbs) || 0),
      fat: Math.max(0, Number(rFat) || 0),
      source: 'ai'
    });
    setIsScanOpen(false);
    resetScanState();
  };

  if (!isOnboarded) {
    return (
      <div id="onboarding-root" className="min-h-screen bg-bg text-ink flex flex-col font-sans">
        <div className="max-w-[440px] w-full mx-auto px-6 py-10 flex flex-col justify-between min-h-[90vh]">
          
          {/* Header indicator / Progress */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-serif font-bold text-2xl text-bg-deep">
              Indian <em className="italic font-medium text-protein">Cal</em>
            </span>
            {onboardStep > 0 && (
              <span className="font-mono text-xs text-ink-soft bg-surface-2 px-3 py-1 rounded-full border border-rule/50">
                Step {onboardStep} of 6
              </span>
            )}
          </div>

          {/* Onboarding Wizard Cards */}
          <div className="flex-1 flex flex-col justify-center my-auto">
            {onboardStep === 0 && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-surface-theme rounded-full flex items-center justify-center mx-auto shadow-md border border-rule/50 text-4xl">
                  🥘
                </div>
                <div className="space-y-2">
                  <h1 className="font-serif font-bold text-3xl text-bg-deep leading-tight">
                    Welcome to <br/>Indian <em className="italic font-medium text-protein">Cal</em>
                  </h1>
                  <p className="text-ink-soft text-sm max-w-xs mx-auto leading-relaxed">
                    Track your Biryani, Paneer, or home-cooked Dal-Roti accurately. Powered by Gemini AI to estimate nutrients from photos, and loaded with a massive database of 4,500+ Indian foods &amp; dishes for instant, offline direct logs!
                  </p>
                </div>
                
                {/* Ask user's name on starting page */}
                <div className="space-y-2 text-left max-w-xs mx-auto pt-2">
                  <label className="text-xs font-bold text-protein tracking-wider uppercase block">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aayush" 
                    value={onboardName}
                    onChange={(e) => setOnboardName(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-2 text-ink rounded-xl border border-rule/60 focus:outline-none focus:border-protein font-medium text-sm transition-colors shadow-inner"
                  />
                  {!onboardName.trim() && (
                    <span className="text-[11px] text-ink-soft italic block mt-1">Please enter your name to begin your journey.</span>
                  )}
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      if (onboardName.trim()) {
                        localStorage.setItem('onboard_name', onboardName.trim());
                        setOnboardStep(1);
                      }
                    }}
                    disabled={!onboardName.trim()}
                    className={`w-full py-4 bg-bg-deep text-surface-2 font-bold text-sm rounded-xl shadow-lg cursor-pointer hover:bg-bg-deep/90 transition-all ${
                      !onboardName.trim() ? 'opacity-50 cursor-not-allowed scale-98' : 'active:scale-[0.98]'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="font-serif font-bold text-2xl text-bg-deep">How old are you?</h2>
                  <p className="text-xs text-ink-soft">We use your age to compute accurate basal metabolic rate (BMR).</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <input 
                    type="number" 
                    value={onboardAge} 
                    onChange={(e) => setOnboardAge(e.target.value)}
                    min="1" 
                    max="120"
                    placeholder="Enter age (e.g. 25)"
                    className="w-full bg-surface-theme border border-rule rounded-xl px-4 py-3.5 text-lg text-ink font-mono focus:outline-none focus:border-protein"
                    required
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setOnboardStep(0)}
                    className="flex-1 py-3.5 border border-rule bg-surface-theme text-ink font-bold text-sm rounded-xl cursor-pointer hover:bg-surface-2 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      if (Number(onboardAge) > 0) setOnboardStep(2);
                    }}
                    disabled={!onboardAge || Number(onboardAge) <= 0}
                    className="flex-1 py-3.5 bg-bg-deep text-surface-2 font-bold text-sm rounded-xl cursor-pointer hover:bg-bg-deep/90 transition-colors disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="font-serif font-bold text-2xl text-bg-deep">What is your gender?</h2>
                  <p className="text-xs text-ink-soft">BMR calculations vary slightly depending on physical characteristics.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    type="button"
                    onClick={() => setOnboardGender('male')}
                    className={`p-4 rounded-xl text-left font-bold text-sm flex items-center justify-between border cursor-pointer transition-all ${
                      onboardGender === 'male' 
                        ? 'bg-surface-2 border-protein text-ink shadow-sm' 
                        : 'bg-surface-theme border-rule text-ink-soft'
                    }`}
                  >
                    <span>Male</span>
                    {onboardGender === 'male' && <span className="w-2.5 h-2.5 rounded-full bg-protein" />}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setOnboardGender('female')}
                    className={`p-4 rounded-xl text-left font-bold text-sm flex items-center justify-between border cursor-pointer transition-all ${
                      onboardGender === 'female' 
                        ? 'bg-surface-2 border-protein text-ink shadow-sm' 
                        : 'bg-surface-theme border-rule text-ink-soft'
                    }`}
                  >
                    <span>Female</span>
                    {onboardGender === 'female' && <span className="w-2.5 h-2.5 rounded-full bg-protein" />}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setOnboardGender('other')}
                    className={`p-4 rounded-xl text-left font-bold text-sm flex items-center justify-between border cursor-pointer transition-all ${
                      onboardGender === 'other' 
                        ? 'bg-surface-2 border-protein text-ink shadow-sm' 
                        : 'bg-surface-theme border-rule text-ink-soft'
                    }`}
                  >
                    <span>Non-binary / Other</span>
                    {onboardGender === 'other' && <span className="w-2.5 h-2.5 rounded-full bg-protein" />}
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setOnboardStep(1)}
                    className="flex-1 py-3.5 border border-rule bg-surface-theme text-ink font-bold text-sm rounded-xl cursor-pointer hover:bg-surface-2 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setOnboardStep(3)}
                    className="flex-1 py-3.5 bg-bg-deep text-surface-2 font-bold text-sm rounded-xl cursor-pointer hover:bg-bg-deep/90 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="font-serif font-bold text-2xl text-bg-deep">Height &amp; Weight</h2>
                  <p className="text-xs text-ink-soft">This is used to estimate baseline energy expenditure and protein targets.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={onboardWeight} 
                      onChange={(e) => setOnboardWeight(e.target.value)}
                      min="10" 
                      max="300"
                      placeholder="e.g. 65"
                      className="w-full bg-surface-theme border border-rule rounded-xl px-4 py-3 text-base text-ink font-mono focus:outline-none focus:border-protein"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Height (cm)</label>
                    <input 
                      type="number" 
                      value={onboardHeight} 
                      onChange={(e) => setOnboardHeight(e.target.value)}
                      min="50" 
                      max="250"
                      placeholder="e.g. 170"
                      className="w-full bg-surface-theme border border-rule rounded-xl px-4 py-3 text-base text-ink font-mono focus:outline-none focus:border-protein"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setOnboardStep(2)}
                    className="flex-1 py-3.5 border border-rule bg-surface-theme text-ink font-bold text-sm rounded-xl cursor-pointer hover:bg-surface-2 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      if (Number(onboardWeight) > 0 && Number(onboardHeight) > 0) {
                        setOnboardStep(4);
                      }
                    }}
                    disabled={!onboardWeight || !onboardHeight || Number(onboardWeight) <= 0 || Number(onboardHeight) <= 0}
                    className="flex-1 py-3.5 bg-bg-deep text-surface-2 font-bold text-sm rounded-xl cursor-pointer hover:bg-bg-deep/90 transition-colors disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="font-serif font-bold text-2xl text-bg-deep">Activity Level</h2>
                  <p className="text-xs text-ink-soft">How active is your average day-to-day lifestyle?</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    type="button"
                    onClick={() => setOnboardActivity('sedentary')}
                    className={`p-3.5 rounded-xl text-left flex flex-col gap-0.5 border cursor-pointer transition-all ${
                      onboardActivity === 'sedentary' 
                        ? 'bg-surface-2 border-protein text-ink shadow-sm' 
                        : 'bg-surface-theme border-rule text-ink-soft'
                    }`}
                  >
                    <span className="font-bold text-[13.5px] text-bg-deep">Sedentary</span>
                    <span className="text-[11px] opacity-80 font-medium">Desk job, minimal workouts or regular walking.</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setOnboardActivity('light')}
                    className={`p-3.5 rounded-xl text-left flex flex-col gap-0.5 border cursor-pointer transition-all ${
                      onboardActivity === 'light' 
                        ? 'bg-surface-2 border-protein text-ink shadow-sm' 
                        : 'bg-surface-theme border-rule text-ink-soft'
                    }`}
                  >
                    <span className="font-bold text-[13.5px] text-bg-deep">Lightly Active</span>
                    <span className="text-[11px] opacity-80 font-medium">Active daily life or light exercise 1-3 days/week.</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setOnboardActivity('moderate')}
                    className={`p-3.5 rounded-xl text-left flex flex-col gap-0.5 border cursor-pointer transition-all ${
                      onboardActivity === 'moderate' 
                        ? 'bg-surface-2 border-protein text-ink shadow-sm' 
                        : 'bg-surface-theme border-rule text-ink-soft'
                    }`}
                  >
                    <span className="font-bold text-[13.5px] text-bg-deep">Moderately Active</span>
                    <span className="text-[11px] opacity-80 font-medium">Regular gym training or sports 3-5 days/week.</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setOnboardActivity('active')}
                    className={`p-3.5 rounded-xl text-left flex flex-col gap-0.5 border cursor-pointer transition-all ${
                      onboardActivity === 'active' 
                        ? 'bg-surface-2 border-protein text-ink shadow-sm' 
                        : 'bg-surface-theme border-rule text-ink-soft'
                    }`}
                  >
                    <span className="font-bold text-[13.5px] text-bg-deep">Highly Active</span>
                    <span className="text-[11px] opacity-80 font-medium">Intense athletics or physically demanding work daily.</span>
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setOnboardStep(3)}
                    className="flex-1 py-3.5 border border-rule bg-surface-theme text-ink font-bold text-sm rounded-xl cursor-pointer hover:bg-surface-2 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setOnboardStep(5)}
                    className="flex-1 py-3.5 bg-bg-deep text-surface-2 font-bold text-sm rounded-xl cursor-pointer hover:bg-bg-deep/90 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="font-serif font-bold text-2xl text-bg-deep">Your fitness goal</h2>
                  <p className="text-xs text-ink-soft">We adjust macro suggestions based on your personal journey.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    type="button"
                    onClick={() => setOnboardGoal('lose')}
                    className={`p-4 rounded-xl text-left flex flex-col gap-1 border cursor-pointer transition-all ${
                      onboardGoal === 'lose' 
                        ? 'bg-surface-2 border-protein text-ink shadow-sm' 
                        : 'bg-surface-theme border-rule text-ink-soft'
                    }`}
                  >
                    <span className="font-bold text-sm text-bg-deep">Lose Weight (Fat Loss)</span>
                    <span className="text-[11.5px] opacity-80 font-medium">Safe calorie deficit to burn bodyfat.</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setOnboardGoal('maintain')}
                    className={`p-4 rounded-xl text-left flex flex-col gap-1 border cursor-pointer transition-all ${
                      onboardGoal === 'maintain' 
                        ? 'bg-surface-2 border-protein text-ink shadow-sm' 
                        : 'bg-surface-theme border-rule text-ink-soft'
                    }`}
                  >
                    <span className="font-bold text-sm text-bg-deep">Maintain Weight</span>
                    <span className="text-[11.5px] opacity-80 font-medium">Balanced BMR calories for consistent weight.</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setOnboardGoal('gain')}
                    className={`p-4 rounded-xl text-left flex flex-col gap-1 border cursor-pointer transition-all ${
                      onboardGoal === 'gain' 
                        ? 'bg-surface-2 border-protein text-ink shadow-sm' 
                        : 'bg-surface-theme border-rule text-ink-soft'
                    }`}
                  >
                    <span className="font-bold text-sm text-bg-deep">Gain Muscle (Clean/Lean Bulk)</span>
                    <span className="text-[11.5px] opacity-80 font-medium">Moderate calorie surplus with extra proteins.</span>
                  </button>
                </div>

                {/* Pace / Rate of Change Selector */}
                {(onboardGoal === 'lose' || onboardGoal === 'gain') && (
                  <div className="bg-surface-theme border border-rule/60 rounded-2xl p-4 space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-[13.5px] text-bg-deep">
                          {onboardGoal === 'lose' ? '🔥 Fat Loss Pace' : '🏋️ Muscle Gain Pace'}
                        </h3>
                        <p className="text-[10.5px] text-ink-soft -mt-0.5">Control the speed of your transformation</p>
                      </div>
                      <span className="text-[9.5px] font-bold font-mono px-2 py-0.5 rounded bg-protein/10 text-protein uppercase tracking-wider">
                        {onboardPace}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setOnboardPace('slow')}
                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          onboardPace === 'slow'
                            ? 'bg-bg-deep text-surface-2 border-bg-deep shadow'
                            : 'bg-surface-2/40 border-rule/50 text-ink-soft hover:bg-surface-2'
                        }`}
                      >
                        <span className="text-[12px] font-bold">Slow &amp; Easy</span>
                        <span className="text-[8px] font-normal opacity-80 mt-0.5">Highly Safe</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOnboardPace('moderate')}
                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          onboardPace === 'moderate'
                            ? 'bg-bg-deep text-surface-2 border-bg-deep shadow'
                            : 'bg-surface-2/40 border-rule/50 text-ink-soft hover:bg-surface-2'
                        }`}
                      >
                        <span className="text-[12px] font-bold">Moderate</span>
                        <span className="text-[8px] font-normal opacity-80 mt-0.5">Recommended</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOnboardPace('aggressive')}
                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          onboardPace === 'aggressive'
                            ? 'bg-protein text-white border-protein shadow-md shadow-protein/15'
                            : 'bg-surface-2/40 border-rule/50 text-ink-soft hover:bg-surface-2'
                        }`}
                      >
                        <span className="text-[12px] font-bold">Aggressive</span>
                        <span className="text-[8px] font-normal opacity-90 mt-0.5">Fast Pace!</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-ink-soft/90 leading-tight italic bg-surface-2/40 p-2 rounded-lg text-center">
                      {onboardGoal === 'lose' ? (
                        onboardPace === 'slow' 
                          ? '🌱 Gentle -200 kcal deficit. Minimal hunger, great for long term consistency.'
                          : onboardPace === 'moderate'
                            ? '⚡ Standard -450 kcal deficit. Optimal fat loss rate while preserving energy.'
                            : '🔥 Intense -750 kcal deficit. Fast fat loss! (Higher protein targets to shield muscle).'
                      ) : (
                        onboardPace === 'slow'
                          ? '🌱 Lean Bulk +150 kcal surplus. Minimizes fat spillover, very clean gains.'
                          : onboardPace === 'moderate'
                            ? '⚡ Clean Bulk +350 kcal surplus. Solid rate of quality muscle hypertrophy.'
                            : '🏋️ Fast Build +600 kcal surplus. Maximum raw muscle size and strength environment.'
                      )}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setOnboardStep(4)}
                    className="flex-1 py-3.5 border border-rule bg-surface-theme text-ink font-bold text-sm rounded-xl cursor-pointer hover:bg-surface-2 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setOnboardStep(6)}
                    className="flex-1 py-3.5 bg-bg-deep text-surface-2 font-bold text-sm rounded-xl cursor-pointer hover:bg-bg-deep/90 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 6 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <h2 className="font-serif font-bold text-2xl text-bg-deep">Your custom targets</h2>
                  <p className="text-xs text-ink-soft">These are calculated based on your specifications. Tweak them if you like!</p>
                </div>

                <div className="space-y-3 bg-surface-theme border border-rule p-4 rounded-2xl shadow-sm">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-ink-soft tracking-wider uppercase">Calorie Target (kcal)</label>
                    <input 
                      type="number" 
                      value={computedCal} 
                      onChange={(e) => setComputedCal(e.target.value)}
                      className="w-full bg-surface-2 border border-rule/60 rounded-xl px-3.5 py-2.5 text-[15px] font-mono text-ink focus:outline-none focus:border-protein"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-bold text-ink-soft tracking-wider uppercase">Protein (g)</label>
                      <input 
                        type="number" 
                        value={computedProtein} 
                        onChange={(e) => setComputedProtein(e.target.value)}
                        className="w-full bg-surface-2 border border-rule/60 rounded-xl px-2.5 py-2 text-[14px] font-mono text-ink focus:outline-none focus:border-protein"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-bold text-ink-soft tracking-wider uppercase">Carbs (g)</label>
                      <input 
                        type="number" 
                        value={computedCarbs} 
                        onChange={(e) => setComputedCarbs(e.target.value)}
                        className="w-full bg-surface-2 border border-rule/60 rounded-xl px-2.5 py-2 text-[14px] font-mono text-ink focus:outline-none focus:border-protein"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-bold text-ink-soft tracking-wider uppercase">Fat (g)</label>
                      <input 
                        type="number" 
                        value={computedFat} 
                        onChange={(e) => setComputedFat(e.target.value)}
                        className="w-full bg-surface-2 border border-rule/60 rounded-xl px-2.5 py-2 text-[14px] font-mono text-ink focus:outline-none focus:border-protein"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    onClick={() => setOnboardStep(5)}
                    className="flex-1 py-3.5 border border-rule bg-surface-theme text-ink font-bold text-sm rounded-xl cursor-pointer hover:bg-surface-2 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      const finalGoals: CalorieGoals = {
                        calories: Math.max(0, Number(computedCal) || 2000),
                        protein: Math.max(0, Number(computedProtein) || 120),
                        carbs: Math.max(0, Number(computedCarbs) || 250),
                        fat: Math.max(0, Number(computedFat) || 65)
                      };
                      localStorage.setItem('goals', JSON.stringify(finalGoals));
                      localStorage.setItem('onboarded', 'true');
                      localStorage.setItem('onboard_name', onboardName);
                      localStorage.setItem('onboard_age', onboardAge);
                      localStorage.setItem('onboard_gender', onboardGender);
                      localStorage.setItem('onboard_weight', onboardWeight);
                      localStorage.setItem('onboard_height', onboardHeight);
                      localStorage.setItem('onboard_activity', onboardActivity);
                      localStorage.setItem('onboard_goal', onboardGoal);
                      localStorage.setItem('onboard_pace', onboardPace);
                      setGoals(finalGoals);
                      setIsOnboarded(true);
                    }}
                    className="flex-1 py-3.5 bg-bg-deep text-surface-2 font-bold text-sm rounded-xl cursor-pointer hover:bg-bg-deep/90 transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4.5 h-4.5 text-emerald-400" strokeWidth={2.5} />
                    Start Tracking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="calorie-tracker-root" className="min-h-screen bg-bg text-ink flex flex-col font-sans">
      <div className="max-w-[480px] w-full mx-auto px-4 pt-5 pb-24 flex flex-col">
        
        {/* Above App Interface Greeting Banner */}
        {onboardName && (
          <div id="above-interface-user-badge" className="flex items-center justify-between text-[11px] font-bold text-protein/90 mb-2 px-2.5 py-1.5 bg-protein/5 border border-protein/10 rounded-lg shadow-sm">
            <span className="flex items-center gap-1.5">
              ✨ <span>Active Profile: <strong>{onboardName}</strong></span>
            </span>
            <span className="text-[10px] font-mono font-medium text-ink-soft uppercase tracking-wider">
              Stay Healthy &amp; Fit
            </span>
          </div>
        )}

        {/* Header Section */}
        <header id="tracker-header" className="flex items-center justify-between mb-2">
          <div>
            <div id="app-logo" className="font-serif font-bold text-[30px] tracking-tight text-bg-deep flex items-center gap-1.5">
              Indian <em className="italic font-medium text-protein">Cal</em>
              {/* Active Avatar Badge */}
              {(() => {
                const currentAv = getAvatarInfo(desiAvatar);
                return (
                  <button
                    type="button"
                    onClick={() => {
                      const idx = AVATARS.findIndex(a => a.id === desiAvatar);
                      const nextIdx = (idx + 1) % AVATARS.length;
                      const nextAv = AVATARS[nextIdx];
                      setDesiAvatar(nextAv.id);
                      localStorage.setItem('desi_avatar', nextAv.id);
                    }}
                    className="ml-1 px-2.5 py-0.5 rounded-full bg-protein/10 text-protein text-[11px] font-bold flex items-center gap-1 border border-protein/25 cursor-pointer hover:bg-protein/20 transition-all active:scale-95"
                    title={`Active Persona: ${currentAv.name} (${currentAv.title}) - Tap to cycle!`}
                  >
                    <span className="text-sm">{currentAv.emoji}</span>
                    <span className="text-[9px] uppercase font-mono tracking-wider">{currentAv.title}</span>
                  </button>
                );
              })()}
            </div>
            <p className="text-[11.5px] text-ink-soft tracking-wider font-semibold uppercase -mt-1">
              calories &amp; macros, Indian style
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {isOffline && (
              <div 
                id="offline-status-badge"
                className="px-2 py-1 bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/25 rounded-lg text-[10.5px] font-semibold flex items-center gap-1 animate-pulse"
                title="Working offline. Your logs are safely and automatically saved to your local database!"
              >
                <WifiOff className="w-3 h-3" />
                <span>Saved Offline</span>
              </div>
            )}
            <button 
              id="theme-toggle-btn"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
              className="p-2 text-ink opacity-70 hover:opacity-100 transition-all cursor-pointer rounded-xl hover:bg-surface-2/50 flex items-center justify-center"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>
            <button 
              id="settings-trigger-btn"
              onClick={() => {
                setGName(onboardName);
                setGCal(goals.calories.toString());
                setGProtein(goals.protein.toString());
                setGCarbs(goals.carbs.toString());
                setGFat(goals.fat.toString());
                setIsSettingsOpen(true);
              }} 
              className="p-2 text-ink opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Date Selector bar */}
        <div id="date-navigation-bar" className="flex items-center justify-center gap-4 my-4">
          <button 
            id="prev-day-btn"
            onClick={handlePrevDay} 
            className="w-8 h-8 rounded-full border border-rule bg-surface-theme flex items-center justify-center cursor-pointer hover:bg-surface-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-ink" />
          </button>
          <div className="min-w-[150px] text-center">
            <span className="block font-semibold text-[11px] text-protein tracking-widest uppercase mb-0.5">
              {getRelativeDateLabel(currentDate)}
            </span>
            <span className="font-mono text-[13.5px] font-semibold text-ink">
              {displayDateStr(currentDate)}
            </span>
          </div>
          <button 
            id="next-day-btn"
            onClick={handleNextDay} 
            className="w-8 h-8 rounded-full border border-rule bg-surface-theme flex items-center justify-center cursor-pointer hover:bg-surface-2 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-ink" />
          </button>
        </div>

        {/* Thali Ring Visualizer Block */}
        <div 
          id="thali-ring-card" 
          onClick={() => {
            setIsSuggestOpen(true);
            fetchMealSuggestions();
          }}
          className="relative overflow-hidden bg-surface-theme rounded-3xl p-6 shadow-[0_2px_0_rgba(43,36,23,0.06),_0_8px_24px_rgba(43,36,23,0.08)] mb-4 cursor-pointer group hover:shadow-[0_4px_12px_rgba(43,36,23,0.1)] hover:scale-[1.02] active:scale-[0.995] transition-all"
          title="Click to get dynamic Indian meal recommendations based on your remaining macros"
        >
          {/* Authentic Radial Thali Engraving Pattern Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[repeating-radial-gradient(circle_at_50%_50%,_transparent_0_38px,_rgba(43,36,23,0.015)_39px,_transparent_40px)]" />

          {/* Share Button (Top Right) */}
          <button
            type="button"
            id="thali-share-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
            }}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-2 hover:bg-surface-theme border border-rule/60 flex items-center justify-center cursor-pointer transition-all shadow-sm hover:scale-105 active:scale-95 group/btn"
            title="Share daily macro progress"
          >
            <Share2 className="w-4 h-4 text-ink-soft group-hover/btn:text-bg-deep transition-colors" />
          </button>

          <div className="flex items-center gap-5 relative z-10">
            {/* SVG Concentric Multi-Rings */}
            <div className="relative w-[172px] h-[172px] flex-shrink-0">
              <svg viewBox="0 0 172 172" className="w-full h-full transform -rotate-90">
                {/* Protein track & fill */}
                <circle className="stroke-rule fill-none" cx="86" cy="86" r="76" strokeWidth="11" />
                <circle 
                  className="stroke-protein fill-none stroke-linecap-round transition-[stroke-dashoffset] duration-700 ease-out" 
                  cx="86" cy="86" r="76" strokeWidth="11"
                  strokeDasharray={getCircumference(76)}
                  strokeDashoffset={getDashoffset(76, (totals.protein / goals.protein) * 100)}
                />
                {/* Carbs track & fill */}
                <circle className="stroke-rule fill-none" cx="86" cy="86" r="58" strokeWidth="11" />
                <circle 
                  className="stroke-carbs fill-none stroke-linecap-round transition-[stroke-dashoffset] duration-700 ease-out" 
                  cx="86" cy="86" r="58" strokeWidth="11"
                  strokeDasharray={getCircumference(58)}
                  strokeDashoffset={getDashoffset(58, (totals.carbs / goals.carbs) * 100)}
                />
                {/* Fat track & fill */}
                <circle className="stroke-rule fill-none" cx="86" cy="86" r="40" strokeWidth="11" />
                <circle 
                  className="stroke-fat fill-none stroke-linecap-round transition-[stroke-dashoffset] duration-700 ease-out" 
                  cx="86" cy="86" r="40" strokeWidth="11"
                  strokeDasharray={getCircumference(40)}
                  strokeDashoffset={getDashoffset(40, (totals.fat / goals.fat) * 100)}
                />
              </svg>
              {/* Central Text Panel */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span id="calories-eaten" className="font-serif font-bold text-[32px] leading-none text-bg-deep">
                  {Math.round(totals.calories)}
                </span>
                <span id="calories-goal-text" className="font-mono text-[11px] text-ink-soft mt-1">
                  of {goals.calories} kcal
                </span>
                <span className="text-[9.5px] font-semibold tracking-widest text-ink-soft uppercase mt-1.5">
                  today
                </span>
              </div>
            </div>

            {/* Concentric Thali Macros Legend List */}
            <div className="flex-1 flex flex-col gap-2.5">
              
              {/* Protein Row */}
              <div id="legend-protein-item" className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-protein flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Protein</div>
                  <div className="font-mono text-[13px] font-semibold text-ink">
                    {Math.round(totals.protein * 10) / 10} <span className="text-ink-soft text-[11px]">/ {goals.protein}g</span>
                  </div>
                  <div className="h-1.5 bg-rule rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-protein rounded-full transition-[width] duration-500 ease-out" 
                      style={{ width: `${Math.min(100, (totals.protein / goals.protein) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Carbs Row */}
              <div id="legend-carbs-item" className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-carbs flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Carbs</div>
                  <div className="font-mono text-[13px] font-semibold text-ink">
                    {Math.round(totals.carbs * 10) / 10} <span className="text-ink-soft text-[11px]">/ {goals.carbs}g</span>
                  </div>
                  <div className="h-1.5 bg-rule rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-carbs rounded-full transition-[width] duration-500 ease-out" 
                      style={{ width: `${Math.min(100, (totals.carbs / goals.carbs) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Fat Row */}
              <div id="legend-fat-item" className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-fat flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Fat</div>
                  <div className="font-mono text-[13px] font-semibold text-ink">
                    {Math.round(totals.fat * 10) / 10} <span className="text-ink-soft text-[11px]">/ {goals.fat}g</span>
                  </div>
                  <div className="h-1.5 bg-rule rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-fat rounded-full transition-[width] duration-500 ease-out" 
                      style={{ width: `${Math.min(100, (totals.fat / goals.fat) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Indian Suggestions Indicator */}
              <div className="pt-1">
                <div className="py-1.5 px-2 bg-gradient-to-r from-protein/5 via-carbs/5 to-fat/5 border border-rule/40 rounded-xl flex items-center justify-center gap-1 text-[9.5px] font-bold text-bg-deep group-hover:from-protein/10 group-hover:to-fat/10 transition-all">
                  <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                  <span>Tap to Suggest Indian Meals</span>
                </div>
              </div>

            </div>
          </div>

          {/* Action Trigger Buttons inside the card block */}
          <div className="flex gap-2.5 mt-5" onClick={(e) => e.stopPropagation()}>
            <button 
              id="ai-scan-overlay-trigger"
              onClick={() => {
                setScanMode('photo');
                resetScanState();
                setIsScanOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-[13.5px] bg-bg-deep text-surface-2 shadow-lg shadow-bg-deep/10 flex items-center justify-center gap-2 cursor-pointer hover:bg-bg-deep/90 transition-colors"
            >
              <Camera className="w-4 h-4 text-indigo-400" />
              AI: photo or describe
            </button>
            <button 
              id="manual-add-overlay-trigger"
              onClick={() => setIsManualOpen(true)}
              className="flex-1 py-3 px-4 rounded-xl border border-rule bg-surface-theme text-ink font-bold text-[13.5px] flex items-center justify-center gap-2 cursor-pointer hover:bg-surface-2 transition-colors"
            >
              <Plus className="w-4 h-4 text-ink-soft" />
              Add manually
            </button>
          </div>
        </div>

        {/* DUOLINGO-STYLE STREAK & CALENDAR NAVIGATION BAR */}
        <div id="gamified-streak-bar" className="bg-surface-theme border border-rule/50 rounded-2xl p-3 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🔥</span>
              <div>
                <span className="font-serif font-bold text-[14px] text-bg-deep">{getStreakCount()}-Day Streak</span>
                <span className="text-[9.5px] text-ink-soft block -mt-0.5">Keep logging meals daily!</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-protein/10 text-protein border border-protein/20 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-protein animate-pulse" />
              <span>{Math.round(totals.calories)} kcal logged today</span>
            </div>
          </div>

          {/* 7 Days Row */}
          <div className="grid grid-cols-7 gap-1">
            {getPastSevenDays().map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentDate(day.date)}
                className={`py-2 rounded-xl flex flex-col items-center justify-between transition-all cursor-pointer relative ${
                  day.isActive 
                    ? 'bg-bg-deep text-surface-2 ring-2 ring-protein/40 font-bold shadow-md' 
                    : 'bg-surface-2/40 hover:bg-surface-2 text-ink-soft'
                }`}
              >
                <span className="text-[8.5px] uppercase tracking-wider font-semibold opacity-80">
                  {day.name}
                </span>
                
                {/* Flame indicator or circular day label */}
                <div className="my-1 flex items-center justify-center">
                  {day.hasLogs ? (
                    <span className="text-xs animate-bounce" title="Logged food on this day!">🔥</span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-rule/80" />
                  )}
                </div>

                <span className="font-mono text-[11px] font-bold">
                  {day.date.getDate()}
                </span>

                {day.isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-protein animate-ping" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* WEEKLY TREND CHART & GAME STATS */}
        <div id="weekly-calorie-chart-card" className="bg-surface-theme border border-rule/50 rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <span className="text-[10px] font-bold text-ink-soft tracking-wider uppercase">Weekly Calories Trend</span>
              <h4 className="font-serif font-bold text-[13.5px] text-bg-deep -mt-0.5">Consistency is Key</h4>
            </div>
            <span className="text-[10px] font-mono text-ink-soft bg-surface-2 px-2 py-1 rounded">
              Goal: {goals.calories} kcal
            </span>
          </div>

          {/* Micro chart bars */}
          <div className="flex items-end justify-between h-20 pt-1 px-1.5 gap-2.5">
            {getPastSevenDays().map((day, idx) => {
              const pct = goals.calories > 0 ? Math.min(100, (day.calories / goals.calories) * 100) : 0;
              const isOver = day.calories > goals.calories;
              
              return (
                <div 
                  key={idx} 
                  onClick={() => setCurrentDate(day.date)}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
                >
                  <div className="relative w-full h-full flex items-end">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-bg-deep text-surface-2 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {day.calories} kcal ({day.protein}g P)
                    </div>

                    {/* Background track */}
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-rule/30 rounded-t-lg pointer-events-none" />

                    {/* Fill */}
                    <div 
                      className={`w-full rounded-t-lg transition-[height] duration-500 ease-out relative ${
                        isOver 
                          ? 'bg-protein/80' 
                          : pct >= 80 
                            ? 'bg-gradient-to-t from-carbs to-carbs/80' 
                            : pct > 0 
                              ? 'bg-gradient-to-t from-fat to-fat/80'
                              : 'bg-transparent'
                      }`}
                      style={{ height: `${pct || 4}%` }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-ink-soft/80 group-hover:text-ink font-bold transition-colors">
                    {day.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fit Goal & Pace Banner */}
        <div id="fitness-goal-pace-banner" className="bg-gradient-to-r from-bg-deep/5 to-surface-theme border border-rule/55 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-3 mt-1.5 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {onboardGoal === 'lose' ? '🔥' : onboardGoal === 'gain' ? '🏋️' : '⚖️'}
            </span>
            <div>
              <span className="font-serif font-bold text-[12.5px] text-bg-deep">
                {onboardGoal === 'lose' 
                  ? 'Fat Loss Mode' 
                  : onboardGoal === 'gain' 
                    ? 'Muscle Gain Mode' 
                    : 'Weight Maintenance Mode'}
              </span>
              {(onboardGoal === 'lose' || onboardGoal === 'gain') && (
                <span className="text-[10px] text-ink-soft block -mt-0.5">
                  Pace: <strong className="capitalize text-protein font-semibold">{onboardPace}</strong>
                  {onboardPace === 'slow' && ' (Gentle & sustainable)'}
                  {onboardPace === 'moderate' && ' (Balanced, steady)'}
                  {onboardPace === 'aggressive' && ' (Rapid transformation)'}
                </span>
              )}
              {onboardGoal === 'maintain' && (
                <span className="text-[10px] text-ink-soft block -mt-0.5">
                  Consistent BMR &amp; activity maintenance.
                </span>
              )}
            </div>
          </div>
          <button 
            type="button"
            onClick={() => {
              setIsOnboarded(false);
              setOnboardStep(0);
            }}
            className="text-[10px] font-bold text-protein border border-protein/20 hover:bg-protein/5 bg-white px-2.5 py-1 rounded-lg transition-all cursor-pointer flex-shrink-0"
          >
            Adjust Target
          </button>
        </div>

        {/* FEATURE: DESI CHEAT DAMAGE METER */}
        <div id="desi-cheat-meter-card" className="bg-surface-theme border border-rule/55 rounded-3xl p-5 shadow-sm mt-1.5 mb-3.5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h4 className="font-serif font-bold text-[15px] text-bg-deep">Desi Cheat Damage Meter</h4>
              <p className="text-[10px] text-ink-soft">Instantly simulate and log the impact of typical Indian street foods!</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 items-start">
            {/* Left selector menu */}
            <div className="space-y-2">
              <label className="text-[9.5px] font-bold text-ink-soft tracking-wider uppercase">Select Cheat Treat</label>
              <div className="relative">
                <select 
                  value={selectedCheat}
                  onChange={(e) => setSelectedCheat(e.target.value)}
                  className="w-full bg-surface-2 border border-rule/65 rounded-xl pl-2.5 pr-8 py-2 text-xs text-ink focus:outline-none focus:border-protein cursor-pointer appearance-none font-medium"
                >
                  {CHEAT_FOODS.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.emoji} {f.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-soft text-[10px]">▼</div>
              </div>

              {/* Simulation metrics breakdown */}
              {(() => {
                const cheat = CHEAT_FOODS.find(f => f.id === selectedCheat) || CHEAT_FOODS[0];
                return (
                  <div className="bg-surface-2 rounded-2xl p-3 border border-rule/40 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] font-bold uppercase text-ink-soft">Energy Cost</span>
                      <span className="font-mono text-xs font-bold text-protein">{cheat.cal} kcal</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-mono">
                      <div className="bg-protein/5 py-1 px-0.5 rounded border border-protein/10">
                        <span className="block text-ink-soft text-[8px] uppercase">Prot</span>
                        <strong className="text-protein">{cheat.protein}g</strong>
                      </div>
                      <div className="bg-carbs/5 py-1 px-0.5 rounded border border-carbs/10">
                        <span className="block text-ink-soft text-[8px] uppercase">Carbs</span>
                        <strong className="text-carbs">{cheat.carbs}g</strong>
                      </div>
                      <div className="bg-fat/5 py-1 px-0.5 rounded border border-fat/10">
                        <span className="block text-ink-soft text-[8px] uppercase">Fat</span>
                        <strong className="text-fat">{cheat.fat}g</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right burn action plan details */}
            {(() => {
              const cheat = CHEAT_FOODS.find(f => f.id === selectedCheat) || CHEAT_FOODS[0];
              return (
                <div className="space-y-2 flex flex-col justify-between h-full pt-1.5">
                  <div>
                    <span className="text-[9.5px] font-bold text-ink-soft tracking-wider uppercase block">Burn-Off Mission</span>
                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-xl p-2.5 mt-1 text-[11px] text-orange-900 dark:text-orange-300 font-medium flex items-start gap-1.5 leading-normal">
                      <span className="text-xs">⚡</span>
                      <span>To completely burn this off, you will need: <strong className="text-orange-950 dark:text-white font-bold">{cheat.burnTime}</strong>!</span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      addEntry({
                        name: `${cheat.emoji} ${cheat.name}`,
                        calories: cheat.cal,
                        protein: cheat.protein,
                        carbs: cheat.carbs,
                        fat: cheat.fat,
                        source: 'manual'
                      });
                    }}
                    className="w-full mt-2.5 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-[11.5px] rounded-xl cursor-pointer transition-colors text-center flex items-center justify-center gap-1 border border-red-700/30"
                  >
                    <span>⚠️</span> Log &amp; Deduct Cal
                  </button>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Quick Add Section */}
        <section id="quick-add-section" className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif font-bold text-[15px] text-bg-deep">
              Quick add
            </h3>
            <span className="font-mono text-[10px] text-ink-soft">Click standard item</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-rule">
            {QUICK_ADD.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => handleQuickAdd(item)}
                className="flex-shrink-0 bg-surface-theme border border-rule rounded-xl px-3 py-2 flex flex-col gap-0.5 text-left min-w-[100px] cursor-pointer hover:border-carbs hover:bg-surface-2/40 transition-colors"
              >
                <span className="text-[12.5px] font-semibold text-ink truncate max-w-[120px]">{item.name}</span>
                <span className="font-mono text-[10.5px] text-ink-soft">{item.calories} kcal</span>
              </button>
            ))}
          </div>
        </section>

        {/* Water & Weight Tracker Section */}
        <section id="bento-trackers" className="mt-5 grid grid-cols-2 gap-3.5">
          {/* Water Tracker Bento Box */}
          <div id="water-tracker-card" className="bg-surface-theme border border-rule/50 rounded-2xl p-4 flex flex-col justify-between shadow-[0_1px_0_rgba(43,36,23,0.03)]">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-bold text-ink-soft tracking-wider uppercase flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
                  Water
                </span>
                {waterIntake >= waterGoal && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">Goal!</span>
                )}
              </div>
              <div className="font-mono text-lg font-bold text-bg-deep leading-tight">
                {waterIntake} <span className="text-xs text-ink-soft font-normal">/ {waterGoal} ml</span>
              </div>
              
              {/* Simple aesthetic fluid bar */}
              <div className="h-2 bg-rule rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.min(100, (waterIntake / waterGoal) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-1.5 mt-4">
              <button 
                onClick={() => adjustWater(250)}
                className="flex-1 py-1.5 bg-surface-2 hover:bg-surface-3 border border-rule/60 text-ink font-mono font-bold text-[11px] rounded-lg cursor-pointer transition-colors"
                title="Add 1 glass (250ml)"
              >
                +250ml
              </button>
              <button 
                onClick={() => adjustWater(-250)}
                disabled={waterIntake <= 0}
                className="py-1.5 px-2 bg-surface-2 hover:bg-surface-3 border border-rule/60 text-ink-soft disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
                title="Remove 1 glass"
              >
                -
              </button>
            </div>
          </div>

          {/* Weight Tracker Bento Box */}
          <div id="weight-tracker-card" className="bg-surface-theme border border-rule/50 rounded-2xl p-4 flex flex-col justify-between shadow-[0_1px_0_rgba(43,36,23,0.03)]">
            <div>
              <span className="text-[12px] font-bold text-ink-soft tracking-wider uppercase flex items-center gap-1 mb-1">
                <Scale className="w-3.5 h-3.5 text-protein" />
                Weight (kg)
              </span>
              
              <form onSubmit={logWeight} className="flex gap-1.5">
                <input 
                  type="number" 
                  step="0.1"
                  min="20"
                  max="300"
                  placeholder={weightHistory[0]?.weight ? `${weightHistory[0].weight} kg` : "e.g. 68.5"}
                  value={currentWeightLog}
                  onChange={(e) => setCurrentWeightLog(e.target.value)}
                  className="flex-1 bg-surface-2 border border-rule/60 rounded-lg px-2 py-1 text-xs font-mono text-ink focus:outline-none focus:border-protein min-w-0"
                />
                <button 
                  type="submit"
                  className="px-2.5 py-1 bg-bg-deep hover:bg-bg-deep/90 text-surface-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Log
                </button>
              </form>

              {/* Lightweight history summary inline */}
              <div className="mt-3.5 space-y-1">
                {weightHistory.length === 0 ? (
                  <span className="text-[10px] text-ink-soft/60 italic block">No logs recorded yet</span>
                ) : (
                  weightHistory.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] font-mono text-ink-soft">
                      <span className="truncate max-w-[70px]">{displayDateStr(new Date(item.date))}</span>
                      <span className="font-bold text-ink flex items-center gap-1">
                        {item.weight} kg
                        <button 
                          type="button"
                          onClick={() => deleteWeightLog(item.date)}
                          className="text-danger hover:text-danger/80 p-0.5 opacity-50 hover:opacity-100"
                          title="Delete weight log"
                        >
                          ×
                        </button>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Weight Congratulation & Encouragement Banner */}
        {(() => {
          const feedback = getWeightFeedback();
          if (!feedback || dismissedFeedback) return null;
          return (
            <div 
              id="weight-progress-feedback-banner" 
              className={`mt-3 p-4 rounded-2xl border text-[12px] leading-relaxed transition-all flex items-start gap-2.5 shadow-sm relative ${feedback.bg}`}
            >
              <div className="flex-1 pr-6">
                <span className="font-bold block text-[12.5px] mb-1">
                  {feedback.type === 'congratulate' ? '🎉 Weight Log Milestone!' : '💪 Weight Tracking Status'}
                </span>
                <span>{feedback.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setDismissedFeedback(true)}
                className="absolute right-3 top-3 text-[14px] leading-none opacity-50 hover:opacity-100 transition-opacity p-0.5 cursor-pointer font-bold"
                aria-label="Close message"
              >
                ×
              </button>
            </div>
          );
        })()}

        {/* QUEST ACHIEVEMENTS & MINI-CHALLENGES */}
        <div id="quest-achievements-panel" className="bg-surface-theme border border-rule/50 rounded-2xl p-4 shadow-sm mt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold text-ink-soft tracking-wider uppercase flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
                Daily Achievements
              </span>
              <h4 className="font-serif font-bold text-[13.5px] text-bg-deep -mt-0.5">Today's Nutrition Quests</h4>
            </div>
            {/* Quest percentage completed */}
            {(() => {
              const count = [
                waterIntake >= waterGoal,
                totals.protein >= goals.protein * 0.9,
                Math.abs(totals.calories - goals.calories) <= 150 && totals.calories > 0,
                entries.length >= 3
              ].filter(Boolean).length;
              return (
                <span className="text-[10.5px] font-bold font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  {count}/4 Completed
                </span>
              );
            })()}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Quest 1 */}
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
              waterIntake >= waterGoal 
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50' 
                : 'bg-surface-2/30 border-rule/45'
            }`}>
              <div className="flex items-start justify-between">
                <span className="text-[10.5px] font-bold">Hydration Hero</span>
                <span className="text-xs">{waterIntake >= waterGoal ? '💧' : '💤'}</span>
              </div>
              <p className="text-[9.5px] text-ink-soft mt-1 leading-tight">Log {waterGoal}ml water</p>
              <div className="h-1 bg-rule/30 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${waterIntake >= waterGoal ? 'bg-emerald-500' : 'bg-sky-400'}`}
                  style={{ width: `${Math.min(100, (waterIntake / waterGoal) * 100)}%` }}
                />
              </div>
            </div>

            {/* Quest 2 */}
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
              totals.protein >= goals.protein * 0.9 
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50' 
                : 'bg-surface-2/30 border-rule/45'
            }`}>
              <div className="flex items-start justify-between">
                <span className="text-[10.5px] font-bold">Protein Power</span>
                <span className="text-xs">{totals.protein >= goals.protein * 0.9 ? '🏋️' : '🦴'}</span>
              </div>
              <p className="text-[9.5px] text-ink-soft mt-1 leading-tight">Hit 90% Protein target</p>
              <div className="h-1 bg-rule/30 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${totals.protein >= goals.protein * 0.9 ? 'bg-emerald-500' : 'bg-protein'}`}
                  style={{ width: `${Math.min(100, (totals.protein / goals.protein) * 100)}%` }}
                />
              </div>
            </div>

            {/* Quest 3 */}
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
              Math.abs(totals.calories - goals.calories) <= 150 && totals.calories > 0
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50' 
                : 'bg-surface-2/30 border-rule/45'
            }`}>
              <div className="flex items-start justify-between">
                <span className="text-[10.5px] font-bold">Macro Target-In</span>
                <span className="text-xs">{Math.abs(totals.calories - goals.calories) <= 150 && totals.calories > 0 ? '🎯' : '⚖️'}</span>
              </div>
              <p className="text-[9.5px] text-ink-soft mt-1 leading-tight">Calorie margin &plusmn;150 kcal</p>
              <div className="h-1 bg-rule/30 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${Math.abs(totals.calories - goals.calories) <= 150 && totals.calories > 0 ? 'bg-emerald-500' : 'bg-carbs'}`}
                  style={{ width: `${totals.calories > 0 ? Math.min(100, (totals.calories / goals.calories) * 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Quest 4 */}
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
              entries.length >= 3 
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50' 
                : 'bg-surface-2/30 border-rule/45'
            }`}>
              <div className="flex items-start justify-between">
                <span className="text-[10.5px] font-bold">Consistent Log</span>
                <span className="text-xs">{entries.length >= 3 ? '✅' : '📝'}</span>
              </div>
              <p className="text-[9.5px] text-ink-soft mt-1 leading-tight">Log at least 3 distinct meals</p>
              <div className="h-1 bg-rule/30 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${entries.length >= 3 ? 'bg-emerald-500' : 'bg-fat'}`}
                  style={{ width: `${Math.min(100, (entries.length / 3) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ROTATING INDIAN NUTRITION TIPS CARD */}
        <div id="indian-nutrition-tips-box" className="bg-gradient-to-r from-protein/5 via-surface-theme to-carbs/5 border border-rule/50 rounded-2xl p-4 shadow-sm mt-4 flex gap-3 items-start">
          <div className="w-10 h-10 rounded-xl bg-surface-theme border border-rule flex items-center justify-center text-xl flex-shrink-0 shadow-sm animate-pulse">
            {INDIAN_TIPS[nutritionTipIdx].icon}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-protein tracking-widest uppercase">Indian Nutrition Tip</span>
              <button 
                type="button"
                onClick={handleNextTip} 
                className="text-[9.5px] text-indigo-600 font-bold hover:underline flex items-center cursor-pointer"
              >
                Next Fact &rarr;
              </button>
            </div>
            <h4 className="font-serif font-bold text-[13px] text-bg-deep leading-tight">
              {INDIAN_TIPS[nutritionTipIdx].title}
            </h4>
            <p className="text-[11px] text-ink-soft leading-normal italic">
              "{INDIAN_TIPS[nutritionTipIdx].text}"
            </p>
          </div>
        </div>

        {/* Today's Log Section */}
        <section id="entries-log-section" className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-serif font-bold text-[15px] text-bg-deep">
              Today's log
            </h3>
            <span className="font-mono text-[11px] text-ink-soft font-semibold bg-surface-2 px-2 py-0.5 rounded-lg border border-rule/50">
              {entries.length} {entries.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          <div className="space-y-2">
            {entries.length === 0 ? (
              <div id="log-empty-state" className="text-center py-8 px-4 text-ink-soft bg-surface-theme/50 rounded-2xl border border-rule/40">
                <span className="block text-3xl mb-1.5">🍽️</span>
                <p className="text-[13px]">Nothing logged yet — scan a plate or add something.</p>
              </div>
            ) : (
              [...entries].reverse().map((e) => (
                <div 
                  key={e.id} 
                  className="bg-surface-theme rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-[0_1px_0_rgba(43,36,23,0.05)] border border-rule/25 hover:border-rule/65 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-surface-2 border border-rule/40 flex items-center justify-center flex-shrink-0 text-base">
                    {e.source === 'ai' ? '📷' : '✍️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-bold text-ink truncate leading-tight">
                      {e.name}
                    </p>
                    <p className="font-mono text-[10.5px] text-ink-soft mt-1">
                      <b className="text-protein font-semibold">P {Math.round(e.protein * 10) / 10}g</b>
                      {' · '}
                      <span className="text-carbs font-semibold">C {Math.round(e.carbs * 10) / 10}g</span>
                      {' · '}
                      <span className="text-fat font-semibold">F {Math.round(e.fat * 10) / 10}g</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-[14px] text-ink">
                      {Math.round(e.calories)}
                    </div>
                    <span className="block text-[8.5px] text-ink-soft font-semibold uppercase tracking-wider -mt-0.5">
                      kcal
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteEntry(e.id)}
                    className="p-1.5 text-ink-soft opacity-40 hover:opacity-100 hover:text-danger cursor-pointer transition-all"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Developer Info Footer card */}
        <footer id="developer-footer" className="mt-8 mb-4 pt-6 border-t border-rule/50 text-center">
          <div className="bg-gradient-to-br from-surface-theme to-surface-2/40 border border-rule/40 rounded-2xl p-5 relative overflow-hidden shadow-sm">
            {/* Subtle design circles */}
            <div className="absolute top-0 right-0 w-24 h-24 border border-rule/10 rounded-full translate-x-8 -translate-y-8 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border border-rule/10 rounded-full -translate-x-6 translate-y-6 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#B49664] uppercase">Designed & Crafted By</span>
              <h4 className="font-serif font-bold text-lg text-bg-deep">Aayush Yadav</h4>
              
              <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                <MapPin className="w-3.5 h-3.5 text-[#B49664]" />
                <span>Thane, Maharashtra</span>
              </div>
              
              <div className="w-10 h-[1px] bg-rule/60 my-1" />
              
              <a 
                href="https://instagram.com/a_aayush_y" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-theme border border-rule hover:border-indigo-400 hover:text-indigo-600 transition-all text-xs font-semibold text-ink cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                <span>@a_aayush_y</span>
              </a>
            </div>
          </div>
          
          <p className="text-[10px] text-ink-soft/50 mt-4 font-mono">
            © {new Date().getFullYear()} INDIAN CAL • Build Version 1.2
          </p>
        </footer>

      </div>

      {/* MODAL 1: AI Food Scanner & Input Overlay */}
      {isScanOpen && (
        <div id="ai-scanner-modal" className="fixed inset-0 bg-bg-deep/50 backdrop-blur-[2px] flex items-end justify-center z-50">
          {/* Modal Overlay click-away trigger */}
          <div className="absolute inset-0" onClick={() => setIsScanOpen(false)} />
          
          <div className="bg-bg w-full max-w-[480px] rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto shadow-2xl relative z-10 transition-transform duration-300">
            {/* Sheet header */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif font-bold text-[19px] text-bg-deep flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                AI food analysis
              </h4>
              <button 
                onClick={() => setIsScanOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-theme border border-rule flex items-center justify-center text-ink cursor-pointer hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free & AI-Optional Info Banner */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/50 rounded-xl mb-4 text-[11px] text-emerald-800 leading-relaxed shadow-xs">
              💚 <strong>100% Free &amp; Offline Friendly:</strong> You do NOT need any active AI to use this app. Our local direct search database handles 4,500+ Indian meals instantly offline without any daily limits or internet required!
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-surface-2 rounded-xl p-1 mb-4 border border-rule/40">
              <button 
                onClick={() => {
                  setScanMode('photo');
                  setAnalysisResult(null);
                  setAnalysisError(null);
                }}
                className={`flex-1 py-2 rounded-lg font-bold text-[12.5px] cursor-pointer text-center flex items-center justify-center gap-1.5 transition-all ${
                  scanMode === 'photo' 
                    ? 'bg-bg-deep text-surface-2 shadow-sm' 
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                📷 Photo
              </button>
              <button 
                onClick={() => {
                  setScanMode('describe');
                  setAnalysisResult(null);
                  setAnalysisError(null);
                }}
                className={`flex-1 py-2 rounded-lg font-bold text-[12.5px] cursor-pointer text-center flex items-center justify-center gap-1.5 transition-all ${
                  scanMode === 'describe' 
                    ? 'bg-bg-deep text-surface-2 shadow-sm' 
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                ✍️ Describe
              </button>
            </div>

            {/* AI Results, Input, Loading display depending on scanMode */}
            {isAnalyzing ? (
              <div id="ai-analyzing-progress-loader" className="flex flex-col items-center justify-center py-10 gap-3 text-ink-soft text-[13.5px]">
                <div className="w-7 h-7 rounded-full border-3 border-rule border-t-protein animate-spin" />
                <span className="font-semibold text-bg-deep">Analyzing your plate...</span>
              </div>
            ) : analysisResult ? (
              // AI Evaluation editable result form
              <div id="ai-evaluation-result-block" className="space-y-4">
                {previewImgUrl && scanMode === 'photo' && (
                  <img src={previewImgUrl} alt="Analyzed plate" className="w-full h-44 object-cover rounded-xl border border-rule/50" />
                )}
                {scanMode === 'describe' && (
                  <div className="bg-surface-2 rounded-xl p-3 text-[12.5px] text-ink-soft italic border border-rule/40">
                    "{descriptionText}"
                  </div>
                )}

                {/* Summary Info Card */}
                <div className="bg-surface-2 rounded-xl p-4 border border-rule/60 flex flex-col gap-1 shadow-sm">
                  <div className="font-serif font-bold text-[16px] text-bg-deep">{analysisResult.dish_name}</div>
                  <div className="text-[11.5px] text-ink-soft font-medium">Serving: {analysisResult.serving_estimate}</div>
                  <div className="mt-1">
                    <span className={`inline-block font-mono font-bold text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full ${
                      analysisResult.confidence === 'high' ? 'bg-fat-soft text-fat border border-fat/25' :
                      analysisResult.confidence === 'medium' ? 'bg-carbs-soft text-carbs border border-carbs/25' :
                      'bg-protein-soft text-protein border border-protein/25'
                    }`}>
                      {analysisResult.confidence} confidence
                    </span>
                  </div>
                  {analysisResult.notes && (
                    <p className="text-[11px] text-ink-soft border-t border-rule mt-2.5 pt-2 italic leading-relaxed">
                      {analysisResult.notes}
                    </p>
                  )}
                </div>

                {/* Inline Adjustment Form */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Food Name</label>
                    <input 
                      type="text" 
                      value={rName} 
                      onChange={(e) => setRName(e.target.value)}
                      className="w-full bg-surface-theme border border-rule rounded-xl px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:border-protein"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Calories (kcal)</label>
                    <input 
                      type="number" 
                      value={rCal} 
                      onChange={(e) => setRCal(e.target.value)}
                      className="w-full bg-surface-theme border border-rule rounded-xl px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:border-protein"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Protein (g)</label>
                      <input 
                        type="number" 
                        value={rProtein} 
                        step="0.1"
                        onChange={(e) => setRProtein(e.target.value)}
                        className="w-full bg-surface-theme border border-rule rounded-xl px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:border-protein"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Carbs (g)</label>
                      <input 
                        type="number" 
                        value={rCarbs} 
                        step="0.1"
                        onChange={(e) => setRCarbs(e.target.value)}
                        className="w-full bg-surface-theme border border-rule rounded-xl px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:border-protein"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Fat (g)</label>
                      <input 
                        type="number" 
                        value={rFat} 
                        step="0.1"
                        onChange={(e) => setRFat(e.target.value)}
                        className="w-full bg-surface-theme border border-rule rounded-xl px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:border-protein"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleAISaveToLog}
                    className="w-full py-3.5 bg-bg-deep text-surface-2 rounded-xl font-bold text-sm cursor-pointer hover:bg-bg-deep/90 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    Add to log
                  </button>
                  <button 
                    onClick={resetScanState}
                    className="w-full py-2.5 mt-2 rounded-xl font-bold text-xs text-ink border border-rule bg-surface-theme cursor-pointer hover:bg-surface-2 transition-colors"
                  >
                    Analyze another food
                  </button>
                </div>
              </div>
            ) : (
              // AI analyzer primary workflow screen
              <div id="ai-primary-scan-flow" className="space-y-4">
                {scanMode === 'photo' ? (
                  <div className="space-y-4">
                    {previewImgUrl ? (
                      <div className="relative">
                        <img src={previewImgUrl} alt="Food Upload" className="w-full h-52 object-cover rounded-xl border border-rule" />
                        <button 
                          onClick={() => {
                            setPreviewImgUrl(null);
                            setBase64PhotoData(null);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-black/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={triggerCameraInput}
                        className="border-2 border-dashed border-rule rounded-xl bg-surface-theme py-8 px-4 text-center cursor-pointer hover:border-carbs transition-colors flex flex-col items-center justify-center"
                      >
                        <span className="text-[30px] mb-2">📷</span>
                        <div className="font-bold text-[13.5px] text-bg-deep">Tap to take or upload a photo</div>
                        <p className="text-[11px] text-ink-soft opacity-75 mt-1">Works best with single serving meals in solid lighting</p>
                      </div>
                    )}

                    {/* Hidden Native File Input */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Input box */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="description-input" className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">What did you eat?</label>
                      <textarea 
                        id="description-input"
                        value={descriptionText}
                        onChange={(e) => setDescriptionText(e.target.value)}
                        placeholder="e.g. 2 rotis and 1 bowl of dal makhani, plus 100g paneer"
                        className="w-full bg-surface-theme border border-rule rounded-xl p-3 text-[13.5px] text-ink min-h-[90px] focus:outline-none focus:border-protein resize-none placeholder-ink-soft/40"
                      />
                    </div>
                    <p className="text-[10.5px] text-ink-soft italic leading-normal -mt-2">
                      Type items &amp; quantities — matched instantly from our preloaded database of 4,500+ Indian dishes &amp; regional variations.
                    </p>

                    {/* Instant Matching Results & Thali Accumulator */}
                    {localMatches.length > 0 && (
                      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-bold text-emerald-800 tracking-wider uppercase flex items-center gap-1">
                            📊 Instant Database Matches
                          </span>
                          <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200/50">
                            {localMatches.length} items
                          </span>
                        </div>
                        
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {localMatches.map((m, idx) => {
                            const totalCal = Math.round(m.item.calories * m.quantity);
                            const totalP = Math.round(m.item.protein * m.quantity * 10) / 10;
                            const totalC = Math.round(m.item.carbs * m.quantity * 10) / 10;
                            const totalF = Math.round(m.item.fat * m.quantity * 10) / 10;
                            
                            return (
                              <div key={m.item.id} className="bg-white rounded-xl p-2.5 border border-emerald-100 flex items-center justify-between gap-2 shadow-[0_1px_2px_rgba(16,185,129,0.03)]">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[12.5px] font-bold text-ink truncate block">{m.item.name}</span>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const updated = localMatches.filter((_, i) => i !== idx);
                                        setLocalMatches(updated);
                                      }}
                                      className="text-red-500 hover:text-red-700 text-[10px] font-bold p-0.5 cursor-pointer leading-none"
                                      title="Remove"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                  <span className="block text-[9.5px] text-ink-soft">
                                    {m.item.serving} · <b className="text-protein font-semibold">P: {totalP}g</b> · <span className="text-carbs font-semibold">C: {totalC}g</span> · <span className="text-fat font-semibold">F: {totalF}g</span>
                                  </span>
                                </div>
                                
                                {/* Quantity Adjuster */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...localMatches];
                                      updated[idx].quantity = Math.max(0.1, m.quantity - 0.5);
                                      setLocalMatches(updated);
                                    }}
                                    className="w-6 h-6 rounded-lg bg-surface-2 border border-rule/50 flex items-center justify-center font-bold text-xs hover:bg-emerald-50 active:scale-95 cursor-pointer text-ink"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    value={m.quantity}
                                    step="0.1"
                                    min="0.1"
                                    onChange={(e) => {
                                      const updated = [...localMatches];
                                      updated[idx].quantity = Math.max(0.1, parseFloat(e.target.value) || 1);
                                      setLocalMatches(updated);
                                    }}
                                    className="w-9 text-center font-mono font-bold text-[11px] bg-surface-theme border border-rule/60 rounded-lg py-0.5 focus:outline-none focus:border-emerald-500 text-ink"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...localMatches];
                                      updated[idx].quantity = m.quantity + 0.5;
                                      setLocalMatches(updated);
                                    }}
                                    className="w-6 h-6 rounded-lg bg-surface-2 border border-rule/50 flex items-center justify-center font-bold text-xs hover:bg-emerald-50 active:scale-95 cursor-pointer text-ink"
                                  >
                                    +
                                  </button>
                                </div>
                                
                                <div className="text-right flex-shrink-0 min-w-[45px]">
                                  <span className="font-mono font-bold text-xs text-emerald-800 block">{totalCal}</span>
                                  <span className="text-[8px] uppercase font-bold tracking-wider text-ink-soft block -mt-1">kcal</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Totals & Add button */}
                        {(() => {
                          const sumCal = localMatches.reduce((acc, m) => acc + m.item.calories * m.quantity, 0);
                          const sumP = localMatches.reduce((acc, m) => acc + m.item.protein * m.quantity, 0);
                          const sumC = localMatches.reduce((acc, m) => acc + m.item.carbs * m.quantity, 0);
                          const sumF = localMatches.reduce((acc, m) => acc + m.item.fat * m.quantity, 0);
                          
                          return (
                            <div className="pt-2.5 border-t border-emerald-200/50 flex flex-col gap-2">
                              <div className="flex items-center justify-between text-[11.5px] font-bold text-emerald-900">
                                <span>Plate Total:</span>
                                <span className="font-mono">{Math.round(sumCal)} kcal (P:{Math.round(sumP * 10) / 10}g C:{Math.round(sumC * 10) / 10}g F:{Math.round(sumF * 10) / 10}g)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  localMatches.forEach(m => {
                                    addEntry({
                                      name: `${m.quantity}x ${m.item.name}`,
                                      calories: Math.max(0, Math.round(m.item.calories * m.quantity)),
                                      protein: Math.max(0, Math.round(m.item.protein * m.quantity * 10) / 10),
                                      carbs: Math.max(0, Math.round(m.item.carbs * m.quantity * 10) / 10),
                                      fat: Math.max(0, Math.round(m.item.fat * m.quantity * 10) / 10),
                                      source: 'manual'
                                    });
                                  });
                                  setIsScanOpen(false);
                                  resetScanState();
                                }}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12.5px] rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98]"
                              >
                                <Check className="w-4 h-4" />
                                Add {localMatches.length} matched {localMatches.length === 1 ? 'item' : 'items'} instantly (Skip AI)
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Error log if present */}
                    {analysisError && (
                      <div className="p-3.5 bg-protein-soft text-danger border border-protein/20 rounded-xl text-xs font-medium leading-relaxed flex gap-2">
                        <Info className="w-4.5 h-4.5 flex-shrink-0 text-protein mt-0.5" />
                        <span>{analysisError}</span>
                      </div>
                    )}

                    {/* Bottom CTA for AI estimation */}
                    <div className="space-y-2">
                      <button 
                        onClick={handleAIAnalyze}
                        className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-bg-deep text-surface-2 flex items-center justify-center gap-1.5 shadow-lg shadow-bg-deep/10 cursor-pointer hover:bg-bg-deep/90 transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        Estimate Nutrition
                      </button>
                      <div className="flex items-center justify-between text-[10px] text-ink-soft px-1">
                        <span>Gemini AI estimation</span>
                        <span className="font-bold">Remaining today: {Math.max(0, 3 - aiScansToday)} / 3</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

          {/* MODAL 2: Add Manual Entry Form Overlay / Database Search */}
          {isManualOpen && (
            <div id="manual-add-modal" className="fixed inset-0 bg-bg-deep/50 backdrop-blur-[2px] flex items-end justify-center z-50 animate-fade-in">
              <div className="absolute inset-0" onClick={() => setIsManualOpen(false)} />
              <div className="bg-bg w-full max-w-[480px] rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl relative z-10 space-y-4 animate-slide-up">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-[19px] text-bg-deep">Add food</h4>
                  <button 
                    type="button"
                    onClick={() => setIsManualOpen(false)}
                    className="w-8 h-8 rounded-full bg-surface-theme border border-rule flex items-center justify-center text-ink hover:bg-surface-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Free & AI-Optional Info Banner */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/50 rounded-xl text-[11px] text-emerald-800 leading-relaxed shadow-xs">
                  💚 <strong>100% Free &amp; Offline Ready:</strong> Indian Cal search database runs completely offline on your device, with zero limits and no subscriptions! Log custom meals or choose from thousands of regional dishes.
                </div>

                {/* Tab Selector */}
                <div className="grid grid-cols-2 p-1 bg-surface-theme border border-rule/50 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setManualTab('search')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      manualTab === 'search'
                        ? 'bg-bg-deep text-surface-2 shadow-sm'
                        : 'text-ink-soft hover:text-ink hover:bg-surface-2/50'
                    }`}
                  >
                    🔍 Database Search (4,500+ Foods)
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualTab('custom')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      manualTab === 'custom'
                        ? 'bg-bg-deep text-surface-2 shadow-sm'
                        : 'text-ink-soft hover:text-ink hover:bg-surface-2/50'
                    }`}
                  >
                    ✍️ Custom Manual Entry
                  </button>
                </div>

                {/* TAB 1: DATABASE SEARCH */}
                {manualTab === 'search' && (
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-serif font-bold text-[13px] text-bg-deep flex items-center gap-1">
                        🔍 Preloaded Indian Food Database
                      </h5>
                      <p className="text-[10px] text-ink-soft leading-tight">
                        Select from our massive database of 4,500+ built-in Indian foods &amp; dishes to log instantly.
                      </p>
                    </div>

                    {/* Search and Category Filter */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={dirSearchQuery}
                        onChange={(e) => setDirSearchQuery(e.target.value)}
                        placeholder="Search database (e.g. roti, paneer, chicken, egg)..."
                        className="w-full bg-surface-theme border border-rule rounded-xl px-3 py-2 text-[12.5px] text-ink focus:outline-none focus:border-protein placeholder-ink-soft/40"
                      />

                      {/* Category Horizonal List */}
                      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                        {["All", "Breads & Staples", "Rice & Grains", "Dals & Curries", "Breakfast & South Indian", "Street Food & Snacks", "Dairy & Gym Staples", "Sweets & Desserts", "Fruits & Salads"].map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setDirSelectedCategory(cat)}
                            className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold cursor-pointer whitespace-nowrap transition-colors border ${
                              dirSelectedCategory === cat
                                ? 'bg-bg-deep text-surface-2 border-bg-deep shadow-sm'
                                : 'bg-surface-theme text-ink-soft border-rule/40 hover:bg-surface-2'
                            }`}
                          >
                            {cat.replace(" & Staples", "").replace(" & Grains", "").replace(" & Curries", "").replace(" & South Indian", "").replace(" & Snacks", "").replace(" & Gym Staples", "").replace(" & Desserts", "").replace(" & Salads", "")}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Search Results List */}
                    <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                      {(() => {
                        const filtered = INDIAN_FOOD_DB.filter(item => {
                          const matchesCat = dirSelectedCategory === 'All' || item.category === dirSelectedCategory;
                          const matchesSearch = !dirSearchQuery.trim() || 
                            item.name.toLowerCase().includes(dirSearchQuery.toLowerCase()) ||
                            item.aliases.some(a => a.includes(dirSearchQuery.toLowerCase()));
                          return matchesCat && matchesSearch;
                        });

                        if (filtered.length === 0) {
                          return (
                            <p className="text-[11px] text-ink-soft italic text-center py-3">
                              No items match "{dirSearchQuery}" in this category.
                            </p>
                          );
                        }

                        return filtered.map(item => {
                          return (
                            <div 
                              key={item.id}
                              className="bg-surface-theme hover:bg-surface-2 rounded-xl p-2.5 border border-rule/30 flex items-center justify-between gap-3 transition-colors text-left"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="block text-[12px] font-bold text-ink truncate">{item.name}</span>
                                <span className="block text-[9.5px] text-ink-soft">
                                  {item.serving} · <b className="text-protein">{item.calories} kcal</b> · P: {item.protein}g · C: {item.carbs}g · F: {item.fat}g
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    addEntry({
                                      name: `1x ${item.name}`,
                                      calories: Math.max(0, Math.round(item.calories)),
                                      protein: Math.max(0, Math.round(item.protein * 10) / 10),
                                      carbs: Math.max(0, Math.round(item.carbs * 10) / 10),
                                      fat: Math.max(0, Math.round(item.fat * 10) / 10),
                                      source: 'manual'
                                    });
                                    setIsManualOpen(false);
                                    setDirSearchQuery('');
                                  }}
                                  className="px-2 py-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-all cursor-pointer"
                                >
                                  + Log Item
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMName(item.name);
                                    setMCal(item.calories.toString());
                                    setMProtein(item.protein.toString());
                                    setMCarbs(item.carbs.toString());
                                    setMFat(item.fat.toString());
                                    setManualTab('custom');
                                  }}
                                  className="px-2 py-1 text-[10px] font-medium text-ink-soft bg-surface-theme hover:bg-surface-2 border border-rule/50 rounded-lg transition-all cursor-pointer"
                                  title="Tweak values first"
                                >
                                  ✏️ Edit
                                </button>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* TAB 2: CUSTOM MANUAL ENTRY FORM */}
                {manualTab === 'custom' && (
                  <form 
                    onSubmit={handleManualAddSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Food Name</label>
                        <input 
                          type="text" 
                          value={mName}
                          onChange={(e) => setMName(e.target.value)}
                          placeholder="e.g. Masala Dosa with Chutney"
                          className="w-full bg-surface-theme border border-rule rounded-xl px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:border-protein placeholder-ink-soft/30"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Calories (kcal)</label>
                        <input 
                          type="number" 
                          value={mCal}
                          onChange={(e) => setMCal(e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full bg-surface-theme border border-rule rounded-xl px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:border-protein"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Protein (g)</label>
                          <input 
                            type="number" 
                            value={mProtein}
                            onChange={(e) => setMProtein(e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.1"
                            className="w-full bg-surface-theme border border-rule rounded-xl px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:border-protein"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Carbs (g)</label>
                          <input 
                            type="number" 
                            value={mCarbs}
                            onChange={(e) => setMCarbs(e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.1"
                            className="w-full bg-surface-theme border border-rule rounded-xl px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:border-protein"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Fat (g)</label>
                          <input 
                            type="number" 
                            value={mFat}
                            onChange={(e) => setMFat(e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.1"
                            className="w-full bg-surface-theme border border-rule rounded-xl px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:border-protein"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-bg-deep text-surface-2 font-bold text-sm rounded-xl cursor-pointer hover:bg-bg-deep/90 transition-colors"
                    >
                      Add to log
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

      {/* MODAL 3: Settings Daily Goals Overlay */}
      {isSettingsOpen && (
        <div id="settings-goals-modal" className="fixed inset-0 bg-bg-deep/50 backdrop-blur-[2px] flex items-end justify-center z-50">
          <div className="absolute inset-0" onClick={() => setIsSettingsOpen(false)} />
          <form 
            onSubmit={handleSaveGoals}
            className="bg-bg w-full max-w-[480px] rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl relative z-10 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-[19px] text-bg-deep">Daily targets</h4>
              <button 
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-theme border border-rule flex items-center justify-center text-ink hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-protein tracking-wider uppercase">Your Name</label>
                <input 
                  type="text" 
                  value={gName}
                  onChange={(e) => setGName(e.target.value)}
                  placeholder="e.g. Aayush"
                  className="w-full bg-surface-theme border border-rule rounded-xl px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:border-protein"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Calorie Goal (kcal)</label>
                <input 
                  type="number" 
                  value={gCal}
                  onChange={(e) => setGCal(e.target.value)}
                  min="0"
                  className="w-full bg-surface-theme border border-rule rounded-xl px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:border-protein"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Protein (g)</label>
                  <input 
                    type="number" 
                    value={gProtein}
                    onChange={(e) => setGProtein(e.target.value)}
                    min="0"
                    className="w-full bg-surface-theme border border-rule rounded-xl px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:border-protein"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Carbs (g)</label>
                  <input 
                    type="number" 
                    value={gCarbs}
                    onChange={(e) => setGCarbs(e.target.value)}
                    min="0"
                    className="w-full bg-surface-theme border border-rule rounded-xl px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:border-protein"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-ink-soft tracking-wider uppercase">Fat (g)</label>
                  <input 
                    type="number" 
                    value={gFat}
                    onChange={(e) => setGFat(e.target.value)}
                    min="0"
                    className="w-full bg-surface-theme border border-rule rounded-xl px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:border-protein"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Visual Theme Selector */}
            <div className="bg-surface-2 p-3.5 rounded-2xl border border-rule/40 space-y-2.5">
              <span className="text-[11px] font-bold text-ink-soft tracking-wider uppercase block">Visual Theme</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-bg-deep text-surface-2 border-bg-deep shadow-sm'
                      : 'bg-surface-theme text-ink-soft border-rule/50 hover:bg-surface-2'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-bg-deep text-surface-2 border-bg-deep shadow-sm'
                      : 'bg-surface-theme text-ink-soft border-rule/50 hover:bg-surface-2'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-bg-deep text-surface-2 font-bold text-sm rounded-xl cursor-pointer hover:bg-bg-deep/90 transition-colors"
            >
              Save targets
            </button>

            <div className="pt-2 text-center border-t border-rule/50 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsOnboarded(false);
                  setOnboardStep(0);
                }}
                className="text-xs text-protein font-semibold hover:underline cursor-pointer bg-none border-none p-2"
              >
                🔄 Re-run Profile Onboarding
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: Dynamic Indian Meal Suggestions */}
      {isSuggestOpen && (
        <div id="indian-suggestions-modal" className="fixed inset-0 bg-bg-deep/50 backdrop-blur-[2px] flex items-end justify-center z-50 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsSuggestOpen(false)} />
          <div className="bg-bg w-full max-w-[480px] rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto shadow-2xl relative z-10 space-y-4">
            
            <div className="flex items-center justify-between border-b border-rule/30 pb-3">
              <div>
                <h4 className="font-serif font-bold text-[19px] text-bg-deep flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-100" />
                  Target-Matched Meals
                </h4>
                <p className="text-[11px] text-ink-soft">Indian recipes fitted to your remaining macros</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsSuggestOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-theme border border-rule flex items-center justify-center text-ink cursor-pointer hover:bg-surface-2 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dual Preferences: Gym & Diet Filter */}
            <div className="grid grid-cols-2 gap-2">
              {/* Gym Focus Toggle Switch */}
              <div className="bg-gradient-to-r from-protein-soft/60 to-surface-theme rounded-2xl p-2.5 border border-rule/50 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-protein/10 border border-protein/20 flex items-center justify-center text-protein flex-shrink-0">
                    <Dumbbell className={`w-3.5 h-3.5 ${isGymFocus ? 'animate-bounce' : ''}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[11.5px] text-bg-deep truncate">Gym Focus</div>
                    <span className="text-[9px] text-ink-soft block -mt-1 leading-none">High Protein</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleGymFocus(!isGymFocus)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex-shrink-0 ${
                    isGymFocus ? 'bg-protein' : 'bg-rule'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      isGymFocus ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Vegetarian Only Toggle Switch */}
              <div className="bg-gradient-to-r from-emerald-500/5 to-surface-theme rounded-2xl p-2.5 border border-rule/50 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 flex-shrink-0 text-xs">
                    🌱
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[11.5px] text-bg-deep truncate">Pure Veg</div>
                    <span className="text-[9px] text-ink-soft block -mt-1 leading-none">Excl. Eggs/Meat</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleVegOnly(!isVegOnly)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex-shrink-0 ${
                    isVegOnly ? 'bg-emerald-500' : 'bg-rule'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      isVegOnly ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Remaining Targets Overview Panel */}
            <div className="bg-surface-2 rounded-2xl p-4 border border-rule/60">
              <span className="text-[10.5px] font-bold text-ink-soft tracking-wider uppercase block mb-2">Remaining Targets Today</span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-surface-theme border border-rule/40 rounded-xl p-1.5">
                  <span className="block text-[10px] text-ink-soft font-semibold uppercase">Calories</span>
                  <span className={`font-mono text-[13px] font-bold ${goals.calories - totals.calories < 0 ? 'text-danger' : 'text-ink'}`}>
                    {Math.round(goals.calories - totals.calories)} <span className="text-[9px] font-normal text-ink-soft">kcal</span>
                  </span>
                </div>
                <div className="bg-surface-theme border border-rule/40 rounded-xl p-1.5">
                  <span className="block text-[10px] text-protein font-bold uppercase">Protein</span>
                  <span className={`font-mono text-[13px] font-bold ${goals.protein - totals.protein < 0 ? 'text-emerald-500' : 'text-protein'}`}>
                    {Math.round((goals.protein - totals.protein) * 10) / 10}g
                  </span>
                </div>
                <div className="bg-surface-theme border border-rule/40 rounded-xl p-1.5">
                  <span className="block text-[10px] text-carbs font-bold uppercase">Carbs</span>
                  <span className={`font-mono text-[13px] font-bold ${goals.carbs - totals.carbs < 0 ? 'text-danger' : 'text-carbs'}`}>
                    {Math.round((goals.carbs - totals.carbs) * 10) / 10}g
                  </span>
                </div>
                <div className="bg-surface-theme border border-rule/40 rounded-xl p-1.5">
                  <span className="block text-[10px] text-fat font-bold uppercase">Fat</span>
                  <span className={`font-mono text-[13px] font-bold ${goals.fat - totals.fat < 0 ? 'text-danger' : 'text-fat'}`}>
                    {Math.round((goals.fat - totals.fat) * 10) / 10}g
                  </span>
                </div>
              </div>
            </div>

            {/* Main suggestion content states */}
            {isSuggestLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-ink-soft text-[13.5px]">
                <div className="w-8 h-8 rounded-full border-3 border-rule border-t-indigo-600 animate-spin" />
                <div className="text-center">
                  <span className="font-bold text-bg-deep block">Calculating macro options...</span>
                  <span className="text-[11px] mt-1 block opacity-75">Curating low-fat high-protein Indian ingredients</span>
                </div>
              </div>
            ) : suggestError ? (
              <div className="p-4 bg-protein-soft text-danger border border-protein/25 rounded-xl text-xs space-y-3">
                <p className="font-semibold flex items-center gap-1.5">
                  <Info className="w-4.5 h-4.5 text-protein" />
                  {suggestError}
                </p>
                <button 
                  onClick={() => fetchMealSuggestions()}
                  className="px-3.5 py-1.5 bg-bg-deep text-surface-2 rounded-lg font-bold text-xs cursor-pointer hover:bg-bg-deep/90 transition-all"
                >
                  Retry Suggestion
                </button>
              </div>
            ) : suggestedMeals ? (
              <div className="space-y-3.5 animate-slide-up">
                {suggestedMeals.length === 0 ? (
                  <p className="text-xs text-ink-soft italic text-center py-4">No suggestions matched your remaining budget. Try updating your target macro goals!</p>
                ) : (
                  suggestedMeals.map((meal, idx) => (
                    <div 
                      key={idx} 
                      className="bg-surface-theme border border-rule/50 rounded-2xl p-4 shadow-sm hover:border-protein/40 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Trend Label Pill Badge */}
                        {meal.trend_label && (
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50">
                              {meal.trend_label}
                            </span>
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h5 className="font-serif font-bold text-[14.5px] text-bg-deep leading-tight">
                              {meal.meal_name}
                            </h5>
                            <span className="inline-block bg-surface-2 text-ink-soft font-mono text-[9.5px] px-2 py-0.5 rounded border border-rule/40 mt-1.5">
                              {meal.portion}
                            </span>
                          </div>
                          
                          <button 
                            onClick={() => {
                              addEntry({
                                name: `${meal.meal_name} (${meal.portion})`,
                                calories: meal.calories,
                                protein: meal.protein_g,
                                carbs: meal.carbs_g,
                                fat: meal.fat_g,
                                source: 'manual'
                              });
                              setIsSuggestOpen(false);
                            }}
                            className="bg-bg-deep hover:bg-bg-deep/90 text-surface-2 font-bold text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-sm flex-shrink-0"
                            title="Add suggested meal to your today's logged food journal"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Log Meal
                          </button>
                        </div>

                        {/* Nutrition pill grid */}
                        <div className="grid grid-cols-4 gap-1.5 mt-3 border-t border-b border-rule/20 py-2">
                          <div className="text-center">
                            <span className="block text-[8px] text-ink-soft font-medium uppercase">Calories</span>
                            <span className="font-mono text-[11.5px] font-bold text-ink">{meal.calories} <span className="text-[8px] font-normal text-ink-soft">kcal</span></span>
                          </div>
                          <div className="text-center">
                            <span className="block text-[8px] text-protein font-semibold uppercase">Protein</span>
                            <span className="font-mono text-[11.5px] font-bold text-protein">{meal.protein_g}g</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-[8px] text-carbs font-semibold uppercase">Carbs</span>
                            <span className="font-mono text-[11.5px] font-bold text-carbs">{meal.carbs_g}g</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-[8px] text-fat font-semibold uppercase">Fat</span>
                            <span className="font-mono text-[11.5px] font-bold text-fat">{meal.fat_g}g</span>
                          </div>
                        </div>

                        {/* AI Fit Logic explanation description */}
                        {meal.why_fits && (
                          <p className="text-[10.5px] text-ink-soft mt-2.5 leading-normal italic">
                            💡 {meal.why_fits}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : null}

            <div className="text-center pt-2">
              <p className="text-[9.5px] text-ink-soft leading-tight">
                Our Indian database covers hundreds of authentic regional recipes with precise macronutrient details curated with AI.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: Share Progress Overlay */}
      {isShareOpen && (
        <div id="share-progress-modal" className="fixed inset-0 bg-bg-deep/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsShareOpen(false)} />
          <div className="bg-[#110D0A] w-full max-w-[440px] rounded-3xl p-5 shadow-2xl relative z-10 border border-white/10 flex flex-col gap-4 text-[#EBE3D5] max-h-[95vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h4 className="font-serif font-bold text-[18px] text-[#EBE3D5]">Share macro progress</h4>
              </div>
              <button 
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* WYSIWYG Card Preview Wrapper */}
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-b from-[#110D0A] to-[#231B13] border border-white/10 aspect-square flex flex-col items-center justify-between text-center shadow-inner">
              {/* Corner Mandala circles overlay */}
              <div className="absolute top-0 left-0 w-24 h-24 border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute top-0 left-0 w-32 h-32 border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-36 h-36 border border-white/5 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-44 h-44 border border-white/5 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

              {/* Title Header */}
              <div className="z-10 mt-1">
                <div className="font-serif font-bold text-[20px] text-[#EBE3D5] tracking-wide leading-none">🇮🇳 INDIAN CAL</div>
                <div className="text-[9px] font-mono font-bold tracking-widest text-[#B49664] mt-2">
                  {onboardName ? `${onboardName.toUpperCase()}'S DAILY MACRO SUMMARY` : 'DAILY MACRO SUMMARY'}
                </div>
                <div className="w-12 h-0.5 bg-[#B49664]/30 mx-auto mt-2" />
              </div>

              {/* Avatar Pill Badge */}
              <div className="z-10 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#B49664]/20 text-[11.5px] font-bold text-[#EBE3D5]">
                {(() => {
                  const currentAv = getAvatarInfo(desiAvatar);
                  return `${currentAv.emoji} ${currentAv.name} • ${currentAv.title}`;
                })()}
              </div>

              {/* Central Concentric Rings */}
              <div className="relative w-44 h-44 flex items-center justify-center z-10 my-1">
                <svg viewBox="0 0 172 172" className="w-full h-full transform -rotate-90">
                  {/* Protein Ring */}
                  <circle className="stroke-white/5 fill-none" cx="86" cy="86" r="76" strokeWidth="11" />
                  <circle 
                    className="stroke-[#EF4444] fill-none stroke-linecap-round transition-[stroke-dashoffset] duration-500" 
                    cx="86" cy="86" r="76" strokeWidth="11"
                    strokeDasharray={getCircumference(76)}
                    strokeDashoffset={getDashoffset(76, (totals.protein / goals.protein) * 100)}
                  />
                  {/* Carbs Ring */}
                  <circle className="stroke-white/5 fill-none" cx="86" cy="86" r="58" strokeWidth="11" />
                  <circle 
                    className="stroke-[#06B6D4] fill-none stroke-linecap-round transition-[stroke-dashoffset] duration-500" 
                    cx="86" cy="86" r="58" strokeWidth="11"
                    strokeDasharray={getCircumference(58)}
                    strokeDashoffset={getDashoffset(58, (totals.carbs / goals.carbs) * 100)}
                  />
                  {/* Fat Ring */}
                  <circle className="stroke-white/5 fill-none" cx="86" cy="86" r="40" strokeWidth="11" />
                  <circle 
                    className="stroke-[#F59E0B] fill-none stroke-linecap-round transition-[stroke-dashoffset] duration-500" 
                    cx="86" cy="86" r="40" strokeWidth="11"
                    strokeDasharray={getCircumference(40)}
                    strokeDashoffset={getDashoffset(40, (totals.fat / goals.fat) * 100)}
                  />
                </svg>

                {/* Central text details */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-serif font-bold text-[28px] text-white leading-none">
                    {Math.round(totals.calories)}
                  </span>
                  <span className="text-[10px] text-[#A0A0A0] mt-1">
                    of {goals.calories} kcal
                  </span>
                  <span className="text-[8px] font-bold tracking-wider text-[#B49664] uppercase mt-1">
                    {displayDateStr(currentDate)}
                  </span>
                </div>
              </div>

              {/* Bottom Metrics Grid */}
              <div className="z-10 w-full bg-white/5 border border-white/5 rounded-xl p-2.5 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[7.5px] text-[#8E8E8E] font-bold">PROTEIN</span>
                  <span className="font-mono text-[11px] font-bold text-white mt-0.5">{Math.round(totals.protein)}g</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-[#EF4444] font-bold mt-1">
                    {Math.round((totals.protein / goals.protein) * 100)}%
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-r border-white/10">
                  <span className="text-[7.5px] text-[#8E8E8E] font-bold">CARBS</span>
                  <span className="font-mono text-[11px] font-bold text-white mt-0.5">{Math.round(totals.carbs)}g</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-[#06B6D4] font-bold mt-1">
                    {Math.round((totals.carbs / goals.carbs) * 100)}%
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[7.5px] text-[#8E8E8E] font-bold">FAT</span>
                  <span className="font-mono text-[11px] font-bold text-white mt-0.5">{Math.round(totals.fat)}g</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-[#F59E0B] font-bold mt-1">
                    {Math.round((totals.fat / goals.fat) * 100)}%
                  </span>
                </div>
              </div>

              {/* Motivation or Streak text */}
              <div className="z-10 text-[9.5px] text-[#8E8E8E] italic px-1">
                {getStreakCount() > 0 
                  ? `🔥 KEEP IT GOING! On a magnificent ${getStreakCount()}-day streak of clean eating!`
                  : `🎯 FUEL YOUR SUCCESS: "Your body is your temple. Fuel it mindfully."`
                }
              </div>

              {/* Watermark */}
              <div className="text-[7.5px] text-[#EBE3D5]/30 tracking-widest uppercase font-mono z-10">
                Tracked on Indian Cal
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                type="button"
                onClick={handleDownloadShareImage}
                className="w-full py-3 bg-[#B49664] hover:bg-[#A18453] text-[#110D0A] rounded-xl font-bold text-sm cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#B49664]/10"
              >
                <Share2 className="w-4 h-4" />
                Download Progress Image
              </button>

              <button
                type="button"
                onClick={handleCopyShareText}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-[#EBE3D5] rounded-xl font-bold text-xs cursor-pointer border border-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                {shareCopySuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied Summary to Clipboard!
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    Copy WhatsApp / Text Summary
                  </>
                )}
              </button>
            </div>

            {/* Small note */}
            <p className="text-[10px] text-center text-white/50 italic">
              Share the screenshot or download the card to inspire your friends to eat clean!
            </p>

          </div>
        </div>
      )}

    </div>
  );
}
