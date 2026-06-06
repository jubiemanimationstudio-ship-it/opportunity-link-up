import type { AffiliateResource, OpportunityCategory } from "@/types";

export const categories: OpportunityCategory[] = [
  {
    slug: "scholarship",
    name: "Scholarships",
    description: "Bachelor's, master's, PhD and short-course funding worldwide.",
    icon: "graduation-cap",
    color: "from-sky-500 to-brand",
    type: "Scholarship"
  },
  {
    slug: "internship",
    name: "Internships",
    description: "Paid internships, summer schools and graduate trainee schemes.",
    icon: "briefcase",
    color: "from-violet-500 to-fuchsia-500",
    type: "Internship"
  },
  {
    slug: "job",
    name: "Jobs",
    description: "Entry-level to senior roles at international organisations and start-ups.",
    icon: "buildings",
    color: "from-emerald-500 to-teal-600",
    type: "Job"
  },
  {
    slug: "grant",
    name: "Grants",
    description: "Seed funding, research grants and non-dilutive capital for founders, NGOs and researchers.",
    icon: "wallet",
    color: "from-accent to-amber-500",
    type: "Grant"
  },
  {
    slug: "fellowship",
    name: "Fellowships",
    description: "Leadership, research and professional fellowships from top institutions.",
    icon: "award",
    color: "from-indigo-500 to-purple-600",
    type: "Fellowship"
  },
  {
    slug: "competition",
    name: "Competitions",
    description: "Pitch contests, hackathons, essay prizes and innovation challenges with cash prizes.",
    icon: "trophy",
    color: "from-amber-500 to-rose-500",
    type: "Competition"
  },
  {
    slug: "donation",
    name: "Donate to a Cause",
    description: "Verified emergency relief and community campaigns you can support directly.",
    icon: "heart",
    color: "from-rose-500 to-orange-500",
    type: "Donation"
  },
  {
    slug: "africa",
    name: "For Africans",
    description: "Programmes prioritising or exclusively for African applicants.",
    icon: "globe",
    color: "from-orange-500 to-amber-500"
  },
  {
    slug: "fully-funded",
    name: "Fully Funded",
    description: "Opportunities that cover all costs \u2014 zero out of pocket.",
    icon: "spark",
    color: "from-emerald-500 to-lime-500"
  },
  {
    slug: "remote",
    name: "Remote",
    description: "Work and study from anywhere in the world.",
    icon: "globe",
    color: "from-cyan-500 to-blue-600"
  }
];

export const affiliateResources: AffiliateResource[] = [
  {
    id: "ar-1",
    title: "IELTS Preparation \u2014 British Council",
    description:
      "The official IELTS test provider. Free practice tests, mock exams and a free study plan generator.",
    category: "English Test Prep",
    url: "https://takeielts.britishcouncil.org/",
    badge: "Official",
    cta: "Start Free Prep"
  },
  {
    id: "ar-2",
    title: "Magoosh TOEFL Prep",
    description:
      "Online TOEFL prep with 200+ video lessons, 700+ practice questions and a 5-point score guarantee.",
    category: "English Test Prep",
    url: "https://magoosh.com/toefl/",
    cta: "Try Free Lessons"
  },
  {
    id: "ar-3",
    title: "GRE Prep \u2014 Manhattan Prep",
    description:
      "Gold-standard GRE preparation with live online classes and intensive 1-on-1 tutoring.",
    category: "Graduate Test Prep",
    url: "https://www.manhattanprep.com/gre/",
    cta: "Browse Courses"
  },
  {
    id: "ar-4",
    title: "Grammarly Premium",
    description:
      "Catches grammar mistakes spellcheck misses. Essential for applications and emails to professors.",
    category: "Writing Tools",
    url: "https://www.grammarly.com/premium",
    badge: "Recommended",
    cta: "Get Premium"
  },
  {
    id: "ar-5",
    title: "Wise \u2014 Send Money Internationally",
    description:
      "The cheapest way to receive stipends or pay application fees across currencies. Free virtual cards.",
    category: "Banking & Finance",
    url: "https://wise.com/",
    badge: "Recommended",
    cta: "Open Free Account"
  },
  {
    id: "ar-6",
    title: "LinkedIn Premium for Students",
    description:
      "Discounted LinkedIn Premium for students \u2014 see who viewed your profile, message recruiters directly, access learning courses.",
    category: "Career Tools",
    url: "https://www.linkedin.com/premium/",
    cta: "Try Free Month"
  },
  {
    id: "ar-7",
    title: "Notion for Students",
    description:
      "Free Notion Personal Pro for students. Plan applications, track deadlines and organise documents in one workspace.",
    category: "Productivity",
    url: "https://www.notion.so/students",
    badge: "Free",
    cta: "Verify with Student Email"
  },
  {
    id: "ar-8",
    title: "InterNations \u2014 Connect Globally",
    description:
      "Network with international students and professionals before you arrive. Local events in 420+ cities.",
    category: "Community",
    url: "https://www.internations.org/",
    cta: "Join Free"
  }
];
