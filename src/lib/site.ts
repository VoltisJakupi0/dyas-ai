export function hrefProps(href: string) {
  if (/^https?:\/\//i.test(href)) {
    return { href, target: "_blank" as const, rel: "noopener noreferrer" };
  }
  return { href };
}

export const site = {
  name: "Dyas AI",
  url: "https://www.dyas.ai",
  title: "Software Development | AI Agency Services - Dyas AI",
  description:
    "Discover innovative digital solutions with our AI agency, designed to improve efficiency and drive real results for your team.",
  email: "info@dyas.ai",
  address: "London, United Kingdom",
  ctaHref: "https://calendly.com/dyas-info/30min",
  ctaLabel: "Schedule a Call",
  social: {
    instagram: "https://www.instagram.com/dyas.ai/",
    x: "https://x.com/dyas_ai",
    linkedin: "https://www.linkedin.com/company/dyas-ai",
  },
};

export const services = [
  {
    slug: "ai-powered-solutions",
    title: "AI-Powered Solutions",
    href: "/service/ai-powered-solutions",
    icon: "flow" as const,
    short:
      "Streamline workflows, enhance interactions, and turn data into insights. Dyas AI automates repetitive tasks so your team can focus on higher-value work.",
    ticker: "AI-POWERED SOLUTIONS",
  },
  {
    slug: "ai-agents",
    title: "AI Agents",
    href: "/service/ai-agents",
    icon: "bot" as const,
    short:
      "Smart AI agents capable of performing tasks, managing workflows, and adapting to your business logic across platforms in real time.",
    ticker: "AI AGENTS",
  },
  {
    slug: "ai-chatbots",
    title: "AI Chatbots",
    href: "/service/ai-chatbots",
    icon: "chat" as const,
    short:
      "Conversational AI built to engage, support, and convert—our chatbots handle inquiries, automate workflows, and elevate your customer experience across platforms.",
    ticker: "AI CHATBOTS",
  },
  {
    slug: "web-mobile-app-development",
    title: "Web & Mobile App Development",
    href: "/service/web-mobile-app-development",
    icon: "device" as const,
    short: "From startup MVPs to complex platforms — we design and build apps that are fast and ready to grow.",
    ticker: "WEB & MOBILE APPS",
  },
  {
    slug: "e-commerce-development",
    title: "E-Commerce Development",
    href: "/service/e-commerce-development",
    icon: "cart" as const,
    short:
      "Launch or scale your online store with modern, conversion-driven e-commerce solutions tailored for seamless shopping and business growth.",
    ticker: "E-COMMERCE",
  },
  {
    slug: "ui-ux-services",
    title: "UI / UX Services",
    href: "/service/ui-ux-services",
    icon: "pen" as const,
    short:
      "User-focused design that blends beauty with functionality—crafting experiences that engage, convert, and retain your audience effortlessly.",
    ticker: "UI / UX",
  },
];

export const nav = {
  links: [
    { label: "Services", href: "/services", menu: "services" as const },
    { label: "Pricing Plans", href: "/pricing-plans" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  services: services.map((s) => ({ label: s.title, href: s.href })),
};

export const hero = {
  headline: "AI-Powered Solutions, Built for Results.",
  body: "From AI Agents to custom apps, we deliver scalable solutions with real ROI.",
  cta: "View Work",
  ctaHref: "#work",
  ticker: services.map((s) => s.ticker),
  intel: {
    label: "AGENT OPERATIONS",
    value: "24/7",
    caption: "Coverage across web, chat, and internal workflows",
  },
};

export const logos = {
  label: "Trusted by teams shipping production AI",
  items: [
    { src: "/logos/albinfo-2.png", alt: "albinfo.ch", scale: 2.4, native: true },
    { src: "/logos/think-b.png", alt: "Think B Agency", scale: 1.35 },
    { src: "/logos/eptura.png", alt: "Eptura", scale: 3, native: true },
    { src: "/logos/novartis-2.png", alt: "Novartis", scale: 1.45 },
    { src: "/logos/bankstreet.png", alt: "bankstreet", scale: 1.7 },
  ],
};

export const work = {
  heading: "Recent work",
  cases: [
    {
      name: "AI Voice Receptionist Agent",
      body: "A human-like voice assistant that answers phone calls, qualifies callers, books appointments, and routes calls intelligently. Works with phone systems, calendars, and CRMs. Call the number below for a quick demo to see how our voice AI agent works: +1 218 579 3842",
      industry: "Voice AI",
      tags: ["CRM Integration", "Scheduling"],
      stats: [
        { label: "Coverage", value: "24", unit: "/7" },
        { label: "Missed-call rate", value: "0" },
        { label: "Core integrations", value: "3" },
      ],
      images: ["/images/work/ai2-voice-robot.jpg", "/images/work/ai-voice-02.jpg", "/images/work/ai2-voice-obj.jpg"],
    },
    {
      name: "AI Sales & Lead Qualification Agent",
      body: "Automates lead capture, qualification, and follow-ups across web, WhatsApp, and CRM platforms. Streamlines your sales pipeline with intelligent lead scoring.",
      industry: "Sales Automation",
      tags: ["Multi-Channel", "Lead Scoring"],
      stats: [
        { label: "Capture channels", value: "3" },
        { label: "Follow-up lag", value: "0" },
        { label: "Pipeline coverage", value: "24", unit: "/7" },
      ],
      images: ["/images/work/ai2-sales-robot.jpg", "/images/work/ai-sales-03.jpg", "/images/work/ai2-sales-obj.jpg"],
    },
    {
      name: "E-Commerce Support Agent",
      body: "Handles product inquiries, order tracking, returns, and customer support 24/7. Provides instant, accurate responses to customer questions and reduces support workload.",
      industry: "24/7 Support",
      tags: ["Order Tracking", "Customer Service"],
      stats: [
        { label: "Support hours", value: "24", unit: "/7" },
        { label: "First response", value: "<1", unit: "min" },
        { label: "Tickets deflected", value: "60", unit: "%" },
      ],
      images: ["/images/work/ai2-commerce-robot.jpg", "/images/work/ai-commerce-03.jpg", "/images/work/ai2-commerce-obj.jpg"],
    },
    {
      name: "Appointment & Booking Agent",
      body: "Automates scheduling, reminders, and confirmations for clinics, services, and consultations. Reduces no-shows and manages your calendar efficiently.",
      industry: "Scheduling",
      tags: ["Reminders", "Calendar Sync"],
      stats: [
        { label: "Fewer no-shows", value: "40", unit: "%" },
        { label: "Reminders", value: "Auto" },
        { label: "Calendar sync", value: "Live" },
      ],
      images: ["/images/work/ai2-booking-robot.jpg", "/images/work/ai-booking-02.jpg", "/images/work/ai2-booking-obj.jpg"],
    },
  ],
};

export const problem = {
  headline: "Driving your future growth with AI solutions",
  body: "We combine automation, agents, and product thinking to build systems that carry real work — not demos that look clever and then sit unused.",
  cards: [
    {
      tone: "white" as const,
      eyebrow: "Automate",
      title: "Put the repetitive work on autopilot",
      body: "Most teams lose hours every week to data entry, chasing follow-ups, and copying information between tools. We map the work you actually do, then automate the parts that never needed a person.",
      points: ["Manual data entry handled end to end", "Follow-ups that send themselves", "One source of truth across your tools"],
      cta: "Explore AI automation",
      ctaHref: "/service/ai-powered-solutions",
    },
    {
      tone: "black" as const,
      eyebrow: "Delegate",
      title: "Give every workflow an agent that owns it",
      body: "An agent is only useful if it knows your business. We build them around your rules, your systems, and your tone of voice, so they qualify, book, reconcile, and reply without supervision.",
      points: ["Agents that work inside your stack", "Chatbots that resolve, not deflect", "Escalation to a human when it matters"],
      cta: "Meet the agents",
      ctaHref: "/service/ai-agents",
    },
    {
      tone: "brand" as const,
      eyebrow: "Measure",
      title: "Build around outcomes, not output",
      body: "Every engagement starts from a number you want to move — response time, missed calls, conversion, cost per ticket. We ship the smallest thing that moves it, then keep going from there.",
      points: ["Scoped against a metric you already track", "Live in weeks, not quarters", "Reporting you can hand to your board"],
      cta: "See how we work",
      ctaHref: "/services",
    },
  ],
};

export const embed = {
  kicker: "Creating Solutions That Are Bold And Up With All Times!",
  headline: "Empowering the Future of Work with AI Innovation",
  body: "At Dyas AI, we craft digital experiences that streamline operations and elevate creative potential. By combining smart automation, data insights, and visual excellence, we enable modern teams to work faster, smarter, and more impactfully, no matter where they are in the world.",
  pillars: [
    {
      title: "Smart Build & Deploy",
      body: "From websites to scalable applications, we craft tailored platforms with speed, performance, and user experience at the core.",
    },
    {
      title: "AI Integration & Automation",
      body: "We go beyond traditional development by embedding intelligent workflows, smart chatbots, and AI agents that simplify operations and save time.",
    },
    {
      title: "Visual-Driven UX & Interfaces",
      body: "Design isn't just aesthetics, it's interaction. We design intuitive, high-converting interfaces that feel as smart as they look.",
    },
    {
      title: "Automated, Adaptive, Effective",
      body: "Whether it's a chatbot, agent, or web app, our solutions evolve with your needs reducing manual effort and maximizing results.",
    },
  ],
};

export const stats = {
  headline: "Empowering the Future of Work with AI Innovation",
  items: [
    {
      value: "60",
      suffix: "%",
      title: "Less manual workflow time",
      label: "Reported after AI automation went live with client teams",
    },
    {
      value: "24",
      suffix: "/7",
      title: "Agent and chatbot coverage",
      label: "Across web, chat, and internal operations",
    },
    {
      value: "6",
      suffix: "",
      title: "Services from agents to storefronts",
      label: "AI, apps, commerce, and design under one team",
    },
  ],
};

export const orbit = {
  kicker: "The problem",
  headline: "Teams still lose hours every week to data entry, scheduling, reporting, and support.",
  body: "The bottleneck isn't the model. It's the last mile — getting an agent live in the tools you already run, so that work actually leaves the week.",
  artifacts: [
    {
      kind: "call" as const,
      eyebrow: "Missed call",
      title: "Withheld · asked for pricing",
      meta: "Voicemail · 14:22",
    },
    {
      kind: "mail" as const,
      eyebrow: "Unread thread",
      title: "FW: Updated contract",
      meta: "Helix Group · 4 days",
    },
  ],
};

export const platform = {
  headline: "From Vision to Execution — Our Services",
  cta: "Explore Our Services",
  ctaHref: "/services",
  slides: services.map((s) => ({ title: s.title, body: s.short, href: s.href })),
};

export const banner = {
  headline: "Get custom solutions for your business that help you leverage AI and Automation for the processes.",
  cta: "Schedule a Call",
  ctaHref: "https://calendly.com/dyas-info/30min",
};

export const testimonials = {
  headline: "What Our Clients Say About Working With Us!",
  wallHeadline: "Proof that automation pays for itself.",
  caption:
    "Real stories from our clients showcase the impact of our solutions, building trust and credibility through authentic experiences.",
  items: [
    {
      pull: "Our client communication is streamlined and response times dropped dramatically.",
      quote:
        "The AI receptionist developed by Dyas AI has streamlined our client communication and improved response times dramatically. It integrates seamlessly with our systems, saving our team valuable time while enhancing customer satisfaction. A true step forward in modernizing our operations.",
      name: "Janine Mehmeti",
      role: "Founder",
      company: "Think B Agency",
    },
    {
      pull: "They rebuilt our digital presence and put AI inside our concierge workflow.",
      quote:
        "Dyas AI transformed our digital presence from the ground up. Not only did they deliver a sleek, user-friendly website and app tailored to our luxury clientele, but they also helped us scale with intelligent automation by integrating AI into our concierge workflow.",
      name: "Mark Morcos",
      role: "Managing Director",
      company: "Maverick Concierge",
    },
    {
      pull: "We cut manual workflows by 60%. It's a second team working in the background.",
      quote:
        "Thanks to the AI automation system, we cut down our manual workflows by 60%. It's like having a second team working silently in the background.",
      name: "Elena Vukovic",
      role: "Operations Lead",
      company: "Helix Group",
    },
    {
      pull: "They turned complex needs into scalable systems, and delivered flawlessly.",
      quote:
        "We entrusted them with the development of our platform and automation systems, and they delivered flawlessly. Their ability to translate complex needs into scalable solutions was remarkable.",
      name: "Arber Marniku",
      role: "Owner",
      company: "Gala Design CH",
    },
  ],
};

export const integrations = {
  headline: "Connect the models, data, and systems you already run",
  sub: "Nothing gets ripped out. Agents plug into the models you trust, the warehouses your data already lives in, and the tools your team opens every morning.",
  stat: { value: 24, suffix: "/7", label: "Coverage across web, chat, and internal workflows" },
  categories: [
    {
      label: "Models",
      body: "Route each task to the model that handles it best, and swap providers without rewriting the workflow.",
      logos: [
        { src: "/logos/int/openai.svg", alt: "OpenAI" },
        { src: "/logos/int/anthropic.svg", alt: "Anthropic" },
        { src: "/logos/int/gemini.svg", alt: "Gemini" },
        { src: "/logos/int/xai.svg", alt: "xAI" },
        { src: "/logos/int/azure-ai.svg", alt: "Azure AI" },
        { src: "/logos/int/bedrock.svg", alt: "Amazon Bedrock" },
      ],
    },
    {
      label: "Data",
      body: "Agents read from the warehouse you already report on, so answers match the numbers your team trusts.",
      logos: [
        { src: "/logos/int/snowflake.svg", alt: "Snowflake" },
        { src: "/logos/int/databricks.svg", alt: "Databricks" },
        { src: "/logos/int/bigquery.svg", alt: "BigQuery" },
        { src: "/logos/int/redshift.svg", alt: "Redshift" },
        { src: "/logos/int/postgres.svg", alt: "Postgres" },
      ],
    },
    {
      label: "Enterprise",
      body: "Write back into the systems of record — ERP, HR, and intranet — with the permissions your IT team sets.",
      logos: [
        { src: "/logos/int/sap.svg", alt: "SAP" },
        { src: "/logos/int/workday.svg", alt: "Workday" },
        { src: "/logos/int/oracle.svg", alt: "Oracle" },
        { src: "/logos/int/sharepoint.svg", alt: "SharePoint" },
        { src: "/logos/int/infor.svg", alt: "Infor" },
      ],
    },
    {
      label: "Files & cloud",
      body: "Contracts, PDFs, and shared drives become searchable context instead of folders nobody opens.",
      logos: [
        { src: "/logos/int/box.svg", alt: "Box" },
        { src: "/logos/int/dropbox.svg", alt: "Dropbox" },
        { src: "/logos/int/gcloud.svg", alt: "Google Cloud" },
        { src: "/logos/int/ibm.svg", alt: "IBM" },
      ],
    },
  ],
};

export const cta = {
  headline: "Built to Automate. Designed to Scale.",
  sub: "Tell us what your team spends its week on, and what you would rather it stopped spending its week on. We reply within one working day.",
  button: "Schedule a Call",
};

export const footer = {
  tagline: "Built to Automate. Designed to Scale.",
  newsletter: "Subscribe to our newsletter and receive the latest news on products, services & more.",
  privacyNote: "By subscribing, you accept the Privacy Policy",
  columns: [
    {
      title: "Menu",
      links: [
        { label: "Services", href: "/services" },
        { label: "Pricing Plans", href: "/pricing-plans" },
        { label: "About Us", href: "/about-us" },
        { label: "Contact Us", href: "/contact-us" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Careers", href: "/career" },
        { label: "Blogs", href: "/blog" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: site.address, href: "/contact-us" },
        { label: site.email, href: `mailto:${site.email}` },
      ],
    },
  ],
  copyright: "©2025 Powered by Dyas AI",
};

export const pages = {
  services: {
    title: "AI Services | AI Agents, AI Chatbots, Web & Mobile Development - Dyas AI",
    description:
      "Transform your business with our AI services. We specialize in creating customized solutions for your unique needs.",
    heading: "Our Services",
    breadcrumb: ["Home", "Services"],
  },
  pricing: {
    title: "AI Pricing Plans | Flexible & Transparent Options - Dyas AI",
    description:
      "Discover flexible AI service pricing plans tailored to your business size and goals. Transparent, scalable options.",
    heading: "Pricing Plans",
    breadcrumb: ["Home", "Pricing Plans"],
    save: "Save 30%",
    note: "Click the button and contact us — we'll guide you through the best plan for your needs.",
    faqKicker: "We're here to answer all your questions",
    faqSub: "Helpful Info Before You Choose a Plan",
    plans: [
      {
        name: "Project-Based",
        body: "Get a complete AI automation or custom app, delivered and handed over to your team.",
        items: [
          "Full implementation of the requested service",
          "Structured Agile process with clear milestones",
          "Tested, reviewed, and delivered — ready to use",
          "Training sessions",
          "Documentation and handover included",
        ],
        cta: "Start My Project",
      },
      {
        name: "Project + Maintenance",
        body: "Launch your AI solution with peace of mind—ongoing monitoring, updates, and improvements included.",
        items: [
          "Everything in Project Build",
          "Monthly monitoring & optimizations",
          "Light updates, performance checks, and bug fixes",
          "Priority access to our support team",
          "Scheduled health reviews to ensure system reliability",
        ],
        cta: "Start with Maintenance",
      },
      {
        name: "Enterprise Partnership",
        body: "For businesses that can't afford downtime—24/7 support, scaling, and enterprise-level reliability.",
        items: [
          "Everything in Project + Maintenance",
          "Dedicated project & success manager",
          "Quarterly strategic planning sessions",
          "Continuous optimization & performance scaling",
          "24/7 support",
        ],
        cta: "Schedule a call",
      },
    ],
    faqs: [
      {
        q: "Can I upgrade my plan later?",
        a: "Yes, absolutely. You can start with any plan and upgrade at any time as your business needs grow.",
      },
      {
        q: "Do you offer one-time services without ongoing maintenance?",
        a: "Yes. Our Basic Plan is designed for one-time delivery with no monthly commitments.",
      },
      {
        q: "Can I schedule a call before choosing a plan?",
        a: "Of course. We'd love to understand your needs and help you choose the right fit. Just contact us to book a discovery call.",
      },
      {
        q: "Why don't you list plan prices upfront?",
        a: "Every project is different — from startups to enterprise-level builds. We price based on the value we deliver, not on a fixed template. After understanding your objectives, we provide a plan and proposal designed specifically for your growth.",
      },
    ],
  },
  about: {
    title: "About Us | Leading AI Innovation & Expert Team - Dyas AI",
    description:
      "Learn about our mission to drive innovation with AI, our team of experts, and our commitment to delivering results.",
    breadcrumb: ["Home", "About Us"],
    eyebrow: "Write, explore, and brainstorm unique ideas!",
    sub: "From sleek websites to smart AI integrations — we design your digital future.",
    headline: "Not Just Software. Smart Growth.",
    paragraphs: [
      "Dyas AI is a software company headquartered in London, with a distributed team across Europe. We began by building simple websites — and quickly evolved into a powerhouse for developing intelligent web and mobile applications.",
      "Today, our core focus is developing cutting-edge AI solutions and providing AI-powered services. From tailored digital products and chatbot systems to fully automated workflows and intelligent agents, we help businesses scale by transforming their customer experiences and operational efficiency through artificial intelligence.",
    ],
    nameHeadline: "What's in a name? For us — everything.",
    nameBody:
      'DYAS started as an idea: "Do Your AI Software/Service." But it evolved into something bigger. DYAS now stands for adaptability, innovation, collaboration a name that means building smarter, scaling faster, and thinking beyond the limits of traditional software. It\'s more than a name, it\'s a mindset.',
    nameNote: "Curious about what we do? Tap the button to discover all our services.",
  },
  contact: {
    title: "Contact Us | Get in Touch Today - Dyas AI",
    description:
      "Contact our AI experts today to discuss your business needs and discover the right AI solutions for you.",
    breadcrumb: ["Home", "Contact Us"],
    eyebrow: "We're here to answer all your questions",
    headline: "Join the Innovation Journey With Us",
    body: "Have a project in mind or curious about how we can help? Whether it's AI integration, digital transformation, or custom-built solutions — we're here to listen and deliver. Our team of experts will assess your needs and tailor a solution that's both strategic and scalable.",
    formHeadline: "Connect With Us",
    formBody: "Just fill out the form and our team will contact you shortly!",
    formCta: "Submit Request",
  },
  career: {
    title: "Career Archive - Dyas AI",
    description: "Open roles at Dyas AI. Join a London-based team building AI agents, apps, and automation.",
    breadcrumb: ["Home", "Career"],
    heading: "Career",
    jobs: [
      {
        slug: "ui-ux-designer",
        title: "UI & UX Designer",
        body: "Are you passionate about creating intuitive, beautiful, and user-friendly digital experiences? At Dyas AI, we're building intelligent web and mobile applications powered by the latest AI technologies — and we're looking for a UI/UX Designer to join our growing team.",
      },
    ],
  },
  blog: {
    title: "AI Blog | Insights & Trends in AI & Automation - Dyas AI",
    description:
      "Read insights, news, and tips on AI technology, automation, and business innovation from our expert blog.",
    breadcrumb: ["Home", "Our Blog"],
    heading: "Our Blog",
    posts: [
      {
        slug: "ai-agents-for-business",
        title: "AI Agents for Business: How AI Chatbots, Voice Agents, and Automation Are Transforming Companies",
        date: "February 16, 2026",
        tags: ["AI automation solutions", "AI chatbot development", "AI consulting services", "AI services company"],
        excerpt:
          "How AI chatbots, voice agents, and automation are transforming companies — from inbox to CRM.",
      },
      {
        slug: "innovating-with-generative-ai",
        title: "Innovating with generative AI to better understand the community needs securely and effectively!",
        date: "February 15, 2025",
        tags: [] as string[],
        excerpt:
          "Understanding of the experience of people around the country is used to address the evolving needs, and ensure communities' priorities shape the decisions",
      },
    ],
  },
};

export const routes = [
  "/",
  "/services",
  ...services.map((s) => s.href),
  "/pricing-plans",
  "/about-us",
  "/contact-us",
  "/career",
  "/blog",
  ...pages.blog.posts.map((p) => `/blog/${p.slug}`),
  ...pages.career.jobs.map((j) => `/career/${j.slug}`),
];
