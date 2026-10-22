import type { Metadata } from "next";
import { LegalList, LegalNote, LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies and browser storage this website uses, what each one does, and how to control them.",
  alternates: { canonical: "/cookies" },
};

const LAST_UPDATED = "22 October 2026";

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      description="This website keeps its use of cookies and browser storage deliberately small. This page explains exactly what is stored in your browser and why."
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="1. What cookies are">
        <p>
          A cookie is a small text file placed in your browser by a website. Cookies let a site
          recognise you between page loads, which is what keeps you signed in to the student and
          admin portals. This website does not use advertising or cross-site tracking cookies.
        </p>
      </LegalSection>

      <LegalSection title="2. Cookies and storage used by this site">
        <LegalList
          items={[
            <>
              <strong className="text-foreground">Authentication session cookie.</strong> Set by
              NextAuth.js when you sign in. It carries a signed session token that is verified on the
              server for every protected request. It is removed when you sign out. Without it the
              student and admin portals cannot function.
            </>,
            <>
              <strong className="text-foreground">Notice dismissal preference.</strong> A small
              value stored in your browser that records that you have already read the independent
              project notice shown at the top of the site, so it is not shown on every visit.
            </>,
            <>
              <strong className="text-foreground">Messaging draft.</strong> If you start composing a
              broadcast message in the admin portal, an unsent draft is kept in your browser&rsquo;s local
              storage so that it survives a page reload. It is never transmitted until you press
              send, and it is cleared when the draft is sent.
            </>,
            <>
              <strong className="text-foreground">Theme preference.</strong> The site records whether
              you have chosen the light or dark appearance so that it stays consistent across
              visits.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Strictly necessary storage">
        <p>
          The session cookie and the notice dismissal preference are strictly necessary for the
          platform to operate and to be used securely. They are set without asking for consent because
          the service cannot work without them. No information in them is used to build a profile of
          your browsing habits.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-party content">
        <LegalNote>
          <p>
            The public website embeds a Google Maps view of the hostel premises and serves
            photographs from a Cloudinary media library. Loading the map may cause Google to set its
            own cookies under its own privacy policy. We do not control, and are not responsible for,
            the cookies set by third-party providers.
          </p>
        </LegalNote>
      </LegalSection>

      <LegalSection title="5. How long cookies are kept">
        <LegalList
          items={[
            "Session cookies are deleted when the browser session ends or when you sign out.",
            "Preference values stored in local storage are kept until you clear them from your browser.",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Controlling cookies">
        <p>
          You can delete or block cookies and clear local storage through your browser settings.
          Please note that blocking the session cookie will prevent you from signing in to the
          student or admin portal, and clearing local storage will reset your theme choice, your
          notice dismissal and any saved messaging draft.
        </p>
      </LegalSection>

      <LegalSection title="7. Consent and updates">
        <p>
          Because this deployment relies only on strictly necessary storage, no cookie consent banner
          is displayed. If additional non-essential cookies are introduced in future, this page and
          the consent mechanism will be updated at the same time. The revision date at the top of
          this page reflects the current version.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          Questions about cookies and browser storage can be raised through the contact form on this
          website.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
