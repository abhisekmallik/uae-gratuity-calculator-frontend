export interface EmployeeData {
  basicSalary: number;
  terminationType:
    | "resignation"
    | "termination"
    | "retirement"
    | "death"
    | "disability";
  isUnlimitedContract: boolean;
  joiningDate: string;
  lastWorkingDay: string;
}

export interface EOSBCalculationResult {
  totalServiceYears: number;
  totalServiceMonths: number;
  totalServiceDays: number;
  basicSalaryAmount: number;
  totalSalary: number;
  eligibleYears: number;
  gratuityAmount: number;
  breakdown: {
    firstFiveYears: {
      years: number;
      rate: number;
      amount: number;
    };
    additionalYears: {
      years: number;
      rate: number;
      amount: number;
    };
  };
  isEligible: boolean;
  reason?: string;
}

export interface ConfigurationData {
  terminationTypes: {
    value: string;
    label: string;
    labelAr: string;
  }[];
  contractTypes: {
    value: boolean;
    label: string;
    labelAr: string;
  }[];
  calculationRules: {
    minimumServiceDays: number;
    firstFiveYearsRate: number;
    additionalYearsRate: number;
    resignationPenalty: {
      lessThanOneYear: number;
      lessThanThreeYears: number;
      lessThanFiveYears: number;
      fiveYearsOrMore: number;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export type Language = "en" | "ar";
export type Theme = "light" | "dark" | "system";

export interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  config: ConfigurationData | null;
  isLoading: boolean;
  error: string | null;
}
