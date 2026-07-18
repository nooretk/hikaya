export interface LocationData {
  id: string;
  name: string;
  arabicName: string;
  lat: number;
  lng: number;
  coverImage: string;
  summary: string;
  culturalImportance: string;
  historicalSummary: string;
  landmarks: string[];
}

export interface Contribution {
  id: string;
  location: string;
  title: string;
  author: string;
  narrative: string;
  imageUrl?: string;
  videoUrl?: string;
  category: string;
  date: string;
}

export interface VoiceOption {
  name: string;
  voiceName: string;
  gender: "Male" | "Female";
  description: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
