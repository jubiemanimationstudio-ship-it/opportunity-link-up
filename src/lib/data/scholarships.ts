import type { Opportunity, OpportunityType } from "@/types";

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

export const scholarshipOpportunities: Opportunity[] = [
  {
    id: "sch-001",
    slug: "chevening-scholarship-2026",
    type: "Scholarship",
    title: "Chevening Scholarship 2026: Full Application Guide",
    excerpt:
      "The UK government's flagship scholarship is open. Fully funded one-year master's at any UK university for emerging African leaders.",
    content: article(
      "Chevening is the UK government's international scholarships programme funded by the Foreign, Commonwealth and Development Office. It sponsors future leaders from over 160 countries for a fully-funded one-year master's in the UK. This guide walks you through eligibility, the four essays, deadlines and a strategy that has worked for hundreds of African awardees.",
      [
        {
          heading: "Who is Chevening for?",
          body:
            "Chevening is built for emerging leaders with at least two years of work experience, an undergraduate degree, and a clear plan to return home and contribute. Selectors are not looking for the highest GPA \u2014 they look for ambition, evidence of leadership and a focused career plan."
        },
        {
          heading: "What's covered",
          body:
            "Full tuition fees, monthly living stipend, return economy flights, arrival allowance, departure allowance, thesis grant where applicable, and travel costs for the Chevening events programme. You arrive in the UK with effectively zero out-of-pocket cost."
        },
        {
          heading: "Eligibility checklist",
          body:
            "Citizen of a Chevening-eligible country, undergraduate degree meeting UK 2:1 standard, at least 2,800 hours of work experience (~2 years full time), apply to three different eligible UK master's courses, commit to returning to your home country for two years after the programme."
        },
        {
          heading: "The four essays \u2014 what actually wins",
          body:
            "Each essay is 500 words. Leadership: one specific story with measurable outcomes. Networking: how you build relationships across difference. Studying in the UK: why these three specific courses. Career plan: a vivid 5-year vision tied to a real problem in your country."
        },
        {
          heading: "Timeline",
          body:
            "Applications typically open in August and close in early November. Shortlisted candidates are interviewed at British High Commissions between February and April. Offers issued in June, arrival in September."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "Graduates throwing caps in the air",
    organization: "UK Government \u2014 FCDO",
    category: "Masters",
    tags: ["UK", "Fully Funded", "Leadership", "Government"],
    level: "Masters",
    funding: "Fully Funded",
    amount: "Full tuition + \u00A31,500/mo stipend",
    duration: "1 year",
    location: "United Kingdom",
    region: "Europe",
    deadline: inDays(38),
    publishedAt: daysAgo(2),
    readingTimeMinutes: 9,
    featured: true,
    views: 4821,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://www.chevening.org/scholarship/",
    status: "published"
  },
  {
    id: "sch-002",
    slug: "mastercard-foundation-scholars-2026",
    type: "Scholarship",
    title: "Mastercard Foundation Scholars Program 2026",
    excerpt:
      "Africa's largest education funder. Fully-funded undergraduate and master's scholarships at 40+ partner universities worldwide.",
    content: article(
      "The Mastercard Foundation Scholars Program is the most generous African-focused scholarship in the world. Since 2012 it has supported tens of thousands of academically talented yet economically disadvantaged young Africans.",
      [
        {
          heading: "What's covered",
          body:
            "100% of tuition, accommodation, books, stipend, return flights and pre-departure orientation. Many partners fund laptops, language training and mentorship. You graduate debt-free."
        },
        {
          heading: "Where you can study",
          body:
            "Partner universities span Africa, North America, Europe and beyond \u2014 University of Cape Town, Makerere, Ashesi, UBC, McGill, MIT, Berkeley, American University in Cairo, EARTH University and more."
        },
        {
          heading: "Eligibility",
          body:
            "Citizen of an African country, academic excellence relative to your context, demonstrated financial need, and a track record (or clear potential) of giving back to your community."
        },
        {
          heading: "The give-back commitment",
          body:
            "Every Scholar signs a moral commitment to return to Africa within ten years of completing studies and contribute to the continent's transformation. Selection committees pay close attention to specifics."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "African students on a university campus",
    organization: "Mastercard Foundation",
    category: "Undergraduate",
    tags: ["Africa", "Fully Funded", "Worldwide"],
    level: "Undergraduate",
    funding: "Fully Funded",
    amount: "Full tuition + living + flights",
    duration: "3-4 years",
    location: "Multiple",
    region: "Worldwide",
    deadline: inDays(72),
    publishedAt: daysAgo(5),
    readingTimeMinutes: 7,
    featured: true,
    views: 6203,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://mastercardfdn.org/all/scholars/",
    status: "published"
  },
  {
    id: "sch-003",
    slug: "daad-scholarships-germany-2026",
    type: "Scholarship",
    title: "DAAD Scholarships for Germany 2026",
    excerpt:
      "Tuition-free education at world-class German universities plus a generous monthly stipend from DAAD.",
    content: article(
      "Germany is one of the most affordable and high-quality study destinations \u2014 most public universities charge zero tuition. The DAAD (German Academic Exchange Service) layers on monthly stipends, health insurance and travel allowances.",
      [
        {
          heading: "Most popular DAAD programmes",
          body:
            "EPOS covers two-year master's in engineering, agriculture, public health and economics. Helmut-Schmidt scholarships target public policy. Leadership for Africa supports refugees and displaced students."
        },
        {
          heading: "What is funded",
          body:
            "Monthly stipend of \u20AC934 for master's and \u20AC1,300 for PhD, plus health insurance, travel allowance, study and research grant. Some programmes fund a German language course."
        },
        {
          heading: "Eligibility",
          body:
            "Most DAAD postgraduate scholarships require at least two years of relevant work experience after your bachelor's, preferably in the development sector. Strong academic record and clear motivation aligned with one of the EPOS courses."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "Berlin skyline at sunset",
    organization: "DAAD",
    category: "Masters",
    tags: ["Germany", "Fully Funded", "Research"],
    level: "Masters",
    funding: "Fully Funded",
    amount: "\u20AC934-\u20AC1,300/mo + tuition",
    duration: "1-2 years",
    location: "Germany",
    region: "Europe",
    deadline: inDays(110),
    publishedAt: daysAgo(8),
    readingTimeMinutes: 6,
    views: 3120,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://www.daad.de/en/",
    status: "published"
  }
];
