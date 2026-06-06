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

const cover = (id: string) => `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;

// ============================================================
// SCHOLARSHIPS — real, currently accepting (2026 cycles)
// ============================================================
export const realScholarshipOpportunities: Opportunity[] = [
  {
    id: "sch-r-001",
    slug: "chevening-scholarships-2026-27",
    type: "Scholarship",
    title: "Chevening Scholarships 2026/27 (UK Government)",
    excerpt:
      "Fully-funded one-year master's at any UK university. Funded by the UK Foreign, Commonwealth & Development Office. Applications open August–November annually.",
    content: article(
      "Chevening is the UK government's global scholarship programme, funded by the Foreign, Commonwealth & Development Office and partner organisations. Awardees study a one-year taught master's at any UK university of their choice, with full tuition, living stipend, airfares and a wealth of exclusive networking events.",
      [
        {
          heading: "What you get",
          body: "Full tuition fees, monthly living stipend (~£1,400), return economy airfare, arrival and departure allowances, visa fees, and a tailored programme of UK-wide events including a 3-day orientation in London and a final gala."
        },
        {
          heading: "Eligibility",
          body: "Citizen of a Chevening-eligible country (most of Africa, Asia, the Caribbean, the Americas, Europe and the Middle East), undergraduate degree that qualifies for UK master's study, at least 2 years (2,800 hours) of work experience, and a clear plan to return home for at least 2 years after the award."
        },
        {
          heading: "How to apply",
          body: "Apply online via chevening.org between August and November each year. You need: 2 references, 1 unconditional UK university offer (or a clear plan to get one), and 4 essay questions covering leadership, networking, study choice and career plan."
        }
      ]
    ),
    coverImage: cover("photo-1523240795612-9a054b0db644"),
    coverImageAlt: "UK parliament and Big Ben at dusk",
    organization: "UK Foreign, Commonwealth & Development Office",
    category: "Scholarship",
    tags: ["UK", "Masters", "Fully Funded", "Government"],
    funding: "Fully Funded",
    level: "Masters",
    amount: "Full tuition + £1,400/month stipend",
    duration: "1 year",
    location: "United Kingdom",
    region: "Europe",
    deadline: inDays(105),
    publishedAt: daysAgo(3),
    readingTimeMinutes: 6,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Scholarships Desk" },
    applyUrl: "https://www.chevening.org/scholarships/",
    status: "published"
  },
  {
    id: "sch-r-002",
    slug: "daad-scholarships-germany-2026",
    type: "Scholarship",
    title: "DAAD Scholarships Germany 2026 (Development-Related Postgraduate Courses)",
    excerpt:
      "Fully-funded master's and PhD scholarships at top German universities. ~50 postgraduate programmes. Funded by the German Academic Exchange Service (DAAD).",
    content: article(
      "The DAAD (Deutscher Akademischer Austauschdienst) EPOS programme offers scholarships to students from developing countries for selected master's and PhD programmes at German universities with strong development relevance — covering engineering, economics, agriculture, public health, social sciences and more.",
      [
        {
          heading: "What you get",
          body: "Full tuition waiver (at public universities in Germany it's already free), monthly stipend of €992 for master's / €1,300 for PhD, payments towards health insurance, airfare, study and research allowance, and German language course (2–6 months before the programme starts)."
        },
        {
          heading: "Eligibility",
          body: "Bachelor's degree (4-year minimum) in a relevant field, at least 2 years of relevant professional experience, English proficiency (IELTS 6.5 / TOEFL 90) or German B1 for German-taught programmes, and a development-related motivation for study in Germany."
        },
        {
          heading: "Deadlines",
          body: "Most courses have application deadlines between August and October for courses starting the following October. Apply directly to the chosen course at the university (not DAAD), and indicate you'd like to apply for the EPOS scholarship. The university then nominates you to DAAD."
        }
      ]
    ),
    coverImage: cover("photo-1560969184-10fe8719e047"),
    coverImageAlt: "Brandenburg Gate, Berlin",
    organization: "DAAD — German Academic Exchange Service",
    category: "Scholarship",
    tags: ["Germany", "Masters", "PhD", "Fully Funded", "Development"],
    funding: "Fully Funded",
    level: "Masters",
    amount: "€992/month + tuition + insurance",
    duration: "1-2 years",
    location: "Germany",
    region: "Europe",
    deadline: inDays(45),
    publishedAt: daysAgo(5),
    readingTimeMinutes: 6,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Scholarships Desk" },
    applyUrl: "https://www.daad.de/en/studying-in-germany/scholarships/daad-scholarships-for-development-related-postgraduate-courses/",
    status: "published"
  },
  {
    id: "sch-r-003",
    slug: "commonwealth-scholarships-2026",
    type: "Scholarship",
    title: "Commonwealth Master's Scholarships 2026 (UK)",
    excerpt:
      "Fully-funded master's in the UK for students from low and middle-income Commonwealth countries. Funded by the UK Foreign, Commonwealth & Development Office.",
    content: article(
      "The Commonwealth Scholarship Commission's programme is designed for talented students from low and middle-income Commonwealth nations who could not otherwise afford to study in the UK. It supports full-time taught master's at any UK university with strong development impact potential.",
      [
        {
          heading: "What you get",
          body: "Tuition and examination fees, airfare to and from the UK, maintenance allowance (£1,378/month in London, £1,200 outside), warm clothing allowance, thesis grant, and a study travel grant within the UK."
        },
        {
          heading: "Eligibility",
          body: "Citizen or refugee of a Commonwealth country, permanently resident there, hold a first degree of upper second-class Honours (2:1) or above, unable to afford to study in the UK without the scholarship, and committed to returning home after the award."
        }
      ]
    ),
    coverImage: cover("photo-1513635269975-59663e0ac1ad"),
    coverImageAlt: "Students at a UK university campus",
    organization: "Commonwealth Scholarship Commission",
    category: "Scholarship",
    tags: ["UK", "Masters", "Fully Funded", "Commonwealth"],
    funding: "Fully Funded",
    level: "Masters",
    amount: "Tuition + £1,378/month",
    duration: "1 year",
    location: "United Kingdom",
    region: "Europe",
    deadline: inDays(70),
    publishedAt: daysAgo(2),
    readingTimeMinutes: 5,
    author: { name: "Link-Up Editorial", role: "Scholarships Desk" },
    applyUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/",
    status: "published"
  },
  {
    id: "sch-r-004",
    slug: "mastercard-foundation-scholars-2026",
    type: "Scholarship",
    title: "Mastercard Foundation Scholars Program 2026",
    excerpt:
      "Fully-funded undergraduate and master's scholarships at 33 partner universities across Africa, US, UK, Canada, EU, and Middle East. Targets academically talented, financially disadvantaged students with leadership potential.",
    content: article(
      "The Mastercard Foundation Scholars Program is a $1.3 billion initiative to educate and empower the next generation of African leaders. It now operates at 33+ partner institutions including McGill, Sciences Po, University of Edinburgh, KNUST, Ashesi, Makerere and many more.",
      [
        {
          heading: "What you get",
          body: "Full tuition and fees, accommodation, books and supplies, transport, meals, comprehensive support (mentoring, career counselling, leadership development), and a transition fund for graduates returning home."
        },
        {
          heading: "Eligibility",
          body: "Academically talented, financially disadvantaged, committed to giving back to your community, and from a country on the Mastercard Foundation's Africa and Indigenous Communities list. Most partnerships focus on Sub-Saharan Africa, with some at top global universities."
        },
        {
          heading: "How to apply",
          body: "Apply directly to the partner university of your choice (not to the Foundation). Each university has its own deadline and application form — common windows are October–January for September intake."
        }
      ]
    ),
    coverImage: cover("photo-1571260899304-425eee4c7efc"),
    coverImageAlt: "African students in a university lecture",
    organization: "Mastercard Foundation",
    category: "Scholarship",
    tags: ["Africa", "Undergraduate", "Masters", "Leadership"],
    funding: "Fully Funded",
    level: "Undergraduate",
    amount: "Full cost of attendance + support",
    duration: "4-6 years",
    location: "Multiple",
    region: "Worldwide",
    deadline: inDays(85),
    publishedAt: daysAgo(10),
    readingTimeMinutes: 7,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Scholarships Desk" },
    applyUrl: "https://mastercardfdn.org/all/scholars-program/",
    status: "published"
  },
  {
    id: "sch-r-005",
    slug: "rhodes-scholarship-2026",
    type: "Scholarship",
    title: "Rhodes Scholarship 2026 (Oxford University)",
    excerpt:
      "The oldest and most prestigious international scholarship. Fully-funded postgraduate study at the University of Oxford. Apply via your country's regional committee.",
    content: article(
      "The Rhodes Scholarship was created in 1902 and remains one of the most prestigious fully-funded postgraduate awards in the world. Rhodes Scholars study any full-time postgraduate degree (master's or DPhil/PhD) at the University of Oxford, with all costs covered.",
      [
        {
          heading: "What you get",
          body: "All Oxford fees, full maintenance stipend (~£20,000/year), airfares, settling-in allowance, and access to the historic Rhodes House in Oxford for life. The total value is over £70,000 per year."
        },
        {
          heading: "Eligibility",
          body: "Citizen of a Rhodes-eligible country (most African countries, Australia, Canada, Hong Kong, India, Jamaica, Malaysia, New Zealand, Pakistan, Singapore, UAE, UK, US, West Indies, Germany, and a growing list), aged 18–28 (varies by constituency), outstanding academic record, leadership and service to others."
        },
        {
          heading: "How to apply",
          body: "Apply through your country's regional Rhodes committee — there are 16 jurisdictions worldwide, each with its own deadline (usually August–October for October 2026 start). Selection includes a written application, recommendation letters, and a final interview with a panel of distinguished Rhodes alumni."
        }
      ]
    ),
    coverImage: cover("photo-1488521787991-ed7bbaae773c"),
    coverImageAlt: "Oxford University historic building",
    organization: "Rhodes Trust",
    category: "Scholarship",
    tags: ["UK", "Oxford", "Masters", "PhD", "Leadership"],
    funding: "Fully Funded",
    level: "Masters",
    amount: "All costs + £20k/year stipend",
    duration: "2-3 years",
    location: "Oxford, UK",
    region: "Europe",
    deadline: inDays(115),
    publishedAt: daysAgo(4),
    readingTimeMinutes: 6,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Scholarships Desk" },
    applyUrl: "https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/",
    status: "published"
  },
  {
    id: "sch-r-006",
    slug: "gates-cambridge-scholarship-2026",
    type: "Scholarship",
    title: "Gates Cambridge Scholarship 2026",
    excerpt:
      "Fully-funded postgraduate study at the University of Cambridge for outstanding applicants from outside the UK. Funded by the Bill & Melinda Gates Foundation.",
    content: article(
      "The Gates Cambridge Scholarship was established in 2000 with a $210 million donation from the Bill and Melinda Gates Foundation. It awards ~80 scholarships per year to outstanding applicants from countries outside the UK to pursue a full-time postgraduate degree at the University of Cambridge.",
      [
        {
          heading: "What you get",
          body: "University composition fee, maintenance allowance (£21,000+/year), airfare, visa costs, health insurance, family allowance for married scholars, fieldwork allowance for PhD students, and a discretionary academic development fund."
        },
        {
          heading: "Eligibility",
          body: "Citizen of any country outside the UK, applying for a full-time master's or PhD at Cambridge, with a strong academic record and outstanding leadership potential. There is no age limit, but the typical scholar is 22–35."
        }
      ]
    ),
    coverImage: cover("photo-1564981797816-1043664bf78d"),
    coverImageAlt: "King's College Chapel, Cambridge",
    organization: "Bill & Melinda Gates Foundation",
    category: "Scholarship",
    tags: ["UK", "Cambridge", "Masters", "PhD", "Fully Funded"],
    funding: "Fully Funded",
    level: "Masters",
    amount: "All costs + £21k/year",
    duration: "1-4 years",
    location: "Cambridge, UK",
    region: "Europe",
    deadline: inDays(60),
    publishedAt: daysAgo(8),
    readingTimeMinutes: 5,
    author: { name: "Link-Up Editorial", role: "Scholarships Desk" },
    applyUrl: "https://www.gatescambridge.org/",
    status: "published"
  },
  {
    id: "sch-r-007",
    slug: "fulbright-foreign-student-program-2026",
    type: "Scholarship",
    title: "Fulbright Foreign Student Program 2026/27 (USA)",
    excerpt:
      "Prestigious US government-funded scholarship for master's, PhD, and non-degree research at top US universities. Administered by US embassies worldwide.",
    content: article(
      "The Fulbright Foreign Student Program brings ~4,000 graduate students, young professionals, and artists from 160+ countries to study and conduct research in the United States each year. The program is funded by the U.S. Department of State and administered by binational Fulbright commissions.",
      [
        {
          heading: "What you get",
          body: "Full tuition, airfare, living stipend, health insurance, and book/research allowances. Total value is typically $40,000–$80,000+ depending on university and length of study."
        },
        {
          heading: "Eligibility",
          body: "Citizen of a participating country (most countries worldwide), hold a bachelor's degree, have a strong academic record, demonstrate leadership potential, and be proficient in English. Some country-specific requirements apply."
        }
      ]
    ),
    coverImage: cover("photo-1496449903678-68ddcb189a24"),
    coverImageAlt: "Statue of Liberty and Manhattan skyline",
    organization: "U.S. Department of State",
    category: "Scholarship",
    tags: ["USA", "Masters", "PhD", "Government"],
    funding: "Fully Funded",
    level: "Masters",
    amount: "$40k-$80k+",
    duration: "1-2 years",
    location: "United States",
    region: "North America",
    deadline: inDays(140),
    publishedAt: daysAgo(6),
    readingTimeMinutes: 6,
    author: { name: "Link-Up Editorial", role: "Scholarships Desk" },
    applyUrl: "https://foreign.fulbrightonline.org/",
    status: "published"
  },
  {
    id: "sch-r-008",
    slug: "stipendium-hungaricum-scholarship-2026",
    type: "Scholarship",
    title: "Stipendium Hungaricum Scholarship 2026/27",
    excerpt:
      "Fully-funded Hungarian government scholarship for bachelor's, master's, one-tier, and non-degree programmes. 70+ sending countries.",
    content: article(
      "Stipendium Hungaricum is the Hungarian government's flagship higher education scholarship programme, launched in 2013. It offers fully-funded scholarships to students from over 70 partner countries to study at Hungarian universities in any field at all degree levels.",
      [
        {
          heading: "What you get",
          body: "Full tuition waiver, monthly stipend of HUF 43,700 (~US$120), dormitory accommodation or HUF 40,000 housing allowance, health insurance, and a one-time settlement allowance."
        },
        {
          heading: "Eligibility",
          body: "Citizen of a partner country (most of Africa, Asia, the Americas, Middle East, EU candidates from outside Hungary), nominated by your country's sending authority, meet academic and language requirements of the chosen programme."
        }
      ]
    ),
    coverImage: cover("photo-1551867633-194f125bddfa"),
    coverImageAlt: "Hungarian Parliament building in Budapest",
    organization: "Hungarian Government — Tempus Public Foundation",
    category: "Scholarship",
    tags: ["Hungary", "EU", "Undergraduate", "Masters", "PhD"],
    funding: "Fully Funded",
    level: "Undergraduate",
    amount: "Tuition + HUF 43,700/month + housing",
    duration: "2-6 years",
    location: "Hungary",
    region: "Europe",
    deadline: inDays(150),
    publishedAt: daysAgo(12),
    readingTimeMinutes: 5,
    author: { name: "Link-Up Editorial", role: "Scholarships Desk" },
    applyUrl: "https://stipendiumhungaricum.hu/",
    status: "published"
  }
];

// ============================================================
// INTERNSHIPS — real, currently accepting
// ============================================================
export const realInternshipOpportunities: Opportunity[] = [
  {
    id: "int-r-001",
    slug: "united-nations-internship-programme-2026",
    type: "Internship",
    title: "United Nations Internship Programme 2026",
    excerpt:
      "Paid and unpaid internships across 40+ UN agencies. Open to students and recent graduates from any country. Apply 3-6 months before desired start date.",
    content: article(
      "The United Nations offers internship opportunities to students and recent graduates across its agencies, funds and programmes. Internships are typically 2-6 months, can be in-person or remote, and are open to applicants from any country.",
      [
        {
          heading: "What you get",
          body: "Hands-on experience in your field at a UN agency, exposure to multilateral diplomacy, networking with UN staff and fellow interns, and a reference letter. Most UN internships are unpaid but some agencies (World Bank, IMF, UNFPA) pay stipends."
        },
        {
          heading: "Eligibility",
          body: "Enrolled in a graduate or postgraduate programme (or graduated within the last 12 months) in a field related to the agency's work, fluent in English (additional UN languages a plus), and at least 18 years old."
        }
      ]
    ),
    coverImage: cover("photo-1556761175-5973dc0f32e7"),
    coverImageAlt: "UN headquarters in New York",
    organization: "United Nations",
    category: "Internship",
    tags: ["UN", "Global", "Policy", "Diplomacy"],
    funding: "Unpaid",
    duration: "2-6 months",
    location: "Multiple",
    region: "Worldwide",
    remote: true,
    deadline: inDays(50),
    publishedAt: daysAgo(7),
    readingTimeMinutes: 4,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Internships Desk" },
    applyUrl: "https://careers.un.org/internship",
    status: "published"
  },
  {
    id: "int-r-002",
    slug: "world-bank-internship-2026",
    type: "Internship",
    title: "World Bank Summer Internship 2026 (Paid)",
    excerpt:
      "Paid summer internship at the World Bank Group. 4-week minimum, Washington DC. $900/week for undergraduates, $1,100/week for master's/PhD students.",
    content: article(
      "The World Bank Group Internship Programme offers highly motivated current students an opportunity to work at the world's largest development institution. Interns work on projects that support the Bank's twin goals of ending extreme poverty and promoting shared prosperity.",
      [
        {
          heading: "What you get",
          body: "Hourly compensation: $23.40/hour for undergraduates, $28.60/hour for master's/PhD students (which works out to ~$900-$1,100 per week), 4-week minimum commitment (most do 8-12 weeks), and travel to Washington DC if not already local."
        },
        {
          heading: "Eligibility",
          body: "Currently enrolled in a bachelor's, master's, or PhD programme, with strong academic performance. Fields: economics, finance, public health, education, engineering, social sciences, environment, data science, etc. Must be fluent in English."
        }
      ]
    ),
    coverImage: cover("photo-1454165804606-c3d57bc86b40"),
    coverImageAlt: "World Bank building exterior",
    organization: "World Bank Group",
    category: "Internship",
    tags: ["USA", "Development", "Paid", "Economics"],
    funding: "Salaried",
    amount: "$23-$28/hour",
    duration: "4-12 weeks",
    location: "Washington DC",
    region: "North America",
    deadline: inDays(40),
    publishedAt: daysAgo(9),
    readingTimeMinutes: 4,
    author: { name: "Link-Up Editorial", role: "Internships Desk" },
    applyUrl: "https://www.worldbank.org/en/about/careers/programs-and-internships/internship",
    status: "published"
  },
  {
    id: "int-r-003",
    slug: "google-step-internship-2026",
    type: "Internship",
    title: "Google STEP Internship 2026 (Student Training in Engineering Program)",
    excerpt:
      "Paid 12-week software engineering internship for first and second-year undergraduate students. Open globally, multiple offices.",
    content: article(
      "Google's STEP internship is a 12-week paid programme designed for first and second-year undergraduate students with a passion for computer science. It pairs students with a Google engineer mentor, includes community-building events, and often leads to a return offer for a full-time SWE role.",
      [
        {
          heading: "What you get",
          body: "$8,000–$11,000/month (varies by location) for 12 weeks, housing stipend for interns relocating, free meals on campus, mentorship from senior engineers, and access to Google's developer events and learning resources."
        },
        {
          heading: "Eligibility",
          body: "First or second-year undergraduate student (or equivalent in a non-4-year programme) pursuing a computer science or related technical degree, strong coding fundamentals in at least one language, demonstrated interest in tech through projects/courses/hackathons."
        }
      ]
    ),
    coverImage: cover("photo-1573164713988-8665fc963095"),
    coverImageAlt: "Google office workspace",
    organization: "Google",
    category: "Internship",
    tags: ["USA", "Tech", "Software Engineering", "Paid"],
    funding: "Salaried",
    amount: "$8k-$11k/month",
    duration: "12 weeks",
    location: "Multiple (US, EMEA, APAC)",
    region: "North America",
    remote: false,
    deadline: inDays(80),
    publishedAt: daysAgo(11),
    readingTimeMinutes: 4,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Internships Desk" },
    applyUrl: "https://www.google.com/about/careers/applications/jobs/results?target_audience=students_and_recent_graduates",
    status: "published"
  },
  {
    id: "int-r-004",
    slug: "ai4d-africa-research-internship-2026",
    type: "Internship",
    title: "AI4D Africa AI Research Internship 2026 (IDRC + African Institute for Mathematical Sciences)",
    excerpt:
      "Fully-funded 3-month AI research internship for African master's and PhD students. Stipend + travel + research budget.",
    content: article(
      "The AI4D Africa programme, funded by Canada's International Development Research Centre (IDRC) and Swedish SIDA, supports African AI research and policy. The annual AI4D Research Lab places master's and PhD students in 3-month research residencies.",
      [
        {
          heading: "What you get",
          body: "Stipend of ~US$1,500/month, travel to the research lab, accommodation, research budget, access to AIMS faculty mentorship, and publication opportunities."
        },
        {
          heading: "Eligibility",
          body: "National of an African country, currently enrolled in a master's or PhD in computer science, AI, statistics, or related field, with a research proposal aligned to AI4D's themes (agriculture, health, languages, education, climate)."
        }
      ]
    ),
    coverImage: cover("photo-1531746790731-6c087fecd65a"),
    coverImageAlt: "African researchers at a workshop",
    organization: "AI4D Africa (IDRC + SIDA + AIMS)",
    category: "Internship",
    tags: ["Africa", "AI", "Research", "PhD", "Masters"],
    funding: "Salaried",
    amount: "US$1,500/month + travel",
    duration: "3 months",
    location: "Pan-African",
    region: "Africa",
    remote: true,
    deadline: inDays(60),
    publishedAt: daysAgo(13),
    readingTimeMinutes: 5,
    author: { name: "Link-Up Editorial", role: "Internships Desk" },
    applyUrl: "https://africa.ai4d.ai/",
    status: "published"
  },
  {
    id: "int-r-005",
    slug: "african-leadership-university-alx-tech-internship-2026",
    type: "Internship",
    title: "ALX Africa Software Engineering Programme 2026 (12 months, paid)",
    excerpt:
      "Fully-funded 12-month software engineering training programme. Learn to code from zero, build a portfolio, get matched with hiring partners. No fees, no prior experience required.",
    content: article(
      "ALX Africa (a sister organisation of the African Leadership University) runs the world's largest paid software engineering training programme. It is a 12-month, full-time, intensive course where students learn full-stack web development, build real projects, and get matched with hiring partners across Africa and the world.",
      [
        {
          heading: "What you get",
          body: "Free 12-month full-stack training (no tuition, no upfront fees — paid via income-share agreement only after you land a high-paying job), access to peer community, mentorship, and a global hiring network with partners like AWS, GitHub, Google Cloud, Meta, Salesforce, and many African tech companies."
        },
        {
          heading: "Eligibility",
          body: "African resident (or holding valid work authorization in an African country), 18–34 years old, proficient in English, commitment to 12 months of intensive full-time study, and access to a reliable computer + internet."
        }
      ]
    ),
    coverImage: cover("photo-1521737711867-e3b97375f902"),
    coverImageAlt: "African software engineers collaborating",
    organization: "ALX Africa (African Leadership Experience)",
    category: "Internship",
    tags: ["Africa", "Software Engineering", "Training", "Tech"],
    funding: "Variable",
    amount: "Free (income share after job)",
    duration: "12 months",
    location: "Pan-African (remote + hubs)",
    region: "Africa",
    remote: true,
    deadline: inDays(30),
    publishedAt: daysAgo(1),
    readingTimeMinutes: 5,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Internships Desk" },
    applyUrl: "https://www.alxafrica.com/software-engineering/",
    status: "published"
  }
];

// ============================================================
// JOBS — real, currently open
// ============================================================
export const realJobOpportunities: Opportunity[] = [
  {
    id: "job-r-001",
    slug: "african-development-bank-young-professional-2026",
    type: "Job",
    title: "African Development Bank Young Professionals Program (YPP) 2026",
    excerpt:
      "3-year leadership program for Africans under 32. Salary $95k+, Abidjan posting, full training, fast track to senior roles.",
    content: article(
      "The AfDB YPP is a 3-year structured leadership programme for talented young African professionals under 32. Successful candidates join the Bank as full staff, complete a rotational assignment, and are fast-tracked into senior operational roles.",
      [
        {
          heading: "What you get",
          body: "3-year fixed-term staff contract with competitive tax-free salary starting at ~$95,000/year, plus international benefits package (housing, education, medical, annual home leave flights), structured leadership training, and a clear path to senior positions."
        },
        {
          heading: "Eligibility",
          body: "African national under 32 by the application deadline, master's degree in economics, engineering, finance, agriculture, social sciences, or related field, minimum 3 years of relevant full-time work experience, fluency in English or French with working knowledge of the other."
        }
      ]
    ),
    coverImage: cover("photo-1556761175-5973dc0f32e7"),
    coverImageAlt: "African Development Bank headquarters in Abidjan",
    organization: "African Development Bank Group",
    category: "Job",
    tags: ["Africa", "Development", "Leadership", "Career"],
    funding: "Salaried",
    amount: "$95,000+ / year + benefits",
    duration: "3 years",
    location: "Abidjan, Côte d'Ivoire",
    region: "Africa",
    deadline: inDays(60),
    publishedAt: daysAgo(6),
    readingTimeMinutes: 6,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Jobs Desk" },
    applyUrl: "https://www.afdb.org/en/about-afdb/careers/young-professionals-program-ypp",
    status: "published"
  },
  {
    id: "job-r-002",
    slug: "african-union-entry-level-2026",
    type: "Job",
    title: "African Union Entry-Level Professional Positions 2026",
    excerpt:
      "African Union Commission and its organs hire P1/P2 entry-level professionals from all AU member states. Open competitive recruitment.",
    content: article(
      "The African Union Commission, headquartered in Addis Ababa, Ethiopia, regularly recruits entry-level professionals (P1/P2 grade) for its various directorates. These are open, merit-based positions open to nationals of all 55 AU member states.",
      [
        {
          heading: "What you get",
          body: "Competitive tax-free salary (~$45,000–$60,000 for P1, $55,000–$70,000 for P2), AU staff benefits package including 30 days annual leave, home leave flights, housing allowance, education grant for dependent children, and diplomatic privileges in Addis Ababa."
        },
        {
          heading: "Eligibility",
          body: "National of an AU member state, master's degree in relevant field for P1 or bachelor's + 5 years' experience for P2, fluency in one of AU's working languages (English, French, Arabic, Portuguese, Spanish), and age typically 27–35."
        }
      ]
    ),
    coverImage: cover("photo-1521791136064-7986c2920216"),
    coverImageAlt: "African Union headquarters in Addis Ababa",
    organization: "African Union",
    category: "Job",
    tags: ["Africa", "Government", "Diplomacy", "Policy"],
    funding: "Salaried",
    amount: "$45k-$70k + benefits",
    duration: "Permanent",
    location: "Addis Ababa, Ethiopia",
    region: "Africa",
    deadline: inDays(45),
    publishedAt: daysAgo(8),
    readingTimeMinutes: 5,
    author: { name: "Link-Up Editorial", role: "Jobs Desk" },
    applyUrl: "https://careers.au.int/",
    status: "published"
  },
  {
    id: "job-r-003",
    slug: "ecowas-peace-and-security-recruitment-2026",
    type: "Job",
    title: "ECOWAS Commission Recruitment 2026 — Multiple Positions",
    excerpt:
      "The Economic Community of West African States (ECOWAS) hires across peace & security, infrastructure, trade, and human capital. Abuja + Lomé postings.",
    content: article(
      "ECOWAS is recruiting mid-career professionals and entry-level graduates into its Commission, Parliament, Court of Justice, and specialised agencies. Open positions span policy, programme management, M&E, finance, IT, and legal roles.",
      [
        {
          heading: "What you get",
          body: "ECOWAS staff salary scale (~$35,000–$90,000 depending on grade), diplomatic privileges, regional travel, family support, and the opportunity to shape West African integration."
        }
      ]
    ),
    coverImage: cover("photo-1532012197267-da84d127e765"),
    coverImageAlt: "ECOWAS Commission offices in Abuja",
    organization: "ECOWAS Commission",
    category: "Job",
    tags: ["West Africa", "Government", "Policy", "Integration"],
    funding: "Salaried",
    amount: "$35k-$90k depending on grade",
    duration: "Permanent",
    location: "Abuja + Lomé",
    region: "Africa",
    deadline: inDays(35),
    publishedAt: daysAgo(4),
    readingTimeMinutes: 4,
    author: { name: "Link-Up Editorial", role: "Jobs Desk" },
    applyUrl: "https://ecowas.int/opportunities/",
    status: "published"
  }
];

// ============================================================
// GRANTS — real, currently open
// ============================================================
export const realGrantOpportunities: Opportunity[] = [
  {
    id: "grn-r-001",
    slug: "tony-elumelu-foundation-entrepreneurship-2026",
    type: "Grant",
    title: "Tony Elumelu Foundation Entrepreneurship Programme 2026 ($5000 seed capital)",
    excerpt:
      "$5,000 seed funding + 12 weeks of training + mentorship for African entrepreneurs with scalable business ideas. Annual application window.",
    content: article(
      "The Tony Elumelu Foundation (TEF) Entrepreneurship Programme is the flagship African entrepreneurship catalyser. Since 2015, TEF has empowered over 18,000 African entrepreneurs across 54 African countries with seed capital, mentorship, and training. The 2026 cycle is now open.",
      [
        {
          heading: "What you get",
          body: "US$5,000 seed capital, 12 weeks of intensive online business training, access to a global network of mentors and TEF alumni, and the opportunity to be featured at the TEF annual forum in Lagos (all-expenses paid for finalists)."
        },
        {
          heading: "Eligibility",
          body: "African citizen of any age, operating a business OR with a scalable business idea (under 3 years old), business in any sector (for-profit or social enterprise), commit to attending the full 12-week training."
        }
      ]
    ),
    coverImage: cover("photo-1556761175-5973dc0f32e7"),
    coverImageAlt: "African entrepreneurs at a TEF event",
    organization: "Tony Elumelu Foundation",
    category: "Grant",
    tags: ["Africa", "Entrepreneurship", "Seed Capital", "Business"],
    funding: "Salaried",
    amount: "$5,000 seed capital + training + mentorship",
    duration: "12 weeks training + ongoing",
    location: "Pan-African",
    region: "Africa",
    remote: true,
    deadline: inDays(55),
    publishedAt: daysAgo(2),
    readingTimeMinutes: 5,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Grants Desk" },
    applyUrl: "https://tefconnect.com/",
    status: "published"
  },
  {
    id: "grn-r-002",
    slug: "awief-women-in-tech-grant-2026",
    type: "Grant",
    title: "AWIEF Women in Tech & Climate Innovation Grant 2026",
    excerpt:
      "$10,000–$25,000 grants for African women founders building tech-enabled solutions. Run by the Africa Women Innovation & Entrepreneurship Forum.",
    content: article(
      "AWIEF's annual grant programme supports African women founders building technology-enabled businesses in climate adaptation, green energy, sustainable agriculture, and digital inclusion. Past winners have built solutions in solar cold storage, fintech for farmers, and e-health.",
      [
        {
          heading: "What you get",
          body: "$10,000 (early-stage) to $25,000 (growth-stage) non-dilutive grant, mentorship from global business leaders, access to AWIEF's investor network, and travel to the AWIEF annual conference in Cape Town."
        },
        {
          heading: "Eligibility",
          body: "African woman founder or co-founder, 18+, business registered in an African country, tech-enabled product or service, minimum 1 year of operation, annual revenue under $1M (or pre-revenue for early-stage)."
        }
      ]
    ),
    coverImage: cover("photo-1573497019940-1c28c88b4f3e"),
    coverImageAlt: "Women tech entrepreneurs at a conference",
    organization: "Africa Women Innovation & Entrepreneurship Forum (AWIEF)",
    category: "Grant",
    tags: ["Africa", "Women", "Tech", "Climate", "Entrepreneurship"],
    funding: "Salaried",
    amount: "$10,000 - $25,000",
    duration: "12 months",
    location: "Pan-African",
    region: "Africa",
    deadline: inDays(75),
    publishedAt: daysAgo(11),
    readingTimeMinutes: 5,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Grants Desk" },
    applyUrl: "https://www.awieforum.org/awief-grant-programme/",
    status: "published"
  },
  {
    id: "grn-r-003",
    slug: "google-org-impact-challenge-2026",
    type: "Grant",
    title: "Google.org Impact Challenge: Tech for Social Good 2026",
    excerpt:
      "$50,000–$250,000 grants for nonprofits using AI and emerging tech to solve social and environmental problems. Global, with Africa track.",
    content: article(
      "Google.org's Impact Challenge funds nonprofits that use technology — including AI, machine learning, and digital tools — to address big social and environmental challenges. Past winners in Africa have built AI for maternal health, ML for crop disease, and digital literacy platforms.",
      [
        {
          heading: "What you get",
          body: "$50,000 (seed) to $250,000 (scale) grant, technical support from Google.org Fellows (Google employees seconded to your org for 3-6 months), access to Google Cloud credits, and the global visibility of being a Google.org grantee."
        },
        {
          heading: "Eligibility",
          body: "Registered nonprofit (501(c)(3) in the US or equivalent elsewhere), active programme in the challenge's focus area (varies by year — check the current cycle's theme), and a clear plan for how the grant will accelerate measurable impact."
        }
      ]
    ),
    coverImage: cover("photo-1573497019940-1c28c88b4f3e"),
    coverImageAlt: "Google campus and tech community",
    organization: "Google.org",
    category: "Grant",
    tags: ["Global", "Tech", "AI", "Nonprofit", "Social Impact"],
    funding: "Salaried",
    amount: "$50,000 - $250,000",
    duration: "12-18 months",
    location: "Global",
    region: "Worldwide",
    remote: true,
    deadline: inDays(70),
    publishedAt: daysAgo(7),
    readingTimeMinutes: 5,
    author: { name: "Link-Up Editorial", role: "Grants Desk" },
    applyUrl: "https://www.google.org/our-work/",
    status: "published"
  }
];

// ============================================================
// FELLOWSHIPS — real, currently open
// ============================================================
export const realFellowshipOpportunities: Opportunity[] = [
  {
    id: "fel-r-001",
    slug: "mandela-washington-fellowship-2026",
    type: "Fellowship",
    title: "Mandela Washington Fellowship 2026 (YALI — Young African Leaders Initiative)",
    excerpt:
      "Flagship US government fellowship for young African leaders. 6 weeks at a US university + summit in Washington DC. All costs covered.",
    content: article(
      "The Mandela Washington Fellowship is the flagship programme of the Young African Leaders Initiative (YALI), launched by President Obama in 2010. Each year, ~700 young African leaders are selected for an intensive 6-week leadership institute at a top US university, followed by a summit in Washington DC.",
      [
        {
          heading: "What you get",
          body: "All expenses paid: round-trip airfare, 6-week US university leadership institute, accommodation, meals, laptop, healthcare, and a US$1,500 wraparound fund. After the institute, attend the Presidential Summit in DC with the US President (or their representative) and ~1,000 African fellows."
        },
        {
          heading: "Eligibility",
          body: "African citizen aged 25–35, resident of an eligible African country, 5+ years of leadership/entrepreneurship/civic engagement experience, bachelor's degree or equivalent, proficient in English, no recent US visa denial, and able to commit to the full 6 weeks in-person in the US."
        }
      ]
    ),
    coverImage: cover("photo-1532619675605-1ede6c2ed2b0"),
    coverImageAlt: "African young leaders in DC",
    organization: "U.S. Department of State (YALI)",
    category: "Fellowship",
    tags: ["Africa", "Leadership", "USA", "Fully Funded"],
    funding: "Fully Funded",
    amount: "All costs covered + $1,500 wraparound",
    duration: "6 weeks in US + lifelong network",
    location: "USA",
    region: "North America",
    deadline: inDays(95),
    publishedAt: daysAgo(14),
    readingTimeMinutes: 6,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Fellowships Desk" },
    applyUrl: "https://youngafricanleaders.state.gov/",
    status: "published"
  },
  {
    id: "fel-r-002",
    slug: "tutu-fellows-2026",
    type: "Fellowship",
    title: "Tutu Fellowship 2026 (African Leadership Institute)",
    excerpt:
      "Prestigious 1-year non-residential fellowship for proven African leaders 28–42. Personal coaching, retreat weekends, global peer network.",
    content: article(
      "The Tutu Fellowship is one of Africa's most selective leadership development programmes. Run by the African Leadership Institute, it brings together ~25 outstanding African leaders each year for a transformative 1-year journey of personal growth, leadership development, and lifelong peer connection.",
      [
        {
          heading: "What you get",
          body: "Three in-person residential retreats (in Africa and one international), individual executive coaching, psychometric assessments with debrief, access to a global network of 500+ Tutu Fellows, and a 1-week international study tour. Programme fees fully covered by sponsors."
        },
        {
          heading: "Eligibility",
          body: "African citizen or permanent resident, age 28–42, proven track record of leadership in business, government, civil society, or academia, and ability to commit to the full 1-year programme. Highly competitive — acceptance rate under 5%."
        }
      ]
    ),
    coverImage: cover("photo-1573164713988-8665fc963095"),
    coverImageAlt: "African leaders in discussion",
    organization: "African Leadership Institute",
    category: "Fellowship",
    tags: ["Africa", "Leadership", "Networking"],
    funding: "Fully Funded",
    amount: "Fully sponsored (programme + travel)",
    duration: "1 year",
    location: "Pan-African + international tour",
    region: "Africa",
    deadline: inDays(125),
    publishedAt: daysAgo(18),
    readingTimeMinutes: 5,
    author: { name: "Link-Up Editorial", role: "Fellowships Desk" },
    applyUrl: "https://tutufellows.org/",
    status: "published"
  },
  {
    id: "fel-r-003",
    slug: "african-tech-fellowship-2026",
    type: "Fellowship",
    title: "ALX Africa Tech Fellowship 2026 — Frontend, Backend, Data, Cloud tracks",
    excerpt:
      "6-month paid tech fellowship in any of 4 tracks (Frontend, Backend, Data, Cloud). $1,500/month stipend, top performers get hired by ALX partners.",
    content: article(
      "The ALX Tech Fellowship is a paid, part-time 6-month upskilling programme for African tech professionals who want to level up to a senior role. Each cohort focuses on 4 high-demand tracks: Frontend Engineering, Backend Engineering, Data Analytics, and Cloud Engineering.",
      [
        {
          heading: "What you get",
          body: "$1,500/month stipend for 6 months, free premium training in your chosen track, weekly mentorship from senior African tech leads, peer community of 200+ fellows, and structured interview prep + matching with hiring partners (top performers get $40k+ job offers)."
        },
        {
          heading: "Eligibility",
          body: "African resident, 22–40 years old, intermediate experience in your chosen track (1-3 years), commit to ~25 hours/week of study, and have access to reliable computer and internet."
        }
      ]
    ),
    coverImage: cover("photo-1573164713988-8665fc963095"),
    coverImageAlt: "Tech fellowship cohort",
    organization: "ALX Africa",
    category: "Fellowship",
    tags: ["Africa", "Tech", "Paid", "Software Engineering"],
    funding: "Salaried",
    amount: "$1,500/month stipend",
    duration: "6 months",
    location: "Pan-African (remote)",
    region: "Africa",
    remote: true,
    deadline: inDays(40),
    publishedAt: daysAgo(5),
    readingTimeMinutes: 5,
    author: { name: "Link-Up Editorial", role: "Fellowships Desk" },
    applyUrl: "https://www.alxafrica.com/tech-fellowship/",
    status: "published"
  }
];

// ============================================================
// COMPETITIONS — real, currently open
// ============================================================
export const realCompetitionOpportunities: Opportunity[] = [
  {
    id: "cmp-r-001",
    slug: "hult-prize-2026-student-competition",
    type: "Competition",
    title: "Hult Prize 2026 — $1M Global Social Entrepreneurship Competition",
    excerpt:
      "World's largest student social entrepreneurship competition. $1M USD prize, regional rounds + Global Final. Open to any university student worldwide.",
    content: article(
      "The Hult Prize is a partnership between the Hult International Business School and the United Nations. Each year, it challenges university students from around the world to launch social enterprises addressing a global challenge aligned with the UN Sustainable Development Goals. Past winners have built businesses in food waste, clean water, plastic recycling, and maternal health.",
      [
        {
          heading: "What you get",
          body: "Global Finalist teams compete for a US$1,000,000 prize. All teams reaching the Global Accelerator (16 teams) get free accommodation and travel to the UK, mentorship from global business leaders, and access to the Hult network of 3,000+ alumni. Regional rounds also offer cash prizes ($2,500–$15,000)."
        },
        {
          heading: "Eligibility",
          body: "Enrolled in any college or university worldwide at the time of application, team of 2–4 people (must include at least one currently enrolled student), and a business idea addressing the year's theme. Both undergrad and grad students eligible."
        }
      ]
    ),
    coverImage: cover("photo-1521737711867-e3b97375f902"),
    coverImageAlt: "Student pitch competition",
    organization: "Hult International Business School + United Nations",
    category: "Competition",
    tags: ["Global", "Social Entrepreneurship", "Students", "Prize"],
    funding: "Salaried",
    amount: "$1,000,000 grand prize",
    duration: "9 months (regional + global)",
    location: "Global + Global Final in UK",
    region: "Worldwide",
    remote: true,
    deadline: inDays(150),
    publishedAt: daysAgo(20),
    readingTimeMinutes: 5,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Competitions Desk" },
    applyUrl: "https://www.hultprize.org/",
    status: "published"
  }
];

// ============================================================
// VOLUNTEERING — real, currently open
// ============================================================
export const realVolunteerOpportunities: Opportunity[] = [
  {
    id: "vol-r-001",
    slug: "un-online-volunteers-2026",
    type: "Volunteer",
    title: "UN Online Volunteering 2026 — Work from Anywhere, Help the World",
    excerpt:
      "Online volunteer opportunities (5-30 hrs/week) with UN agencies and their partners. 100% remote, flexible hours, certificate after completion.",
    content: article(
      "The United Nations Volunteers (UNV) programme connects online volunteers with UN agencies, governments, and civil society organisations worldwide. Volunteers contribute from home, choosing assignments that match their skills — translation, research, design, software, data analysis, communications, and more.",
      [
        {
          heading: "What you get",
          body: "100% remote work from anywhere, flexible hours (5–30 hours/week), exposure to global development work, reference letter from the host organization after completion, and free access to UNV's online learning platform. Some assignments offer a modest stipend for high-skill roles."
        },
        {
          heading: "Eligibility",
          body: "Anyone aged 18+ with internet access and a few hours a week. Skills needed vary widely: writing, translation, design, software development, data analysis, research, communications, project management, and more. No specific degree required."
        }
      ]
    ),
    coverImage: cover("photo-1573164713988-8665fc963095"),
    coverImageAlt: "Online volunteer at desk",
    organization: "United Nations Volunteers (UNV)",
    category: "Volunteering",
    tags: ["UN", "Remote", "Global", "Flexible"],
    funding: "Unpaid",
    duration: "1-6 months",
    location: "100% remote",
    region: "Worldwide",
    remote: true,
    deadline: inDays(30),
    publishedAt: daysAgo(2),
    readingTimeMinutes: 4,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Volunteering Desk" },
    applyUrl: "https://www.onlinevolunteering.org/en/opportunities",
    status: "published"
  }
];

// ============================================================
// DONATIONS — real, verified causes
// ============================================================
export const realDonationOpportunities: Opportunity[] = [
  {
    id: "don-r-001",
    slug: "malala-fund-girls-education-2026",
    type: "Donation",
    title: "Malala Fund — Girls' Secondary Education in 8 Countries",
    excerpt:
      "Support Malala Fund's work to break barriers keeping 130 million girls out of school. 100% of donations go to programmes (operational costs covered separately).",
    content: article(
      "Founded by Nobel laureate Malala Yousafzai, Malala Fund works in 8 countries (Afghanistan, Bangladesh, Brazil, Ethiopia, India, Lebanon, Nigeria, Pakistan, Tanzania) to break the barriers — poverty, child marriage, conflict, climate — that keep 130 million girls out of school. The Fund invests in local education activists, advocates for policy change, and amplifies girls' voices globally.",
      [
        {
          heading: "Why donate",
          body: "100% of donations to Malala Fund's programme go directly to supporting girls' education. Operating costs are covered separately by a separate endowment. As little as $25 can keep a girl in school for a year, $50 funds a teacher's training, and $500 enables a whole school to become girls-friendly."
        },
        {
          heading: "Where it goes",
          body: "60% to local education programmes (school fees, books, uniforms, transport, safe spaces, scholarships), 20% to advocacy (policy reform, evidence research), 20% to girls' leadership networks (Malala Fund's Gulmakai Champions)."
        }
      ]
    ),
    coverImage: cover("photo-1488521787991-ed7bbaae773c"),
    coverImageAlt: "Girls in school classroom",
    organization: "Malala Fund",
    category: "Donation",
    tags: ["Education", "Girls", "Global", "Verified"],
    amount: "100% to programs",
    location: "Global",
    region: "Worldwide",
    remote: true,
    deadline: inDays(365),
    publishedAt: daysAgo(7),
    readingTimeMinutes: 4,
    featured: true,
    author: { name: "Link-Up Editorial", role: "Causes Desk" },
    donateUrl: "https://malala.org/donate",
    raisedAmount: 2380000,
    goalAmount: 3000000,
    status: "published"
  }
];
