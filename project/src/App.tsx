import React, { useState, useCallback } from 'react';
import { Calculator, ChevronRight, ChevronLeft } from 'lucide-react';
import { StepIndicator } from './components/StepIndicator';
import { Summary } from './components/Summary';
import { CalculatorState, RoomData, ContactInfo, ROOM_SIZES } from './types';
import { calculatePrices } from './utils/calculator';

const initialState: CalculatorState = {
  step: 1,
  serviceType: 'installation',
  installationType: 'new',
  hasCarpet: false,
  hasPadding: false,
  rooms: [],
  hasStairs: false,
  stairCount: 0,
  hasHallways: false,
  hallwayCount: 0,
  paddingType: 'good',
  needsFurnitureMove: false,
  needsDisposal: false,
  disposalRooms: 0,
  hasPetUrine: false,
  petUrineRooms: 0,
  carpetQuality: 'good',
  specialRequests: '',
  contactInfo: {
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  },
};

const TOTAL_STEPS = 17;

const ROOM_TYPES = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'living-room', label: 'Living Room' },
  { value: 'dining-room', label: 'Dining Room' },
  { value: 'office', label: 'Office' },
  { value: 'basement', label: 'Basement' },
] as const;

function App() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [showSummary, setShowSummary] = useState(false);

  const handleSubmit = () => {
    setShowSummary(true);
  };

  const nextStep = () => {
    if (state.step === TOTAL_STEPS) {
      handleSubmit();
    } else {
      setState(prev => ({ ...prev, step: Math.min(prev.step + 1, TOTAL_STEPS) }));
    }
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
    setShowSummary(false);
  };

  const restart = () => {
    setState(initialState);
    setShowSummary(false);
  };

  const updateRooms = (count: number) => {
    const newRooms: RoomData[] = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      size: 'medium',
      type: '',
      hasFurniture: false,
    }));
    setState(prev => ({ ...prev, rooms: newRooms }));
  };

  const updateRoomSize = (roomId: number, size: RoomData['size']) => {
    setState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId ? { ...room, size } : room
      ),
    }));
  };

  const updateRoomType = (roomId: number, type: RoomData['type']) => {
    setState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId ? { ...room, type } : room
      ),
    }));
  };

  const updateRoomFurniture = (roomId: number, hasFurniture: boolean) => {
    setState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId ? { ...room, hasFurniture } : room
      ),
      needsFurnitureMove: prev.rooms.some(r => r.id === roomId ? hasFurniture : r.hasFurniture),
    }));
  };

  const updateContactInfo = (field: keyof ContactInfo | keyof ContactInfo['address'], value: string) => {
    setState(prev => {
      if (field in prev.contactInfo.address) {
        return {
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            address: {
              ...prev.contactInfo.address,
              [field]: value
            }
          }
        };
      }
      return {
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value
        }
      };
    });
  };

  const getRoomSizeDescription = (type: RoomData['type'], size: RoomData['size']) => {
    if (!type) return '';
    const range = ROOM_SIZES[type][size];
    return `${range.min}-${range.max} sq ft`;
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">What service do you need a quote for?</h2>
            <select
              className="w-full p-4 border rounded-lg bg-white"
              value={state.serviceType}
              onChange={(e) => {
                setState(prev => ({
                  ...prev,
                  serviceType: e.target.value as 'installation'
                }));
              }}
            >
              <option value="installation">Carpet Installation</option>
            </select>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Is this a new installation or replacement?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className={`p-6 rounded-lg border-2 transition-all ${
                  state.installationType === 'new'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/20'
                }`}
                onClick={() => setState(prev => ({ ...prev, installationType: 'new', needsDisposal: false }))}
              >
                <h3 className="text-lg font-semibold mb-2">New Installation</h3>
                <p className="text-gray-600">Install carpet in a new space</p>
              </button>
              <button
                className={`p-6 rounded-lg border-2 transition-all ${
                  state.installationType === 'replacement'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/20'
                }`}
                onClick={() => setState(prev => ({ ...prev, installationType: 'replacement', needsDisposal: true }))}
              >
                <h3 className="text-lg font-semibold mb-2">Replacement</h3>
                <p className="text-gray-600">Remove existing carpet and install new</p>
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Have you already purchased carpet?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className={`p-6 rounded-lg border-2 transition-all ${
                  state.hasCarpet
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/20'
                }`}
                onClick={() => setState(prev => ({ ...prev, hasCarpet: true }))}
              >
                <h3 className="text-lg font-semibold mb-2">Yes</h3>
                <p className="text-gray-600">I have my own carpet ready to install</p>
              </button>
              <button
                className={`p-6 rounded-lg border-2 transition-all ${
                  !state.hasCarpet
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/20'
                }`}
                onClick={() => setState(prev => ({ ...prev, hasCarpet: false }))}
              >
                <h3 className="text-lg font-semibold mb-2">No</h3>
                <p className="text-gray-600">I need to purchase carpet</p>
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Have you already purchased padding?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className={`p-6 rounded-lg border-2 transition-all ${
                  state.hasPadding
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/20'
                }`}
                onClick={() => setState(prev => ({ ...prev, hasPadding: true }))}
              >
                <h3 className="text-lg font-semibold mb-2">Yes</h3>
                <p className="text-gray-600">I have my own padding ready to install</p>
              </button>
              <button
                className={`p-6 rounded-lg border-2 transition-all ${
                  !state.hasPadding
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/20'
                }`}
                onClick={() => setState(prev => ({ ...prev, hasPadding: false }))}
              >
                <h3 className="text-lg font-semibold mb-2">No</h3>
                <p className="text-gray-600">I need to purchase padding</p>
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              How many rooms need {state.installationType === 'replacement' ? 'carpet replacement' : 'new carpet'}?
            </h2>
            <select
              className="w-full p-3 border rounded-lg"
              value={state.rooms.length}
              onChange={(e) => updateRooms(Number(e.target.value))}
            >
              <option value="0">Select number of rooms</option>
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} room{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">What type of room is each space?</h2>
            {state.rooms.map((room, index) => (
              <div key={room.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Room {index + 1}
                </label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={room.type}
                  onChange={(e) => updateRoomType(room.id, e.target.value as RoomData['type'])}
                >
                  <option value="">Please Select the Room Type</option>
                  {ROOM_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Select room sizes</h2>
            {state.rooms.map((room, index) => (
              <div key={room.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {ROOM_TYPES.find(t => t.value === room.type)?.label} {index + 1}
                </label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={room.size}
                  onChange={(e) => updateRoomSize(room.id, e.target.value as RoomData['size'])}
                >
                  <option value="small">Small ({getRoomSizeDescription(room.type, 'small')})</option>
                  <option value="medium">Medium ({getRoomSizeDescription(room.type, 'medium')})</option>
                  <option value="large">Large ({getRoomSizeDescription(room.type, 'large')})</option>
                </select>
              </div>
            ))}
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Do you need stairs {state.installationType === 'new' ? 'carpeted' : 'carpet removed'}?</h2>
            <div className="flex space-x-4">
              <button
                className={`flex-1 p-3 rounded-lg border ${
                  state.hasStairs ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => setState(prev => ({ ...prev, hasStairs: true }))}
              >
                Yes
              </button>
              <button
                className={`flex-1 p-3 rounded-lg border ${
                  !state.hasStairs ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => setState(prev => ({ ...prev, hasStairs: false, stairCount: 0 }))}
              >
                No
              </button>
            </div>
            {state.hasStairs && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many stairs?
                </label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={state.stairCount}
                  onChange={(e) => setState(prev => ({ ...prev, stairCount: Number(e.target.value) }))}
                >
                  <option value="0">Select number of stairs</option>
                  {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} stair{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Do you have hallways that need {state.installationType === 'new' ? 'carpeting' : 'carpet removal'}?</h2>
            <div className="flex space-x-4">
              <button
                className={`flex-1 p-3 rounded-lg border ${
                  state.hasHallways ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => setState(prev => ({ ...prev, hasHallways: true }))}
              >
                Yes
              </button>
              <button
                className={`flex-1 p-3 rounded-lg border ${
                  !state.hasHallways ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => setState(prev => ({ ...prev, hasHallways: false, hallwayCount: 0 }))}
              >
                No
              </button>
            </div>
            {state.hasHallways && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many hallways?
                </label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={state.hallwayCount}
                  onChange={(e) => setState(prev => ({ ...prev, hallwayCount: Number(e.target.value) }))}
                >
                  <option value="0">Select number of hallways</option>
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} hallway{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );

      case 10:
        return !state.hasCarpet ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Select your carpet quality</h2>
            <div className="space-y-3">
              {[
                { value: 'good', label: 'Good' },
                { value: 'better', label: 'Better' },
                { value: 'best', label: 'Best' },
              ].map(option => (
                <button
                  key={option.value}
                  className={`w-full p-4 rounded-lg border ${
                    state.carpetQuality === option.value
                      ? 'bg-primary text-white'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() =>
                    setState(prev => ({
                      ...prev,
                      carpetQuality: option.value as 'good' | 'better' | 'best',
                    }))
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : nextStep();

      case 11:
        return state.serviceType === 'installation' && !state.hasPadding ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Choose your carpet padding</h2>
            <div className="space-y-3">
              {[
                { value: 'good', label: 'Good' },
                { value: 'better', label: 'Better' },
                { value: 'best', label: 'Best' },
              ].map(option => (
                <button
                  key={option.value}
                  className={`w-full p-4 rounded-lg border ${
                    state.paddingType === option.value
                      ? 'bg-primary text-white'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() =>
                    setState(prev => ({
                      ...prev,
                      paddingType: option.value as 'good' | 'better' | 'best',
                    }))
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : nextStep();

      case 12:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Which rooms need furniture moved to install the carpet?</h2>
            {state.rooms.map((room, index) => (
              <div key={room.id} className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-gray-700">
                  {ROOM_TYPES.find(t => t.value === room.type)?.label} {index + 1}
                </span>
                <div className="flex space-x-2">
                  <button
                    className={`px-4 py-2 rounded-lg border ${
                      room.hasFurniture ? 'bg-primary text-white' : 'bg-white'
                    }`}
                    onClick={() => updateRoomFurniture(room.id, true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg border ${
                      !room.hasFurniture ? 'bg-primary text-white' : 'bg-white'
                    }`}
                    onClick={() => updateRoomFurniture(room.id, false)}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 13:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Do you need us to dispose of the old carpet?</h2>
            <div className="flex space-x-4">
              <button
                className={`flex-1 p-3 rounded-lg border ${
                  state.needsDisposal ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => setState(prev => ({ ...prev, needsDisposal: true }))}
              >
                Yes
              </button>
              <button
                className={`flex-1 p-3 rounded-lg border ${
                  !state.needsDisposal ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => setState(prev => ({ ...prev, needsDisposal: false }))}
              >
                No
              </button>
            </div>
          </div>
        );

      case 14:
        return state.serviceType === 'installation' ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Is pet urine present?</h2>
            <div className="flex space-x-4">
              <button
                className={`flex-1 p-3 rounded-lg border ${
                  state.hasPetUrine ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => setState(prev => ({ ...prev, hasPetUrine: true }))}
              >
                Yes
              </button>
              <button
                className={`flex-1 p-3 rounded-lg border ${
                  !state.hasPetUrine ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => setState(prev => ({ ...prev, hasPetUrine: false, petUrineRooms: 0 }))}
              >
                No
              </button>
            </div>
            {state.hasPetUrine && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  For how many rooms?
                </label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={state.petUrineRooms}
                  onChange={(e) =>
                    setState(prev => ({ ...prev, petUrineRooms: Number(e.target.value) }))
                  }
                >
                  <option value="0">Select number of rooms</option>
                  {Array.from({ length: state.rooms.length }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} room{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ) : nextStep();

      case 15:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Any special requests?</h2>
            <textarea
              className="w-full p-3 border rounded-lg h-32"
              placeholder="Enter any special requests or notes here..."
              value={state.specialRequests}
              onChange={(e) => setState(prev => ({ ...prev, specialRequests: e.target.value }))}
            />
          </div>
        );

      case 16:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Installation Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your street address"
                  value={state.contactInfo.address.street}
                  onChange={(e) => updateContactInfo('street', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your city"
                  value={state.contactInfo.address.city}
                  onChange={(e) => updateContactInfo('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your state"
                  value={state.contactInfo.address.state}
                  onChange={(e) => updateContactInfo('state', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your ZIP code"
                  value={state.contactInfo.address.zipCode}
                  onChange={(e) => updateContactInfo('zipCode', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 17:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your full name"
                  value={state.contactInfo.name}
                  onChange={(e) => updateContactInfo('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your phone number"
                  value={state.contactInfo.phone}
                  onChange={(e) => updateContactInfo('phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your email address"
                  value={state.contactInfo.email}
                  onChange={(e) => updateContactInfo('email', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = useCallback(() => {
    switch (state.step) {
      case 1:
        return state.serviceType === 'installation';
      case 2:
        return state.installationType === 'new' || state.installationType === 'replacement';
      case 3:
        return typeof state.hasCarpet === 'boolean';
      case 4:
        return typeof state.hasPadding === 'boolean';
      case 5:
        return state.rooms.length > 0;
      case 6:
        return state.rooms.every(room => room.type);
      case 7:
        return state.rooms.every(room => room.size);
      case 8:
        return !state.hasStairs || (state.hasStairs && state.stairCount > 0);
      case 9:
        return !state.hasHallways || (state.hasHallways && state.hallwayCount > 0);
      case 10:
        return state.hasCarpet || state.carpetQuality !== '';
      case 11:
        return state.hasPadding || state.paddingType !== '';
      case 12:
        return true; // Furniture moving is optional
      case 13:
        return typeof state.needsDisposal === 'boolean';
      case 14:
        return !state.hasPetUrine || (state.hasPetUrine && state.petUrineRooms > 0);
      case 15:
        return true; // Special requests are optional
      case 16:
        return (
          state.contactInfo.address.street.trim() !== '' &&
          state.contactInfo.address.city.trim() !== '' &&
          state.contactInfo.address.state.trim() !== '' &&
          state.contactInfo.address.zipCode.trim() !== ''
        );
      case 17:
        return (
          state.contactInfo.name.trim() !== '' &&
          state.contactInfo.phone.trim() !== '' &&
          state.contactInfo.email.trim() !== ''
        );
      default:
        return true;
    }
  }, [state]);

  if (showSummary) {
    return <Summary state={state} prices={calculatePrices(state)} onRestart={restart} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <Calculator className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Instant Quote Calculator</h1>
          </div>

          <StepIndicator currentStep={state.step} totalSteps={TOTAL_STEPS} />

          {renderStep()}

          <div className="mt-8 flex justify-between">
            {state.step > 1 && (
              <button
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={prevStep}
              >
                <ChevronLeft className="w- 5 h-5 mr-1" />
                Back
              </button>
            )}
            {state.step === 1 ? <div /> : null}
            <button
              className={`flex items-center px-6 py-2 rounded-lg ${
                canProceed()
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              onClick={nextStep}
              disabled={!canProceed()}
            >
              {state.step === TOTAL_STEPS ? 'Get Quote' : 'Next'}
              {state.step !== TOTAL_STEPS && <ChevronRight className="w-5 h-5 ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;