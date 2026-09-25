"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type RideFilters = {
  source: string;
  destination: string;
  date: string;
  minSeats: number;
};

type RideStore = {
  filters: RideFilters;
  selectedRideId: string | null;
  joinedRideIds: string[];
  setFilter: <K extends keyof RideFilters>(key: K, value: RideFilters[K]) => void;
  resetFilters: () => void;
  selectRide: (rideId: string) => void;
  joinRide: (rideId: string) => void;
};

const defaultFilters: RideFilters = {
  source: "",
  destination: "",
  date: "",
  minSeats: 1,
};

export const useRideStore = create<RideStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      selectedRideId: null,
      joinedRideIds: [],
      setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
      resetFilters: () => set({ filters: defaultFilters }),
      selectRide: (rideId) => set({ selectedRideId: rideId }),
      joinRide: (rideId) =>
        set((state) => ({
          selectedRideId: rideId,
          joinedRideIds: state.joinedRideIds.includes(rideId)
            ? state.joinedRideIds
            : [...state.joinedRideIds, rideId],
        })),
    }),
    {
      name: "campusride-store",
      partialize: (state) => ({
        filters: state.filters,
        selectedRideId: state.selectedRideId,
        joinedRideIds: state.joinedRideIds,
      }),
    },
  ),
);
