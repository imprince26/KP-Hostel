import type { Metadata } from "next";
import { LegalList, LegalNote, LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern the use of this website, the student portal of the KP Vidhyarthi Bhavan project.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "22 October 2026";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Use"
      description="These terms set out the agreement between you and the operator of this website. By creating an account or using the portal, you accept them."
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="1. Agreement to these terms">
        <p>
          By accessing this website, registering an account, submitting an admission application or
          using the student or admin portal, you agree to these terms in full. If you do not agree
          with any part of them, you must stop using the platform.
        </p>
      </LegalSection>

      <LegalSection title="2. Nature of this platform">
        <LegalList
          items={[
            "This website is an independent academic and portfolio project created by Prince Patel.",
            "It is not the official website of Shree Kadva Patidar Vidhyarthi Bhavan (K.P. Vidhyarthi Bhavan), Ellisbridge, Ahmedabad, and it is not endorsed, authorised or operated by the hostel administration.",
            "All applications, notifications, allotments and messages produced through this portal are demonstration prototypes. They do not create a real tenancy, a real admission, or any enforceable obligation.",
            "Real admission decisions, fees and room allocation are made exclusively by the hostel administration through its own process.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Eligibility and accounts">
        <LegalList
          items={[
            "You must be at least 18 years old, or have the consent of a parent or guardian, to create an account.",
            "You must provide accurate information and keep it current.",
            "One person may maintain only one account. Duplicate accounts used to influence application ordering are grounds for suspension.",
            "You are responsible for the confidentiality of your credentials and for every activity that occurs under your account.",
            "You must notify us promptly if you suspect unauthorised access.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Acceptable use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            "Submit false, misleading or impersonated information, including a passport photograph that is not your own.",
            "Upload content that is unlawful, defamatory, or infringes the rights of others, including the photograph and data of another individual.",
            "Attempt to gain access to accounts, data or administrative functions that are not yours.",
            "Probe, scan, overload or otherwise disrupt the platform, including through automated requests.",
            "Use the platform to send unsolicited bulk messages to students.",
            "Reverse engineer, resell, sublicense or commercially exploit the code of this project without written permission.",
          ]}
        />
        <LegalNote>
          <p>
            Breach of this section may result in immediate suspension or deletion of your account
            without notice.
          </p>
        </LegalNote>
      </LegalSection>

      <LegalSection title="5. Admission applications">
        <LegalList
          items={[
            "An application number is generated for every submitted application so that you can track its status. It is issued sequentially and must not be altered or reused.",
            "Submitting an application does not guarantee a place, and no acknowledgement from this portal constitutes an offer of accommodation.",
            "An application may be approved, put under review, or rejected. Where an application is rejected, a reason is recorded for demonstration purposes.",
            "The passport photograph you upload must be a clear, recent, front-facing image of you and must not include another person.",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Fees, payments and records">
        <p>
          Fee structures configured on the portal are illustrative. Payment records are maintained to
          demonstrate tracking and reporting only; they do not constitute a receipt, an invoice or an
          agreement to pay, and no money is transferred through this website.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual property">
        <LegalList
          items={[
            "The source code, design system, written copy and visual identity of this project are the property of the project creator and are protected by the applicable intellectual property laws.",
            "Photographs and imagery of the hostel premises are the property of K.P. Vidhyarthi Bhavan, Ahmedabad. They are used here with attribution and may not be reused. See the Image and Content Credits page.",
            "Nothing in these terms grants you a licence to reuse hostel photographs, logos or trademarks for commercial purposes.",
          ]}
        />
      </LegalSection>

      <LegalSection title="8. Announcements and messaging">
        <p>
          Announcements and messages published on the portal are demonstration content published by
          administrators of this project. They are not official circulars of the hostel and must not
          be relied upon for any real-world decision.
        </p>
      </LegalSection>

      <LegalSection title="9. Availability and changes">
        <p>
          The platform is provided on an as-is and as-available basis, for demonstration and
          educational purposes. Features may be added, altered or removed at any time without notice.
          We do not guarantee that the service will be uninterrupted or error free.
        </p>
      </LegalSection>

      <LegalSection title="10. Limitation of liability">
        <p>
          To the maximum extent permitted by law, the project creator and the contributors to this
          project are not liable for any indirect or consequential loss arising from the use of the
          platform, including lost applications, lost messages, or reliance on demonstration data.
          Nothing in these terms excludes liability that cannot lawfully be excluded.
        </p>
      </LegalSection>

      <LegalSection title="11. Indemnity">
        <p>
          You agree to indemnify the project creator against any claim, loss or expense, including
          reasonable legal fees, arising from your breach of these terms, your misuse of the
          platform, or your upload of content that infringes the rights of another person.
        </p>
      </LegalSection>

      <LegalSection title="12. Suspension and termination">
        <p>
          Accounts may be suspended or deleted for breach of these terms, for security reasons, or
          at the request of the account holder. You may request deletion of your own account from the
          Settings page at any time.
        </p>
      </LegalSection>

      <LegalSection title="13. Governing law and jurisdiction">
        <p>
          These terms are governed by the laws of India. Subject to the following clause, the courts
          at Ahmedabad, Gujarat have exclusive jurisdiction over any dispute arising from them.
        </p>
      </LegalSection>

      <LegalSection title="14. Severability">
        <p>
          If any provision of these terms is found to be unenforceable, the remaining provisions
          continue in full force and effect.
        </p>
      </LegalSection>

      <LegalSection title="15. Changes to these terms">
        <p>
          These terms may be revised as the project evolves. The revision date at the top of this page
          always reflects the current version, and continued use of the platform after a revision
          constitutes acceptance of the revised terms.
        </p>
      </LegalSection>

      <LegalSection title="16. Contact">
        <p>
          Questions about these terms can be raised through the contact form on this website
        </p>
      </LegalSection>
    </LegalPage>
  );
}
