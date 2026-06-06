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

export const internshipOpportunities: Opportunity[] = [
  {
    id: "int-001",
    slug: "google-step-internship-2026",
    type: "Internship",
    title: "Google STEP Internship 2026 \u2014 First & Second-Year Students",
    excerpt:
      "Google's Student Training in Engineering Program offers a paid 12-week summer internship for first and second-year computer science students.",
    content: article(
      "Google STEP is designed for students early in their CS journey \u2014 you do not need senior-level experience or a polished portfolio. STEP interns work in pairs on a real Google project with full mentorship, and many convert to a full software engineering internship the following year.",
      [
        {
          heading: "What you get",
          body:
            "Competitive salary (varies by location), accommodation or housing stipend, return flights, swag and full access to Google's mentorship and learning platforms. STEP interns work from Google offices across Europe, the US and Africa."
        },
        {
          heading: "Eligibility",
          body:
            "You must be in your first or second year of a Bachelor's degree in Computer Science (or a closely-related field) at the time of application. Some coding experience required \u2014 you should be comfortable with at least one programming language."
        },
        {
          heading: "How to stand out",
          body:
            "Polish one focused project on GitHub, not five half-done ones. Participate in coding competitions (Codeforces, LeetCode contests, local hackathons). Write a CV that emphasises projects over coursework. Practise behavioural interviews \u2014 Google weights them heavily."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "Software engineers collaborating at a laptop",
    organization: "Google",
    category: "Tech",
    tags: ["Tech", "Software", "Paid"],
    funding: "Salaried",
    amount: "Competitive salary + housing",
    duration: "12 weeks",
    location: "Multiple",
    region: "Worldwide",
    deadline: inDays(48),
    publishedAt: daysAgo(3),
    readingTimeMinutes: 6,
    featured: true,
    views: 5240,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://buildyourfuture.withgoogle.com/programs/step",
    status: "published"
  },
  {
    id: "int-002",
    slug: "un-volunteers-online-2026",
    type: "Internship",
    title: "UN Online Volunteer Internships \u2014 Remote, Global Impact",
    excerpt:
      "Volunteer remotely with UN agencies on real projects. Build international experience from your laptop, on your schedule.",
    content: article(
      "The UN Online Volunteering service connects skilled volunteers with UN agencies, NGOs and government partners working towards the Sustainable Development Goals. You contribute 3-15 hours per week, fully remote, to a project that needs your skills.",
      [
        {
          heading: "What you can do",
          body:
            "Translation, writing, web development, graphic design, research, data analysis, social media, video editing, programme management \u2014 if it can be done on a laptop, UN partners likely need it. You browse open assignments and apply to ones that match your skills."
        },
        {
          heading: "What you get",
          body:
            "No monetary stipend (this is volunteer work), but you receive an official UN Online Volunteer certificate on completion, your contributions are publicly listed on your profile, and the experience is hugely respected on graduate school and job applications."
        },
        {
          heading: "Eligibility",
          body:
            "You must be at least 18, have reliable internet, and be willing to commit to your chosen assignment for its full duration. Skills are weighted higher than degrees \u2014 student, employed or unemployed, you can apply."
        }
      ]
    ),
    coverImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80&auto=format&fit=crop",
    coverImageAlt: "Person working remotely on a laptop",
    organization: "United Nations Volunteers",
    category: "Development",
    tags: ["Remote", "UN", "Global", "Flexible"],
    funding: "Unpaid",
    amount: "Volunteer (certificate + experience)",
    duration: "Flexible (1-12 months)",
    location: "Remote",
    region: "Remote",
    remote: true,
    deadline: inDays(365),
    publishedAt: daysAgo(12),
    readingTimeMinutes: 5,
    views: 1834,
    author: { name: "Link-Up Editorial", role: "Opportunity Desk" },
    applyUrl: "https://www.onlinevolunteering.org/",
    status: "published"
  }
];
