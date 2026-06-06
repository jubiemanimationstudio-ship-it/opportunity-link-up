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

export const jobOpportunities: Opportunity[] = [
  {
    id: "job-001",
    slug: "world-bank-young-professionals-2026",
    type: "Job",
    title: "World Bank Young Professionals Program 2026",
    excerpt:
      "Launch a global development career at the World Bank. Five-year contract, Washington DC posting, world-class training.",
    content: article(
      "The Young Professionals Program (YPP) is the World Bank's flagship leadership-development programme. It recruits high-potential professionals into a structured 5-year career path that combines real operational work with rotational assignments and leadership training.",
      [
        {
          heading: "What you get",
          body:
            "Five-year renewable contract starting at GE-level (around US$135,000+ base salary plus generous benefits), relocation to Washington DC, accelerated career path, two operational rotations and dedicated mentorship from senior leaders."
        },
        {
          heading: "Eligibility",
          body:
            "Master's or PhD with at least 4 years of relevant work or research experience, born on or after 1 October 1993 (under 32 at time of application), fluency in English, and a strong commitment to international development. Specialisation in economics, finance, education, health, infrastructure, environment, social development or related."
        },
        {
          heading: "Selection process",
          body:
            "Online application (deep technical and motivation essays), shortlisting, written technical assessment, panel interviews, final interviews in Washington. Highly competitive \u2014 fewer than 40 offers from roughly 15,000 applicants per cycle."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "Professionals meeting in a modern office",
    organization: "World Bank Group",
    category: "International Development",
    tags: ["USA", "Development", "Global", "Career"],
    funding: "Salaried",
    amount: "$135,000+ / year + benefits",
    duration: "5 years",
    location: "Washington DC",
    region: "North America",
    deadline: inDays(64),
    publishedAt: daysAgo(7),
    readingTimeMinutes: 7,
    featured: true,
    views: 3920,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://www.worldbank.org/en/about/careers/programs-and-internships/young-professionals-program",
    status: "published"
  },
  {
    id: "job-002",
    slug: "un-junior-professional-officer-2026",
    type: "Job",
    title: "UN Junior Professional Officer (JPO) Programme 2026",
    excerpt:
      "Entry into the United Nations system through your country's sponsored Junior Professional Officer track.",
    content: article(
      "The UN JPO Programme places young professionals from sponsor countries into substantive positions in UN agencies for 2-4 years. It is the most reliable entry route into the UN system for emerging diplomats, lawyers, economists and development specialists.",
      [
        {
          heading: "How it works",
          body:
            "Each year, sponsor countries (donor governments) fund a number of JPO positions across UN agencies. You apply through your country's foreign ministry or development agency \u2014 not directly to the UN. Selected JPOs receive UN staff contracts at the P-2 grade."
        },
        {
          heading: "What you get",
          body:
            "UN P-2 salary (approximately $70,000-$95,000 plus post adjustments and benefits), assignment to a substantive role for 2 years (often extendable to 4), exposure to senior UN leadership, and an inside track to long-term UN careers."
        },
        {
          heading: "Eligibility",
          body:
            "Citizen of a JPO sponsor country (check your country's eligibility), master's degree in a relevant field, 2-4 years of professional experience, fluency in English and ideally a second UN language, under 32 years old at application."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "UN building exterior",
    organization: "United Nations",
    category: "International Development",
    tags: ["UN", "Diplomacy", "Government"],
    funding: "Salaried",
    amount: "$70k-$95k + benefits",
    duration: "2-4 years",
    location: "Multiple",
    region: "Worldwide",
    deadline: inDays(95),
    publishedAt: daysAgo(15),
    readingTimeMinutes: 6,
    views: 2104,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://www.unjpo.org/",
    status: "published"
  }
];
