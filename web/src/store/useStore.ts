import { create } from 'zustand';

export interface UserProfile {
    businessType: string;
    locationType: 'global' | 'region';
    targetCountry: string;
    targetState: string;
    targetCity: string;
    idealClientType: string;
    budgetRange: string;
    servicesOffered: string;
    customNotes: string;
    openAiKey: string;
    customEndpoint: string;
    companyName: string;
    targetAudience: string;
}

interface AppState {
    profile: UserProfile;
    setProfileField: (field: keyof UserProfile, value: string) => void;
    setProfile: (profile: UserProfile) => void;
    resetProfile: () => void;
}

const initialProfile: UserProfile = {
    businessType: '',
    locationType: 'global',
    targetCountry: '',
    targetState: '',
    targetCity: '',
    idealClientType: '',
    budgetRange: '',
    servicesOffered: '',
    customNotes: '',
    openAiKey: '',
    customEndpoint: '',
    companyName: '',
    targetAudience: '',
};

export const useStore = create<AppState>((set) => ({
    profile: initialProfile,
    setProfileField: (field, value) =>
        set((state) => ({
            profile: { ...state.profile, [field]: value }
        })),
    setProfile: (profile) => set({ profile }),
    resetProfile: () => set({ profile: initialProfile }),
}));
