import { CalculatorState, PriceBreakdown, ROOM_SIZES } from '../types';

const ROOM_PRICES = {
  'living-room': 32.00,
  'bedroom': 30.00,
  'dining-room': 32.00,
  'office': 32.00,
  'basement': 35.00,
};

export const calculatePrices = (state: CalculatorState): PriceBreakdown => {
  // Calculate base price based on room types and sizes
  const basePrice = state.rooms.reduce((acc, room) => {
    const sizeRange = ROOM_SIZES[room.type][room.size];
    const avgSqFt = (sizeRange.min + sizeRange.max) / 2;
    const sqYd = avgSqFt / 9;
    return acc + (sqYd * ROOM_PRICES[room.type]);
  }, 0);

  // Stairs price ($15 per stair)
  const stairsPrice = state.hasStairs ? state.stairCount * 15 : 0;

  // Hallways price ($100 per hallway)
  const hallwaysPrice = state.hasHallways ? state.hallwayCount * 100 : 0;

  // Padding price (only if not provided)
  const paddingRates = {
    good: 4.50,
    better: 6.75,
    best: 11.25
  };
  
  const totalSqYd = state.rooms.reduce((acc, room) => {
    const sizeRange = ROOM_SIZES[room.type][room.size];
    const avgSqFt = (sizeRange.min + sizeRange.max) / 2;
    return acc + (avgSqFt / 9);
  }, 0);
  
  const paddingPrice = !state.hasPadding ? totalSqYd * paddingRates[state.paddingType] : 0;

  // Furniture moving price ($25 per room)
  const furnitureMovePrice = state.rooms.reduce((acc, room) => 
    acc + (room.hasFurniture ? 25 : 0), 0);

  // Disposal price (flat rate of $150 if needed)
  const disposalPrice = state.needsDisposal ? 150 : 0;

  // Pet treatment price ($100 per room)
  const petTreatmentPrice = state.hasPetUrine ? state.petUrineRooms * 100 : 0;

  // Carpet quality price (only if carpet not provided)
  const qualityRates = {
    good: 10.00,
    better: 14.00,
    best: 18.00
  };
  const carpetQualityPrice = !state.hasCarpet ? totalSqYd * qualityRates[state.carpetQuality] : 0;

  const total = basePrice + stairsPrice + hallwaysPrice + paddingPrice + 
                furnitureMovePrice + disposalPrice + petTreatmentPrice + 
                carpetQualityPrice;

  return {
    basePrice,
    stairsPrice,
    hallwaysPrice,
    paddingPrice,
    furnitureMovePrice,
    disposalPrice,
    petTreatmentPrice,
    carpetQualityPrice,
    total
  };
};