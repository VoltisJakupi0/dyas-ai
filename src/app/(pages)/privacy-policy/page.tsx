import { PageHero } from "@/components/PageHero";
import { pageSeo } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageSeo({
  title: "Privacy Policy | Dyas AI",
  description: "How Dyas AI collects, uses, stores, and protects personal information submitted through this website.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <main className="dyas-sheet">
      <PageHero breadcrumb={["Home", "Privacy Policy"]} headline="Privacy Policy" body="How we collect, use, store, and protect information shared through this website." />
      <section className="dyas-sheet__section dyas-sheet__section--end">
        <div className="container-site">
          <div className="max-w-3xl space-y-8 text-body-18-light [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-medium [&_a]:underline [&_a]:underline-offset-4">
            <p>Updated 17 October 2026.</p>
            <section>
              <h2>About this policy</h2>
              <p>This policy applies when you visit dyas.ai, submit our contact form, book a call through a link on the website, or communicate with us about our services. It explains what personal information we handle, why we use it, who may process it on our behalf, and the choices available to you.</p>
              <p className="mt-3">This policy does not cover websites or services operated by other organisations. When you follow an external link, the privacy policy of that provider applies.</p>
            </section>
            <section>
              <h2>Who to contact</h2>
              <p>Dyas AI, based in {site.address}, is responsible for personal information handled through this website. For privacy questions, requests, or complaints, email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
            </section>
            <section>
              <h2>Information we collect</h2>
              <p>When you use our contact form, we collect your name, email address, optional company name, and the content of your message. If you continue a conversation with us, we may also keep the information contained in later emails, calls, proposals, and project discussions.</p>
              <p className="mt-3">Our website and hosting systems may receive technical information needed to deliver and protect the service, such as your IP address, browser type, device information, requested pages, timestamps, and basic server logs. Please do not include sensitive personal information in a contact message unless it is necessary and we have agreed to receive it.</p>
            </section>
            <section>
              <h2>How and why we use information</h2>
              <p>We use enquiry and correspondence details to respond to you, understand your requirements, arrange calls, prepare proposals, provide requested services, maintain business records, and manage an ongoing client relationship. We use technical information to operate the website, diagnose problems, limit repeated form submissions, and protect the service from misuse.</p>
              <p className="mt-3">Our legal basis is normally taking steps at your request before entering into a contract, performing a contract with you, complying with a legal obligation, or our legitimate interests in responding to business enquiries, operating our services, and keeping them secure. Where the law requires consent for a specific activity, we will ask for it separately.</p>
              <p className="mt-3">You do not have to submit the contact form. However, without the required contact details and message, we may be unable to respond to your request.</p>
            </section>
            <section>
              <h2>Who receives information</h2>
              <p>Authorised members of our team may access your information when they need it for the purposes described above. Contact messages are delivered through Resend, with Web3Forms available as a fallback, and received through our email provider. Our website hosting and technical service providers may also process information needed to operate and secure the website.</p>
              <p className="mt-3">We do not sell your personal information. We may disclose information when required by law, to establish or defend legal claims, to protect our rights or the safety of others, or as part of a business reorganisation where appropriate safeguards apply.</p>
            </section>
            <section>
              <h2>External services and international processing</h2>
              <p>Booking links take you to Calendly, where Calendly’s privacy policy applies. The contact page embeds Google Maps, which receives connection information such as your IP address when the map loads. Social links and other external links take you to independently operated websites.</p>
              <p className="mt-3">Some providers may process information outside the United Kingdom. Where this happens, we expect the provider to use a recognised transfer mechanism or another safeguard required by applicable data protection law. You can contact us for more information about providers and safeguards relevant to your information.</p>
            </section>
            <section>
              <h2>How long we keep information</h2>
              <p>We keep enquiry correspondence only for as long as reasonably needed to respond, follow up on the request, manage any resulting business relationship, resolve disputes, and meet legal, tax, accounting, or recordkeeping obligations. The exact period depends on whether the enquiry develops into a project, the nature of the communication, and any legal requirement that applies.</p>
              <p className="mt-3">When information is no longer required, we delete it or make it anonymous where reasonably possible. Backup copies may remain for a limited period until they are overwritten through normal system processes.</p>
            </section>
            <section>
              <h2>How we protect information</h2>
              <p>We use reasonable technical and organisational measures intended to protect personal information against unauthorised access, loss, misuse, alteration, or disclosure. These measures include limiting access to people and providers who need the information to perform their role. No online service or method of electronic storage can guarantee absolute security.</p>
            </section>
            <section>
              <h2>Cookies and automated decisions</h2>
              <p>The website application does not set advertising cookies or use your information for solely automated decisions that produce legal or similarly significant effects. The embedded Google Map and external services may use their own cookies or similar technologies under their respective privacy policies.</p>
            </section>
            <section>
              <h2>Your data protection rights</h2>
              <p>Depending on the circumstances and the legal basis involved, you may have the right to request access to your personal information, correction of inaccurate information, deletion, restriction of processing, or transfer of information in a portable format. If we rely on consent, you may withdraw it at any time without affecting earlier lawful processing.</p>
              <p className="mt-3"><strong>You may object to processing based on our legitimate interests.</strong> We will stop that processing unless we have compelling legitimate grounds to continue or need the information for legal claims.</p>
              <p className="mt-3">To exercise a right, email <a href={`mailto:${site.email}`}>{site.email}</a>. We may need to verify your identity before completing a request. Data protection rights can be subject to legal conditions and exemptions.</p>
              <p className="mt-3">You can also raise a concern with the UK Information Commissioner’s Office at <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk/make-a-complaint</a>.</p>
            </section>
            <section>
              <h2>Children</h2>
              <p>Our website and services are intended for businesses and are not directed to children. We do not knowingly collect personal information from children through the contact form. If you believe a child has submitted information to us, contact us so we can review and delete it where appropriate.</p>
            </section>
            <section>
              <h2>Changes to this policy</h2>
              <p>We may update this policy when our website, service providers, or legal obligations change. We will publish the revised version on this page and change the “Updated” date above. We encourage you to review this page periodically.</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
