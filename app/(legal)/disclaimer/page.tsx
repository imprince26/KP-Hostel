import type { Metadata } from "next";
import { LegalList, LegalNote, LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important information about the independent nature of this website and the limits of the information published on it.",
  alternates: { canonical: "/disclaimer" },
};

const LAST_UPDATED = "22 October 2026";

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Disclaimer"
      description="This page sets out the nature of this website, the accuracy of the information it publishes, and the limits of what it should be relied upon for."
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="1. Independent project notice">
        <LegalNote>
          <p>
            <strong className="text-foreground">This website is an independent project.</strong> It was created by Prince Patel. It is
            <strong className="text-foreground"> not </strong>
            the official website of K.P. Vidhyarthi Bhavan,
            Ellisbridge, Ahmedabad. It is not endorsed, authorised, sponsored or operated by the
            hostel administration or by the trust that manages it.
          </p>
        </LegalNote>
      </LegalSection>

      <LegalSection title="2. Demonstration data">
        <p>
          Student records, application numbers, occupancy figures, fee structures, payment records,
          room allotments, announcements and messages that appear on this platform are demonstration
          data produced for evaluation purposes. They do not represent actual residents, actual
          admissions, actual fees or actual allotments.
        </p>
      </LegalSection>

      <LegalSection title="3. No offer of accommodation">
        <p>
          Nothing on this website constitutes an offer of accommodation, a reservation of a room, a
          contract of tenancy, or an invoice. Any admission or allotment is granted exclusively by
          the hostel administration through its own application process, subject to availability and
          its own rules.
        </p>
      </LegalSection>

      <LegalSection title="4. Accuracy of information">
        <p>
          Hostel details such as the founding year, number of blocks, room capacity, facilities,
          rules and fee structure are reproduced for demonstration purposes from publicly visible
          information about the premises. They may be incomplete or out of date. For authoritative
          information, contact the hostel office directly.
        </p>
      </LegalSection>

      <LegalSection title="5. Photographs and imagery">
        <p>
          Photographs of the hostel premises, its blocks, rooms, mess, lobby, temple and common
          areas are the property of K.P. Vidhyarthi Bhavan, Ahmedabad. They are reproduced on this
          website with attribution for non-commercial demonstration purposes only. They may not be
          reused, redistributed or used commercially without the rights holder&rsquo;s permission. Full
          details are set out on the Image and Content Credits page.
        </p>
      </LegalSection>

      <LegalSection title="6. External links">
        <p>
          Links to Google Maps and to any other third-party site are provided for convenience. We do
          not control those sites and are not responsible for their content, availability or
          privacy practices.
        </p>
      </LegalSection>

      <LegalSection title="7. Availability and security">
        <p>
          The platform is provided on an as-is basis for demonstration and educational purposes. It
          may be restarted, reset, migrated or taken offline at any time, and data may be cleared
          between deployments. Please do not rely on it as a system of record for anything
          consequential.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of liability">
        <p>
          To the maximum extent permitted by law, the project creator and contributors are not
          liable for any loss arising from reliance on the content of this website, from the loss of
          demonstration data, or from the unavailability of the service.
        </p>
      </LegalSection>

      <LegalSection title="9. How to verify the real hostel">
        <LegalList
          items={[
            "Visit the hostel premises in Ellisbridge, Ahmedabad and speak to the office.",
            "Confirm fee and admission details directly with the hostel administration.",
            "Treat any communication that reaches you through this portal as demonstration output until you have confirmed it with the hostel office.",
          ]}
        />
      </LegalSection>

      <LegalSection title="10. Related pages">
        <p>
          The Terms of Use, Privacy Policy, Cookie Policy and Image and Content Credits pages form
          part of this disclaimer and should be read together with it.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
