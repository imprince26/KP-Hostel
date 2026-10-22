import type { Metadata } from "next";
import { LegalList, LegalNote, LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How this website collects, uses, stores and protects the personal information of students, guardians and visitors.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "22 October 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="This policy explains what personal information this website collects, why it is collected, how long it is kept, and the choices available to you. It applies to the public website, the student portal and the admin portal."
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="1. Who we are">
        <p>
          This website is an independent project built by Prince Patel. It is not the
          official website of K.P. Vidhyarthi Bhavan, Ellisbridge, Ahmedabad, and it is not operated, endorsed or authorised by the hostel administration.
        </p>
        <p>
          Admission applications, notifications and room allocations performed through this portal
          are demonstration prototypes. For any enquiry that concerns the real hostel, its fees, its
          allotment process or a real resident, please approach the hostel office directly at the
          premises in Ellisbridge, Ahmedabad.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>We collect only the information that is needed to demonstrate the admission workflow:</p>
        <LegalList
          items={[
            <>
              <strong className="text-foreground">Account information.</strong> When you register, we
              store your name, email address, hashed password, role and verification state. If you
              sign in with Google, we store the identifier, name, email address and profile image
              returned by Google.
            </>,
            <>
              <strong className="text-foreground">Profile information.</strong> Students are asked to
              complete a profile containing a phone number, date of birth and residential address so
              that the admission review workflow can be exercised end to end.
            </>,
            <>
              <strong className="text-foreground">Admission application data.</strong> Applications
              collect course and college details, guardian name, relationship, phone number and
              address, plus a passport photograph that you upload to Cloudinary.
            </>,
            <>
              <strong className="text-foreground">Communication preferences.</strong> Optional
              toggles that determine which notifications you receive by email.
            </>,
            <>
              <strong className="text-foreground">Technical data.</strong> Session identifiers,
              timestamps and error logs generated while the portal is running.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="3. How we use your information">
        <LegalList
          items={[
            "To create and authenticate your account and to keep you signed in.",
            "To process, review and track admission applications.",
            "To send transactional notifications, for example an application receipt, an approval or a rejection.",
            "To publish announcements addressed to you, to all students or to a specific block.",
            "To store your uploaded passport photograph and avatar so that staff can review an application.",
            "To maintain the security and stability of the platform, for example rate limiting and audit records.",
          ]}
        />
        <p>
          We do not sell personal information, and we do not use admission data for advertising or
          profiling.
        </p>
      </LegalSection>

      <LegalSection title="4. Legal basis for processing">
        <p>
          We process personal information on the following bases: performance of a contract, where
          processing is necessary to provide the portal you have requested; legitimate interests, for
          example operating the demonstration safely and preventing abuse; and consent, for example
          when you agree to receive optional email notifications.
        </p>
      </LegalSection>

      <LegalSection title="5. Where your data is stored">
        <LegalList
          items={[
            "Application and account records are stored in a Neon serverless PostgreSQL database.",
            "Uploaded images are stored in a Cloudinary media library and are referenced by URL.",
            "Transactional email is delivered through a Gmail SMTP mailbox."
          ]}
        />
        <p>
          Some of these providers process data outside India. Where that occurs, transfers are made
          on the basis of the provider&rsquo;s standard contractual safeguards.
        </p>
      </LegalSection>

      <LegalSection title="6. Retention">
        <p>
          We keep personal information for as long as the account remains active and for a reasonable
          period afterwards so that historical admission records remain coherent. If you request
          account deletion, the associated records are removed from the active database in line with
          the retention schedule configured for the project.
        </p>
      </LegalSection>

      <LegalSection title="7. Sharing and disclosure">
        <p>
          We share personal information only with the service providers listed in section 5, and only
          to the extent required to operate the portal. We do not disclose information to third
          parties for their own marketing purposes.
        </p>
        <LegalNote>
          <p>
            <strong className="text-foreground">Important.</strong> Because this is an independent
            project rather than the official hostel system, no admission data submitted here is
            transmitted to the actual K.P. Vidhyarthi Bhavan administration.
          </p>
        </LegalNote>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <LegalList
          items={[
            "Access and correct the personal information held about your account.",
            "Request deletion of your account and the associated application records.",
            "Withdraw consent for optional notifications at any time from the Settings page.",
            "Object to or restrict certain processing, and ask for a portable copy of your data.",
          ]}
        />
        <p>
          Requests can be raised from the Settings page of the portal, or through the contact form on
          this website. Because this is a demonstration project with a limited support capacity,
          responses may take longer than for a commercial service.
        </p>
      </LegalSection>

      <LegalSection title="9. Security">
        <p>
          Passwords are hashed with bcrypt and never stored in plain text. Sessions are signed
          server-side, every API route revalidates the session and role on the server before
          returning data, and uploads are restricted by type and size. No system is completely
          secure; if you believe your account has been compromised, change your password from the
          Settings page and report it.
        </p>
      </LegalSection>

      <LegalSection title="10. Cookies">
        <p>
          The portal sets a session cookie required for authentication and stores small values such
          as a dismissed notice and an unsent message draft in your browser&rsquo;s local storage. The
          full position is set out in the Cookie Policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Children">
        <p>
          This portal is intended for college-going students and their guardians. It is not directed
          at children, and we do not knowingly collect information from anyone under 18 without
          appropriate supervision.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to this policy">
        <p>
          This policy may be updated as the project evolves. The revision date shown at the top of
          this page always reflects the current version, and material changes will be summarised on
          the announcements page of the website.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          For questions about this policy or about the handling of your personal information, use the
          contact form on this website, or write to the project office at the hostel premises in
          Ellisbridge, Ahmedabad, Gujarat 380006.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
