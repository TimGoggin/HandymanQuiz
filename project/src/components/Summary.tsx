import { Calculator } from 'lucide-react';
import { CalculatorState, PriceBreakdown, ROOM_SIZES } from '../types';
import { formatCurrency } from '../utils/format';

interface SummaryProps {
  state: CalculatorState;
  prices: PriceBreakdown;
  onRestart: () => void;
}

export const Summary = ({ state, prices, onRestart }: SummaryProps) => {
  const getRoomSizeRange = (type: string, size: string) => {
    const sizeRange = ROOM_SIZES[type as keyof typeof ROOM_SIZES][size as 'small' | 'medium' | 'large'];
    return `${sizeRange.min}-${sizeRange.max}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-center mb-6">
        <Calculator className="w-8 h-8 text-primary mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Installation Summary</h2>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{state.contactInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{state.contactInfo.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{state.contactInfo.phone}</span>
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Installation Address</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Street:</span>
              <span>{state.contactInfo.address.street}</span>
            </div>
            <div className="flex justify-between">
              <span>City:</span>
              <span>{state.contactInfo.address.city}</span>
            </div>
            <div className="flex justify-between">
              <span>State:</span>
              <span>{state.contactInfo.address.state}</span>
            </div>
            <div className="flex justify-between">
              <span>ZIP Code:</span>
              <span>{state.contactInfo.address.zipCode}</span>
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Service Details</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Service Type:</span>
              <span>{state.serviceType === 'replacement' ? 'Carpet Replacement' : 'New Installation'}</span>
            </div>
            <div className="flex justify-between">
              <span>Carpet Provided:</span>
              <span>{state.hasCarpet ? 'By Customer' : 'Needs Purchase'}</span>
            </div>
            <div className="flex justify-between">
              <span>Padding Provided:</span>
              <span>{state.hasPadding ? 'By Customer' : 'Needs Purchase'}</span>
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Room Details</h3>
          {state.rooms.map((room, index) => (
            <div key={room.id} className="flex justify-between text-gray-600">
              <span>
                {room.type.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')} {index + 1}
              </span>
              <span>
                {room.size.charAt(0).toUpperCase() + room.size.slice(1)} ({getRoomSizeRange(room.type, room.size)} sq ft)
              </span>
            </div>
          ))}
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Selected Options</h3>
          <div className="space-y-2 text-gray-600">
            {state.hasStairs && (
              <div className="flex justify-between">
                <span>Stairs</span>
                <span>{state.stairCount} steps</span>
              </div>
            )}
            {state.hasHallways && (
              <div className="flex justify-between">
                <span>Hallways</span>
                <span>{state.hallwayCount} hallway{state.hallwayCount !== 1 ? 's' : ''}</span>
              </div>
            )}
            {!state.hasCarpet && (
              <div className="flex justify-between">
                <span>Carpet Quality</span>
                <span className="capitalize">{state.carpetQuality}</span>
              </div>
            )}
            {!state.hasPadding && (
              <div className="flex justify-between">
                <span>Padding Type</span>
                <span className="capitalize">{state.paddingType}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Price Breakdown</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Base Installation</span>
              <span>{formatCurrency(prices.basePrice)}</span>
            </div>
            {prices.stairsPrice > 0 && (
              <div className="flex justify-between">
                <span>Stairs</span>
                <span>{formatCurrency(prices.stairsPrice)}</span>
              </div>
            )}
            {prices.hallwaysPrice > 0 && (
              <div className="flex justify-between">
                <span>Hallways</span>
                <span>{formatCurrency(prices.hallwaysPrice)}</span>
              </div>
            )}
            {!state.hasPadding && prices.paddingPrice > 0 && (
              <div className="flex justify-between">
                <span>Padding</span>
                <span>{formatCurrency(prices.paddingPrice)}</span>
              </div>
            )}
            {prices.furnitureMovePrice > 0 && (
              <div className="flex justify-between">
                <span>Furniture Moving</span>
                <span>{formatCurrency(prices.furnitureMovePrice)}</span>
              </div>
            )}
            {prices.disposalPrice > 0 && (
              <div className="flex justify-between">
                <span>Old Carpet Disposal</span>
                <span>{formatCurrency(prices.disposalPrice)}</span>
              </div>
            )}
            {prices.petTreatmentPrice > 0 && (
              <div className="flex justify-between">
                <span>Pet Treatment</span>
                <span>{formatCurrency(prices.petTreatmentPrice)}</span>
              </div>
            )}
            {prices.carpetQualityPrice > 0 && (
              <div className="flex justify-between">
                <span>Carpet Quality Upgrade</span>
                <span>{formatCurrency(prices.carpetQualityPrice)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Total Estimate</span>
            <span>{formatCurrency(prices.total)}</span>
          </div>
        </div>

        <div className="space-y-4 pt-6">
          <button
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            onClick={() => window.location.href = '#contact'}
          >
            Get a Detailed Quote
          </button>
          <button
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            onClick={onRestart}
          >
            Start Over
          </button>
        </div>

        {state.specialRequests && (
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-2">Special Requests</h3>
            <p className="text-gray-600">{state.specialRequests}</p>
          </div>
        )}
      </div>
    </div>
  );
};