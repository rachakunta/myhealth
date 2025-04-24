export const SERVICES = [
  {
    id: 'nursing',
    title: 'Nursing',
    description: 'Professional nursing care services at home or facilities by qualified GNM/BSc nurses.',
    icon: 'ri-nurse-fill',
    iconBgClass: 'bg-rose-100',
    iconColor: 'text-rose-500',
    buttonText: 'Book Nursing Care',
    buttonColor: 'text-rose-500',
    path: '/nursing'
  },
  {
    id: 'consult',
    title: 'Consult',
    description: 'Access certified doctors & specialists (including mental health) via secure video or chat.',
    icon: 'ri-video-chat-fill',
    iconBgClass: 'bg-primary bg-opacity-10',
    iconColor: 'text-primary',
    buttonText: 'Book Consultation',
    buttonColor: 'text-primary',
    path: '/consult'
  },
  {
    id: 'diagnose',
    title: 'Diagnose',
    description: 'Book lab tests at home or centers; view results directly in-app.',
    icon: 'ri-test-tube-fill',
    iconBgClass: 'bg-secondary bg-opacity-10',
    iconColor: 'text-secondary',
    buttonText: 'Book Test',
    buttonColor: 'text-secondary',
    path: '/diagnose'
  },
  {
    id: 'medicate',
    title: 'Medicate',
    description: 'Order prescriptions for convenient home delivery with tracking.',
    icon: 'ri-medicine-bottle-fill',
    iconBgClass: 'bg-accent bg-opacity-10',
    iconColor: 'text-accent',
    buttonText: 'Order Medicine',
    buttonColor: 'text-accent',
    path: '/pharmacy'
  },
  {
    id: 'manage',
    title: 'Manage',
    description: 'Track chronic conditions with personalized plans & smart reminders.',
    icon: 'ri-heart-pulse-line',
    iconBgClass: 'bg-status-info bg-opacity-10',
    iconColor: 'text-blue-500',
    buttonText: 'View Health Plans',
    buttonColor: 'text-blue-500',
    path: '/dashboard'
  },
  {
    id: 'prevent',
    title: 'Prevent',
    description: 'Integrate wearable data & receive AI-powered insights for proactive health.',
    icon: 'ri-health-book-fill',
    iconBgClass: 'bg-status-success bg-opacity-10',
    iconColor: 'text-green-500',
    buttonText: 'Connect Devices',
    buttonColor: 'text-green-500',
    path: '/dashboard'
  },
  {
    id: 'thrive',
    title: 'Thrive',
    description: 'Access resources & programs for mental wellness, nutrition, and fitness.',
    icon: 'ri-mental-health-fill',
    iconBgClass: 'bg-status-warning bg-opacity-10',
    iconColor: 'text-yellow-500',
    buttonText: 'Explore Wellness',
    buttonColor: 'text-yellow-500',
    path: '/wellness'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    text: "I used to juggle multiple healthcare apps. MyHealth360 has simplified everything - from doctor appointments to medication tracking. The mental wellness resources are also incredibly helpful.",
    author: "Michael Rodriguez",
    role: "Marketing Director",
    initials: "MR",
    rating: 5
  },
  {
    id: 2,
    text: "As someone managing diabetes, the integrated approach has been a game-changer. I can track my metrics, consult with specialists, and get my medications all in one place. The AI insights are surprisingly accurate!",
    author: "Sarah Patel",
    role: "Software Engineer",
    initials: "SP",
    rating: 5
  },
  {
    id: 3,
    text: "The mental health resources combined with physical healthcare is what sets MyHealth360 apart. The video consultations are seamless, and having my test results explained by a doctor right in the app is incredibly convenient.",
    author: "James Wilson",
    role: "Teacher",
    initials: "JW",
    rating: 4.5
  }
];

export const AI_FEATURES = [
  {
    id: 1,
    title: "Predictive Analysis",
    description: "Our AI analyzes patterns in your health data to predict potential issues before they become serious.",
    icon: "ri-pulse-line",
    link: "/dashboard"
  },
  {
    id: 2,
    title: "Personalized Plans",
    description: "Get customized health plans based on your unique health profile, goals, and medical history.",
    icon: "ri-body-scan-line",
    link: "/dashboard"
  },
  {
    id: 3,
    title: "Device Integration",
    description: "Connect your wearables and health devices for real-time monitoring and enhanced insights.",
    icon: "ri-device-line",
    link: "/dashboard"
  }
];

export const MENTAL_WELLNESS_RESOURCES = [
  {
    id: 1,
    title: "Guided Meditation",
    icon: "ri-mental-health-line",
    duration: "10 min session"
  },
  {
    id: 2,
    title: "Breathing Exercise",
    icon: "ri-heart-pulse-line",
    duration: "5 min session"
  },
  {
    id: 3,
    title: "Calming Sounds",
    icon: "ri-music-2-line",
    duration: "Sleep aid"
  },
  {
    id: 4,
    title: "Mindfulness Tips",
    icon: "ri-book-read-line",
    duration: "3 min read"
  }
];

// Navigation
export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: '/' },
  { name: 'Telemedicine', href: '/telemedicine' },
  { name: 'Nursing Care', href: '/nursing' },
  { name: 'Diagnostics', href: '/diagnose' },
  { name: 'Pharmacy', href: '/pharmacy' }
];

// Health Metrics
export const HEALTH_METRICS = {
  bloodPressure: { label: 'Blood Pressure', unit: 'mmHg' },
  heartRate: { label: 'Heart Rate', unit: 'bpm' },
  bloodGlucose: { label: 'Blood Glucose', unit: 'mg/dL' },
  weight: { label: 'Weight', unit: 'kg' },
  height: { label: 'Height', unit: 'cm' }
};

// Nursing Services
export const NURSING_SERVICES = {
  transactional: [
    { name: "Intramuscular Injections", price: "$30", duration: "15 mins" },
    { name: "Intravenous Infusion", price: "$45", duration: "30 mins" },
    { name: "Wound Dressing", price: "$35", duration: "20 mins" },
    { name: "Nebulization", price: "$25", duration: "15 mins" },
    { name: "Vitals Check", price: "$20", duration: "10 mins" }
  ],
  continuous: [
    { name: "Tracheostomy Care", price: "$250/day", duration: "24/7" },
    { name: "Ostomy Care", price: "$200/day", duration: "24/7" },
    { name: "RT Feeds", price: "$180/day", duration: "24/7" },
    { name: "PEG Feeding", price: "$180/day", duration: "24/7" },
    { name: "Ventilator Monitoring", price: "$300/day", duration: "24/7" },
    { name: "Wound Care", price: "$150/day", duration: "24/7" }
  ]
};

export const MOBILE_NAV_ITEMS = [
  { name: 'Home', path: '/', icon: 'ri-home-5-line' },
  { name: 'Dashboard', path: '/dashboard', icon: 'ri-dashboard-line' },
  { name: 'Telemedicine', path: '/telemedicine', icon: 'ri-video-chat-line' },
  { name: 'Pharmacy', path: '/pharmacy', icon: 'ri-medicine-bottle-line' }
];

export const FOOTER_LINKS = {
  services: [
    { name: 'Telemedicine', path: '/telemedicine' },
    { name: 'Lab Tests', path: '/diagnose' },
    { name: 'Medicine Delivery', path: '/pharmacy' },
    { name: 'Mental Wellness', path: '/wellness' },
    { name: 'Health Tracking', path: '/dashboard' }
  ],
  company: [
    { name: 'About Us', path: '/' },
    { name: 'Our Services', path: '/' },
    { name: 'How It Works', path: '/' },
    { name: 'Contact', path: '/' }
  ],
  legal: [
    { name: 'Privacy Policy', path: '/' },
    { name: 'Terms of Service', path: '/' },
    { name: 'HIPAA Compliance', path: '/' },
    { name: 'Data Security', path: '/' }
  ]
};