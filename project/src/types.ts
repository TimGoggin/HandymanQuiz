export interface RoomData {
  id: number;
  size: 'small' | 'medium' | 'large';
  type: '' | 'bedroom' | 'living-room' | 'dining-room' | 'office' | 'basement';
  hasFurniture: boolean;
}

export interface ContactInfo {
  name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface CalculatorState {
  step: number;
  serviceType: 'installation';
  installationType: 'new' | 'replacement';
  hasCarpet: boolean;
  hasPadding: boolean;
  rooms: RoomData[];
  hasStairs: boolean;
  stairCount: number;
  hasHallways: boolean;
  hallwayCount: number;
  paddingType: 'good' | 'better' | 'best';
  needsFurnitureMove: boolean;
  needsDisposal: boolean;
  hasPetUrine: boolean;
  petUrineRooms: number;
  carpetQuality: 'good' | 'better' | 'best';
  specialRequests: string;
  contactInfo: ContactInfo;
}

export interface PriceBreakdown {
  basePrice: number;
  stairsPrice: number;
  hallwaysPrice: number;
  paddingPrice: number;
  furnitureMovePrice: number;
  disposalPrice: number;
  petTreatmentPrice: number;
  carpetQualityPrice: number;
  total: number;
}

export const ROOM_SIZES = {
  'bedroom': {
    small: { min: 100, max: 150 },
    medium: { min: 150, max: 250 },
    large: { min: 250, max: 350 }
  },
  'living-room': {
    small: { min: 150, max: 200 },
    medium: { min: 200, max: 350 },
    large: { min: 350, max: 500 }
  },
  'dining-room': {
    small: { min: 120, max: 150 },
    medium: { min: 150, max: 250 },
    large: { min: 250, max: 350 }
  },
  'office': {
    small: { min: 100, max: 150 },
    medium: { min: 150, max: 200 },
    large: { min: 200, max: 300 }
  },
  'basement': {
    small: { min: 200, max: 300 },
    medium: { min: 300, max: 450 },
    large: { min: 450, max: 700 }
  }
} as const;