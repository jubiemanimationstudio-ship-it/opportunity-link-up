export type OpportunityType =
  | "Scholarship"
  | "Internship"
  | "Job"
  | "Grant"
  | "Fellowship"
  | "Competition"
  | "Volunteer"
  | "Donation";

export type ScholarshipLevel =
  | "Secondary"
  | "Undergraduate"
  | "Masters"
  | "PhD"
  | "Postdoctoral"
  | "Professional"
  | "Open";

export type FundingType =
  | "Fully Funded"
  | "Partial"
  | "Stipend Only"
  | "Tuition Only"
  | "Salaried"
  | "Unpaid"
  | "Variable";

export type Region =
  | "Africa"
  | "Europe"
  | "North America"
  | "Asia"
  | "Australia"
  | "South America"
  | "Middle East"
  | "Worldwide"
  | "Remote";

export interface Author {
  name: string;
  role: string;
  avatar?: string;
}

export interface Opportunity {
  id: string;
  slug: string;
  type: OpportunityType;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt?: string;
  organization: string;
  category: string;
  tags: string[];
  level?: ScholarshipLevel;
  funding?: FundingType;
  amount?: string;
  duration?: string;
  location?: string;
  region: Region;
  remote?: boolean;
  deadline: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  author: Author;
  featured?: boolean;
  views?: number;
  applyUrl?: string;
  donateUrl?: string;
  raisedAmount?: number;
  goalAmount?: number;
  status?: "published" | "draft" | "archived";
}

export interface OpportunityCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  type?: OpportunityType;
}

export interface AffiliateResource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  badge?: string;
  cta?: string;
}
