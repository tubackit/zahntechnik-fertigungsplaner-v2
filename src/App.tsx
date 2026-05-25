/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Clock, 
  ChevronRight, 
  Settings2, 
  Info,
  Activity,
  Edit2,
  Save,
  Calendar,
  Database,
  Search,
  Plus,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Hash,
  Truck
} from 'lucide-react';

interface ProductionStep {
  id: string;
  stepNumber: number;
  name: string;
  duration: number; // in minutes
  description: string;
  category: 'digital' | 'manual' | 'machine';
}

interface Product {
  id: string;
  name: string;
  icon: ReactNode;
  steps: ProductionStep[];
}

// Base catalog with our specific examples
const BASE_CATALOG: Omit<ProductionStep, 'stepNumber'>[] = [
  { id: 'k1', name: 'Modelle', duration: 2880, category: 'manual', description: 'Modellherstellung für Kronen und Brücken.' },
  { id: 'k2', name: 'CAD Design', duration: 1440, category: 'digital', description: 'Virtuelle Konstruktion der Krone.' },
  { id: 'k3', name: 'CAM Ausarbeiten', duration: 4320, category: 'manual', description: 'Manuelle Ausarbeitung des gefrästen Rohlings.' },
  { id: 'k4', name: 'Verblendung', duration: 2880, category: 'manual', description: 'Keramische Verblendung.' },
  { id: 'k5', name: 'Glanzbrand', duration: 2880, category: 'manual', description: 'Finales Finish und Glanzbrand.' },
  { id: 'k6', name: 'Abutment', duration: 1440, category: 'machine', description: 'Herstellung des individuellen Abutments.' },
  { id: 'k7', name: 'Abutment Nacharbeit', duration: 2880, category: 'manual', description: 'Manuelle Nacharbeit und Passungskontrolle des Abutments.' },
  { id: 'k8', name: 'Endkontrolle', duration: 60, category: 'manual', description: 'Abschließende Qualitätskontrolle.' },
  { id: 'p1', name: 'Modellherstellung', duration: 30, category: 'manual', description: 'Ausgießen der Abformungen.' },
  { id: 'p2', name: 'Bissschablonen', duration: 45, category: 'manual', description: 'Herstellung der Wachswälle zur Bissnahme.' },
  { id: 'p3', name: 'Aufstellung in Wachs', duration: 90, category: 'manual', description: 'Anordnung der Zähne nach ästhetischen Vorgaben.' },
  { id: 'p4', name: 'Einbetten & Ausbrühen', duration: 60, category: 'manual', description: 'Vorbereitung für den Kunststoffguss.' },
  { id: 'p5', name: 'Stopfen / Gießen', duration: 45, category: 'manual', description: 'Einbringen des Prothesenkunststoffs.' },
  { id: 'p6', name: 'Polymerisation', duration: 120, category: 'machine', description: 'Aushärtung im Drucktopf.' },
  { id: 'p7', name: 'Ausarbeiten & Polieren', duration: 60, category: 'manual', description: 'Finales Glätten und Hochglanzpolitur.' },
  { id: 'p8', name: 'Löffel', duration: 1440, category: 'manual', description: 'Herstellung des individuellen Löffels.' },
  { id: 'p9', name: 'Bissnahme', duration: 1440, category: 'manual', description: 'Herstellung der Bissschablone.' },
  { id: 'p10', name: 'Artikulieren', duration: 1440, category: 'manual', description: 'Einartikulieren der Modelle.' },
  { id: 'p11', name: 'ZE Planung', duration: 1440, category: 'manual', description: 'Planung des Zahnersatzes.' },
  { id: 'p12', name: 'Umstellung', duration: 2880, category: 'manual', description: 'Umstellung der Zähne.' },
  { id: 'i1', name: 'Intraoralscan', duration: 10, category: 'digital', description: 'Direkte digitale Abformung beim Patienten.' },
  { id: 'i2', name: 'Design', duration: 15, category: 'digital', description: 'Konstruktion des Inlays am Bildschirm.' },
  { id: 'i3', name: 'Schleifvorgang', duration: 12, category: 'machine', description: 'Nassschleifen aus dem Keramikblock.' },
  { id: 'i4', name: 'Kristallisationsbrand', duration: 25, category: 'machine', description: 'Härtung und Farboptimierung im Ofen.' },
  { id: 'i5', name: 'Einsetzen', duration: 20, category: 'manual', description: 'Adhäsive Befestigung.' },
  { id: 's1', name: 'Scan / Import', duration: 10, category: 'digital', description: 'Digitalisierung der Kiefermodelle.' },
  { id: 's2', name: 'Konstruktion', duration: 20, category: 'digital', description: 'Design der Schiene mit Funktionsflächen.' },
  { id: 's3', name: '3D-Druck', duration: 60, category: 'machine', description: 'Additive Fertigung der Schiene.' },
  { id: 's4', name: 'Reinigung & Nachhärtung', duration: 30, category: 'machine', description: 'Isopropanol-Bad und UV-Licht-Härtung.' },
  { id: 's5', name: 'Finish', duration: 15, category: 'manual', description: 'Entfernen der Stützen und Politur.' },
  { id: 's6', name: 'Modell', duration: 1440, category: 'manual', description: 'Herstellung des Arbeitsmodells.' },
  { id: 's7', name: 'ZE Planung', duration: 1440, category: 'digital', description: 'Zahnersatzplanung.' },
  { id: 's8', name: 'Schienen Konstruktion', duration: 1440, category: 'digital', description: 'Virtuelle Konstruktion der Schiene.' },
  { id: 's9', name: 'Schiene Nacharbeit', duration: 4320, category: 'manual', description: 'Manuelle Nachbearbeitung der Schiene.' },
  { id: 'c1', name: 'Aufstellung', duration: 2880, category: 'manual', description: 'Anordnung der Zähne.' },
  { id: 'c2', name: 'Fertigstellung', duration: 2880, category: 'manual', description: 'Finale Fertigstellung des Werkstücks.' },
  { id: 't1', name: 'Primärkronen CAD', duration: 1440, category: 'digital', description: 'Virtuelle Konstruktion der Primärkronen (Teleskope).' },
  { id: 't2', name: 'Fräsen & Passen', duration: 2880, category: 'manual', description: 'Fräsen der Primärteile und manuelle Passung auf dem Modell.' },
  { id: 't3', name: 'Sekundärgerüst / Modellguss', duration: 2880, category: 'manual', description: 'Guss oder Fräsen des Sekundärgerüstes als Einstückarbeit.' },
];

const PartialDentureIcon = () => (
  <svg viewBox="0 0 64 64" width="1em" height="1em" className="inline-block drop-shadow-md">
    {/* Main pink body */}
    <path 
      d="M 20 30 
         C 20 40 15 45 10 50 
         C 15 55 25 55 30 45 
         C 32 42 34 42 36 45 
         C 41 55 51 55 56 50 
         C 51 45 46 40 46 30 
         C 46 25 55 20 60 25 
         C 62 20 55 15 45 15 
         C 40 15 35 20 32 20 
         C 29 20 24 15 19 15 
         C 9 15 2 20 4 25 
         C 9 20 18 25 20 30 Z" 
      fill="#e68a9a" 
    />
    {/* Teeth */}
    <path 
      d="M 22 22 
         C 22 10 31 10 31 22 
         C 31 30 22 30 22 22 Z" 
      fill="#fdf5d3" 
    />
    <path 
      d="M 33 23 
         C 33 11 42 11 42 23 
         C 42 31 33 31 33 23 Z" 
      fill="#fdf5d3" 
    />
    {/* Highlights for realism */}
    <path d="M 24 15 C 26 15 28 15 28 20" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <path d="M 35 16 C 37 16 39 16 39 21" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <path d="M 15 45 C 18 48 20 48 22 45" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    <path d="M 45 45 C 47 48 49 48 51 45" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const SplintIcon = () => (
  <svg viewBox="0 0 64 64" width="1em" height="1em" className="inline-block drop-shadow-md">
    <defs>
      <linearGradient id="splintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.9" />
        <stop offset="40%" stopColor="#f3f4f6" stopOpacity="0.7" />
        <stop offset="60%" stopColor="#bfdbfe" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.95" />
      </linearGradient>
      <pattern id="blueGrid" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
        <path d="M 3 0 L 0 0 0 3" fill="none" stroke="#1d4ed8" strokeWidth="0.5" opacity="0.6" />
      </pattern>
    </defs>
    
    {/* Main Splint Body (Horseshoe shape) */}
    <path 
      d="M 15 15 
         C 10 25, 10 40, 20 50 
         C 28 58, 45 55, 55 45 
         C 60 40, 60 30, 55 25 
         C 52 22, 48 22, 45 25 
         C 48 32, 45 42, 35 45 
         C 25 48, 20 40, 22 30 
         C 23 25, 20 18, 15 15 Z" 
      fill="url(#splintGrad)" 
      stroke="#9ca3af"
      strokeWidth="1"
    />
    
    {/* Grid overlay on the right side (blue part) */}
    <path 
      d="M 35 45 
         C 45 42, 48 32, 45 25 
         C 48 22, 52 22, 55 25 
         C 60 30, 60 40, 55 45 
         C 48 52, 38 50, 35 45 Z" 
      fill="url(#blueGrid)" 
    />
    
    {/* 3D Highlights / Reflections */}
    <path d="M 14 25 C 13 35, 18 45, 25 50" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M 48 28 C 50 35, 48 42, 42 46" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <path d="M 52 26 C 55 30, 55 38, 52 42" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    
    {/* Tooth indentations (bumps) */}
    <circle cx="18" cy="22" r="3" fill="#ffffff" opacity="0.4" />
    <circle cx="16" cy="32" r="3" fill="#ffffff" opacity="0.4" />
    <circle cx="20" cy="42" r="3" fill="#ffffff" opacity="0.4" />
    <circle cx="28" cy="48" r="3" fill="#ffffff" opacity="0.4" />
    <circle cx="38" cy="46" r="3" fill="#ffffff" opacity="0.4" />
    <circle cx="48" cy="40" r="3" fill="#ffffff" opacity="0.4" />
    <circle cx="52" cy="32" r="3" fill="#ffffff" opacity="0.4" />
  </svg>
);

const InlayIcon = () => (
  <svg viewBox="0 0 64 64" width="1em" height="1em" className="inline-block drop-shadow-md">
    <defs>
      <linearGradient id="toothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="80%" stopColor="#f3f4f6" />
        <stop offset="100%" stopColor="#e5e7eb" />
      </linearGradient>
      <linearGradient id="inlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f4d8d1" />
        <stop offset="100%" stopColor="#e6b8ad" />
      </linearGradient>
    </defs>
    
    {/* Main Tooth Body */}
    <path 
      d="M 12 25 
         C 12 5, 28 5, 32 12 
         C 36 5, 52 5, 52 25 
         C 52 38, 45 42, 42 52 
         C 40 58, 35 58, 32 50 
         C 29 58, 24 58, 22 52 
         C 19 42, 12 38, 12 25 Z" 
      fill="url(#toothGrad)" 
      stroke="#d1d5db"
      strokeWidth="1"
    />
    
    {/* 3D Highlights for Tooth */}
    <path d="M 16 25 C 16 15, 22 12, 28 14" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M 48 25 C 48 15, 42 12, 36 14" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    
    {/* Inlay (Cross shape on top) */}
    <path 
      d="M 32 10
         C 36 10, 42 12, 46 16
         C 42 18, 38 18, 36 22
         C 40 26, 42 32, 38 34
         C 34 32, 30 30, 26 34
         C 22 32, 24 26, 28 22
         C 26 18, 22 18, 18 16
         C 22 12, 28 10, 32 10 Z"
      fill="url(#inlayGrad)"
      stroke="#d4a39a"
      strokeWidth="0.5"
    />
    
    {/* Inlay Highlights */}
    <path d="M 32 11 C 34 11, 38 12, 42 14" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <path d="M 22 14 C 26 12, 30 11, 32 11" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const BarDentureIcon = () => (
  <svg viewBox="0 0 200 200" width="1.2em" height="1.2em" className="inline-block drop-shadow-md">
    <defs>
      <linearGradient id="stegBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#cfd8dc" />
        <stop offset="30%" stopColor="#eceff1" />
        <stop offset="70%" stopColor="#b0bec5" />
        <stop offset="100%" stopColor="#78909c" />
      </linearGradient>
      <linearGradient id="stegGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffd54f" />
        <stop offset="50%" stopColor="#ffb300" />
        <stop offset="100%" stopColor="#ff8f00" />
      </linearGradient>
      <linearGradient id="stegGumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff8a80" />
        <stop offset="100%" stopColor="#e53935" />
      </linearGradient>
      <linearGradient id="stegLowerGumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffab91" />
        <stop offset="100%" stopColor="#d84315" />
      </linearGradient>
      <linearGradient id="stegToothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#ededed" />
      </linearGradient>
      <linearGradient id="stegImplantGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#90a4ae" />
        <stop offset="50%" stopColor="#eceff1" />
        <stop offset="100%" stopColor="#546e7a" />
      </linearGradient>
    </defs>

    {/* Upper Overdenture Set (Teeth and Gums) */}
    {/* Coral Pink Gum Base for the denture */}
    <path 
      d="M 25 75 
         C 40 55, 160 55, 175 75 
         C 175 88, 160 85, 145 80 
         C 130 75, 70 75, 55 80 
         C 40 85, 25 88, 25 75 Z" 
      fill="url(#stegGumGrad)" 
      stroke="#c62828" 
      strokeWidth="1.2" 
    />

    {/* Elegant White Teeth Set on the denture */}
    {/* Left molars/premolar */}
    <path d="M 32 73 C 32 90, 44 90, 44 73 Z" fill="url(#stegToothGrad)" stroke="#37474f" strokeWidth="1" />
    <path d="M 46 75 C 46 92, 58 92, 58 75 Z" fill="url(#stegToothGrad)" stroke="#37474f" strokeWidth="1" />
    
    {/* Left Canine */}
    <path d="M 60 76 C 60 95, 72 95, 72 76 C 72 76, 66 98, 60 76 Z" fill="url(#stegToothGrad)" stroke="#37474f" strokeWidth="1" />
    
    {/* Incisors (Front teeth) */}
    <path d="M 74 77 C 74 98, 87 98, 87 77 Z" fill="url(#stegToothGrad)" stroke="#37474f" strokeWidth="1" />
    <path d="M 89 77 C 89 98, 102 98, 102 77 Z" fill="url(#stegToothGrad)" stroke="#37474f" strokeWidth="1" />
    <path d="M 104 77 C 104 98, 117 98, 117 77 Z" fill="url(#stegToothGrad)" stroke="#37474f" strokeWidth="1" />
    <path d="M 119 77 C 119 98, 132 98, 132 77 Z" fill="url(#stegToothGrad)" stroke="#37474f" strokeWidth="1" />

    {/* Right Canine */}
    <path d="M 134 76 C 134 95, 146 95, 146 76 C 146 76, 140 98, 134 76 Z" fill="url(#stegToothGrad)" stroke="#37474f" strokeWidth="1" />
    
    {/* Right molars/premolar */}
    <path d="M 148 75 C 148 92, 160 92, 160 75 Z" fill="url(#stegToothGrad)" stroke="#37474f" strokeWidth="1" />
    <path d="M 162 73 C 162 90, 174 90, 174 73 Z" fill="url(#stegToothGrad)" stroke="#37474f" strokeWidth="1" />

    {/* Lower Bone/Gum Base at the bottom */}
    <path 
      d="M 20 170 
         C 40 185, 160 185, 180 170 
         C 180 152, 160 148, 140 146
         C 120 144, 80 144, 60 146 
         C 40 148, 20 152, 20 170 Z" 
      fill="url(#stegLowerGumGrad)" 
      stroke="#bf360c" 
      strokeWidth="1.5" 
    />

    {/* Four Implants coming out of the bone */}
    {/* Implant 1 (Far Left) */}
    <g transform="translate(42, 138)">
      <rect x="0" y="0" width="10" height="24" rx="2" fill="url(#stegImplantGrad)" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="5" x2="9" y2="5" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="9" x2="9" y2="9" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="13" x2="9" y2="13" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="17" x2="9" y2="17" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="21" x2="9" y2="21" stroke="#37474f" strokeWidth="1.2" />
      <ellipse cx="5" cy="0" rx="6" ry="3" fill="url(#stegGoldGrad)" stroke="#ff6f00" strokeWidth="0.8" />
    </g>

    {/* Implant 2 (Center Left) */}
    <g transform="translate(78, 135)">
      <rect x="0" y="0" width="10" height="24" rx="2" fill="url(#stegImplantGrad)" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="5" x2="9" y2="5" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="9" x2="9" y2="9" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="13" x2="9" y2="13" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="17" x2="9" y2="17" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="21" x2="9" y2="21" stroke="#37474f" strokeWidth="1.2" />
      <ellipse cx="5" cy="0" rx="6" ry="3" fill="url(#stegGoldGrad)" stroke="#ff6f00" strokeWidth="0.8" />
    </g>

    {/* Implant 3 (Center Right) */}
    <g transform="translate(112, 135)">
      <rect x="0" y="0" width="10" height="24" rx="2" fill="url(#stegImplantGrad)" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="5" x2="9" y2="5" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="9" x2="9" y2="9" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="13" x2="9" y2="13" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="17" x2="9" y2="17" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="21" x2="9" y2="21" stroke="#37474f" strokeWidth="1.2" />
      <ellipse cx="5" cy="0" rx="6" ry="3" fill="url(#stegGoldGrad)" stroke="#ff6f00" strokeWidth="0.8" />
    </g>

    {/* Implant 4 (Far Right) */}
    <g transform="translate(148, 138)">
      <rect x="0" y="0" width="10" height="24" rx="2" fill="url(#stegImplantGrad)" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="5" x2="9" y2="5" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="9" x2="9" y2="9" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="13" x2="9" y2="13" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="17" x2="9" y2="17" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="21" x2="9" y2="21" stroke="#37474f" strokeWidth="1.2" />
      <ellipse cx="5" cy="0" rx="6" ry="3" fill="url(#stegGoldGrad)" stroke="#ff6f00" strokeWidth="0.8" />
    </g>

    {/* Horizontal Titanium Bar joining the implants */}
    <path 
      d="M 47 137 
         C 70 128, 130 128, 153 137 
         C 151 142, 127 135, 97 135
         C 72 135, 49 142, 47 137 Z" 
      fill="url(#stegBarGrad)" 
      stroke="#37474f" 
      strokeWidth="1.5" 
    />

    {/* Gold matrix housings / receptors under the upper denture */}
    <g stroke="#ff6f00" strokeWidth="0.8" fill="url(#stegGoldGrad)">
      <ellipse cx="47" cy="98" rx="5" ry="2" />
      <ellipse cx="83" cy="99" rx="5" ry="2" />
      <ellipse cx="117" cy="99" rx="5" ry="2" />
      <ellipse cx="153" cy="98" rx="5" ry="2" />
    </g>

    {/* Insertion Pathways Guidance (arrows pointing downward to bar) */}
    <g stroke="#455a64" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
      {/* Left Outer Arrow */}
      <path d="M 47 106 L 47 122" strokeDasharray="2,2" />
      <path d="M 44 118 L 47 122 L 50 118" />

      {/* Left Center Arrow */}
      <path d="M 83 107 L 83 121" strokeDasharray="2,2" />
      <path d="M 80 117 L 83 121 L 86 117" />

      {/* Right Center Arrow */}
      <path d="M 117 107 L 117 121" strokeDasharray="2,2" />
      <path d="M 114 117 L 117 121 L 120 117" />

      {/* Right Outer Arrow */}
      <path d="M 153 106 L 153 122" strokeDasharray="2,2" />
      <path d="M 150 118 L 153 122 L 156 118" />
    </g>
  </svg>
);

const TelescopeIcon = () => (
  <svg viewBox="0 0 200 200" width="1.2em" height="1.2em" className="inline-block drop-shadow-md">
    <defs>
      {/* Gradients */}
      <linearGradient id="implantGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#cfd8dc" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#90a4ae" />
      </linearGradient>
      <linearGradient id="gumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff8a80" />
        <stop offset="100%" stopColor="#e53935" />
      </linearGradient>
      <linearGradient id="lowerGumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff8a80" />
        <stop offset="100%" stopColor="#f06292" />
      </linearGradient>
      <linearGradient id="toothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f5f5f5" />
      </linearGradient>
      <linearGradient id="metalBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#eceff1" />
        <stop offset="100%" stopColor="#b0bec5" />
      </linearGradient>
    </defs>

    {/* Halftone Halos/Dot Arrays at the top (upper jaw margin) */}
    <g opacity="0.6">
      {/* Row 1 - smallest */}
      <circle cx="20" cy="20" r="1.5" fill="#e53935" />
      <circle cx="30" cy="18" r="1.7" fill="#e53935" />
      <circle cx="40" cy="17" r="1.9" fill="#e53935" />
      <circle cx="50" cy="18" r="1.7" fill="#e53935" />
      <circle cx="60" cy="20" r="1.5" fill="#e53935" />
      
      {/* Row 2 */}
      <circle cx="15" cy="28" r="2.0" fill="#e53935" />
      <circle cx="25" cy="25" r="2.3" fill="#e53935" />
      <circle cx="35" cy="23" r="2.5" fill="#e53935" />
      <circle cx="45" cy="24" r="2.3" fill="#e53935" />
      <circle cx="55" cy="26" r="2.0" fill="#e53935" />
      <circle cx="65" cy="29" r="1.7" fill="#e53935" />

      {/* Row 3 - dense */}
      <circle cx="10" cy="38" r="2.7" fill="#e53935" />
      <circle cx="20" cy="34" r="3.0" fill="#e53935" />
      <circle cx="30" cy="31" r="3.3" fill="#e53935" />
      <circle cx="40" cy="30" r="3.5" fill="#e53935" />
      <circle cx="50" cy="31" r="3.3" fill="#e53935" />
      <circle cx="60" cy="33" r="3.0" fill="#e53935" />
      <circle cx="70" cy="37" r="2.5" fill="#e53935" />
    </g>

    {/* Right-side dots */}
    <g opacity="0.6">
      {/* Row 1 */}
      <circle cx="180" cy="20" r="1.5" fill="#e53935" />
      <circle cx="170" cy="18" r="1.7" fill="#e53935" />
      <circle cx="160" cy="17" r="1.9" fill="#e53935" />
      <circle cx="150" cy="18" r="1.7" fill="#e53935" />
      <circle cx="140" cy="20" r="1.5" fill="#e53935" />
      
      {/* Row 2 */}
      <circle cx="185" cy="28" r="2.0" fill="#e53935" />
      <circle cx="175" cy="25" r="2.3" fill="#e53935" />
      <circle cx="165" cy="23" r="2.5" fill="#e53935" />
      <circle cx="155" cy="24" r="2.3" fill="#e53935" />
      <circle cx="145" cy="26" r="2.0" fill="#e53935" />
      <circle cx="135" cy="29" r="1.7" fill="#e53935" />

      {/* Row 3 */}
      <circle cx="190" cy="38" r="2.7" fill="#e53935" />
      <circle cx="180" cy="34" r="3.0" fill="#e53935" />
      <circle cx="170" cy="31" r="3.3" fill="#e53935" />
      <circle cx="160" cy="30" r="3.5" fill="#e53935" />
      <circle cx="150" cy="31" r="3.3" fill="#e53935" />
      <circle cx="140" cy="33" r="3.0" fill="#e53935" />
      <circle cx="130" cy="37" r="2.5" fill="#e53935" />
    </g>

    {/* Upper Jaw Red Base */}
    <path 
      d="M 12 40 
         C 20 28, 50 32, 70 34 
         C 85 35, 95 48, 100 48 
         C 105 48, 115 35, 130 34 
         C 150 32, 180 28, 188 40 
         C 188 65, 175 62, 160 55 
         C 150 51, 145 61, 137 60 
         C 125 58, 115 63, 100 63
         C 85 63, 75 58, 63 60 
         C 55 61, 50 51, 40 55
         C 25 62, 12 65, 12 40 Z" 
      fill="url(#gumGrad)" 
      stroke="#c62828"
      strokeWidth="1.5"
    />

    {/* Upper central teeth sticking down */}
    {/* Left Central Incisor */}
    <path 
      d="M 86 58
         C 86 75, 99 75, 99 58 Z" 
      fill="url(#toothGrad)" 
      stroke="#263238" 
      strokeWidth="1.2" 
    />
    {/* Right Central Incisor */}
    <path 
      d="M 101 58
         C 101 75, 114 75, 114 58 Z" 
      fill="url(#toothGrad)" 
      stroke="#263238" 
      strokeWidth="1.2" 
    />
    {/* Left Lateral Incisor */}
    <path 
      d="M 75 56
         C 75 70, 85 70, 85 56 Z" 
      fill="url(#toothGrad)" 
      stroke="#263238" 
      strokeWidth="1.2" 
    />
    {/* Right Lateral Incisor */}
    <path 
      d="M 115 56
         C 115 70, 125 70, 125 56 Z" 
      fill="url(#toothGrad)" 
      stroke="#263238" 
      strokeWidth="1.2" 
    />

    {/* Dotted outlines inside Upper Gums with upward arrows representing primary sleeve sockets */}
    {/* Left Dotted Target */}
    <path 
      d="M 53 45 L 53 62 A 7 7 0 0 0 67 62 L 67 45" 
      fill="none" 
      stroke="#263238" 
      strokeWidth="1.5" 
      strokeDasharray="3,3" 
    />
    {/* Left Target Upward Arrow */}
    <g stroke="#263238" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 60 60 L 60 48" />
      <path d="M 56 52 L 60 48 L 64 52" />
    </g>

    {/* Right Dotted Target */}
    <path 
      d="M 133 45 L 133 62 A 7 7 0 0 0 147 62 L 147 45" 
      fill="none" 
      stroke="#263238" 
      strokeWidth="1.5" 
      strokeDasharray="3,3" 
    />
    {/* Right Target Upward Arrow */}
    <g stroke="#263238" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 140 60 L 140 48" />
      <path d="M 136 52 L 140 48 L 144 52" />
    </g>

    {/* Prepared implant/abutment structures */}
    {/* Left Implant Body */}
    <g transform="translate(54, 78)">
      <rect x="0" y="0" width="12" height="24" rx="2" fill="url(#implantGrad)" stroke="#37474f" strokeWidth="1.2" />
      {/* Threads */}
      <line x1="1" y1="5" x2="11" y2="5" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="9" x2="11" y2="9" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="13" x2="11" y2="13" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="17" x2="11" y2="17" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="21" x2="11" y2="21" stroke="#37474f" strokeWidth="1.2" />
      {/* Abutment hex top */}
      <path d="M 2 0 L 4 -4 L 8 -4 L 10 0 Z" fill="#90a4ae" stroke="#37474f" strokeWidth="1" />
    </g>

    {/* Right Implant Body */}
    <g transform="translate(134, 78)">
      <rect x="0" y="0" width="12" height="24" rx="2" fill="url(#implantGrad)" stroke="#37474f" strokeWidth="1.2" />
      {/* Threads */}
      <line x1="1" y1="5" x2="11" y2="5" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="9" x2="11" y2="9" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="13" x2="11" y2="13" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="17" x2="11" y2="17" stroke="#37474f" strokeWidth="1.2" />
      <line x1="1" y1="21" x2="11" y2="21" stroke="#37474f" strokeWidth="1.2" />
      {/* Abutment hex top */}
      <path d="M 2 0 L 4 -4 L 8 -4 L 10 0 Z" fill="#90a4ae" stroke="#37474f" strokeWidth="1" />
    </g>

    {/* Lower telescopic denture components */}
    {/* Left Denture Pink Wing */}
    <path 
      d="M 18 120
         C 18 102, 36 102, 44 116
         C 46 122, 44 142, 40 148
         C 34 152, 18 140, 18 120 Z" 
      fill="url(#lowerGumGrad)" 
      stroke="#d81b60" 
      strokeWidth="1.2" 
    />
    {/* Left Denture Teeth */}
    <path d="M 20 120 C 20 108, 28 108, 28 120 Z" fill="url(#toothGrad)" stroke="#263238" strokeWidth="1" />
    <path d="M 28 123 C 28 112, 36 112, 36 123 Z" fill="url(#toothGrad)" stroke="#263238" strokeWidth="1" />

    {/* Right Denture Pink Wing */}
    <path 
      d="M 182 120
         C 182 102, 164 102, 156 116
         C 154 122, 156 142, 160 148
         C 166 152, 182 140, 182 120 Z" 
      fill="url(#lowerGumGrad)" 
      stroke="#d81b60" 
      strokeWidth="1.2" 
    />
    {/* Right Denture Teeth */}
    <path d="M 180 120 C 180 108, 172 108, 172 120 Z" fill="url(#toothGrad)" stroke="#263238" strokeWidth="1" />
    <path d="M 172 123 C 172 112, 164 112, 164 123 Z" fill="url(#toothGrad)" stroke="#263238" strokeWidth="1" />

    {/* Connecting Metallic Substructure Bar */}
    <path 
      d="M 42 136 
         C 60 146, 140 146, 158 136
         C 140 140, 60 140, 42 136 Z" 
      fill="url(#metalBarGrad)" 
      stroke="#455a64" 
      strokeWidth="1.2" 
    />

    {/* Telescopic secondary crown sockets (Dashed outlines in denture sliding up) */}
    {/* Left Socket */}
    <path 
      d="M 52 124 L 52 140 A 8 8 0 0 0 68 140 L 68 124 Z" 
      fill="url(#metalBarGrad)" 
      stroke="#37474f" 
      strokeWidth="1.5" 
    />
    <path 
      d="M 55 128 L 55 138 A 5 5 0 0 0 65 138 L 65 128" 
      fill="none" 
      stroke="#cfd8dc" 
      strokeWidth="1" 
      strokeDasharray="2,2" 
    />

    {/* Right Socket */}
    <path 
      d="M 132 124 L 132 140 A 8 8 0 0 0 148 140 L 148 124 Z" 
      fill="url(#metalBarGrad)" 
      stroke="#37474f" 
      strokeWidth="1.5" 
    />
    <path 
      d="M 135 128 L 135 138 A 5 5 0 0 0 145 138 L 145 128" 
      fill="none" 
      stroke="#cfd8dc" 
      strokeWidth="1" 
      strokeDasharray="2,2" 
    />

    {/* Insertion vectors / overall pathway guide arrows */}
    {/* Far Left Pathway Arrow */}
    <g stroke="#212121" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 32 110 L 32 44" strokeDasharray="3,3" />
      <path d="M 32 44 L 32 36" />
      <path d="M 29 42 L 32 36 L 35 42" />
    </g>

    {/* Far Right Pathway Arrow */}
    <g stroke="#212121" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 168 110 L 168 44" strokeDasharray="3,3" />
      <path d="M 168 44 L 168 36" />
      <path d="M 165 42 L 168 36 L 171 42" />
    </g>

    {/* Short guide arrows from implants to targets */}
    <g stroke="#263238" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Left to sleeve */}
      <path d="M 60 74 L 60 66" />
      <path d="M 57 70 L 60 74 L 63 70" />
      {/* Right to sleeve */}
      <path d="M 140 74 L 140 66" />
      <path d="M 137 70 L 140 74 L 143 70" />
    </g>
  </svg>
);

// Generate exactly 200 items for the catalog
const INITIAL_CATALOG: ProductionStep[] = Array.from({ length: 200 }, (_, i) => {
  const stepNumber = i + 1;
  if (i < BASE_CATALOG.length) {
    return { ...BASE_CATALOG[i], stepNumber };
  }
  // Fill the rest with generic placeholders
  return {
    id: `step-${stepNumber}`,
    stepNumber,
    name: `Fertigungsabschnitt ${stepNumber}`,
    duration: 60, // Default 1 hour
    category: 'manual',
    description: `Standardbeschreibung für Fertigungsabschnitt ${stepNumber}.`
  };
});

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'krone-standard',
    name: 'Kronen/Brücken (glasiert/bemalt)',
    icon: '🦷',
    steps: INITIAL_CATALOG.filter(s => ['k1', 'k2', 'k3', 'k5', 'k8'].includes(s.id))
  },
  {
    id: 'krone-verblendet',
    name: 'Kronen/Brücken (verblendet)',
    icon: '✨',
    steps: INITIAL_CATALOG.filter(s => ['k1', 'k2', 'k3', 'k4', 'k5', 'k8'].includes(s.id))
  },
  {
    id: 'prothese-total',
    name: 'Totalprothese (klassisch / mit MG)',
    icon: '👄',
    steps: INITIAL_CATALOG.filter(s => s.id.startsWith('p'))
  },
  {
    id: 'inlay-keramik',
    name: 'Inlay/Teilkrone',
    icon: <InlayIcon />,
    steps: INITIAL_CATALOG.filter(s => s.id.startsWith('i'))
  },
  {
    id: 'schiene-aufbiss',
    name: 'Aufbissschienen',
    icon: <SplintIcon />,
    steps: [
      ...INITIAL_CATALOG.filter(s => ['s6', 's7', 's8', 's9'].includes(s.id)),
      ...INITIAL_CATALOG.filter(s => s.id === 'k8')
    ]
  },
  {
    id: 'interims-clearsplint',
    name: 'Interims/ClearSplint',
    icon: <PartialDentureIcon />,
    steps: [
      ...INITIAL_CATALOG.filter(s => ['s6', 's7', 'c1', 'c2'].includes(s.id)),
      ...INITIAL_CATALOG.filter(s => s.id === 'k8')
    ]
  },
  {
    id: 'prothese-teleskop',
    name: 'Teleskopierende Prothese',
    icon: <TelescopeIcon />,
    steps: ['s6', 't1', 't2', 't3', 'c1', 'c2', 'k8']
      .map(id => INITIAL_CATALOG.find(s => s.id === id)!)
      .filter(Boolean)
  },
  {
    id: 'steg-prothese',
    name: 'Stegprothese',
    icon: <BarDentureIcon />,
    steps: ['s6', 's7', 'k8']
      .map(id => INITIAL_CATALOG.find(s => s.id === id)!)
      .filter(Boolean)
  }
];

const formatTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const minutesToDHM = (totalMinutes: number) => {
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
};

const dhmToMinutes = (days: number, hours: number, minutes: number) => {
  return (days * 24 * 60) + (hours * 60) + minutes;
};

function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31);
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function isPublicHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  // Fixed holidays in Rhineland-Palatinate
  if (month === 0 && day === 1) return true;   // Neujahr (01.01.)
  if (month === 4 && day === 1) return true;   // Tag der Arbeit (01.05.)
  if (month === 9 && day === 3) return true;   // Tag der Deutschen Einheit (03.10.)
  if (month === 10 && day === 1) return true;  // Allerheiligen (01.11.)
  if (month === 11 && day === 25) return true; // 1. Weihnachtstag (25.12.)
  if (month === 11 && day === 26) return true; // 2. Weihnachtstag (26.12.)

  // Variable holidays based on Easter Sunday
  const easter = getEasterSunday(year);
  
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // Karfreitag (Easter Sunday - 2)
  const karfreitag = new Date(easter);
  karfreitag.setDate(easter.getDate() - 2);
  if (isSameDay(date, karfreitag)) return true;

  // Ostermontag (Easter Sunday + 1)
  const ostermontag = new Date(easter);
  ostermontag.setDate(easter.getDate() + 1);
  if (isSameDay(date, ostermontag)) return true;

  // Christi Himmelfahrt (Easter Sunday + 39)
  const christiHimmelfahrt = new Date(easter);
  christiHimmelfahrt.setDate(easter.getDate() + 39);
  if (isSameDay(date, christiHimmelfahrt)) return true;

  // Pfingstmontag (Easter Sunday + 50)
  const pfingstmontag = new Date(easter);
  pfingstmontag.setDate(easter.getDate() + 50);
  if (isSameDay(date, pfingstmontag)) return true;

  // Fronleichnam (Easter Sunday + 60) - Feiertag in Rheinland-Pfalz
  const fronleichnam = new Date(easter);
  fronleichnam.setDate(easter.getDate() + 60);
  if (isSameDay(date, fronleichnam)) return true;

  return false;
}

function isWorkingDay(date: Date): boolean {
  const day = date.getDay();
  if (day === 0 || day === 6) { // Sunday, Saturday
    return false;
  }
  return !isPublicHoliday(date);
}

function getEndOfDay(date: Date, stepName?: string): Date {
  const d = new Date(date);
  if (d.getDay() === 5) { // Friday
    // Friday specific rules for crown products
    if (stepName === 'Endkontrolle') {
      d.setHours(14, 0, 0, 0);
    } else {
      d.setHours(14, 0, 0, 0); // Default Friday end
    }
  } else {
    d.setHours(17, 0, 0, 0);
  }
  return d;
}

function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(8, 0, 0, 0);
  return d;
}

function advanceToNextWorkingDay(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  while (!isWorkingDay(d)) {
    d.setDate(d.getDate() + 1);
  }
  return getStartOfDay(d);
}

function addWorkingTime(startDate: Date, durationMinutes: number, stepName?: string): { start: Date, end: Date } {
  let current = new Date(startDate);
  
  if (!isWorkingDay(current)) {
    current = advanceToNextWorkingDay(current);
  } else if (current.getHours() < 8) {
    current = getStartOfDay(current);
  } else if (current.getTime() >= getEndOfDay(current, stepName).getTime()) {
    current = advanceToNextWorkingDay(current);
  }

  const actualStart = new Date(current);

  const daysToAdd = Math.floor(durationMinutes / (24 * 60));
  const minsToAdd = durationMinutes % (24 * 60);

  if (daysToAdd > 0) {
    let actualDaysToAdvance = (current.getHours() < 12) ? daysToAdd - 1 : daysToAdd;
    
    for (let i = 0; i < actualDaysToAdvance; i++) {
      current.setDate(current.getDate() + 1);
      while (!isWorkingDay(current)) {
        current.setDate(current.getDate() + 1);
      }
    }
    
    // Special rule: Glanzbrand, Schiene Nacharbeit, and Fertigstellung end at 14:00 (13:00 on Fridays) on the last day
    if (stepName === 'Glanzbrand' || stepName === 'Schiene Nacharbeit' || stepName === 'Fertigstellung') {
      if (current.getDay() === 5) {
        current.setHours(13, 0, 0, 0);
      } else {
        current.setHours(14, 0, 0, 0);
      }
    } else {
      current = getEndOfDay(current, stepName);
    }
  }

  if (minsToAdd > 0) {
    let remainingMins = minsToAdd;
    while (remainingMins > 0) {
      const eod = getEndOfDay(current, stepName);
      const minsToEod = (eod.getTime() - current.getTime()) / 60000;
      
      if (remainingMins <= minsToEod) {
        current.setMinutes(current.getMinutes() + remainingMins);
        remainingMins = 0;
      } else {
        remainingMins -= minsToEod;
        current = advanceToNextWorkingDay(current);
      }
    }
  }

  return { start: actualStart, end: current };
}

const formatDateForInput = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDisplayDate = (date: Date) => {
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${days[date.getDay()]}, ${pad(date.getDate())}.${pad(date.getMonth() + 1)}.`;
};

const formatDisplayTime = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'planner' | 'catalog'>('planner');
  
  // Catalog State
  const [catalog, setCatalog] = useState<ProductionStep[]>(INITIAL_CATALOG);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [editingCatalogStep, setEditingCatalogStep] = useState<ProductionStep | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  
  // Catalog Form State
  const [catFormDays, setCatFormDays] = useState(0);
  const [catFormHours, setCatFormHours] = useState(0);
  const [catFormMinutes, setCatFormMinutes] = useState(0);

  // Planner State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSteps, setEditingSteps] = useState<ProductionStep[]>([]);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [plannerStartTime, setPlannerStartTime] = useState<Date>(new Date());
  const [isImplant, setIsImplant] = useState(false);
  const [isVerblendet, setIsVerblendet] = useState(false);
  const [isModellguss, setIsModellguss] = useState(false);
  const [totalProtheseOption, setTotalProtheseOption] = useState<'loeffel' | 'loeffel-biss' | 'anprobe' | 'umstellung' | 'um-fertigstellung' | 'fertigstellung'>('loeffel');
  const [telescopeOption, setTelescopeOption] = useState<'loeffel' | 'loeffel-biss' | 'primaerteile' | 'biss-stuetzstift' | 'gesamtanprobe' | 'umstellung' | 'um-fertigstellung' | 'fertigstellung'>('primaerteile');
  const [stegOption, setStegOption] = useState<'loeffel' | 'loeffel-biss' | 'biss-stuetzstift' | 'aesthetikanprobe' | 'steg-uebertrag' | 'steg-mg-uebertrag' | 'fertigstellung'>('loeffel');

  useEffect(() => {
    setIsEditing(false);
    setIsImplant(false);
    setIsModellguss(false);
    setStegOption('loeffel');
  }, [selectedProductId]);

  const selectedProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId), 
    [selectedProductId, products]
  );

  // --- Catalog Functions ---

  const filteredCatalog = useMemo(() => {
    return catalog.filter(step => 
      step.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      step.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      step.stepNumber.toString().includes(catalogSearch)
    ).sort((a, b) => a.stepNumber - b.stepNumber);
  }, [catalog, catalogSearch]);

  const openCatalogModal = (step?: ProductionStep) => {
    if (step) {
      setEditingCatalogStep(step);
      const { days, hours, minutes } = minutesToDHM(step.duration);
      setCatFormDays(days);
      setCatFormHours(hours);
      setCatFormMinutes(minutes);
    } else {
      const nextNumber = catalog.length > 0 ? Math.max(...catalog.map(s => s.stepNumber)) + 1 : 1;
      setEditingCatalogStep({
        id: `step-${Date.now()}`,
        stepNumber: nextNumber,
        name: '',
        duration: 0,
        description: '',
        category: 'manual'
      });
      setCatFormDays(0);
      setCatFormHours(0);
      setCatFormMinutes(0);
    }
    setIsCatalogModalOpen(true);
  };

  const saveCatalogStep = () => {
    if (!editingCatalogStep) return;
    const duration = dhmToMinutes(catFormDays, catFormHours, catFormMinutes);
    const updatedStep = { ...editingCatalogStep, duration };

    setCatalog(prev => {
      const exists = prev.find(s => s.id === updatedStep.id);
      if (exists) {
        return prev.map(s => s.id === updatedStep.id ? updatedStep : s);
      }
      return [...prev, updatedStep];
    });

    // Update steps in products if they use this step
    setProducts(prev => prev.map(p => ({
      ...p,
      steps: p.steps.map(s => s.id === updatedStep.id ? updatedStep : s)
    })));

    setIsCatalogModalOpen(false);
  };

  const moveCatalogStep = (id: string, direction: 'up' | 'down') => {
    const sorted = [...catalog].sort((a, b) => a.stepNumber - b.stepNumber);
    const index = sorted.findIndex(s => s.id === id);
    
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sorted.length - 1) return;

    const newCatalog = [...sorted];
    const stepA = { ...newCatalog[index] };
    const stepB = { ...newCatalog[direction === 'up' ? index - 1 : index + 1] };

    // Swap step numbers
    const tempNum = stepA.stepNumber;
    stepA.stepNumber = stepB.stepNumber;
    stepB.stepNumber = tempNum;

    newCatalog[index] = stepB;
    newCatalog[direction === 'up' ? index - 1 : index + 1] = stepA;

    setCatalog(newCatalog);

    // Update products
    setProducts(prev => prev.map(p => ({
      ...p,
      steps: p.steps.map(s => {
        if (s.id === stepA.id) return { ...s, stepNumber: stepA.stepNumber };
        if (s.id === stepB.id) return { ...s, stepNumber: stepB.stepNumber };
        return s;
      })
    })));
  };

  const deleteCatalogStep = (id: string) => {
    if (confirm('Möchten Sie diesen Abschnitt wirklich aus dem Katalog löschen?')) {
      const filtered = catalog.filter(s => s.id !== id);
      const newCatalog = filtered.map((s, index) => ({ ...s, stepNumber: index + 1 }));
      setCatalog(newCatalog);
      
      setProducts(prev => prev.map(p => ({
        ...p,
        steps: p.steps.map(s => {
          const updatedCatalogStep = newCatalog.find(c => c.id === s.id);
          if (updatedCatalogStep) {
            return { ...s, stepNumber: updatedCatalogStep.stepNumber };
          }
          return s;
        })
      })));
    }
  };

  // --- Planner Functions ---

  const handleEditClick = () => {
    if (selectedProduct) {
      setEditingSteps([...selectedProduct.steps]);
      setIsEditing(true);
    }
  };

  const handleSaveClick = () => {
    setProducts(prev => prev.map(p => 
      p.id === selectedProductId ? { ...p, steps: editingSteps } : p
    ));
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingSteps([]);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...editingSteps];
    if (direction === 'up' && index > 0) {
      [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    } else if (direction === 'down' && index < newSteps.length - 1) {
      [newSteps[index + 1], newSteps[index]] = [newSteps[index], newSteps[index + 1]];
    }
    setEditingSteps(newSteps);
  };

  const removeStepFromProduct = (index: number) => {
    setEditingSteps(prev => prev.filter((_, i) => i !== index));
  };

  const addStepToProduct = (step: ProductionStep) => {
    setEditingSteps(prev => [...prev, { ...step, id: `${step.id}-${Date.now()}` }]);
    setShowAddStepModal(false);
  };

  const scheduledSteps = useMemo(() => {
    if (!selectedProduct) return [];
    let stepsToSchedule = isEditing ? editingSteps : selectedProduct.steps;

    // Handle dynamic steps for Inlay/Teilkrone
    if (!isEditing && selectedProductId === 'inlay-keramik') {
      const targetProductId = isVerblendet ? 'krone-verblendet' : 'krone-standard';
      const targetProduct = products.find(p => p.id === targetProductId);
      if (targetProduct) {
        stepsToSchedule = targetProduct.steps;
      }
    }

    // Handle dynamic steps for Teleskopierende Prothese
    if (!isEditing && selectedProductId === 'prothese-teleskop') {
      let currentStartTime = new Date(plannerStartTime);
      
      if (telescopeOption === 'loeffel') {
        const modell = { id: 't-mod', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung für Teleskope' };
        const loeffel = { id: 't-loef', name: 'Individueller Löffel', duration: 2880, category: 'manual' as const, description: 'Herstellung des Löffels' };
        
        const mTimes = addWorkingTime(currentStartTime, modell.duration, modell.name);
        const scheduledModell = {
          ...modell,
          stepNumber: 1,
          startDate: mTimes.start,
          endDate: mTimes.end
        };
        const lTimes = addWorkingTime(scheduledModell.endDate, loeffel.duration, loeffel.name);
        const scheduledLoeffel = {
          ...loeffel,
          stepNumber: 2,
          startDate: lTimes.start,
          endDate: lTimes.end
        };
        return [scheduledModell, scheduledLoeffel];
        
      } else if (telescopeOption === 'loeffel-biss') {
        const modell = { id: 't-mod', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung für Teleskope' };
        const loeffel = { id: 't-loef', name: 'Individueller Löffel (Parallel)', duration: 2880, category: 'manual' as const, description: 'Herstellung des Löffels' };
        const biss = { id: 't-biss', name: 'Bissnahme (Parallel)', duration: 2880, category: 'manual' as const, description: 'Herstellung der Bissschablone' };
        
        const mTimes = addWorkingTime(currentStartTime, modell.duration, modell.name);
        const scheduledModell = {
          ...modell,
          stepNumber: 1,
          startDate: mTimes.start,
          endDate: mTimes.end
        };
        const lTimes = addWorkingTime(scheduledModell.endDate, loeffel.duration, loeffel.name);
        const bTimes = addWorkingTime(scheduledModell.endDate, biss.duration, biss.name);
        const scheduledLoeffel = {
          ...loeffel,
          stepNumber: 2,
          startDate: lTimes.start,
          endDate: lTimes.end
        };
        const scheduledBiss = {
          ...biss,
          stepNumber: 3,
          startDate: bTimes.start,
          endDate: bTimes.end
        };
        return [scheduledModell, scheduledLoeffel, scheduledBiss];
        
      } else if (telescopeOption === 'primaerteile') {
        const modell = { id: 't-mod-2', name: 'Modellherstellung (Teleskope)', duration: 2880, category: 'manual' as const, description: '2 Tage Modellherstellung für Teleskope' };
        const konstruktion = { id: 't-kon', name: 'Primärteil Konstruktion', duration: 1440, category: 'digital' as const, description: 'Konstruktion der Primärkronen (Teleskope)' };
        const nacharbeit = { id: 't-nach', name: 'Primärteil Nacharbeit & Passung', duration: 4320, category: 'manual' as const, description: '3 Tage Nacharbeit der Teleskope' };
        const loeffel = { id: 't-loef-p', name: 'Individueller Löffel (Parallel)', duration: 2880, category: 'manual' as const, description: 'Parallel hergestellter Löffel' };
        const biss = { id: 't-biss-p', name: 'Bissnahme (Parallel)', duration: 2880, category: 'manual' as const, description: 'Parallel hergestellte Bissschablone' };
        
        const mTimes = addWorkingTime(currentStartTime, modell.duration, modell.name);
        const scheduledModell = {
          ...modell,
          stepNumber: 1,
          startDate: mTimes.start,
          endDate: mTimes.end
        };
        const kTimes = addWorkingTime(scheduledModell.endDate, konstruktion.duration, konstruktion.name);
        const scheduledKonstruktion = {
          ...konstruktion,
          stepNumber: 2,
          startDate: kTimes.start,
          endDate: kTimes.end
        };
        const nTimes = addWorkingTime(scheduledKonstruktion.endDate, nacharbeit.duration, nacharbeit.name);
        const scheduledNacharbeit = {
          ...nacharbeit,
          stepNumber: 3,
          startDate: nTimes.start,
          endDate: nTimes.end
        };
        const lTimes = addWorkingTime(scheduledKonstruktion.endDate, loeffel.duration, loeffel.name);
        const scheduledLoeffel = {
          ...loeffel,
          stepNumber: 4,
          startDate: lTimes.start,
          endDate: lTimes.end
        };
        const bTimes = addWorkingTime(scheduledKonstruktion.endDate, biss.duration, biss.name);
        const scheduledBiss = {
          ...biss,
          stepNumber: 5,
          startDate: bTimes.start,
          endDate: bTimes.end
        };
        return [scheduledModell, scheduledKonstruktion, scheduledNacharbeit, scheduledLoeffel, scheduledBiss];
      } else if (telescopeOption === 'biss-stuetzstift') {
        const modell = { id: 't-mod-bs', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung (1 Tag)' };
        const bissStütz = { id: 't-bs', name: 'Biss / Stützstiftregistrat', duration: 2880, category: 'manual' as const, description: 'Biss- oder Stützstiftregistrat (2 Tage)' };

        const mTimes = addWorkingTime(currentStartTime, modell.duration, modell.name);
        const scheduledModell = {
          ...modell,
          stepNumber: 1,
          startDate: mTimes.start,
          endDate: mTimes.end
        };
        const bsTimes = addWorkingTime(scheduledModell.endDate, bissStütz.duration, bissStütz.name);
        const scheduledBissStütz = {
          ...bissStütz,
          stepNumber: 2,
          startDate: bsTimes.start,
          endDate: bsTimes.end
        };
        return [scheduledModell, scheduledBissStütz];
      } else if (telescopeOption === 'gesamtanprobe') {
        const modell = { id: 't-mod-ga', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung (1 Tag)' };
        const planning = { id: 't-plan-ga', name: 'ZE Planung', duration: 1440, category: 'digital' as const, description: 'ZE Planung (1 Tag)' };
        const fraesen = { id: 't-fraes-ga', name: 'Fräsen (8-10 Uhr)', duration: 120, category: 'digital' as const, description: 'Fräsen von 8 bis 10 Uhr' };
        const aufstellungVorweg = { id: 't-auf-ga', name: 'Vorwegaufstellung (10-17 Uhr)', duration: 420, category: 'manual' as const, description: 'Vorwegaufstellung von 10 bis 17 Uhr' };
        const sekKonstruktion = { id: 't-sek-ga', name: 'Sekundärkonstruktion', duration: 1440, category: 'digital' as const, description: 'Sekundärkonstruktion (1 Tag)' };
        const modGussKonstruktion = { id: 't-mgk-ga', name: 'Modellgußkonstruktion', duration: 1440, category: 'digital' as const, description: 'Modellgußkonstruktion (1 Tag)' };
        const modGussNacharbeit = { id: 't-mgn-ga', name: 'Modellgussnacharbeit', duration: 2880, category: 'manual' as const, description: 'Modellgussnacharbeit (2 Tage)' };
        const kompositverblendung = { id: 't-komp-ga', name: 'Kompositverblendung', duration: 1440, category: 'manual' as const, description: 'Kompositverblendung (1 Tag)' };
        const aufstellung = { id: 't-auf2-ga', name: 'Aufstellung', duration: 2880, category: 'manual' as const, description: 'Aufstellung (2 Tage)' };

        const mTimes = addWorkingTime(currentStartTime, modell.duration, modell.name);
        const scheduledModell = {
          ...modell,
          stepNumber: 1,
          startDate: mTimes.start,
          endDate: mTimes.end
        };
        const pTimes = addWorkingTime(scheduledModell.endDate, planning.duration, planning.name);
        const scheduledPlanning = {
          ...planning,
          stepNumber: 2,
          startDate: pTimes.start,
          endDate: pTimes.end
        };
        const fTimes = addWorkingTime(scheduledPlanning.endDate, fraesen.duration, fraesen.name);
        const scheduledFraesen = {
          ...fraesen,
          stepNumber: 3,
          startDate: fTimes.start,
          endDate: fTimes.end
        };
        const avTimes = addWorkingTime(scheduledFraesen.endDate, aufstellungVorweg.duration, aufstellungVorweg.name);
        const scheduledAufstellungVorweg = {
          ...aufstellungVorweg,
          stepNumber: 4,
          startDate: avTimes.start,
          endDate: avTimes.end
        };
        const sTimes = addWorkingTime(scheduledAufstellungVorweg.endDate, sekKonstruktion.duration, sekKonstruktion.name);
        const scheduledSekKonstruktion = {
          ...sekKonstruktion,
          stepNumber: 5,
          startDate: sTimes.start,
          endDate: sTimes.end
        };
        const mgkTimes = addWorkingTime(scheduledSekKonstruktion.endDate, modGussKonstruktion.duration, modGussKonstruktion.name);
        const scheduledModGussKonstruktion = {
          ...modGussKonstruktion,
          stepNumber: 6,
          startDate: mgkTimes.start,
          endDate: mgkTimes.end
        };
        const mgnTimes = addWorkingTime(scheduledModGussKonstruktion.endDate, modGussNacharbeit.duration, modGussNacharbeit.name);
        const scheduledModGussNacharbeit = {
          ...modGussNacharbeit,
          stepNumber: 7,
          startDate: mgnTimes.start,
          endDate: mgnTimes.end
        };
        const kvTimes = addWorkingTime(scheduledModGussNacharbeit.endDate, kompositverblendung.duration, kompositverblendung.name);
        const scheduledKompositverblendung = {
          ...kompositverblendung,
          stepNumber: 8,
          startDate: kvTimes.start,
          endDate: kvTimes.end
        };
        const aTimes = addWorkingTime(scheduledKompositverblendung.endDate, aufstellung.duration, aufstellung.name);
        const scheduledAufstellung = {
          ...aufstellung,
          stepNumber: 9,
          startDate: aTimes.start,
          endDate: aTimes.end
        };

        return [
          scheduledModell,
          scheduledPlanning,
          scheduledFraesen,
          scheduledAufstellungVorweg,
          scheduledSekKonstruktion,
          scheduledModGussKonstruktion,
          scheduledModGussNacharbeit,
          scheduledKompositverblendung,
          scheduledAufstellung
        ];
      } else if (telescopeOption === 'umstellung') {
        const artikulieren = { id: 't-art-um', name: 'Artikulieren', duration: 1440, category: 'manual' as const, description: 'Artikulieren (1 Tag)' };
        const planning = { id: 't-plan-um', name: 'ZE-Planung', duration: 1440, category: 'digital' as const, description: 'ZE-Planung (1 Tag)' };
        const umstellung = { id: 't-um-um', name: 'Umstellung', duration: 2880, category: 'manual' as const, description: 'Umstellung (2 Tage)' };

        const aTimes = addWorkingTime(currentStartTime, artikulieren.duration, artikulieren.name);
        const scheduledArtikulieren = {
          ...artikulieren,
          stepNumber: 1,
          startDate: aTimes.start,
          endDate: aTimes.end
        };
        const pTimes = addWorkingTime(scheduledArtikulieren.endDate, planning.duration, planning.name);
        const scheduledPlanning = {
          ...planning,
          stepNumber: 2,
          startDate: pTimes.start,
          endDate: pTimes.end
        };
        const uTimes = addWorkingTime(scheduledPlanning.endDate, umstellung.duration, umstellung.name);
        const scheduledUmstellung = {
          ...umstellung,
          stepNumber: 3,
          startDate: uTimes.start,
          endDate: uTimes.end
        };

        return [scheduledArtikulieren, scheduledPlanning, scheduledUmstellung];

      } else if (telescopeOption === 'um-fertigstellung') {
        const artikulieren = { id: 't-art-uf', name: 'Artikulieren', duration: 1440, category: 'manual' as const, description: 'Artikulieren (1 Tag)' };
        const planning = { id: 't-plan-uf', name: 'ZE-Planung', duration: 1440, category: 'digital' as const, description: 'ZE-Planung (1 Tag)' };
        const umstellung = { id: 't-um-uf', name: 'Umstellung', duration: 2880, category: 'manual' as const, description: 'Umstellung (2 Tage)' };
        const fertigstellung = { id: 't-fert-uf', name: 'Fertigstellung', duration: 2880, category: 'manual' as const, description: 'Fertigstellung (2 Tage)' };

        const aTimes = addWorkingTime(currentStartTime, artikulieren.duration, artikulieren.name);
        const scheduledArtikulieren = {
          ...artikulieren,
          stepNumber: 1,
          startDate: aTimes.start,
          endDate: aTimes.end
        };
        const pTimes = addWorkingTime(scheduledArtikulieren.endDate, planning.duration, planning.name);
        const scheduledPlanning = {
          ...planning,
          stepNumber: 2,
          startDate: pTimes.start,
          endDate: pTimes.end
        };
        const uTimes = addWorkingTime(scheduledPlanning.endDate, umstellung.duration, umstellung.name);
        const scheduledUmstellung = {
          ...umstellung,
          stepNumber: 3,
          startDate: uTimes.start,
          endDate: uTimes.end
        };
        const fTimes = addWorkingTime(scheduledUmstellung.endDate, fertigstellung.duration, fertigstellung.name);
        const scheduledFertigstellung = {
          ...fertigstellung,
          stepNumber: 4,
          startDate: fTimes.start,
          endDate: fTimes.end
        };

        return [scheduledArtikulieren, scheduledPlanning, scheduledUmstellung, scheduledFertigstellung];

      } else if (telescopeOption === 'fertigstellung') {
        const planning = { id: 't-plan-f', name: 'ZE-Planung', duration: 1440, category: 'digital' as const, description: 'ZE-Planung (1 Tag)' };
        const fertigstellung = { id: 't-fert-f', name: 'Fertigstellung', duration: 2880, category: 'manual' as const, description: 'Fertigstellung (2 Tage)' };
        const endkontrolle = { id: 't-end-f', name: 'Endkontrolle', duration: 1440, category: 'manual' as const, description: 'Endkontrolle (1 Tag)' };

        const pTimes = addWorkingTime(currentStartTime, planning.duration, planning.name);
        const scheduledPlanning = {
          ...planning,
          stepNumber: 1,
          startDate: pTimes.start,
          endDate: pTimes.end
        };
        const fTimes = addWorkingTime(scheduledPlanning.endDate, fertigstellung.duration, fertigstellung.name);
        const scheduledFertigstellung = {
          ...fertigstellung,
          stepNumber: 2,
          startDate: fTimes.start,
          endDate: fTimes.end
        };
        const eTimes = addWorkingTime(scheduledFertigstellung.endDate, endkontrolle.duration, endkontrolle.name);
        const scheduledEndkontrolle = {
          ...endkontrolle,
          stepNumber: 3,
          startDate: eTimes.start,
          endDate: eTimes.end
        };

        return [scheduledPlanning, scheduledFertigstellung, scheduledEndkontrolle];
      }
    }

    // Handle dynamic steps for Totalprothese
    if (!isEditing && selectedProductId === 'prothese-total') {
      if (isModellguss && totalProtheseOption === 'anprobe') {
        const modell = { id: 'pt-mod-mg', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung (1 Tag)' };
        const planning = { id: 'pt-plan-mg', name: 'ZE-Planung', duration: 1440, category: 'digital' as const, description: 'ZE-Planung (1 Tag)' };
        const mgKonstruktion = { id: 'pt-mgk-mg', name: 'Modellguss Konstruktion', duration: 1440, category: 'digital' as const, description: 'Modellguss Konstruktion (1 Tag)' };
        const mgNacharbeit = { id: 'pt-mgn-mg', name: 'Modellguss Nacharbeit', duration: 4320, category: 'manual' as const, description: 'Modellguss Nacharbeit (3 Tage)' };
        const aufstellung = { id: 'pt-auf-mg', name: 'Aufstellung', duration: 2880, category: 'manual' as const, description: 'Aufstellung (2 Tage)' };

        let currentStartTime = new Date(plannerStartTime);

        const mTimes = addWorkingTime(currentStartTime, modell.duration, modell.name);
        const scheduledModell = {
          ...modell,
          stepNumber: 1,
          startDate: mTimes.start,
          endDate: mTimes.end
        };
        const pTimes = addWorkingTime(scheduledModell.endDate, planning.duration, planning.name);
        const scheduledPlanning = {
          ...planning,
          stepNumber: 2,
          startDate: pTimes.start,
          endDate: pTimes.end
        };
        const mgkTimes = addWorkingTime(scheduledPlanning.endDate, mgKonstruktion.duration, mgKonstruktion.name);
        const scheduledMgKonstruktion = {
          ...mgKonstruktion,
          stepNumber: 3,
          startDate: mgkTimes.start,
          endDate: mgkTimes.end
        };
        const mgnTimes = addWorkingTime(scheduledMgKonstruktion.endDate, mgNacharbeit.duration, mgNacharbeit.name);
        const scheduledMgNacharbeit = {
          ...mgNacharbeit,
          stepNumber: 4,
          startDate: mgnTimes.start,
          endDate: mgnTimes.end
        };
        const aTimes = addWorkingTime(scheduledMgNacharbeit.endDate, aufstellung.duration, aufstellung.name);
        const scheduledAufstellung = {
          ...aufstellung,
          stepNumber: 5,
          startDate: aTimes.start,
          endDate: aTimes.end
        };

        return [
          scheduledModell,
          scheduledPlanning,
          scheduledMgKonstruktion,
          scheduledMgNacharbeit,
          scheduledAufstellung
        ];
      } else if (totalProtheseOption === 'loeffel') {
        stepsToSchedule = [
          catalog.find(s => s.id === 's6')!,
          catalog.find(s => s.id === 'p8')!
        ].filter(Boolean);
      } else if (totalProtheseOption === 'loeffel-biss') {
        stepsToSchedule = [
          catalog.find(s => s.id === 's6')!,
          catalog.find(s => s.id === 'p8')!,
          catalog.find(s => s.id === 'p9')!
        ].filter(Boolean);
      } else if (totalProtheseOption === 'anprobe') {
        stepsToSchedule = [
          catalog.find(s => s.id === 's6')!,
          catalog.find(s => s.id === 's7')!,
          catalog.find(s => s.id === 'c1')!
        ].filter(Boolean);
      } else if (totalProtheseOption === 'umstellung') {
        stepsToSchedule = [
          catalog.find(s => s.id === 'p10')!,
          catalog.find(s => s.id === 'p11')!,
          catalog.find(s => s.id === 'p12')!
        ].filter(Boolean);
      } else if (totalProtheseOption === 'um-fertigstellung') {
        stepsToSchedule = [
          catalog.find(s => s.id === 'p10')!,
          catalog.find(s => s.id === 'p11')!,
          catalog.find(s => s.id === 'p12')!,
          catalog.find(s => s.id === 'c2')!,
          catalog.find(s => s.id === 'k8')!
        ].filter(Boolean);
      } else if (totalProtheseOption === 'fertigstellung') {
        stepsToSchedule = [
          catalog.find(s => s.id === 'p11')!,
          catalog.find(s => s.id === 'c2')!,
          catalog.find(s => s.id === 'k8')!
        ].filter(Boolean);
      }
    }

    // Handle dynamic steps for Stegprothese
    if (!isEditing && selectedProductId === 'steg-prothese') {
      let currentStartTime = new Date(plannerStartTime);

      if (stegOption === 'loeffel') {
        const modell = { id: 'st-mod', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung (1 Tag)' };
        const loeffel = { id: 'st-loef', name: 'Individueller Löffel', duration: 1440, category: 'manual' as const, description: 'Löffelherstellung (1 Tag)' };

        const mTimes = addWorkingTime(currentStartTime, modell.duration, modell.name);
        const scheduledModell = { ...modell, stepNumber: 1, startDate: mTimes.start, endDate: mTimes.end };
        const lTimes = addWorkingTime(scheduledModell.endDate, loeffel.duration, loeffel.name);
        const scheduledLoeffel = { ...loeffel, stepNumber: 2, startDate: lTimes.start, endDate: lTimes.end };

        return [scheduledModell, scheduledLoeffel];

      } else if (stegOption === 'loeffel-biss') {
        const modell = { id: 'st-mod', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung (1 Tag)' };
        const loeffel = { id: 'st-loef', name: 'Individueller Löffel', duration: 1440, category: 'manual' as const, description: 'Löffelherstellung (1 Tag)' };
        const biss = { id: 'st-biss', name: 'Bissschablone', duration: 1440, category: 'manual' as const, description: 'Herstellung Bissschablone (1 Tag)' };

        const mTimes = addWorkingTime(currentStartTime, modell.duration, modell.name);
        const scheduledModell = { ...modell, stepNumber: 1, startDate: mTimes.start, endDate: mTimes.end };
        const lTimes = addWorkingTime(scheduledModell.endDate, loeffel.duration, loeffel.name);
        const scheduledLoeffel = { ...loeffel, stepNumber: 2, startDate: lTimes.start, endDate: lTimes.end };
        const bTimes = addWorkingTime(scheduledLoeffel.endDate, biss.duration, biss.name);
        const scheduledBiss = { ...biss, stepNumber: 3, startDate: bTimes.start, endDate: bTimes.end };

        return [scheduledModell, scheduledLoeffel, scheduledBiss];

      } else if (stegOption === 'biss-stuetzstift') {
        const modell = { id: 'st-mod', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung (1 Tag)' };
        const biss = { id: 'st-biss', name: 'Bissregistrat / Stützstift', duration: 2880, category: 'manual' as const, description: 'Herstellung Bissregistrat oder Stützstiftregistrat (2 Tage)' };

        const mTimes = addWorkingTime(currentStartTime, modell.duration, modell.name);
        const scheduledModell = { ...modell, stepNumber: 1, startDate: mTimes.start, endDate: mTimes.end };
        const bTimes = addWorkingTime(scheduledModell.endDate, biss.duration, biss.name);
        const scheduledBiss = { ...biss, stepNumber: 2, startDate: bTimes.start, endDate: bTimes.end };

        return [scheduledModell, scheduledBiss];

      } else if (stegOption === 'aesthetikanprobe') {
        const modell = { id: 'st-mod', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung (1 Tag)' };
        const planung = { id: 'st-plan', name: 'ZE-Planung', duration: 1440, category: 'digital' as const, description: 'Zahnersatzplanung (1 Tag)' };
        const anprobe = { id: 'st-anp', name: 'Ästhetikanprobe', duration: 2880, category: 'manual' as const, description: 'Ästhetikaufstellung in Wachs (2 Tage)' };

        const mTimes = addWorkingTime(currentStartTime, modell.duration, modell.name);
        const scheduledModell = { ...modell, stepNumber: 1, startDate: mTimes.start, endDate: mTimes.end };
        const pTimes = addWorkingTime(scheduledModell.endDate, planung.duration, planung.name);
        const scheduledPlanung = { ...planung, stepNumber: 2, startDate: pTimes.start, endDate: pTimes.end };
        const aTimes = addWorkingTime(scheduledPlanung.endDate, anprobe.duration, anprobe.name);
        const scheduledAnprobe = { ...anprobe, stepNumber: 3, startDate: aTimes.start, endDate: aTimes.end };

        return [scheduledModell, scheduledPlanung, scheduledAnprobe];

      } else if (stegOption === 'steg-uebertrag') {
        const artikulieren = { id: 'st-art', name: 'Artikulieren', duration: 1440, category: 'manual' as const, description: 'Artikulieren (1 Tag)' };
        const zePlanung = { id: 'st-ze-plan', name: 'zE-Planung', duration: 1440, category: 'digital' as const, description: 'zE-Planung (1 Tag)' };
        const umstellung = { id: 'st-umst', name: 'Eventuelle Umstellung', duration: 1440, category: 'manual' as const, description: 'Eventuelle Umstellung (1 Tag)' };
        const fremdf = { id: 'st-fremd', name: 'Steg Fremdfertigung', duration: 10080, category: 'manual' as const, description: 'Steg Fremdfertigung (7 Tage)' };
        const uebertrag = { id: 'st-auf-ueb', name: 'auf und übertrag', duration: 2880, category: 'manual' as const, description: 'auf und übertrag (2 Tage)' };

        const aTimes = addWorkingTime(currentStartTime, artikulieren.duration, artikulieren.name);
        const scheduledArtikulieren = { ...artikulieren, stepNumber: 1, startDate: aTimes.start, endDate: aTimes.end };
        const zTimes = addWorkingTime(scheduledArtikulieren.endDate, zePlanung.duration, zePlanung.name);
        const scheduledZePlanung = { ...zePlanung, stepNumber: 2, startDate: zTimes.start, endDate: zTimes.end };
        const uTimes = addWorkingTime(scheduledZePlanung.endDate, umstellung.duration, umstellung.name);
        const scheduledUmstellung = { ...umstellung, stepNumber: 3, startDate: uTimes.start, endDate: uTimes.end };
        const fTimes = addWorkingTime(scheduledUmstellung.endDate, fremdf.duration, fremdf.name);
        const scheduledFremdf = { ...fremdf, stepNumber: 4, startDate: fTimes.start, endDate: fTimes.end };
        const u2Times = addWorkingTime(scheduledFremdf.endDate, uebertrag.duration, uebertrag.name);
        const scheduledUebertrag = { ...uebertrag, stepNumber: 5, startDate: u2Times.start, endDate: u2Times.end };

        return [scheduledArtikulieren, scheduledZePlanung, scheduledUmstellung, scheduledFremdf, scheduledUebertrag];

      } else if (stegOption === 'steg-mg-uebertrag') {
        const artikulieren = { id: 'st-mg-art', name: 'Artikulieren', duration: 1440, category: 'manual' as const, description: 'Artikulieren (1 Tag)' };
        const zePlanung = { id: 'st-mg-ze-plan', name: 'zE-Planung', duration: 1440, category: 'digital' as const, description: 'zE-Planung (1 Tag)' };
        const umstellung = { id: 'st-mg-umst', name: 'Eventuelle Umstellung', duration: 1440, category: 'manual' as const, description: 'Eventuelle Umstellung (1 Tag)' };
        const fremdf = { id: 'st-mg-fremd', name: 'Steg Fremdfertigung', duration: 10080, category: 'manual' as const, description: 'Steg Fremdfertigung (7 Tage)' };
        const modellguss = { id: 'st-mg-mg', name: 'Modellguss', duration: 2880, category: 'manual' as const, description: 'Modellguss (2 Tage)' };
        const uebertrag = { id: 'st-mg-auf-ueb', name: 'auf und übertrag', duration: 2880, category: 'manual' as const, description: 'auf und übertrag (2 Tage)' };

        const aTimes = addWorkingTime(currentStartTime, artikulieren.duration, artikulieren.name);
        const scheduledArtikulieren = { ...artikulieren, stepNumber: 1, startDate: aTimes.start, endDate: aTimes.end };
        const zTimes = addWorkingTime(scheduledArtikulieren.endDate, zePlanung.duration, zePlanung.name);
        const scheduledZePlanung = { ...zePlanung, stepNumber: 2, startDate: zTimes.start, endDate: zTimes.end };
        const uTimes = addWorkingTime(scheduledZePlanung.endDate, umstellung.duration, umstellung.name);
        const scheduledUmstellung = { ...umstellung, stepNumber: 3, startDate: uTimes.start, endDate: uTimes.end };
        const fTimes = addWorkingTime(scheduledUmstellung.endDate, fremdf.duration, fremdf.name);
        const scheduledFremdf = { ...fremdf, stepNumber: 4, startDate: fTimes.start, endDate: fTimes.end };
        const mTimes = addWorkingTime(scheduledFremdf.endDate, modellguss.duration, modellguss.name);
        const scheduledModellguss = { ...modellguss, stepNumber: 5, startDate: mTimes.start, endDate: mTimes.end };
        const u2Times = addWorkingTime(scheduledModellguss.endDate, uebertrag.duration, uebertrag.name);
        const scheduledUebertrag = { ...uebertrag, stepNumber: 6, startDate: u2Times.start, endDate: u2Times.end };

        return [scheduledArtikulieren, scheduledZePlanung, scheduledUmstellung, scheduledFremdf, scheduledModellguss, scheduledUebertrag];

      } else if (stegOption === 'fertigstellung') {
        const artikulieren = { id: 'st-f-art', name: 'Artikulieren', duration: 1440, category: 'manual' as const, description: 'Artikulieren (1 Tag)' };
        const zePlanung = { id: 'st-f-ze-plan', name: 'zE-Planung', duration: 1440, category: 'digital' as const, description: 'zE-Planung (1 Tag)' };
        const umstellung = { id: 'st-f-umst', name: 'Eventuelle Umstellung', duration: 1440, category: 'manual' as const, description: 'Eventuelle Umstellung (1 Tag)' };
        const fertigstellung = { id: 'st-f-fert', name: 'Fertigstellung', duration: 2880, category: 'manual' as const, description: 'Fertigstellung (2 Tage)' };
        const endkontrolle = { id: 'st-f-kontr', name: 'Endkontrolle', duration: 120, category: 'manual' as const, description: 'Endkontrolle' };

        const aTimes = addWorkingTime(currentStartTime, artikulieren.duration, artikulieren.name);
        const scheduledArtikulieren = { ...artikulieren, stepNumber: 1, startDate: aTimes.start, endDate: aTimes.end };
        const zTimes = addWorkingTime(scheduledArtikulieren.endDate, zePlanung.duration, zePlanung.name);
        const scheduledZePlanung = { ...zePlanung, stepNumber: 2, startDate: zTimes.start, endDate: zTimes.end };
        const uTimes = addWorkingTime(scheduledZePlanung.endDate, umstellung.duration, umstellung.name);
        const scheduledUmstellung = { ...umstellung, stepNumber: 3, startDate: uTimes.start, endDate: uTimes.end };
        const fTimes = addWorkingTime(scheduledUmstellung.endDate, fertigstellung.duration, fertigstellung.name);
        const scheduledFertigstellung = { ...fertigstellung, stepNumber: 4, startDate: fTimes.start, endDate: fTimes.end };

        // Endkontrolle on final day of fertigstellung from 15:00 to 17:00
        const lastDay = new Date(scheduledFertigstellung.endDate);
        const kStart = new Date(lastDay);
        kStart.setHours(15, 0, 0, 0);
        const kEnd = new Date(lastDay);
        kEnd.setHours(17, 0, 0, 0);
        const scheduledEndkontrolle = { ...endkontrolle, stepNumber: 5, startDate: kStart, endDate: kEnd };

        return [scheduledArtikulieren, scheduledZePlanung, scheduledUmstellung, scheduledFertigstellung, scheduledEndkontrolle];
      }
    }

    // Inject implant steps if applicable
    if (isImplant && (selectedProductId === 'krone-standard' || selectedProductId === 'krone-verblendet')) {
      const modelStepIndex = stepsToSchedule.findIndex(s => s.name === 'Modelle');
      if (modelStepIndex !== -1) {
        const abutmentStep = catalog.find(s => s.id === 'k6');
        const abutmentFinishStep = catalog.find(s => s.id === 'k7');
        
        if (abutmentStep && abutmentFinishStep) {
          const newSteps = [...stepsToSchedule];
          newSteps.splice(modelStepIndex + 1, 0, abutmentStep, abutmentFinishStep);
          stepsToSchedule = newSteps;
        }
      }
    }

    let currentStartTime = new Date(plannerStartTime);

    return stepsToSchedule.map(step => {
      const { start, end } = addWorkingTime(currentStartTime, step.duration, step.name);
      currentStartTime = new Date(end);

      return {
        ...step,
        startDate: start,
        endDate: end
      };
    });
  }, [selectedProduct, isEditing, editingSteps, plannerStartTime, isImplant, isVerblendet, isModellguss, totalProtheseOption, telescopeOption, stegOption, catalog, selectedProductId, products]);

  const totalDuration = useMemo(() => {
    if (!selectedProduct) return 0;
    let steps = isEditing ? editingSteps : selectedProduct.steps;

    // Handle dynamic steps for Inlay/Teilkrone
    if (!isEditing && selectedProductId === 'inlay-keramik') {
      const targetProductId = isVerblendet ? 'krone-verblendet' : 'krone-standard';
      const targetProduct = products.find(p => p.id === targetProductId);
      if (targetProduct) {
        steps = targetProduct.steps;
      }
    }

    // Handle dynamic steps for Teleskopierende Prothese
    if (!isEditing && selectedProductId === 'prothese-teleskop') {
      if (telescopeOption === 'loeffel' || telescopeOption === 'loeffel-biss') {
        return 4320; // 3 days
      } else if (telescopeOption === 'primaerteile') {
        return 8640; // 6 days
      } else if (telescopeOption === 'biss-stuetzstift') {
        return 4320; // 3 days (deliver on 4th day / am 4. Tag in Praxis)
      } else if (telescopeOption === 'gesamtanprobe') {
        return 14400; // 10 days
      } else if (telescopeOption === 'umstellung') {
        return 5760; // 4 days (deliver on 5th day / am 5ten tag in Praxis)
      } else if (telescopeOption === 'um-fertigstellung') {
        return 8640; // 6 days (deliver on 7th day / am 7ten tag in Praxis)
      } else if (telescopeOption === 'fertigstellung') {
        return 5760; // 4 days (deliver on 5th/6th day / am 6ten Tag zurück in Praxis)
      }
    }

    // Handle dynamic steps for Totalprothese
    if (!isEditing && selectedProductId === 'prothese-total') {
      if (isModellguss && totalProtheseOption === 'anprobe') {
        steps = [
          { id: 'pt-mod-mg', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung (1 Tag)' },
          { id: 'pt-plan-mg', name: 'ZE-Planung', duration: 1440, category: 'digital' as const, description: 'ZE-Planung (1 Tag)' },
          { id: 'pt-mgk-mg', name: 'Modellguss Konstruktion', duration: 1440, category: 'digital' as const, description: 'Modellguss Konstruktion (1 Tag)' },
          { id: 'pt-mgn-mg', name: 'Modellguss Nacharbeit', duration: 4320, category: 'manual' as const, description: 'Modellguss Nacharbeit (3 Tage)' },
          { id: 'pt-auf-mg', name: 'Aufstellung', duration: 2880, category: 'manual' as const, description: 'Aufstellung (2 Tage)' }
        ];
      } else if (totalProtheseOption === 'loeffel') {
        steps = [
          catalog.find(s => s.id === 's6')!,
          catalog.find(s => s.id === 'p8')!
        ].filter(Boolean);
      } else if (totalProtheseOption === 'loeffel-biss') {
        steps = [
          catalog.find(s => s.id === 's6')!,
          catalog.find(s => s.id === 'p8')!,
          catalog.find(s => s.id === 'p9')!
        ].filter(Boolean);
      } else if (totalProtheseOption === 'anprobe') {
        steps = [
          catalog.find(s => s.id === 's6')!,
          catalog.find(s => s.id === 's7')!,
          catalog.find(s => s.id === 'c1')!
        ].filter(Boolean);
      } else if (totalProtheseOption === 'umstellung') {
        steps = [
          catalog.find(s => s.id === 'p10')!,
          catalog.find(s => s.id === 'p11')!,
          catalog.find(s => s.id === 'p12')!
        ].filter(Boolean);
      } else if (totalProtheseOption === 'um-fertigstellung') {
        steps = [
          catalog.find(s => s.id === 'p10')!,
          catalog.find(s => s.id === 'p11')!,
          catalog.find(s => s.id === 'p12')!,
          catalog.find(s => s.id === 'c2')!,
          catalog.find(s => s.id === 'k8')!
        ].filter(Boolean);
      } else if (totalProtheseOption === 'fertigstellung') {
        steps = [
          catalog.find(s => s.id === 'p11')!,
          catalog.find(s => s.id === 'c2')!,
          catalog.find(s => s.id === 'k8')!
        ].filter(Boolean);
      }
    }

    // Handle dynamic steps for Stegprothese
    if (!isEditing && selectedProductId === 'steg-prothese') {
      if (stegOption === 'loeffel') {
        steps = [
          { id: 'st-mod', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung' },
          { id: 'st-loef', name: 'Individueller Löffel', duration: 1440, category: 'manual' as const, description: 'Löffelherstellung' }
        ];
      } else if (stegOption === 'loeffel-biss') {
        steps = [
          { id: 'st-mod', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung' },
          { id: 'st-loef', name: 'Individueller Löffel', duration: 1440, category: 'manual' as const, description: 'Löffelherstellung' },
          { id: 'st-biss', name: 'Bissschablone', duration: 1440, category: 'manual' as const, description: 'Herstellung Bissschablone' }
        ];
      } else if (stegOption === 'biss-stuetzstift') {
        steps = [
          { id: 'st-mod', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung' },
          { id: 'st-biss', name: 'Bissregistrat / Stützstift', duration: 2880, category: 'manual' as const, description: 'Herstellung Bissregistrat oder Stützstiftregistrat' }
        ];
      } else if (stegOption === 'aesthetikanprobe') {
        steps = [
          { id: 'st-mod', name: 'Modellherstellung', duration: 1440, category: 'manual' as const, description: 'Modellherstellung' },
          { id: 'st-plan', name: 'ZE-Planung', duration: 1440, category: 'digital' as const, description: 'Zahnersatzplanung' },
          { id: 'st-anp', name: 'Ästhetikanprobe', duration: 2880, category: 'manual' as const, description: 'Ästhetikaufstellung in Wachs' }
        ];
      } else if (stegOption === 'steg-uebertrag') {
        steps = [
          { id: 'st-art', name: 'Artikulieren', duration: 1440, category: 'manual' as const, description: 'Artikulieren' },
          { id: 'st-ze-plan', name: 'zE-Planung', duration: 1440, category: 'digital' as const, description: 'zE-Planung' },
          { id: 'st-umst', name: 'Eventuelle Umstellung', duration: 1440, category: 'manual' as const, description: 'Eventuelle Umstellung' },
          { id: 'st-fremd', name: 'Steg Fremdfertigung', duration: 10080, category: 'manual' as const, description: 'Steg Fremdfertigung' },
          { id: 'st-auf-ueb', name: 'auf und übertrag', duration: 2880, category: 'manual' as const, description: 'auf und übertrag' }
        ];
      } else if (stegOption === 'steg-mg-uebertrag') {
        steps = [
          { id: 'st-mg-art', name: 'Artikulieren', duration: 1440, category: 'manual' as const, description: 'Artikulieren' },
          { id: 'st-mg-ze-plan', name: 'zE-Planung', duration: 1440, category: 'digital' as const, description: 'zE-Planung' },
          { id: 'st-mg-umst', name: 'Eventuelle Umstellung', duration: 1440, category: 'manual' as const, description: 'Eventuelle Umstellung' },
          { id: 'st-mg-fremd', name: 'Steg Fremdfertigung', duration: 10080, category: 'manual' as const, description: 'Steg Fremdfertigung' },
          { id: 'st-mg-mg', name: 'Modellguss', duration: 2880, category: 'manual' as const, description: 'Modellguss' },
          { id: 'st-mg-auf-ueb', name: 'auf und übertrag', duration: 2880, category: 'manual' as const, description: 'auf und übertrag' }
        ];
      } else if (stegOption === 'fertigstellung') {
        steps = [
          { id: 'st-f-art', name: 'Artikulieren', duration: 1440, category: 'manual' as const, description: 'Artikulieren' },
          { id: 'st-f-ze-plan', name: 'zE-Planung', duration: 1440, category: 'digital' as const, description: 'zE-Planung' },
          { id: 'st-f-umst', name: 'Eventuelle Umstellung', duration: 1440, category: 'manual' as const, description: 'Eventuelle Umstellung' },
          { id: 'st-f-fert', name: 'Fertigstellung', duration: 2880, category: 'manual' as const, description: 'Fertigstellung' },
          { id: 'st-f-kontr', name: 'Endkontrolle', duration: 120, category: 'manual' as const, description: 'Endkontrolle' }
        ];
      }
    }
    
    // Account for implant steps in duration
    if (isImplant && (selectedProductId === 'krone-standard' || selectedProductId === 'krone-verblendet')) {
      const abutmentStep = catalog.find(s => s.id === 'k6');
      const abutmentFinishStep = catalog.find(s => s.id === 'k7');
      if (abutmentStep && abutmentFinishStep) {
        return steps.reduce((acc, step) => acc + step.duration, 0) + abutmentStep.duration + abutmentFinishStep.duration;
      }
    }
    
    return steps.reduce((acc, step) => acc + step.duration, 0);
  }, [selectedProduct, isEditing, editingSteps, isImplant, isVerblendet, isModellguss, totalProtheseOption, telescopeOption, stegOption, catalog, selectedProductId, products]);

  const deliveryDate = useMemo(() => {
    if (scheduledSteps.length === 0) return null;
    let maxEndDate = scheduledSteps[0].endDate;
    for (const step of scheduledSteps) {
      if (step.endDate.getTime() > maxEndDate.getTime()) {
        maxEndDate = step.endDate;
      }
    }
    return advanceToNextWorkingDay(maxEndDate);
  }, [scheduledSteps]);

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return '0 Min.';
    const { days, hours, minutes: mins } = minutesToDHM(minutes);
    const parts = [];
    if (days > 0) parts.push(`${days}T`);
    if (hours > 0) parts.push(`${hours}Std`);
    if (mins > 0) parts.push(`${mins}Min`);
    return parts.join(' ');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <Settings2 size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden md:block">
            Zahntechnik <span className="text-blue-600">Planer</span>
          </h1>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'planner' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Activity size={16} />
            Produktionsplaner
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'catalog' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Database size={16} />
            Stammdaten (Katalog)
          </button>
        </div>
      </nav>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* ==========================================
              TAB: PLANNER
             ========================================== */}
          {activeTab === 'planner' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar: Product Selection */}
              <aside className="lg:col-span-4 space-y-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
                  Produktauswahl
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={`
                        group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left
                        ${selectedProductId === product.id 
                          ? 'bg-white shadow-lg shadow-blue-100 ring-1 ring-blue-100' 
                          : 'bg-white/50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100'}
                      `}
                    >
                      <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                        {product.icon}
                      </span>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${selectedProductId === product.id ? 'text-blue-600' : 'text-slate-700'}`}>
                          {product.name}
                        </h3>
                      </div>
                      <ChevronRight 
                        size={18} 
                        className={`transition-transform duration-300 ${selectedProductId === product.id ? 'rotate-90 text-blue-600' : 'text-slate-300'}`} 
                      />
                      {selectedProductId === product.id && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </aside>

              {/* Main Content: Steps Display */}
              <main className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {selectedProduct ? (
                    <motion.div
                      key={selectedProduct.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Global Settings Badge */}
                      <div className="flex flex-col gap-3 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
                            <Clock size={16} className="text-blue-500" />
                            <span>Arbeitszeiten: <strong>Mo-Do 08:00-17:00, Fr 08:00-14:00</strong></span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
                            <Calendar size={16} className="text-blue-500" />
                            <label className="font-medium">Auftragsstart:</label>
                            <input 
                              type="datetime-local" 
                              value={formatDateForInput(plannerStartTime)}
                              onChange={(e) => {
                                const newDate = new Date(e.target.value);
                                if (!isNaN(newDate.getTime())) setPlannerStartTime(newDate);
                              }}
                              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {deliveryDate && (
                            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm w-fit">
                              <Truck size={16} className="text-emerald-500" />
                              <label className="font-medium">Lieferung möglich ab:</label>
                              <span className="font-bold">{formatDisplayDate(deliveryDate)} {formatDisplayTime(deliveryDate)} Uhr</span>
                            </div>
                          )}
                        </div>

                        {(selectedProductId === 'krone-standard' || selectedProductId === 'krone-verblendet') && (
                          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm w-fit">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                              <Info size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">Wird ein Implantat genutzt?</span>
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => setIsImplant(true)}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    isImplant 
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Ja
                                </button>
                                <button
                                  onClick={() => setIsImplant(false)}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    !isImplant 
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Nein
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedProductId === 'inlay-keramik' && (
                          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm w-fit">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                              <Info size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">Wird es verblendet?</span>
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => setIsVerblendet(true)}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    isVerblendet 
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Ja
                                </button>
                                <button
                                  onClick={() => setIsVerblendet(false)}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    !isVerblendet 
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Nein
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedProductId === 'prothese-total' && (
                          <>
                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm w-fit">
                              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Info size={20} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-700">Mit Modellguss?</span>
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => setIsModellguss(true)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                      isModellguss 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                                  >
                                    Ja
                                  </button>
                                  <button
                                    onClick={() => setIsModellguss(false)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                      !isModellguss 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                                  >
                                    Nein
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm w-fit">
                              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Info size={20} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-700">Was wird zum ersten Termin hergestellt?</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <button
                                    onClick={() => setTotalProtheseOption('loeffel')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                      totalProtheseOption === 'loeffel'
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                                  >
                                    Löffel
                                  </button>
                                <button
                                  onClick={() => setTotalProtheseOption('loeffel-biss')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    totalProtheseOption === 'loeffel-biss'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Löffel mit Biss
                                </button>
                                <button
                                  onClick={() => setTotalProtheseOption('anprobe')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    totalProtheseOption === 'anprobe'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Gesamtanprobe
                                </button>
                                <button
                                  onClick={() => setTotalProtheseOption('umstellung')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    totalProtheseOption === 'umstellung'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Umstellung
                                </button>
                                <button
                                  onClick={() => setTotalProtheseOption('um-fertigstellung')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    totalProtheseOption === 'um-fertigstellung'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Um+Fertigstellung
                                </button>
                                <button
                                  onClick={() => setTotalProtheseOption('fertigstellung')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    totalProtheseOption === 'fertigstellung'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Fertigstellung
                                </button>
                              </div>
                            </div>
                          </div>
                          </>
                        )}

                        {selectedProductId === 'prothese-teleskop' && (
                          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm w-full md:w-fit">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 block shrink-0">
                              <Info size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">Option wählen:</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <button
                                  onClick={() => setTelescopeOption('loeffel')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    telescopeOption === 'loeffel'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Zuerst Löffel
                                </button>
                                <button
                                  onClick={() => setTelescopeOption('loeffel-biss')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    telescopeOption === 'loeffel-biss'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Löffel und Biss
                                </button>
                                <button
                                  onClick={() => setTelescopeOption('primaerteile')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    telescopeOption === 'primaerteile'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Primärteile für Überabformung
                                </button>
                                <button
                                  onClick={() => setTelescopeOption('biss-stuetzstift')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    telescopeOption === 'biss-stuetzstift'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Biss / Stützstiftregistrat
                                </button>
                                <button
                                  onClick={() => setTelescopeOption('gesamtanprobe')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    telescopeOption === 'gesamtanprobe'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Gesamtanprobe
                                </button>
                                <button
                                  onClick={() => setTelescopeOption('umstellung')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    telescopeOption === 'umstellung'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Umstellung
                                </button>
                                <button
                                  onClick={() => setTelescopeOption('um-fertigstellung')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    telescopeOption === 'um-fertigstellung'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Um+Fertigstellung
                                </button>
                                <button
                                  onClick={() => setTelescopeOption('fertigstellung')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    telescopeOption === 'fertigstellung'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Fertigstellung
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedProductId === 'steg-prothese' && (
                          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm w-full md:w-fit">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 block shrink-0">
                              <Info size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">Option wählen:</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <button
                                  onClick={() => setStegOption('loeffel')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    stegOption === 'loeffel'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Löffel
                                </button>
                                <button
                                  onClick={() => setStegOption('loeffel-biss')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    stegOption === 'loeffel-biss'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Löffel mit Biss
                                </button>
                                <button
                                  onClick={() => setStegOption('biss-stuetzstift')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    stegOption === 'biss-stuetzstift'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Biss oder Stützstift
                                </button>
                                <button
                                  onClick={() => setStegOption('aesthetikanprobe')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    stegOption === 'aesthetikanprobe'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Ästhetikanprobe
                                </button>
                                <button
                                  onClick={() => setStegOption('steg-uebertrag')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    stegOption === 'steg-uebertrag'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Steg mit Übertrag
                                </button>
                                <button
                                  onClick={() => setStegOption('steg-mg-uebertrag')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    stegOption === 'steg-mg-uebertrag'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Steg mit MG und Übertrag
                                </button>
                                <button
                                  onClick={() => setStegOption('fertigstellung')}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    stegOption === 'fertigstellung'
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  Fertigstellung
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                          <div className="text-xs text-slate-500 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-2 w-fit">
                            <strong>Tages-Regel:</strong> Schritte in "Tagen" enden am Folgetag (wenn Start &lt; 12 Uhr) oder am übernächsten Tag (wenn Start &ge; 12 Uhr).
                          </div>
                          <div className="text-xs text-slate-500 bg-amber-50/50 border border-amber-100 rounded-xl px-4 py-2 w-fit">
                            <strong>Arbeitsfreie Tage:</strong> Wochenenden &amp; gesetzliche Feiertage in Rheinland-Pfalz werden automatisch übersprungen.
                          </div>
                        </div>
                      </div>

                      {/* Summary Card */}
                      <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Activity size={24} />
                          </div>
                          <div>
                            <p className="text-blue-100 text-sm font-medium">Gesamtfertigungszeit</p>
                            <h3 className="text-2xl font-bold">{formatDuration(totalDuration)}</h3>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                            <p className="text-[10px] uppercase tracking-widest text-blue-200">Schritte</p>
                            <p className="text-xl font-bold">{isEditing ? editingSteps.length : selectedProduct.steps.length}</p>
                          </div>
                        </div>
                      </div>

                      {/* Steps Header */}
                      <div className="flex items-center justify-between px-2 mt-8 mb-4">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                          Fertigungsablauf
                        </h2>
                        {!isEditing && (
                          <button 
                            onClick={handleEditClick}
                            className="text-sm flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                            Ablauf bearbeiten
                          </button>
                        )}
                      </div>

                      {/* Steps List */}
                      {isEditing ? (
                        <div className="space-y-4">
                          {scheduledSteps.map((step, index) => (
                            <div key={step.id} className="bg-white p-5 rounded-2xl border-2 border-blue-100 shadow-sm flex flex-col gap-4">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm font-semibold text-slate-800">
                                    <span className="text-slate-400 font-normal mr-1.5">#{step.stepNumber}</span>
                                    {step.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {formatDisplayDate(step.startDate)} {formatDisplayTime(step.startDate)} - {formatDisplayDate(step.endDate)} {formatDisplayTime(step.endDate)}
                                  </div>
                                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                    <button onClick={() => moveStep(index, 'up')} disabled={index === 0} className="p-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-600 border-r border-slate-200">
                                      <ArrowUp size={14} />
                                    </button>
                                    <button onClick={() => moveStep(index, 'down')} disabled={index === scheduledSteps.length - 1} className="p-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-600">
                                      <ArrowDown size={14} />
                                    </button>
                                  </div>
                                  <button onClick={() => removeStepFromProduct(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <button 
                            onClick={() => setShowAddStepModal(true)}
                            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                          >
                            <Plus size={18} /> Abschnitt aus Katalog hinzufügen
                          </button>

                          {/* Sticky Save Bar */}
                          <div className="sticky bottom-4 flex justify-end gap-3 mt-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg z-10">
                            <button onClick={handleCancelClick} className="px-6 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-medium transition-colors shadow-sm">
                              Abbrechen
                            </button>
                            <button onClick={handleSaveClick} className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
                              <Save size={18} /> Ablauf speichern
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {scheduledSteps.map((step, index) => (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-lg hover:shadow-slate-100 transition-all flex gap-5"
                            >
                              <div className="flex flex-col items-center">
                                <div className={`
                                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                  ${step.category === 'digital' ? 'bg-indigo-50 text-indigo-600' : 
                                    step.category === 'machine' ? 'bg-amber-50 text-amber-600' : 
                                    'bg-emerald-50 text-emerald-600'}
                                `}>
                                  {index + 1}
                                </div>
                                {index < selectedProduct.steps.length - 1 && (
                                  <div className="w-0.5 flex-1 bg-slate-100 my-2" />
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                    <span className="text-slate-400 font-normal mr-1.5">#{step.stepNumber}</span>
                                    {step.name}
                                  </h4>
                                  <div className="flex items-center gap-3">
                                    <span className={`
                                      text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md
                                      ${step.category === 'digital' ? 'bg-indigo-100 text-indigo-700' : 
                                        step.category === 'machine' ? 'bg-amber-100 text-amber-700' : 
                                        'bg-emerald-100 text-emerald-700'}
                                    `}>
                                      {step.category}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
                                      <Clock size={14} />
                                      {formatDuration(step.duration)}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed mb-3">
                                  {step.description}
                                </p>
                                
                                {/* Schedule Badge */}
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 w-fit px-2.5 py-1.5 rounded-lg border border-slate-100">
                                  <Calendar size={14} className="text-blue-500" />
                                  {formatDisplayDate(step.startDate)} {formatDisplayTime(step.startDate)} - {formatDisplayDate(step.endDate)} {formatDisplayTime(step.endDate)} Uhr
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Footer Info */}
                      {!isEditing && (
                        <div className="bg-slate-100/50 rounded-2xl p-4 flex items-start gap-3 mt-8">
                          <Info size={18} className="text-slate-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-slate-500 italic">
                            Hinweis: Die berechneten Zeiten überspringen automatisch Wochenenden. Freitags endet die Arbeitszeit um 14:00 Uhr.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white/30 border-2 border-dashed border-slate-200 rounded-3xl">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <ClipboardList size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Kein Produkt ausgewählt</h3>
                      <p className="text-slate-500 max-w-xs">
                        Bitte wählen Sie ein Produkt aus der linken Liste aus, um den Fertigungsplan zu generieren.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </main>
            </div>
          )}

          {/* ==========================================
              TAB: CATALOG (STAMMDATEN)
             ========================================== */}
          {activeTab === 'catalog' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Katalog der Fertigungsabschnitte</h2>
                  <p className="text-sm text-slate-500">Verwalten Sie hier alle {catalog.length} verfügbaren Arbeitsschritte und deren Standardzeiten.</p>
                </div>
                <button 
                  onClick={() => openCatalogModal()}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Neuer Abschnitt
                </button>
              </div>

              <div className="p-6 border-b border-slate-100">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Suchen nach Name, Kategorie oder Nummer..." 
                    value={catalogSearch}
                    onChange={e => setCatalogSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 w-20">Nr.</th>
                      <th className="px-6 py-4">Bezeichnung</th>
                      <th className="px-6 py-4">Kategorie</th>
                      <th className="px-6 py-4">Standard-Dauer</th>
                      <th className="px-6 py-4 text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCatalog.map(step => (
                      <tr key={step.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-400">
                          #{step.stepNumber}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{step.name}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{step.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`
                            text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md
                            ${step.category === 'digital' ? 'bg-indigo-100 text-indigo-700' : 
                              step.category === 'machine' ? 'bg-amber-100 text-amber-700' : 
                              'bg-emerald-100 text-emerald-700'}
                          `}>
                            {step.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">
                          {formatDuration(step.duration)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden mr-2">
                              <button 
                                onClick={() => moveCatalogStep(step.id, 'up')} 
                                disabled={step.stepNumber === 1 || catalogSearch !== ''} 
                                className="p-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-600 border-r border-slate-200"
                                title="Nach oben verschieben"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button 
                                onClick={() => moveCatalogStep(step.id, 'down')} 
                                disabled={step.stepNumber === catalog.length || catalogSearch !== ''} 
                                className="p-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-600"
                                title="Nach unten verschieben"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                            <button onClick={() => openCatalogModal(step)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteCatalogStep(step.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCatalog.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          Keine Abschnitte gefunden.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Background Accents */}
      <div className="fixed top-0 right-0 -z-10 w-1/2 h-1/2 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-gradient-to-t from-slate-50/50 to-transparent pointer-events-none" />

      {/* ==========================================
          MODALS
         ========================================== */}

      {/* Catalog Edit/Add Modal */}
      <AnimatePresence>
        {isCatalogModalOpen && editingCatalogStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800">
                  {editingCatalogStep.id.startsWith('step-') ? 'Neuen Abschnitt anlegen' : 'Abschnitt bearbeiten'}
                </h3>
                <button onClick={() => setIsCatalogModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Nummer</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="number" 
                        disabled
                        value={editingCatalogStep.stepNumber}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Bezeichnung</label>
                    <input 
                      type="text" 
                      value={editingCatalogStep.name}
                      onChange={e => setEditingCatalogStep({...editingCatalogStep, name: e.target.value})}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Kategorie</label>
                    <select 
                      value={editingCatalogStep.category}
                      onChange={e => setEditingCatalogStep({...editingCatalogStep, category: e.target.value as any})}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="manual">Manuell</option>
                      <option value="digital">Digital</option>
                      <option value="machine">Maschinell</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Beschreibung</label>
                  <textarea 
                    value={editingCatalogStep.description}
                    onChange={e => setEditingCatalogStep({...editingCatalogStep, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-700 resize-none"
                  />
                </div>

                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                  <label className="text-xs font-semibold text-blue-800 uppercase mb-3 block flex items-center gap-2">
                    <Clock size={14} /> Zeitvorgabe (Dauer)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 mb-1 block">Tage (à 24h)</label>
                      <input 
                        type="number" min="0"
                        value={catFormDays}
                        onChange={e => setCatFormDays(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 mb-1 block">Stunden</label>
                      <input 
                        type="number" min="0" max="23"
                        value={catFormHours}
                        onChange={e => setCatFormHours(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 mb-1 block">Minuten</label>
                      <input 
                        type="number" min="0" max="59"
                        value={catFormMinutes}
                        onChange={e => setCatFormMinutes(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center font-medium"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 italic">
                    Hinweis: 1 Tag entspricht 24 Stunden. In der Ablaufplanung wird diese Zeit automatisch auf die Arbeitszeiten (8-17 Uhr) verteilt.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setIsCatalogModalOpen(false)} className="px-5 py-2 text-slate-600 hover:bg-slate-200 rounded-xl font-medium transition-colors">
                  Abbrechen
                </button>
                <button onClick={saveCatalogStep} className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium transition-colors shadow-sm">
                  Speichern
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Step to Product Modal */}
      <AnimatePresence>
        {showAddStepModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <h3 className="text-lg font-bold text-slate-800">Abschnitt aus Katalog hinzufügen</h3>
                <button onClick={() => setShowAddStepModal(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 border-b border-slate-100 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Suchen nach Name, Kategorie oder Nummer..." 
                    value={catalogSearch}
                    onChange={e => setCatalogSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="overflow-y-auto p-2 flex-1">
                {filteredCatalog.map(step => (
                  <button 
                    key={step.id}
                    onClick={() => addStepToProduct(step)}
                    className="w-full text-left p-4 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-between group border border-transparent hover:border-blue-100 mb-1"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-700">
                        <span className="text-slate-400 font-normal mr-2">#{step.stepNumber}</span>
                        {step.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {step.category}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={12} /> {formatDuration(step.duration)}
                        </span>
                      </div>
                    </div>
                    <Plus size={20} className="text-slate-300 group-hover:text-blue-600" />
                  </button>
                ))}
                {filteredCatalog.length === 0 && (
                  <div className="p-8 text-center text-slate-500">Keine Abschnitte gefunden.</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
