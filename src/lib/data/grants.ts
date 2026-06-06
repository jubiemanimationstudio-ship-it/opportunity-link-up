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

export const grantOpportunities: Opportunity[] = [
  {
    id: "gr-001",
    slug: "tony-elumelu-foundation-entrepreneurship-2026",
    type: "Grant",
    title: "Tony Elumelu Foundation Entrepreneurship Programme 2026",
    excerpt:
      "$5,000 non-refundable seed capital, business training and mentorship for 1,000 African entrepreneurs each year.",
    content: article(
      "The Tony Elumelu Foundation Entrepreneurship Programme (TEFEP) is a 10-year, $100 million commitment to identify, train, mentor and fund 10,000 African entrepreneurs. Every year, 1,000 founders are selected for the flagship programme.",
      [
        {
          heading: "What you get",
          body:
            "$5,000 non-refundable seed capital, 12-week business training on the TEFConnect platform, dedicated mentorship from senior business leaders, a meeting at the TEF Entrepreneurship Forum in Lagos, and lifetime access to the alumni network of over 18,000 entrepreneurs."
        },
        {
          heading: "Eligibility",
          body:
            "You must be a citizen of an African country, at least 18 years old, with a for-profit business idea or early-stage business operating in Africa. All sectors qualify. Both new ideas and businesses up to 3 years old are eligible."
        },
        {
          heading: "How to win",
          body:
            "Articulate the problem your business solves with concrete numbers. Show traction \u2014 even basic evidence (5 paying customers, 2 LOIs, a working prototype). Demonstrate why YOU are the right founder for this problem. Skip the buzzwords \u2014 use plain language."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "African entrepreneurs in a working session",
    organization: "Tony Elumelu Foundation",
    category: "Entrepreneurship",
    tags: ["Africa", "Startup", "Seed Funding"],
    funding: "Fully Funded",
    amount: "$5,000 + training + mentorship",
    duration: "12 weeks programme + lifetime network",
    location: "Africa",
    region: "Africa",
    deadline: inDays(30),
    publishedAt: daysAgo(4),
    readingTimeMinutes: 6,
    featured: true,
    views: 7821,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://www.tefconnect.com/",
    status: "published"
  },
  {
    id: "gr-002",
    slug: "awief-women-in-tech-grant-2026",
    type: "Grant",
    title: "AWIEF Women in Tech Grant 2026",
    excerpt:
      "Up to $25,000 in non-dilutive funding plus accelerator support for African women building scalable tech ventures.",
    content: article(
      "The Africa Women Innovation and Entrepreneurship Forum (AWIEF) Growth Programme awards grants to African women founders running revenue-generating tech businesses ready to scale.",
      [
        {
          heading: "What you get",
          body:
            "Grant funding between $5,000 and $25,000 (non-dilutive \u2014 you keep your equity), six-month accelerator with structured curriculum, 1:1 coaching with industry mentors, investor introductions, and a showcase slot at the annual AWIEF conference."
        },
        {
          heading: "Eligibility",
          body:
            "Woman founder or co-founder of an African-registered tech company (broadly defined: SaaS, fintech, agritech, healthtech, edtech, climate tech). Business must be at least 12 months old with demonstrable revenue or paying users."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "Woman leading a tech team meeting",
    organization: "AWIEF",
    category: "Entrepreneurship",
    tags: ["Africa", "Women", "Tech", "Non-dilutive"],
    funding: "Variable",
    amount: "$5,000-$25,000",
    duration: "6-month accelerator",
    location: "Africa",
    region: "Africa",
    deadline: inDays(58),
    publishedAt: daysAgo(11),
    readingTimeMinutes: 5,
    views: 2014,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://awieforum.org/",
    status: "published"
  }
];

export const fellowshipOpportunities: Opportunity[] = [
  {
    id: "fel-001",
    slug: "mandela-washington-fellowship-2026",
    type: "Fellowship",
    title: "Mandela Washington Fellowship for Young African Leaders 2026",
    excerpt:
      "The flagship YALI programme. Six weeks of leadership development at a top US university for 700 young African leaders.",
    content: article(
      "The Mandela Washington Fellowship is the flagship programme of the Young African Leaders Initiative (YALI). Each year, 700 outstanding leaders aged 25-35 from Sub-Saharan Africa are selected for a fully-funded six-week academic and leadership programme in the United States.",
      [
        {
          heading: "What's covered",
          body:
            "Round-trip international travel, six-week institute at a US university (Business, Civic Engagement or Public Management track), accommodation, meals, medical insurance, daily allowance, optional Professional Development Experience in a US organisation, and lifetime alumni network access."
        },
        {
          heading: "Eligibility",
          body:
            "Between 25-35 years old at application deadline, citizen and resident of an eligible Sub-Saharan African country, not a US citizen or permanent resident, English proficient, with a demonstrated record of leadership in your community, organisation or business."
        },
        {
          heading: "Selection",
          body:
            "Online application with five short essays focused on your leadership story, impact and future plans. Shortlisted candidates interview at US embassies. Final selection in March; departure in June."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "Group of professionals collaborating",
    organization: "US Department of State",
    category: "Leadership",
    tags: ["USA", "Africa", "Leadership", "Fully Funded"],
    funding: "Fully Funded",
    amount: "Full programme + travel + stipend",
    duration: "6 weeks",
    location: "United States",
    region: "North America",
    deadline: inDays(78),
    publishedAt: daysAgo(9),
    readingTimeMinutes: 7,
    featured: true,
    views: 4380,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://yali.state.gov/mwfellowship/",
    status: "published"
  }
];
