import type { Opportunity } from "@/types";

const today = new Date();
const inDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};
const daysAgo = (n: number) => inDays(-n);
const article = (intro: string, sections: Array<{ heading: string; body: string }>) => {
  const html = [`<p class="lead">${intro}</p>`];
  for (const s of sections) html.push(`<h2>${s.heading}</h2><p>${s.body}</p>`);
  return html.join("\n");
};

export const donationOpportunities: Opportunity[] = [
  {
    id: "don-001",
    slug: "kwara-flood-relief-2026",
    type: "Donation",
    title: "Kwara Flood Relief: Help Families Rebuild After Devastation",
    excerpt:
      "Over 4,000 families displaced by record flooding in Kwara State need urgent shelter, food and medical supplies.",
    content: article(
      "In the past month, unprecedented flooding across Kwara State has displaced more than 4,000 families and submerged farmlands, homes and schools across nine local government areas. Verified local NGOs are coordinating direct relief and need community support.",
      [
        {
          heading: "What your donation funds",
          body:
            "\u20A65,000 provides 3 days of meals for a family. \u20A615,000 funds basic shelter materials for one displaced family. \u20A650,000 supplies a community health kit (water purification, anti-malarial medication, ORS). 100% of funds go directly through verified partner NGOs \u2014 no overhead."
        },
        {
          heading: "Verified partners",
          body:
            "We have vetted three on-the-ground NGOs: Reach Out Kwara Initiative, the Nigerian Red Cross Kwara Chapter, and the Federation of Muslim Women's Associations. Each provides public quarterly reports and receipts for all disbursements."
        },
        {
          heading: "Transparency",
          body:
            "Donations are routed via the Flutterwave / Paystack platforms directly to partner NGO accounts. The Opportunity Link-Up takes zero fees \u2014 we facilitate the connection only. You will receive a tax-deductible receipt where applicable."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "Aerial view of a flooded community",
    organization: "Reach Out Kwara Initiative",
    category: "Emergency Relief",
    tags: ["Nigeria", "Emergency", "Flood Relief"],
    funding: "Variable",
    amount: "Goal: \u20A615,000,000",
    location: "Kwara State, Nigeria",
    region: "Africa",
    deadline: inDays(45),
    publishedAt: daysAgo(1),
    readingTimeMinutes: 4,
    featured: true,
    views: 1283,
    raisedAmount: 4250000,
    goalAmount: 15000000,
    author: { name: "Link-Up Editorial", role: "Causes Desk" },
    donateUrl: "https://example.org/donate-kwara",
    status: "published"
  },
  {
    id: "don-002",
    slug: "send-a-child-to-school-2026",
    type: "Donation",
    title: "Send a Child to Secondary School \u2014 Term Sponsorship",
    excerpt:
      "Sponsor a year of secondary education for a brilliant child from a low-income family. $200 covers fees, uniforms and books.",
    content: article(
      "In partnership with three vetted community-based education NGOs, this fund sponsors brilliant children from low-income households through a full academic year of secondary school. Sponsors receive a personal letter and termly progress report from their sponsored student.",
      [
        {
          heading: "What $200 covers",
          body:
            "One academic year of school fees at a verified secondary school, full uniform package, textbooks and stationery, one nutritious meal per school day, and any required examination registration fees (JSSCE, WASSCE, NECO)."
        },
        {
          heading: "How sponsors are matched",
          body:
            "After donation, you are matched with a sponsored student based on availability. You receive their first name (privacy protected), school, year and a short bio. Twice a year you receive a written progress report, termly grades and a personal letter from your student."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "Smiling secondary school students in uniform",
    organization: "Brighter Futures Coalition",
    category: "Education",
    tags: ["Education", "Africa", "Sponsorship"],
    funding: "Variable",
    amount: "$200 per child per year",
    location: "Nigeria, Ghana, Kenya",
    region: "Africa",
    deadline: inDays(365),
    publishedAt: daysAgo(20),
    readingTimeMinutes: 4,
    views: 892,
    raisedAmount: 18400,
    goalAmount: 50000,
    author: { name: "Link-Up Editorial", role: "Causes Desk" },
    donateUrl: "https://example.org/donate-school",
    status: "published"
  }
];

export const competitionOpportunities: Opportunity[] = [
  {
    id: "comp-001",
    slug: "hult-prize-2026-student-competition",
    type: "Competition",
    title: "Hult Prize 2026: $1M for Student-Led Social Ventures",
    excerpt:
      "The world's largest student competition for social good. Build a startup that solves a UN SDG challenge \u2014 winners take home $1 million.",
    content: article(
      "The Hult Prize is the world's biggest student entrepreneurship competition, awarding $1 million in seed capital to a team of university students building a venture that solves a defined global challenge. Every year a new challenge is announced, aligned with the UN Sustainable Development Goals.",
      [
        {
          heading: "How it works",
          body:
            "Compete first at your campus (OnCampus round), then advance to one of 25+ Regional Summits worldwide, then to the Accelerator at Hult's London campus, and finally to the Global Finals where the $1M is awarded by a panel of global judges."
        },
        {
          heading: "Eligibility",
          body:
            "Team of 3-4 currently-enrolled university students (undergraduate or graduate). All disciplines welcome \u2014 some of the strongest teams blend engineers, business students, designers and policy students."
        },
        {
          heading: "How to advance",
          body:
            "Pick a problem you have genuine first-hand exposure to \u2014 lived experience beats abstract research. Build a working prototype or pilot before regionals, not just slides. Practice your pitch with hostile audiences \u2014 the questions get sharper at every round."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "Students pitching on a stage",
    organization: "Hult Prize Foundation",
    category: "Entrepreneurship",
    tags: ["Global", "Students", "Social Impact", "$1M Prize"],
    funding: "Variable",
    amount: "$1,000,000 grand prize",
    duration: "Annual competition",
    location: "Multiple",
    region: "Worldwide",
    deadline: inDays(120),
    publishedAt: daysAgo(16),
    readingTimeMinutes: 5,
    views: 3107,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://www.hultprize.org/",
    status: "published"
  }
];
