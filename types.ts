
export interface BoqItem {
  category: string;
  itemDescription: string;
  brand: string;
  model: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  margin?: number;
  source: 'database' | 'web';
  priceSource: 'database' | 'estimated';
}

export type Boq = BoqItem[];

export interface GroundingSource {
    web?: {
        uri: string;
        title: string;
    };
    maps?: {
        uri: string;
        title: string;
    };
}

export interface ProductDetails {
  imageUrl: string;
  description: string;
  sources: GroundingSource[];
}

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'multiple-choice';
  options?: QuestionOption[];
}

export interface QuestionnaireSection {
  title: string;
  questions: Question[];
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export const CURRENCIES: { label: string; value: Currency; symbol: string }[] = [
    { label: 'USD - US Dollar', value: 'USD', symbol: '$' },
    { label: 'EUR - Euro', value: 'EUR', symbol: '€' },
    { label: 'GBP - British Pound', value: 'GBP', symbol: '£' },
    { label: 'INR - Indian Rupee', value: 'INR', symbol: '₹' },
];

export interface ClientDetails {
    clientName: string;
    projectName: string;
    preparedBy: string;
    date: string;
    designEngineer: string;

    accountManager: string;
    keyClientPersonnel: string;
    location: string;
    keyComments: string;
}

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
  missingComponents: string[];
}

export interface Room {
    id: string;
    name: string;
    answers: { [key: string]: any };
    boq: Boq | null;
    isLoading: boolean;
    error: string | null;
    isVisualizing: boolean;
    visualizationImageUrl: string | null;
    visualizationError: string | null;
    isValidating: boolean;
    validationResult: ValidationResult | null;
    isGeneratingSchematic: boolean;
    schematicImageUrl: string | null;
    schematicError: string | null;
}

export interface RoomTemplate {
  id: string;
  name: string;
  description: string;
  details: {
    capacity: string;
    display: string;
  };
  answers: Record<string, any>;
}

export interface Toast {
  message: string;
  type: 'success' | 'error';
}

export type Theme = 'light' | 'dark';

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface BrandingSettings {
  logoUrl: string; // base64 data URL
  primaryColor: string; // hex code
  companyInfo: CompanyInfo;
}
