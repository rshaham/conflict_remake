// ============================================
// UI Store - UI State Management
// ============================================

import { create } from 'zustand';
import type { CountryId, VendorId } from '../types/game';

export type ModalType =
  | 'country_detail'
  | 'weapon_purchase'
  | 'event'
  | 'war_status'
  | 'nuclear_confirm'
  | 'settings'
  | 'help';

interface UIStore {
  // Selected items
  selectedCountry: CountryId | null;
  selectedVendor: VendorId;

  // Modals
  activeModal: ModalType | null;
  modalData: unknown;

  // Navigation
  currentScreen: string;

  // Actions
  selectCountry: (country: CountryId | null) => void;
  selectVendor: (vendor: VendorId) => void;
  openModal: (type: ModalType, data?: unknown) => void;
  closeModal: () => void;
  setCurrentScreen: (screen: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial State
  selectedCountry: null,
  selectedVendor: 'usa',
  activeModal: null,
  modalData: null,
  currentScreen: 'title',

  // Actions
  selectCountry: (country) => set({ selectedCountry: country }),

  selectVendor: (vendor) => set({ selectedVendor: vendor }),

  openModal: (type, data = null) => set({ activeModal: type, modalData: data }),

  closeModal: () => set({ activeModal: null, modalData: null }),

  setCurrentScreen: (screen) => set({ currentScreen: screen }),
}));
