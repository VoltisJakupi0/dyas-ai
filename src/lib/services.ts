export type ServicePage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string[];
  heroHeadline: string;
  heroBody: string;
  sectionHeadline: string;
  body: string[];
  approachTitle?: string;
  approach?: string[];
  offerTitle?: string;
  offers?: { title: string; body: string }[];
  faqKicker: string;
  faqSub: string;
  faqs: { q: string; a: string }[];
  faqCta: string;
  bannerHeadline: string;
  bannerSub: string;
  pillars: { title: string; body: string }[];
};

const shared = {
  heroHeadline: "Step Into the Future of AI.",
  heroBody:
    "It's time to move beyond traditional systems. Discover how AI integration transforms workflows, enhances interactions, and unlocks real business growth.",
  faqKicker: "We're here to answer all your questions!",
  faqCta: "Still Need Help? Contact Us Now",
};

export const servicePages: ServicePage[] = [
  {
    slug: "ai-powered-solutions",
    title: "AI-Powered Solutions",
    metaTitle: "AI-Powered Solutions to Transform Workflows - Dyas AI",
    metaDescription:
      "Revolutionize your workflow with AI-powered solutions that drive efficiency, enhance engagement, and unlock valuable insights.",
    breadcrumb: ["Home", "Service", "AI-Powered Solutions"],
    ...shared,
    sectionHeadline: "AI Solutions for Real-World Challenges",
    body: [
      "In today's fast-moving world, many businesses are held back by inefficiencies. Teams waste hours on repetitive tasks like manual data entry, scheduling, reporting, and customer support. These bottlenecks slow growth, increase costs, and leave staff burned out instead of focused on innovation.",
    ],
    approachTitle: "Our Approach",
    approach: [
      "At Dyas AI we replace repetitive work with AI-powered automation. Our solutions are designed to:",
      "Streamline workflows – reduce time and costs by cutting out manual processes.",
      "Enhance interactions – create smarter, faster customer engagement through AI-driven support.",
      "Unlock insights – transform raw data into intelligence that drives better decisions.",
    ],
    offerTitle: "What We Offer",
    offers: [
      {
        title: "Workflow Automation",
        body: "Eliminate repetitive tasks across departments with smart automation. From approvals and reporting to compliance checks and document handling, we help teams save time, reduce costs, and focus on higher-value work.",
      },
      {
        title: "AI for Customer & Team Engagement",
        body: "Deploy AI chatbots and assistants tailored to your needs, for customer support, or internally to help staff access knowledge, streamline communication, and cut operational costs. Built on secure APIs, these solutions adapt to your unique workflows.",
      },
      {
        title: "Data Intelligence & Analytics",
        body: "Every solution we offer comes with tracking and monitoring at its core. Gain real-time visibility into your operations, measure performance, and turn raw data into actionable insights that drive smarter decisions.",
      },
    ],
    faqSub: "Everything you need to know about AI-powered solutions.",
    faqs: [
      {
        q: "Is my business suitable for AI automation?",
        a: "If manual processes are slowing your team down, Dyas AI can help. Our solutions are designed for organizations of any size seeking to optimize workflows, reduce costs, and enhance overall efficiency.",
      },
      {
        q: "Which processes can be automated?",
        a: "Our AI-powered solutions streamline repetitive or manual workflows, such as data entry, document handling, and customer support, among many others, enabling your team to focus on higher-value tasks.",
      },
      {
        q: "Which industries benefit most from our AI solutions?",
        a: "Industries such as finance, healthcare, logistics, retail, and professional services experience significant improvements. Any organization with repetitive tasks can achieve measurable gains in efficiency, customer engagement, and data-driven decision-making.",
      },
      {
        q: "How secure is my data?",
        a: "Data security is a top priority. All Dyas AI solutions comply with rigorous privacy and security standards, ensuring your information is fully protected.",
      },
      {
        q: "What is the cost of automation?",
        a: "Pricing depends on the scope and complexity of your automation objectives. Dyas AI works with both with startups and enterprises to deliver solutions that maximize operational efficiency and ROI. Contact us for a complimentary consultation and a tailored estimate.",
      },
    ],
    bannerHeadline: "We Build Automation That Actually Moves Your Business Forward",
    bannerSub: "From strategy to delivery, we are here to make sure that your business endeavor succeeds.",
    pillars: [
      {
        title: "Optimizing Operations",
        body: "We automate repetitive workflows and data-heavy tasks, giving your team time to focus on what matters most.",
      },
      {
        title: "Time-Saving Automations",
        body: "AI that handles repetitive admin tasks, so your team doesn't have to.",
      },
      {
        title: "Maximizing Efficiency",
        body: "Through AI integration, we help you do more with less — consistently and sustainably.",
      },
    ],
  },
  {
    slug: "ai-agents",
    title: "AI Agents",
    metaTitle: "AI Agents to Optimize Your Business Processes - Dyas AI",
    metaDescription: "Boost efficiency and streamline operations with custom AI agents designed to optimize your business processes.",
    breadcrumb: ["Home", "Service", "AI Agents"],
    ...shared,
    sectionHeadline: "Smart AI Agents That Think, Act, and Execute",
    body: [
      "Businesses waste time on repetitive tasks, disconnected tools, and slow decision-making. Employees manually move data between platforms, copy-paste emails, follow up on tasks, and answer the same questions again and again. Hiring more people to fix this doesn't scale.",
    ],
    approachTitle: "Our Approach",
    approach: [
      "We build AI agents trained on your business data, workflows, and goals to act like a virtual team member. They automate repetitive tasks, make decisions, and integrate with your existing tools which leads helping your team save time, work smarter, and focus on higher-value work.",
    ],
    offerTitle: "What Our AI Agents Can Do",
    offers: [
      {
        title: "Task Automation",
        body: "Automate lead qualification, email follow-ups, scheduling, reporting, database updates, and more, saving 40–60% of manual workflow time.",
      },
      {
        title: "Context-Aware Memory",
        body: "Remember past interactions and tailor responses like a human assistant.",
      },
      {
        title: "Multi-Format Understanding",
        body: "Process text, PDFs, spreadsheets, images, and voice inputs, helping your team handle 10x more repetitive tasks efficiently.",
      },
      {
        title: "Decision-Making",
        body: "Combine rules and AI logic to escalate, tag, or summarize tasks automatically, allowing your team to respond to leads 50% faster.",
      },
      {
        title: "API & App Integration",
        body: "Connect with Slack, Gmail, Google Sheets, Notion, Trello, and custom CRMs.",
      },
      {
        title: "Multi-Agent Collaboration",
        body: "Coordinate workflows across multiple agents and systems.",
      },
      {
        title: "Security & Access Control",
        body: "Keep data secure with encryption, role-based permissions, and audit logs.",
      },
    ],
    faqSub: "From Inbox to CRM — Let AI Agents Handle It.",
    faqs: [
      {
        q: "What's the difference between an AI agent and a chatbot?",
        a: "A chatbot replies to messages, an AI agent takes action. Our AI agents don't just answer; they read, decide, follow logic, and execute tasks across different platforms.",
      },
      {
        q: "What can an AI agent actually do for my business?",
        a: "Our AI agents can qualify leads, send emails, generate reports, assign tasks, retrieve data from multiple tools, update records, and more. You define the workflow and we build the agent to follow it.",
      },
      {
        q: "Can AI agents work with my existing tools?",
        a: "Yes. We integrate AI agents with your tools like Google Sheets, Notion, Slack, email, CRMs, databases, and more using APIs or automation platforms.",
      },
      {
        q: "Can I monitor what the AI agent is doing?",
        a: "Absolutely. We provide detailed logs, dashboards, or Slack/email summaries so you know exactly what your agent is doing and when.",
      },
      {
        q: "How smart are they? Can they make decisions?",
        a: 'Yes, we use logic chains and AI models that can follow conditional instructions. You define the rules (e.g., "if X happens, do Y"), and the agent handles it on its own.',
      },
      {
        q: "Will my data be safe?",
        a: "Yes. Your agent runs in a secure environment with encryption, role-based access, and full data privacy. Sensitive data is never exposed or used outside your use case.",
      },
    ],
    bannerHeadline: "Automate Complex Tasks",
    bannerSub:
      "AI Agents handle repetitive, manual work across departments from data entry and inbox triage to lead qualification, scheduling, and even internal reporting.",
    pillars: [
      {
        title: "Context-Aware Memory",
        body: "Your agent remembers past interactions, understands the context of ongoing conversations, and tailors responses accordingly like having an employee who never forgets.",
      },
      {
        title: "Multimodal Understanding",
        body: "They can process and interpret multiple formats including text, PDFs, spreadsheets, voice, and images making them versatile across use cases.",
      },
      {
        title: "Decision-Making with Rules + AI Logic",
        body: "Agents can follow pre-set rules, analyze data, and take action whether it's escalating issues, tagging leads, or generating insights from documents.",
      },
    ],
  },
  {
    slug: "ai-chatbots",
    title: "AI Chatbots",
    metaTitle: "AI Chatbots - Dyas AI",
    metaDescription:
      "AI chatbots that enhance customer engagement, automate support, and deliver intelligent, real-time conversations to improve user experience.",
    breadcrumb: ["Home", "Service", "AI Chatbots"],
    ...shared,
    sectionHeadline: "Decide How Smart It Works for You",
    body: [
      "Whether it's answering customer inquiries, assisting visitors on your website, or providing instant internal support our AI chatbots deliver accurate, context-aware responses 24/7, trained on your company's data for maximum efficiency.",
    ],
    approachTitle: "Why AI Chatbots?",
    approach: [
      "Modern businesses need fast, consistent, and scalable communication. Our chatbots handle conversations across websites, messaging apps, and custom platforms. They can be trained on your company's data, FAQs, or services to deliver accurate, context-aware responses.",
      "Your customers message you on web, Instagram, WhatsApp and other platforms, your chatbot should be there too. We build AI chatbots that reply instantly on the platforms people use every day, turning messages into sales without manual effort.",
    ],
    offerTitle: "Capabilities / What They Can Do",
    offers: [
      { title: "Virtual receptionist", body: "Act as your virtual receptionist, answering common questions instantly." },
      { title: "Product & service support", body: "Provide product or service support across multiple channels." },
      { title: "Guided journeys", body: "Guide users through your website or app efficiently." },
      { title: "Lead capture", body: "Collect leads, feedback, or support requests automatically." },
      { title: "Integrations", body: "Integrate seamlessly with CRM, databases, or external APIs." },
      { title: "Brand voice", body: "Support multiple languages, tone customization, and brand-specific responses." },
      { title: "Fully customizable", body: "And much more fully customizable to your business needs." },
    ],
    faqSub: "Train once. Answer forever. Your AI chatbots are ready.",
    faqs: [
      {
        q: "What kind of chatbots do you build?",
        a: "From simple rule-based bots to advanced AI assistants tailored to your business needs.",
      },
      {
        q: "What can your chatbots integrate with?",
        a: "CRMs, databases, messaging apps, websites, and custom applications.",
      },
      {
        q: "Do your chatbots support multiple languages and tones?",
        a: "Yes, they can communicate in different languages and adopt your brand's tone.",
      },
      {
        q: "How secure and private are the chatbots?",
        a: "All interactions are encrypted, and we implement role-based permissions and audit logging.",
      },
      {
        q: "How do you train the chatbot?",
        a: "Upload documents, FAQs, or web content; our models learn and adapt to your data.",
      },
      {
        q: "Can we select the AI model powering our chatbot?",
        a: "Yes. You can choose between different large language models (LLMs), including fast, budget-friendly options or more advanced ones — depending on how complex your needs are. We handle the backend.",
      },
      {
        q: "What measurable results can we expect?",
        a: "Faster response times, higher lead capture, and consistent 24/7 customer support.",
      },
    ],
    bannerHeadline: "We Build AI Chatbots You Can Train",
    bannerSub: "Why Choose Dyas AI Chatbots Service?",
    pillars: [
      {
        title: "Custom Training",
        body: "Upload your PDFs, articles, website links, or support docs — and your chatbot will learn from them instantly.",
      },
      {
        title: "Natural Conversations",
        body: "Our bots are powered by AI providers based language models for smooth, human-like conversations.",
      },
      {
        title: "Team-Wide Efficiency",
        body: "Give your entire team access to one smart assistant — without paying for dozens of separate AI tools.",
      },
    ],
  },
  {
    slug: "web-mobile-app-development",
    title: "Web & Mobile App Development",
    metaTitle: "Web & Mobile App Development - Dyas AI",
    metaDescription:
      "We design and develop high-performing web and mobile applications tailored to your business needs with / without AI",
    breadcrumb: ["Home", "Service", "Web & Mobile App Development"],
    ...shared,
    sectionHeadline:
      "From smartphones to desktops, we design and develop seamless digital experiences that perform smoothly across all devices and platforms.",
    body: [
      "In today's hyper-connected world, your website or mobile application is often your customer's first impression and your biggest opportunity. At Dyas AI, we specialize in developing smart, secure, and scalable websites and mobile applications that don't just look great, but drive real results.",
    ],
    approachTitle: "Our Approach",
    approach: [
      "We solve challenges like fragmented systems that slow teams down, poor mobile responsiveness or UX drop-off, limited flexibility for future features and scaling, and technical complexity or unclear development roadmaps.",
      "We use modern technologies like React, React Native, Flutter, Node.js, and NestJS — but our approach is never one-size-fits-all. We choose the right stack based on your product needs, timeline, and future vision.",
      "Whether you need a cross-platform mobile app, a powerful admin dashboard, or a complete SaaS product, we tailor each project to your exact business logic and user goals.",
      "We go beyond templates. Whether you're building a landing page, a SaaS platform, or a complex mobile app, we offer full-stack development backed by thoughtful design and seamless user experience.",
    ],
    faqSub:
      "From UI/UX to final deployment, we handle every step — discovery, wireframing, development, testing, and launch. Your product is in expert hands.",
    faqs: [
      {
        q: "Can you build web applications with or without AI?",
        a: "Absolutely. We develop traditional web platforms, and we can also integrate AI modules later when you're ready.",
      },
      {
        q: "Will I be able to manage the site/app after launch?",
        a: "Yes — we offer handoff, training, and optional maintenance packages for full independence or ongoing support.",
      },
      {
        q: "Can you build mobile applications with or without AI?",
        a: "Absolutely. We develop traditional mobile platforms, and we can also integrate AI modules later when you're ready.",
      },
      {
        q: "How long does it take to build a website?",
        a: "Standard websites can take 2–4 weeks. Larger platforms or apps typically take 6–12 weeks everything depending on complexity.",
      },
      {
        q: "How much does a custom website or mobile app cost?",
        a: "It depends on your goals and features. We'll provide a transparent quote after our first consultation.",
      },
    ],
    bannerHeadline: "We Build Powerful Websites and Custom Apps That Perform at Scale",
    bannerSub: "Core Areas We Cover",
    pillars: [
      {
        title: "Website Development",
        body: "We create fast, SEO-friendly, and responsive websites tailored to your brand. From WordPress to custom-coded platforms, we build it to perform — across all devices.",
      },
      {
        title: "Web Applications",
        body: "Whether it's an internal dashboard, client portal, or B2B tool — we craft robust web apps designed for growth, security, and scalability.",
      },
      {
        title: "Mobile Applications",
        body: "We build native and cross-platform apps for iOS and Android using technologies like Flutter and React Native — custom-designed for your users' needs.",
      },
    ],
  },
  {
    slug: "e-commerce-development",
    title: "E-Commerce Development",
    metaTitle: "E-Commerce Development - Dyas AI",
    metaDescription: "Build powerful e-commerce stores with secure payments, seamless UX, and scalable performance.",
    breadcrumb: ["Home", "Service", "E-Commerce Development"],
    ...shared,
    sectionHeadline: "From Idea to Storefront — Online Shops That Sell",
    body: [
      "Launching or scaling an online store comes with many challenges from platform selection to workflows, design, and functionality. At Dyas AI, we provide end-to-end e-commerce development services that ensure your store is fast, secure, and aligned with your brand.",
      "Whether building from scratch or leveraging platforms like Shopify or WooCommerce, we deliver custom or theme-based designs tailored to your products and audience. We manage setup, structure, design, configuration, and optimization so you can focus on growing your business.",
    ],
    approachTitle: "Our Approach",
    approach: [
      "Platform Selection & Setup: Choose the right e-commerce platform for your needs.",
      "Custom or Template Design: Tailored UI/UX that reflects your brand identity.",
      "Store Configuration: Product uploads, categories, and navigation structure.",
      "Payment, Shipping & Taxes: Fully integrated and secure checkout processes.",
      "Optimization & Performance: Fast-loading, mobile-responsive, and SEO-ready.",
    ],
    faqSub: "Building Smart Stores, Starting with Your Questions",
    faqs: [
      {
        q: "Do I need to choose a platform before starting?",
        a: "No — we guide you on the best platform based on your goals, budget, and scalability needs.",
      },
      {
        q: "Can I use a pre-made theme, or do I need a custom design?",
        a: "Both options are available. We can work with your chosen theme or design a fully custom interface.",
      },
      {
        q: "Do you handle product uploads and organization?",
        a: "Yes, we manage product data, categories, and catalog setup for a smooth launch.",
      },
      {
        q: "Can I manage my store after launch?",
        a: "Absolutely. We provide training and intuitive tools for ongoing store management.",
      },
      {
        q: "Do you integrate payments, taxes, and shipping?",
        a: "Yes. We'll help you integrate payment gateways, set up tax rules, and configure shipping zones so your store is ready to sell.",
      },
    ],
    bannerHeadline: "E-commerce Solutions That Build, Scale & Simplify",
    bannerSub: "We design and build online stores that are easy to use, look great, and are ready to grow with your business.",
    pillars: [
      {
        title: "Custom or Platform-Based? You Choose",
        body: "Whether you want a store developed from the ground up or built on platforms like Shopify or WooCommerce, we deliver clean, scalable setups tailored to your brand.",
      },
      {
        title: "Smart Product Structure",
        body: "We organize your products with thoughtful categories, filters, and layouts to ensure users find what they need — and convert quickly.",
      },
      {
        title: "Ready to Grow",
        body: "We build mobile-friendly, high-performance stores that keep up with your growth — no matter the traffic, no matter the season.",
      },
    ],
  },
  {
    slug: "ui-ux-services",
    title: "UI / UX Services",
    metaTitle: "UI / UX Services - Dyas AI",
    metaDescription:
      "Delivering intuitive and engaging UI/UX design services that enhance user journeys, improve conversions, and align perfectly with your brand identity.",
    breadcrumb: ["Home", "Service", "UI / UX Services"],
    ...shared,
    sectionHeadline: "Design That Drives Interaction, Retention, and Growth",
    body: [
      "We don't just make things look good, we craft digital experiences that solve user problems, reduce friction, and support your business goals. Whether you're launching a new product, improving an existing interface, or scaling up your platform, our design process is built to deliver measurable results.",
    ],
    offerTitle: "What We Offer",
    offers: [
      {
        title: "User Experience Research & Strategy",
        body: "We begin with deep discovery analyzing your users, goals, and competitors. Through user interviews, analytics, and journey mapping, we build data-backed design strategies that align with your objectives.",
      },
      {
        title: "Wireframes & UX Architecture",
        body: "Before we design the look, we structure the experience. We create wireframes and navigation flows that outline every interaction, ensuring your app or site feels intuitive from the first click.",
      },
      {
        title: "Interface Design (UI)",
        body: "Pixel-perfect visuals that reflect your brand and delight your users. We focus on hierarchy, consistency, responsiveness, and accessibility to make your product beautiful and usable.",
      },
      {
        title: "Interactive Prototypes",
        body: "Get a feel for your product before it's built. We deliver clickable, animated prototypes that simulate user flows and help you test ideas quickly and clearly — ideal for investors, developers, and stakeholders.",
      },
      {
        title: "Design Systems & Component Libraries",
        body: "We build scalable, reusable design systems that your dev team can easily implement. This ensures consistency and speeds up future builds, updates, and collaborations.",
      },
      {
        title: "Usability Testing & Iteration",
        body: "We test everything — with real users or stakeholders — and refine designs based on feedback. No assumptions, just insights.",
      },
      {
        title: "UI/UX Audits & Redesigns",
        body: "Already have a product? We assess its design from a usability, conversion, and accessibility standpoint — then create a roadmap for improvement.",
      },
    ],
    faqSub: "Design Shouldn't Be Confusing. Let's Make It Clear.",
    faqs: [
      {
        q: "Which tools do you use for UI/UX design?",
        a: "We primarily use Figma. All files are shareable and developer-ready.",
      },
      {
        q: "Do you deliver responsive/mobile-first designs?",
        a: "Always. Every design is created with mobile, tablet, and desktop users in mind. We ensure smooth usability across all screen sizes.",
      },
      {
        q: "Will I get a prototype before development?",
        a: "Yes. We provide interactive prototypes so you can test and review the user experience before any development begins. This reduces guesswork and ensures alignment early on.",
      },
      {
        q: "Can you redesign my existing website or app?",
        a: "Yes. We offer UI/UX audits and redesigns for existing platforms. We'll identify usability issues, modernize your design, and optimize the user experience to improve conversions and engagement.",
      },
    ],
    bannerHeadline: "Smart Design & Seamless Interfaces — Built to Convert.",
    bannerSub: "From user flows to final clicks — we design digital experiences that work.",
    pillars: [
      {
        title: "Research-Driven Strategy",
        body: "We start with understanding your users and your goals — mapping out clear user journeys to inform a design strategy that drives real results.",
      },
      {
        title: "Modern, Scalable Design Systems",
        body: "From wireframes to high-fidelity visuals, we create consistent design systems tailored for web or mobile, adaptable across platforms.",
      },
      {
        title: "Usability Meets Aesthetics",
        body: "Good design isn't just about looking nice — we combine clean visuals with smart interactions to improve functionality and retain users.",
      },
    ],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}
