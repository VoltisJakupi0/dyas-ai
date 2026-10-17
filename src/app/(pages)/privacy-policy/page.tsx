import { PageHero } from "@/components/PageHero";
import { pageSeo } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageSeo({
  title: "Privacy Policy | Dyas AI",
  description: "How Dyas AI handles website enquiries and booking information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <main className="dyas-sheet">
      <PageHero breadcrumb={["Home", "Privacy Policy"]} headline="Privacy Policy" body="How we handle information you share through this website." />
      <section className="dyas-sheet__section dyas-sheet__section--end">
        <div className="container-site">
          <div className="max-w-3xl space-y-8 text-body-18-light [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-medium [&_a]:underline [&_a]:underline-offset-4">
            <p>Updated 17 October 2026.</p>
            <section>
              <h2>Who to contact</h2>
              <p>Dyas AI, based in {site.address}, handles enquiries made through this website. For privacy questions or requests, email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
            </section>
            <section>
              <h2>Information you provide</h2>
              <p>Our contact form asks for your name, email address, optional company name, and message. We use this information to respond to your enquiry and discuss the services you request. Please avoid including sensitive personal information in your message.</p>
            </section>
            <section>
              <h2>Why we use information</h2>
              <p>We use enquiry details to take steps at your request before entering a contract, or for our legitimate interest in responding to business enquiries. We also use technical information, including IP addresses, to limit repeated form submissions and protect the website from abuse.</p>
            </section>
            <section>
              <h2>Services involved</h2>
              <p>Contact messages are delivered through Resend, with Web3Forms available as a fallback, and received in our email inbox. Our hosting and email providers also process information needed to operate these services. Booking links take you to Calendly, where its privacy notice applies. The contact page embeds Google Maps, which receives connection information such as your IP address when the map loads. Social and other external links take you to independently operated websites.</p>
              <p className="mt-3">Provider processing locations can differ from your location. Contact us for details about the providers and international transfer arrangements applicable to your enquiry.</p>
            </section>
            <section>
              <h2>Retention</h2>
              <p>We keep enquiry correspondence for as long as needed to respond, manage the resulting business relationship, and meet applicable recordkeeping obligations. Retention depends on the nature of the enquiry and any resulting agreement. Contact us to ask about retention or deletion of your information.</p>
            </section>
            <section>
              <h2>Cookies and automated decisions</h2>
              <p>The website application does not set advertising cookies or use your enquiry to make solely automated decisions with legal or similarly significant effects. The embedded Google Map and external services may use their own cookies under their respective privacy policies.</p>
            </section>
            <section>
              <h2>Your choices and rights</h2>
              <p>Depending on the circumstances, you can request access, correction, deletion, restriction, or portability of your personal information. You can object to processing based on legitimate interests. Email <a href={`mailto:${site.email}`}>{site.email}</a> to make a request.</p>
              <p className="mt-3">You can also raise a concern with the UK Information Commissioner’s Office at <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk/make-a-complaint</a>.</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
