import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Fish, Loader2, Info, X, RefreshCw, MapPin, Navigation, Store, Phone, Mail, Building2, MessageCircle, Send, Book, ChevronRight, Brain, ExternalLink, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from "@google/generative-ai";
import FishAnalysisDashboard from './components/FishAnalysisDashboard';
import About from './components/About';

import {
  Language,
  FishResult,
  HistoryItem,
  User,
  UserLocation,
  ChatMessage,
  FishData,
  Department,
  WeatherData
} from './types';

const DEFAULT_GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [identifying, setIdentifying] = useState(false);
  const [result, setResult] = useState<FishResult | null>(null);
  const [activeTab, setActiveTab] = useState('identify');
  const [_selectedDepartment, _setSelectedDepartment] = useState<Department | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showUserId, setShowUserId] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [_user, setUser] = useState<User | null>(null);
  const [selectedFish, setSelectedFish] = useState<FishData | null>(null);
  const [language, _setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [scanHistory, setScanHistory] = useState<HistoryItem[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Weather simulation cycle (Legacy - kept for fallback or removed if real API preferred)
  // Removed static scenarios to use dynamic data

  const getRiskStatus = (wave: number, wind: number) => {
    if (wave >= 4.0 || wind >= 60) return 'Emergency';
    if (wave >= 2.5 || wind >= 40) return 'Danger';
    if (wave >= 1.5 || wind >= 25) return 'Warning';
    return 'Safe';
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Emergency': return 'bg-red-500/20 text-red-100 border-red-500/50';
      case 'Danger': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getFreshnessGradeClass = (grade: string) => {
    switch (grade) {
      case 'Excellent': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Good': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'Fair': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Poor': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getQualityGradeClass = (grade: string) => {
    switch (grade) {
      case 'Premium': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Good': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Average': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Below Average': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const analyzeWeatherWithGemini = async (metrics: any) => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
      if (!apiKey) return "Normal sea conditions detected. Stay alert.";

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });

      const prompt = `Act as a marine safety expert. Analyze these current metrics:
Wind Speed: ${metrics.windSpeed} km/h
Wave Height: ${metrics.waveHeight} m
Sea Temperature: ${metrics.temperature}°C

Provide a concise (1-2 sentence) safety recommendation.
If conditions are dangerous, be firm. If safe, mention any fishing advantages.
Return ONLY the text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      return "Unable to generate AI analysis at this time.";
    }
  };

  const fetchMarineWeather = async (lat: number, lng: number) => {
    setLoadingWeather(true);
    try {
      // Open-Meteo Marine API
      const response = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height,wind_speed_10m&hourly=sea_surface_temperature`);
      const data = await response.json();

      const currentWave = data.current.wave_height;
      const currentWind = data.current.wind_speed_10m;
      // Get latest sea surface temp if available
      const currentTemp = data.hourly?.sea_surface_temperature?.[0] || 25;

      const risk = getRiskStatus(currentWave, currentWind);

      // Get AI Analysis
      const aiMsg = await analyzeWeatherWithGemini({
        windSpeed: currentWind,
        waveHeight: currentWave,
        temperature: currentTemp
      });

      setWeatherData({
        windSpeed: currentWind,
        waveHeight: currentWave,
        temperature: currentTemp,
        status: risk,
        analysis: aiMsg,
        lastUpdated: new Date().toLocaleTimeString()
      });
    } catch (error) {
      console.error("Weather fetch failed:", error);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Auto-fetch weather when location is available
  useEffect(() => {
    if (userLocation && activeTab === 'weather' && !weatherData) {
      fetchMarineWeather(userLocation.lat, userLocation.lng);
    }
  }, [userLocation, activeTab]);



  // Generate unique user ID
  const generateUserId = () => {
    return 'FISH-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  // Initialize user ID on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const stored = await window.storage.get('user_id');
        if (stored && stored.value) {
          setUserId(stored.value);
        } else {
          const newId = generateUserId();
          await window.storage.set('user_id', newId);
          setUserId(newId);
        }

        const userProfile = await window.storage.get('user_profile');
        if (userProfile && userProfile.value) {
          setUser(JSON.parse(userProfile.value));
        }

        const history = await window.storage.get('scan_history');
        if (history && history.value) {
          setScanHistory(JSON.parse(history.value));
        }

        const loggedIn = localStorage.getItem('aqualens_logged_in');
        if (loggedIn === 'true') {
          setIsLoggedIn(true);
        }
      } catch (error) {
        const newId = generateUserId();
        setUserId(newId);
      }
    };
    initializeUser();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setImage(e.target.result);
          setResult(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const identifyFish = async () => {
    if (!image || identifying) return;

    setIdentifying(true);
    setResult(null);

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
      if (!apiKey) {
        setResult({
          error: "API key not configured."
        });
        setIdentifying(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });

      const base64Data = image.includes(',') ? image.split(',')[1] : image;

      const prompt = `Analyze this fish image and identify the species. Also assess the freshness and quality of the fish. Provide your response ONLY as valid JSON. Do not use markdown formatting. Use this exact structure:
{
  "commonName": "name",
  "scientificName": "name",
  "features": ["feature1", "feature2", "feature3"],
  "habitat": "description",
  "category": "Freshwater/Saltwater/Brackish",
  "edibility": "description",
  "confidence": 85,
  "freshness": {
    "score": 85,
    "grade": "Excellent",
    "indicators": ["bright eyes", "firm flesh", "fresh smell"],
    "assessment": "The fish appears very fresh based on visual indicators."
  },
  "quality": {
    "score": 80,
    "grade": "Good",
    "factors": ["good size", "proper handling", "no visible damage"],
    "assessment": "The fish shows good quality characteristics."
  },
  "nutrition": {
    "vitamins": ["Vitamin A", "Omega-3", "Vitamin D"],
    "protein": "18g per 100g",
    "benefits": "Excellent for heart health and brain function."
  }
}
For freshness, analyze: eye clarity and brightness, skin/scales condition, gill color, flesh firmness (if visible), and overall appearance. Grade: Excellent (90-100), Good (70-89), Fair (50-69), Poor (0-49).
For quality, analyze: size appropriateness, handling marks, damage, texture, and overall condition. Grade: Premium (90-100), Good (70-89), Average (50-69), Below Average (0-49).
Category must be one of: Freshwater, Saltwater, or Brackish.
Be specific about identifying features like coloration, body shape, fin structure, and markings. If unsure, still provide your best identification with appropriate confidence level.`;

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: image.startsWith('data:image/png') ? "image/png" : "image/jpeg",
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      let text = response.text();
      console.log("Raw identification response:", text);

      if (text) {
        // Clean markdown if present
        text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : text;
          const fishData = JSON.parse(jsonString);

          if (fishData.commonName || fishData.scientificName) {
            setResult(fishData);

            // Save to history (non-blocking)
            try {
              const newHistoryItem: HistoryItem = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                image: image,
                result: fishData
              };
              const updatedHistory = [newHistoryItem, ...scanHistory].slice(0, 10);
              setScanHistory(updatedHistory);
              await window.storage.set('scan_history', JSON.stringify(updatedHistory));
            } catch (storageError) {
              console.error("Failed to save history:", storageError);
              // Continue without saving history
            }
          } else {
            throw new Error('Invalid response format');
          }
        } catch (parseError) {
          console.error("JSON Parse Error", parseError);
          setResult({ error: "Could not parse identification results." });
        }
      } else {
        setResult({ error: "No response received from the API." });
      }
    } catch (error: any) {
      console.error('Identification error:', error);
      const errorMessage = error?.message || 'Unknown error';
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setResult({
          error: "Offline mode: Network connection unavailable. Please reconnect to cellular data or Wi-Fi to run cloud AI identification."
        });
      } else {
        setResult({ error: `Failed to identify fish: ${errorMessage}.` });
      }
    } finally {
      setIdentifying(false);
    }
  };

  const getUserLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.warn("Location access notice:", error.message);
          setLoadingLocation(false);
          // Gracefully fallback to coastal coordinates without blocking alert popup
          setUserLocation({
            lat: 13.0827,
            lng: 80.2707
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLoadingLocation(false);
      setUserLocation({
        lat: 13.0827,
        lng: 80.2707
      });
    }
  };


  const coastGuardDepartments: Department[] = [
    { name: "Public Relations", telephone: "+91-11-23115153", fax: "+91-11-23387926", email: "pro@indiancoastguard.nic.in" },
    { name: "Recruitment", telephone: "+91-120-2201335", fax: "+91-120-2414395", email: "dte-rect@indiancoastguard.nic.in" },
    { name: "Operations", telephone: "+91-11-23115090", fax: "+91-11-23383196", email: "dte-ops@indiancoastguard.nic.in" },
    { name: "Information & Technology", telephone: "+91-11-23115242", fax: "-", email: "dte-it@indiancoastguard.nic.in" }
  ];

  const languages: Record<Language, { name: string; flag: string }> = {
    en: { name: 'English', flag: '🇬🇧' },
    hi: { name: 'हिंदी', flag: '🇮🇳' },
    mr: { name: 'मराठी', flag: '🇮🇳' },
    ta: { name: 'தமிழ்', flag: '🇮🇳' },
    te: { name: 'తెలుగు', flag: '🇮🇳' },
    bn: { name: 'বাংলা', flag: '🇮🇳' },
    ml: { name: 'മലയാളം', flag: '🇮🇳' },
  };

  const fishDatabase: FishData[] = [
    {
      id: 1,
      name: { en: "Hilsa", hi: "इलिश", mr: "हिलसा", ta: "உல்லம்", te: "పులస", bn: "ইলিশ", ml: "ഇലിഷ" },
      scientificName: "Tenualosa ilisha",
      description: { en: "The Hilsa is a popular food fish in South Asia, known for its rich flavor and tender texture.", hi: "हिल्सा दक्षिण एशिया में एक लोकप्रिय खाद्य मछली है, जो अपने समृद्ध स्वाद के लिए जानी जाती है।", mr: "हिल्सा ही दक्षिण आशियातील एक लोकप्रिय अन्न मासा आहे।", ta: "இலிசா தெற்காசியாவில் பிரபலமான உணவு மீன்.", te: "హిల్సా దక్షిణాసియాలో ప్రసిద్ధ ఆహార చేప.", bn: "ইলিশ দক্ষিণ এশিয়ার একটি জনপ্রিয় খাদ্য মাছ।", ml: "ഇലിഷ ദക്ഷിണേഷ്യയിലെ ഒരു പ്രശസ്ത ഭക്ഷ്യ മത്സ്യമാണ്." },
      habitat: { en: "Found in rivers and coastal waters.", hi: "नदियों और तटीय जल में पाई जाती है।", mr: "नद्या आणि किनारी पाण्यात आढळते।", ta: "ஆறுகள் மற்றும் கடலோர நீரில் காணப்படுகிறது.", te: "నదులు మరియు తీర జలాల్లో కనిపిస్తుంది.", bn: "নদী এবং উপকূলীয় জলে পাওয়া যায়।", ml: "ഇന്ത്യൻ മഹാസമുദ്രത്തിലെ തീരദേശ ജലം." },
      color: "#94a3b8",
      category: "Brackish",
      vitamins: { en: "Omega-3, Vitamin A, Vitamin D", hi: "ओमेगा-3, विटामिन ए, विटामिन डी", mr: "ओमेगा-3, व्हिटॅमिन ए, डी", ta: "Omega-3, Vitamin A", te: "Omega-3, Vitamin A", bn: "ওমেগা-৩, ভিটামিন এ", ml: "ഒമേഗ -3, വിറ്റാമിൻ എ" },
      idealConditions: { en: "Temperature: 25-30°C, Slow moving river water during Monsoon.", hi: "तापमान: 25-30 डिग्री सेल्सियस, मानसून के दौरान धीमी नदी।", mr: "मान्सूनमध्ये मंद वाहणारे नदीचे पाणी।", ta: "Slow moving river.", te: "Slow moving river.", bn: "Slow moving river.", ml: "Slow moving river." },
      isPoisonous: false,
      image: "https://www.bbassets.com/media/uploads/p/l/800436628_2-me-fresh-fish-hilsa.jpg"
    },
    {
      id: 2,
      name: { en: "Silver Pomfret", hi: "सिल्वर पोमफ्रेट", mr: "पापलेट", ta: "வவ்வால்", te: "చంద్రమ", bn: "পমফ্রেট", ml: "ആവോലി" },
      scientificName: "Pampus argenteus",
      description: { en: "Highly valued food fish with delicate white flesh and a subtle sweet taste.", hi: "नाजुक सफेद मांस वाली अत्यधिक मूल्यवान खाद्य मछली।", mr: "चांदी पापलेट एक मौल्यवान मासा आहे।", ta: "வெள்ளி வவ்வால் மதிப்புமிக்க உணவு மீன்.", te: "వెండి చంద్రమ విలువైన ఆహార చేప.", bn: "সিলভার পমফ্রেট একটি মূল্যবান মাছ।", ml: "വെള്ളി ആവോലി വിലപ്പെട്ട മത്സ്യമാണ്." },
      habitat: { en: "Indo-Pacific coastal waters.", hi: "हिंद-प्रशांत तटीय जल।", mr: "हिंद-प्रशांत किनारी पाणी।", ta: "இந்தோ-பசிபிக் பகுதி.", te: "ఇండో-పసిఫిక్ ప్రాంతం.", bn: "ইন্দো-প্যাসিফিক অঞ্চল।", ml: "ഇൻഡോ-പസഫിക് മേഖല." },
      color: "#e2e8f0",
      category: "Saltwater",
      vitamins: { en: "Omega-3, Vitamin B12, Phosphorus", hi: "ओमेगा-3, विटामिन बी12, फास्फोरस", mr: "ओमेगा-3, व्हिटॅमिन बी12", ta: "B12, Phosphorus", te: "B12, Phosphorus", bn: "বি১২, ফসফরাস", ml: "വിറ്റാമിൻ ബി 12" },
      idealConditions: { en: "Indo-Pacific tropical waters, depth 10-80m.", hi: "हिंद-प्रशांत उष्णकटिबंधीय जल, गहराई 10-80 मीटर।", mr: "हिंद-प्रशांत प्रदेश।", ta: "Indo-Pacific.", te: "Indo-Pacific.", bn: "Indo-Pacific.", ml: "Indo-Pacific." },
      isPoisonous: false,
      image: "https://www.bbassets.com/media/uploads/p/l/800436473_1-me-fresh-fish-silver-pomfret-large-white-manji.jpg"
    },
    {
      id: 3,
      name: { en: "Indian Mackerel", hi: "बंगड़ा", mr: "बांगडा", ta: "காஞ்சல்", te: "అయల", bn: "ম্যাকরেল", ml: "അയല" },
      scientificName: "Rastrelliger kanagurta",
      description: { en: "Deep-bodied oily fish with silver-grey back and black stripes.", hi: "चांदी-धूसर पीठ और काली धारियों वाली तैलीय मछली।", mr: "भारतीय बांगडा एक सामान्य मासा आहे।", ta: "இந்திய காஞ்சல் பொதுவான மீன்.", te: "భారతీయ అయల సాధారణ చేప.", bn: "ভারতীয় ম্যাকরেল একটি সাধারণ মাছ।", ml: "ഇന്ത്യൻ അയല സാധാരണ മത്സ്യമാണ്." },
      habitat: { en: "Warm coastal waters of Indian Ocean.", hi: "हिंद महासागर के गर्म तटीय जल।", mr: "हिंद महासागराचे किनारी पाणी।", ta: "இந்திய பெருங்கடலின் கடலோர நீர்.", te: "హిందూ మహాసముద్రం తీర జలాలు.", bn: "ভারত মহাসাগরের উপকূলীয় জল।", ml: "ഇന്ത്യൻ മഹാസമുദ്രത്തിലെ തീരദേശ ജലം." },
      color: "#60a5fa",
      category: "Saltwater",
      vitamins: { en: "Vitamin D, B12, Magnesium, Omega-3", hi: "विटामिन डी, बी12, मैग्नीशियम, ओमेगा-3", mr: "व्हिटॅमिन डी, बी12, ओमेगा-3", ta: "Vitamin D, B12", te: "Vitamin D, B12", bn: "ভিটামিন ডি, বি১২", ml: "വിറ്റാമിൻ ഡി, ബി 12" },
      idealConditions: { en: "Warm surface waters near coral reefs.", hi: "मूंगा चट्टानों के पास गर्म सतही जल।", mr: "प्रवाळ खडकांजवळचे पाणी।", ta: "Warm surface waters.", te: "Warm surface waters.", bn: "Warm surface waters.", ml: "Warm surface waters." },
      isPoisonous: false,
      image: "https://static.wixstatic.com/media/42a449_65e9b00aae9748b6ae473e5ce006a4c7~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80/Indian%20mackerel.jpg"
    },
    {
      id: 4,
      name: { en: "Rohu", hi: "रोहू", mr: "रोहू", ta: "ரோகு", te: "రోహు", bn: "রুই", ml: "രോഹു" },
      scientificName: "Labeo rohita",
      description: { en: "Large freshwater carp, extremely popular in culinary dishes across India.", hi: "बड़ी मीठे पानी की कार्प, पूरे भारत के व्यंजनों में लोकप्रिय।", mr: "रोहू नद्यांमध्ये आढळणारी प्रमुख कार्प प्रजाती आहे।", ta: "ரோகு ஆறுகளில் காணப்படும் முக்கிய கெண்டை மீன் இனமாகும்.", te: "రోహు నదులలో కనిపించే ప్రధాన కార్ప్ జాతి.", bn: "রুই নদীগুলির একটি প্রধান কার্প প্রজাতি।", ml: "നദികളിൽ കാണപ്പെടുന്ന പ്രധാന കാർപ്പ് ഇനമാണ് രോഹു." },
      habitat: { en: "Freshwater rivers and managed ponds.", hi: "मीठे पानी की नदियां और तालाब।", mr: "गोड्या पाण्यातील नद्या आणि तलाव।", ta: "நன்னீர் ஆறுகள் மற்றும் குளங்கள்.", te: "మంచినీటి నదులు మరియు చెరువులు.", bn: "মিষ্টি জলের নদী এবং পুকুর।", ml: "ശുദ്ധജല നദികളും കുളങ്ങളും." },
      color: "#9ca3af",
      category: "Freshwater",
      vitamins: { en: "High Protein, Vitamin C, Calcium", hi: "उच्च प्रोटीन, विटामिन सी, कैल्शियम", mr: "प्रोटीन, व्हिटॅमिन सी", ta: "Protein, Vitamin C", te: "Protein, Vitamin C", bn: "প্রোটিন, ভিটামিন সি", ml: "പ്രോട്ടീൻ, വിറ്റാമിൻ സി" },
      idealConditions: { en: "Temperature: 20-30°C, Alkaline pH level.", hi: "तापमान: 20-30 डिग्री सेल्सियस, क्षारीय पीएच स्तर।", mr: "स्वच्छ पाणी।", ta: "Freshwater lakes.", te: "Freshwater lakes.", bn: "Freshwater lakes.", ml: "Freshwater lakes." },
      isPoisonous: false,
      image: "https://www.bigbasket.com/media/uploads/p/m/40178465_2-fresho-rohu-whole-preservative-free.jpg"
    },
    {
      id: 5,
      name: { en: "Puffer Fish", hi: "पफर फिश", mr: "पफर मासा", ta: "பஃபர் மீன்", te: "పఫర్ చేప", bn: "পাফার মাছ", ml: "പഫർ മത്സ്യം" },
      scientificName: "Tetraodontidae",
      description: { en: "Slow moving fish that can inflate into a ball for protection.", hi: "बॉल की तरह फूलने वाली मछली, रक्षा के लिए प्रसिद्ध।", mr: "संरक्षणासाठी फुगणारा मासा।", ta: "ஆபத்து வந்தால் பந்து போல் ஊதிக் கொள்ளும்.", te: "రక్షణ కోసం బంతిలా ఉబ్బుతుంది.", bn: "রক্ষার জন্য বলের মতো ফুলে যায়।", ml: "ഫുട്ബോൾ പോലെ വീർക്കുന്ന മത്സ്യം." },
      habitat: { en: "Tropical and subtropical marine waters.", hi: "उष्णकटिबंधीय समुद्री जल।", mr: "उष्णकटिबंधीय समुद्र।", ta: "Tropical oceans.", te: "Tropical oceans.", bn: "Tropical oceans.", ml: "Tropical oceans." },
      color: "#fde047",
      category: "Saltwater",
      vitamins: { en: "Not recommended for consumption", hi: "सेवन के लिए अनुशंसित नहीं", mr: "खाण्यासाठी शिफारस केलेली नाही", ta: "Not for food.", te: "Not for food.", bn: "Not for food.", ml: "ഭക്ഷിക്കരുത്." },
      idealConditions: { en: "Sandy reefs and seagrass beds.", hi: "रेतीले मूंगा चट्टान और समुद्री घास।", mr: "समुद्री भाग।", ta: "Sandy reefs.", te: "Sandy reefs.", bn: "Sandy reefs.", ml: "Sandy reefs." },
      isPoisonous: true,
      image: "https://www.keywestaquarium.com/wp-content/uploads/2024/12/puffer-fish-mobile.jpg"
    },
    {
      id: 6,
      name: { en: "Red Snapper", hi: "रेड स्नैपर", mr: "तांबसा", ta: "சங்கரா", te: "ఎర్ర మట్ట", bn: "রাঙ্গা কৈ", ml: "പഹരി" },
      scientificName: "Lutjanus campechanus",
      description: { en: "Prized for its firm texture and sweet, nutty flavor.", hi: "अपने कड़े बनावट और मीठे स्वाद के लिए प्रसिद्ध।", mr: "रेड स्नैपर त्याच्या लाल त्वचेसाठी ओळखला जातो।", ta: "Red Snapper is known for its red skin.", te: "Red Snapper is known for its red skin.", bn: "Red Snapper is known for its red skin.", ml: "Red Snapper is known for its red skin." },
      habitat: { en: "Rocky bottoms and offshore reefs.", hi: "पथरीले तल और अपतटीय चट्टानें।", mr: "खडक आणि खडकाळ तळ।", ta: "Reefs and rocky bottoms.", te: "Reefs and rocky bottoms.", bn: "Reefs and rocky bottoms.", ml: "Reefs and rocky bottoms." },
      color: "#ef4444",
      category: "Saltwater",
      vitamins: { en: "Vitamin B12, Selenium, Omega-3", hi: "विटामिन बी12, सेलेनियम, ओमेगा-3", mr: "बी12, सेलेनियम", ta: "Selenium, Omega-3", te: "Selenium, Omega-3", bn: "বি১২, সেলেনিয়াম", ml: "വിറ്റാമിൻ ബി 12" },
      idealConditions: { en: "Depth 30-190m, stable temperature.", hi: "गहराई 30-190 मीटर, स्थिर तापमान।", mr: "खोल समुद्र।", ta: "Offshore reefs.", te: "Offshore reefs.", bn: "Offshore reefs.", ml: "Offshore reefs." },
      isPoisonous: false,
      image: "https://media.istockphoto.com/id/135898272/photo/whole-fresh-red-snapper.jpg?s=612x612&w=0&k=20&c=2HY-DeDg_Id9KxrzzTY3pudyMzqcrdZcVpBk0wLtNOk="
    }
  ];

  const filteredFish = fishDatabase.filter(fish => {
    const matchesSearch = fish.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      fish.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || fish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
      if (!apiKey) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: "API key not configured." }]);
        setChatLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: DEFAULT_GEMINI_MODEL,
        systemInstruction: `You are a helpful fishing assistant. Respond in ${languages[language].name}.`
      });

      const chat = model.startChat({
        history: chatMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.text() }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
  };

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser({
      ...userData,
      id: userId || 'unknown',
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
      provider: 'local'
    });
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('_logged_in');
    localStorage.removeItem('_current_user');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <About onLogin={handleLogin} />;
  }

  return (
    <div className="relative flex flex-col w-full h-screen overflow-hidden font-sans bg-slate-950 text-slate-50 selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 z-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px] animate-pulse-ring"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
      </div>

      {activeTab === 'chat' ? (
        <div className="relative z-10 flex flex-col flex-1 w-full overflow-hidden">
          {/* Chat Tab - Full Height */}
          <div className="relative flex flex-col w-full h-full max-w-4xl pb-4 mx-auto animate-fade-in">
            {/* Chat Header */}
            <div className="sticky top-0 z-10 flex items-center gap-4 p-4 border-b shadow-lg bg-slate-900/60 backdrop-blur-xl border-white/5 shadow-black/20">
              <div className="relative">
                <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2.5 rounded-2xl shadow-lg shadow-cyan-500/20">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold tracking-tight text-white"> AI</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-cyan-400">Online</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <p className="text-xs text-slate-400">Expert in marine life</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/20 transition-all flex items-center gap-2 text-xs font-bold"
              >
                <X className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60 min-h-[400px]">
                  <div className="bg-gradient-to-b from-slate-800 to-slate-900/50 p-8 rounded-[2rem] mb-6 border border-white/5 shadow-2xl">
                    <Fish className="w-16 h-16 text-cyan-400 opacity-80" />
                  </div>
                  <p className="mb-2 text-xl font-bold text-slate-200">How can I help you?</p>
                  <p className="max-w-xs mx-auto text-sm leading-relaxed text-slate-400">Ask about fish identification, specific species, or fishing spots nearby.</p>
                </div>
              ) : (
                <div className="flex flex-col justify-end min-h-full pb-0">
                  <div className="flex-1" />
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex w-full animate-message-in items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-3'}`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center justify-center w-8 h-8 mt-1 border rounded-full bg-slate-800 border-white/10 shrink-0">
                          <Brain className="w-4 h-4 text-cyan-400" />
                        </div>
                      )}
                      <div
                        className={`
                            max-w-[85%] px-5 py-3.5 text-[15px] leading-relaxed shadow-md backdrop-blur-sm relative group whitespace-pre-wrap
                            ${msg.role === 'user'
                            ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-2xl rounded-tr-sm shadow-cyan-900/20'
                            : 'bg-slate-800/80 border border-cyan-500/20 text-slate-100 rounded-2xl rounded-tl-sm hover:bg-slate-800 transition-colors shadow-lg shadow-black/20'}
                          `}
                      >
                        {msg.role === 'assistant' ? (
                          <div className="markdown-content"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start w-full gap-3 animate-message-in">
                      <div className="flex items-center justify-center w-8 h-8 mt-1 border rounded-full bg-slate-800 border-white/10 shrink-0">
                        <Brain className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 min-h-[50px] min-w-[80px]">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot"></div>
                        <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot"></div>
                        <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot"></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} className="h-48" />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="absolute left-0 z-20 w-full px-4 bottom-28">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 p-2 pl-4 transition-all duration-300 border rounded-full shadow-2xl bg-slate-900/90 backdrop-blur-2xl border-white/10 shadow-black/50 focus-within:border-cyan-500/50 ring-1 ring-white/5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent border-none px-2 py-3 text-white placeholder-slate-500 focus:ring-0 focus:outline-none min-h-[44px] text-base"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || chatLoading}
                    className="flex items-center justify-center p-3 text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:grayscale shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-90 w-11 h-11 shrink-0"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex-1 w-full pb-32 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          <div className="max-w-md px-4 pt-8 mx-auto md:max-w-xl lg:max-w-4xl">
            {/* Header for Non-Chat Tabs */}
            <header className="mb-10 text-center animate-float">
              <div className="inline-block p-4 mb-4 shadow-xl rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/20">
                <Fish className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-cyan-100 to-white drop-shadow-sm font-['Outfit'] tracking-tight">
              AquaLens
              </h1>
              <div className="flex items-center justify-center gap-4 mt-2">
                <p className="font-medium text-slate-400">Smart Marine Identification</p>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <button
                  onClick={logout}
                  className="text-xs font-bold tracking-widest uppercase transition-colors text-slate-500 hover:text-red-400"
                >
                  Logout
                </button>
              </div>


            </header>

            <main key={activeTab}>
              {activeTab === 'identify' && (
                <div className="p-6 glass-card rounded-3xl md:p-8 animate-fade-in">
                  <div className="mb-6 text-center">
                    <h2 className="mb-2 text-2xl font-bold">Scan Fish</h2>
                    <p className="text-sm text-slate-400">Upload a photo to identify species, assess freshness & quality</p>
                  </div>

                  <label className="relative flex flex-col items-center justify-center w-full overflow-hidden transition-all border-2 border-dashed cursor-pointer h-72 border-white/20 rounded-2xl hover:border-cyan-400/50 hover:bg-white/5 group bg-slate-900/50">
                    {image ? (
                      <>
                        <img src={image} alt="Uploaded fish" className="relative z-10 object-contain w-full h-full p-2" />
                        {identifying && <div className="z-20 animate-scan"></div>}
                        <button onClick={(e) => { e.preventDefault(); clearImage(); }} className="absolute z-30 p-2 text-white transition-all rounded-full top-4 right-4 bg-black/50 hover:bg-red-500 backdrop-blur-md">
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center p-8 transition-transform duration-300 group-hover:scale-105">
                        <div className="p-5 mb-4 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-400/20 ring-1 ring-white/10">
                          <Upload className="w-10 h-10 text-cyan-400" />
                        </div>
                        <p className="text-lg font-semibold text-slate-200">Upload Photo</p>
                        <p className="mt-1 text-sm text-slate-500">JPG, PNG, WEBP</p>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>

                  {image && !result && (
                    <button
                      onClick={identifyFish} disabled={identifying}
                      className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      {identifying ? <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing...</> : <><Camera className="w-6 h-6" /> Scan Fish (Species, Freshness & Quality)</>}
                    </button>
                  )}

                  {result && !result.error && (
                    <div className="mt-8">
                      <FishAnalysisDashboard result={result} image={image} onNewScan={clearImage} />
                    </div>
                  )}
                  {result?.error && (
                    <div className="p-4 mt-6 text-sm text-center text-red-200 border bg-red-500/10 border-red-500/20 rounded-xl">
                      <p className="flex items-center justify-center gap-2 mb-2 font-bold"><Info className="w-4 h-4" /> Identification Failed</p>
                      <p className="opacity-80">{result.error}</p>
                    </div>
                  )}

                  {!identifying && !result && scanHistory.length > 0 && (
                    <div className="mt-12">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-500">Recent Scans</h3>
                        <button
                          onClick={async () => {
                            setScanHistory([]);
                            await window.storage.delete('scan_history');
                          }}
                          className="text-[10px] font-bold text-slate-600 hover:text-red-400 uppercase tracking-tighter"
                        >
                          Clear History
                        </button>
                      </div>
                      <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
                        {scanHistory.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setImage(item.image);
                              setResult(item.result);
                            }}
                            className="flex-shrink-0 w-24 text-left transition-transform group hover:scale-105"
                          >
                            <div className="relative w-24 h-24 mb-2 overflow-hidden border bg-slate-900 rounded-2xl border-white/5 group-hover:border-cyan-500/50">
                              <img src={item.image} alt={item.result.commonName} className="object-cover w-full h-full transition-opacity opacity-60 group-hover:opacity-100" />
                              <div className="absolute inset-x-0 bottom-0 p-1 text-[8px] font-bold text-center text-white bg-gradient-to-t from-black/80 to-transparent">
                                {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 truncate w-full group-hover:text-cyan-400">
                              {item.result.commonName || item.result.scientificName}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}


              {activeTab === 'weather' && (
                <div className="p-6 glass-card rounded-3xl md:p-8 animate-fade-in min-h-[500px]">
                  <div className="mb-8 text-center text-slate-800">
                    <div className="inline-block p-4 mb-4 rounded-full shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30">
                      <RefreshCw className={`w-8 h-8 text-white ${loadingWeather ? 'animate-spin' : 'animate-spin-slow'}`} />
                    </div>
                    {weatherData && (
                      <div className={`mx-auto mb-4 w-fit px-4 py-1.5 rounded-full border text-sm font-bold backdrop-blur-md transition-all ${getStatusClass(weatherData.status)}`}>
                        Status: {weatherData.status}
                      </div>
                    )}
                    <h2 className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">Marine Dashboard</h2>
                    <p className="text-slate-500">Live monitoring & disaster alerts</p>
                  </div>

                  {!userLocation && !loadingLocation && (
                    <div className="py-12 text-center">
                      <div className="p-6 mb-6 border rounded-2xl bg-slate-100 border-slate-200">
                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400" />
                        <h3 className="mb-2 text-lg font-bold text-slate-800">Location Required</h3>
                        <p className="text-sm text-slate-500">Enable location to get real-time marine weather for your area.</p>
                      </div>
                      <button onClick={getUserLocation} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl shadow-cyan-900/10">
                        <Navigation className="w-5 h-5" /> Activate GPS Search
                      </button>
                    </div>
                  )}

                  {(loadingLocation || loadingWeather) && (
                    <div className="py-24 text-center">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 text-cyan-500 animate-spin" />
                      <p className="font-medium text-slate-500 animate-pulse">Gathering sea telemetry...</p>
                    </div>
                  )}

                  {userLocation && weatherData && !loadingWeather && (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
                        {[
                          { label: 'Wind Speed', value: `${weatherData.windSpeed} km/h`, icon: Navigation, desc: 'At 10m height' },
                          { label: 'Wave Height', value: `${weatherData.waveHeight} m`, icon: Fish, desc: 'Significant' },
                          { label: 'Temperature', value: `${weatherData.temperature.toFixed(1)}°C`, icon: Info, desc: 'Sea surface' },
                          { label: 'Last Sync', value: weatherData.lastUpdated, icon: RefreshCw, desc: 'Local time' },
                        ].map((item, i) => (
                          <div key={i} className="p-4 transition-all border bg-white/40 rounded-2xl border-slate-200/50 hover:bg-white/60 hover:border-cyan-200">
                            <div className="flex items-center gap-2 mb-2">
                              <item.icon className="w-3.5 h-3.5 text-cyan-500" />
                              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{item.label}</p>
                            </div>
                            <p className="text-2xl font-black text-slate-800">{item.value}</p>
                            <p className="text-[9px] text-slate-400 mt-1">{item.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-6 border bg-slate-50 rounded-2xl border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Brain className="w-5 h-5 text-cyan-600" />
                          <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500">AI Safety Analysis</h3>
                        </div>
                        <div className="relative">
                          <div className="absolute top-0 bottom-0 w-1 rounded-full -left-3 bg-cyan-500/20"></div>
                          <p className="pl-4 text-lg italic font-medium leading-relaxed text-slate-700">"{weatherData.analysis}"</p>
                        </div>
                      </div>

                      <button
                        onClick={() => fetchMarineWeather(userLocation.lat, userLocation.lng)}
                        className="flex items-center justify-center w-full gap-2 py-3 mt-8 text-xs font-bold tracking-widest uppercase transition-colors text-slate-400 hover:text-cyan-600"
                      >
                        <RefreshCw className="w-3 h-3" /> Force Update Telemetry
                      </button>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'sos' && (
                <div className="p-4 glass-card rounded-[2.5rem] md:p-10 animate-fade-in overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

                  <div className="mb-10 text-center">
                    <h2 className="mb-1 text-3xl font-black tracking-tighter text-white">EMERGENCY</h2>
                    <p className="mb-8 text-sm font-bold tracking-widest text-red-500 uppercase">Marine Helpline 1554</p>

                    <div className="relative w-48 h-48 mx-auto mb-10 group">
                      <div className="absolute inset-0 transition-opacity bg-red-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 animate-pulse"></div>
                      <a
                        href="tel:1554"
                        className="relative flex flex-col items-center justify-center w-48 h-48 overflow-hidden text-white no-underline transition-all border-8 rounded-full shadow-2xl bg-gradient-to-b from-red-500 to-red-700 shadow-red-900/50 border-red-400/30 hover:scale-105 active:scale-95 group"
                      >
                        <span className="mb-1 text-5xl font-black tracking-tighter">SOS</span>
                        <span className="text-[10px] font-black bg-red-900/50 px-3 py-1 rounded-full border border-red-100/20">CALL NOW</span>
                        <div className="absolute transition-transform duration-1000 -translate-x-full skew-x-12 -inset-2 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full"></div>
                      </a>
                    </div>
                  </div>

                  <div className="p-6 mb-8 border shadow-inner bg-slate-900/80 border-white/10 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-500/20 rounded-xl"><MapPin className="w-5 h-5 text-red-400" /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Live Tracking</p>
                        <h4 className="text-xs font-bold text-white uppercase">Current GPS Coordinates</h4>
                      </div>
                    </div>
                    <div className="p-4 text-center border bg-black/40 rounded-xl border-white/5">
                      <div className="font-mono text-xl font-black text-cyan-400">
                        {userLocation ? `${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}` : (
                          <button onClick={getUserLocation} className="flex items-center justify-center w-full gap-2 text-sm text-slate-400 hover:text-white">
                            <RefreshCw className="w-4 h-4 animate-spin-slow" /> Click to Locate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-center text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Emergency Contacts</h3>
                    <div className="grid gap-4">
                      {coastGuardDepartments.slice(0, 2).map((dept, i) => (
                        <div key={i} className="flex items-center justify-between p-4 transition-colors border bg-white/5 border-white/5 rounded-2xl hover:bg-white/10">
                          <div>
                            <p className="mb-1 text-xs font-bold text-white">{dept.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{dept.telephone}</p>
                          </div>
                          <a href={`tel:${dept.telephone}`} className="p-3 transition-all bg-slate-800 rounded-xl hover:bg-red-500/20 hover:text-red-400">
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'encyclopedia' && (
                <div className="p-6 glass-card rounded-3xl md:p-8 animate-fade-in min-h-[500px]">
                  {!selectedFish ? (
                    <>
                      <div className="mb-8 text-center">
                        <h2 className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Species Guide</h2>
                        <p className="text-sm text-slate-500">Explore and learn about local marine life</p>
                      </div>

                      {/* Search and Filter UI */}
                      <div className="flex flex-col gap-4 mb-8">
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder="Search fish name or scientific name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-5 py-3 pl-12 transition-all border outline-none bg-slate-100/50 rounded-2xl border-slate-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                          />
                          <Fish className="absolute w-5 h-5 transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-400 group-focus-within:text-cyan-500" />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {['All', 'Freshwater', 'Saltwater', 'Brackish'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat
                                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {filteredFish.length > 0 ? (
                          filteredFish.map(fish => (
                            <button key={fish.id} onClick={() => setSelectedFish(fish)} className="flex items-center gap-4 p-4 overflow-hidden text-left transition-all border bg-white/40 rounded-2xl border-slate-200/50 hover:border-cyan-400/50 hover:bg-white/80 group hover:shadow-xl hover:shadow-cyan-500/5">
                              <div className="relative flex-shrink-0 w-20 h-20">
                                <img src={fish.image} alt={fish.name[language]} className="object-cover w-full h-full transition-transform duration-500 shadow-md rounded-xl group-hover:scale-110" />
                                {fish.isPoisonous && (
                                  <div className="absolute p-1 text-white bg-red-500 rounded-full shadow-lg -top-1 -right-1">
                                    <Shield className="w-3 h-3" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold truncate text-slate-800 group-hover:text-cyan-600">{fish.name[language]}</h3>
                                <p className="text-xs italic truncate text-slate-500">{fish.scientificName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] uppercase font-bold text-cyan-500 px-2 py-0.5 bg-cyan-100 rounded-md">{fish.category}</span>
                                  {fish.isPoisonous && <span className="text-[10px] uppercase font-bold text-red-500 px-2 py-0.5 bg-red-100 rounded-md">Toxic</span>}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 ml-auto text-slate-300 group-hover:text-cyan-400" />
                            </button>
                          ))
                        ) : (
                          <div className="py-12 text-center col-span-full text-slate-400">
                            <Info className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No species found matching your search.</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="animate-fade-in">
                      <button onClick={() => setSelectedFish(null)} className="flex items-center gap-1 mb-4 text-sm font-bold text-cyan-400 hover:text-white">← Back to List</button>
                      <div className="flex flex-col gap-8 lg:flex-row">
                        <div className="flex-shrink-0 w-full lg:w-80">
                          <div className="relative group">
                            <img src={selectedFish.image} alt={selectedFish.name[language]} className="w-full aspect-square object-cover rounded-[2rem] shadow-2xl border-4 border-white/10" />
                            {selectedFish.isPoisonous && (
                              <div className="absolute flex items-center gap-2 px-4 py-2 font-bold text-white border rounded-full shadow-xl top-4 right-4 bg-red-500/90 backdrop-blur-md border-red-400/50">
                                <Shield className="w-4 h-4" />
                                Toxic Species
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="mb-1 text-4xl font-black text-white">{selectedFish.name[language]}</h2>
                          <div className="flex items-center gap-3 mb-6">
                            <p className="text-xl italic font-medium text-cyan-400">{selectedFish.scientificName}</p>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                            <span className="text-sm font-bold tracking-widest uppercase text-slate-400">{selectedFish.category}</span>
                          </div>

                          <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
                            <div className="p-5 border bg-slate-900/60 rounded-2xl border-white/5 backdrop-blur-md">
                              <div className="flex items-center gap-2 mb-3">
                                <Info className="w-4 h-4 text-cyan-400" />
                                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400">Description</h4>
                              </div>
                              <p className="text-sm font-medium leading-relaxed text-slate-300">{selectedFish.description[language]}</p>
                            </div>
                            <div className="p-5 border bg-slate-900/60 rounded-2xl border-white/5 backdrop-blur-md">
                              <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400">Habitat</h4>
                              </div>
                              <p className="text-sm font-medium leading-relaxed text-slate-300">{selectedFish.habitat[language]}</p>
                            </div>
                            <div className="p-5 border bg-slate-900/60 rounded-2xl border-white/5 backdrop-blur-md">
                              <div className="flex items-center gap-2 mb-3">
                                <RefreshCw className="w-4 h-4 text-yellow-400" />
                                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400">Vitamins & Nutrition</h4>
                              </div>
                              <p className="text-sm font-medium leading-relaxed text-slate-300">{selectedFish.vitamins[language]}</p>
                            </div>
                            <div className="p-5 border bg-slate-900/60 rounded-2xl border-white/5 backdrop-blur-md">
                              <div className="flex items-center gap-2 mb-3">
                                <Navigation className="w-4 h-4 text-purple-400" />
                                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400">Ideal Conditions</h4>
                              </div>
                              <p className="text-sm font-medium leading-relaxed text-slate-300">{selectedFish.idealConditions[language]}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className="border shadow-2xl glass backdrop-blur-xl bg-slate-900/80 rounded-2xl border-white/10 shadow-black/50">
          <div className="flex items-center justify-between p-2">
            {[
              { id: 'identify', icon: Camera, label: 'Scan' },
              { id: 'weather', icon: RefreshCw, label: 'Weather' },
              { id: 'sos', icon: Phone, label: 'SOS' },
              { id: 'chat', icon: MessageCircle, label: 'AI Chat' },
              { id: 'encyclopedia', icon: Book, label: 'Wiki' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id
                  ? 'text-cyan-400 bg-white/5 scale-110 shadow-lg shadow-cyan-900/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
              >
                <tab.icon className={`w-5 h-5 mb-1 ${activeTab === tab.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}