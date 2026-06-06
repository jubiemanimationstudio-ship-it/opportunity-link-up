export const site = {
  name: "The Opportunity Link-up",
  shortName: "Link-Up",
  initials: "TOL",
  tagline: "Where Opportunity Meets Ambition.",
  description:
    "The Opportunity Link-up (TOL) is your daily hub for verified scholarships, internships, grants, jobs, fellowships and charitable causes. We surface life-changing opportunities and link you straight to the apply button.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://opportunitylinkup.com",
  ogImage: "/og-default.svg",
  logo: {
    image: "/logo.svg",
    alt: "The Opportunity Link-up logo \u2014 handshake forming a pen",
    width: 1280,
    height: 1280
  },
  whatsappInvite:
    process.env.NEXT_PUBLIC_WHATSAPP_INVITE ||
    "https://chat.whatsapp.com/your-invite-code",
  email: "hello@opportunitylinkup.com",
  adsense: {
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
    enabled: Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT)
  },
  social: {
    twitter: "https://twitter.com/oppoLinkUp",
    instagram: "https://instagram.com/oppoLinkUp",
    facebook: "https://facebook.com/oppoLinkUp",
    youtube: "https://youtube.com/@oppoLinkUp",
    telegram: "https://t.me/oppoLinkUp",
    linkedin: "https://linkedin.com/company/opportunity-linkup"
  },
  founder: {
    name: "The Link-Up Team",
    role: "Editorial",
    bio: "We are educators, students, founders and grant recipients building the resource we wish we had."
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/opportunities", label: "Opportunities" },
    { href: "/categories/scholarship", label: "Scholarships" },
    { href: "/categories/internship", label: "Internships" },
    { href: "/categories/job", label: "Jobs" },
    { href: "/categories/grant", label: "Grants" },
    { href: "/categories/donation", label: "Donate" },
    { href: "/resources", label: "Resources" }
  ],
  footerLinks: {
    "Browse": [
      { href: "/opportunities", label: "All Opportunities" },
      { href: "/categories/scholarship", label: "Scholarships" },
      { href: "/categories/internship", label: "Internships" },
      { href: "/categories/job", label: "Jobs & Careers" },
      { href: "/categories/grant", label: "Grants" },
      { href: "/categories/fellowship", label: "Fellowships" },
      { href: "/categories/donation", label: "Causes & Donations" }
    ],
    "Company": [
      { href: "/about", label: "About Link-Up" },
      { href: "/contact", label: "Contact" },
      { href: "/resources", label: "Application Tools" },
      { href: "/blog", label: "Insights" }
    ],
    "Legal": [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/disclosure", label: "Affiliate Disclosure" },
      { href: "/cookies", label: "Cookie Policy" }
    ]
  },
  opportunityTypes: [
    {
      slug: "scholarship",
      label: "Scholarship",
      icon: "graduation-cap",
      color: "from-sky-500 to-brand",
      blurb: "Fully-funded, partial and tuition-only awards from secondary to doctorate."
    },
    {
      slug: "internship",
      label: "Internship",
      icon: "briefcase",
      color: "from-violet-500 to-fuchsia-500",
      blurb: "Paid internships, summer schools and graduate trainee schemes."
    },
    {
      slug: "job",
      label: "Job",
      icon: "buildings",
      color: "from-emerald-500 to-teal-600",
      blurb: "Entry-level to senior roles at international organisations and start-ups."
    },
    {
      slug: "grant",
      label: "Grant",
      icon: "wallet",
      color: "from-accent to-amber-500"
    },
    {
      slug: "fellowship",
      label: "Fellowship",
      icon: "award",
      color: "from-indigo-500 to-purple-600",
      blurb: "Leadership, research and professional fellowships worldwide."
    },
    {
      slug: "competition",
      label: "Competition",
      icon: "trophy",
      color: "from-amber-500 to-rose-500",
      blurb: "Pitch contests, hackathons, essay prizes and innovation challenges."
    },
    {
      slug: "volunteer",
      label: "Volunteer",
      icon: "hand-heart",
      color: "from-pink-500 to-rose-500",
      blurb: "Meaningful volunteer placements with global NGOs and local causes."
    },
    {
      slug: "donation",
      label: "Donate",
      icon: "heart",
      color: "from-rose-500 to-orange-500",
      blurb: "Vetted causes and emergency campaigns you can support today."
    }
  ]
} as const;

export type SiteConfig = typeof site;
export type OpportunityTypeMeta = (typeof site.opportunityTypes)[number];
