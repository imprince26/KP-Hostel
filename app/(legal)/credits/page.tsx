import type { Metadata } from "next";
import { LegalList, LegalNote, LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Image & Content Credits",
  description:
    "Attribution for the hostel photographs, the project authorship and the third-party assets used on this website.",
  alternates: { canonical: "/credits" },
};

const LAST_UPDATED = "22 October 2026";

export default function CreditsPage() {
  return (
    <LegalPage
      eyebrow="Attribution"
      title="Image & Content Credits"
      description="This website is built on material that belongs to others. This page records who owns what, so that every contributor is credited properly."
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="1. Hostel photography">
        <LegalNote>
          <p>
            <strong className="text-foreground">
              All photographs of the hostel premises, its residential blocks, rooms, mess, lobby,
              temple, common areas and events on this website are the property of
            </strong>{" "}
            <strong className="text-primary">K.P. Vidhyarthi Bhavan, Ellisbridge, Ahmedabad</strong>
            <strong className="text-foreground">.</strong> They are published here with
            acknowledgement for non-commercial demonstration purposes only. They may not be
            reproduced, redistributed or used commercially without the rights holder&rsquo;s permission.
          </p>
        </LegalNote>
        <p>
          The credit applies to the block photography on the home page, to the gallery, to the
          facilities and about pages, and to the architectural images used in the hero and preview
          sections. Please contact the hostel office if you require a higher-resolution original or
          permission for a different use.
        </p>
      </LegalSection>

      <LegalSection title="2. The hostel itself">
        <LegalList
          items={[
            <>
              <strong className="text-foreground">Name.</strong> K.P. Vidhyarthi Bhavan.
            </>,
            <>
              <strong className="text-foreground">Location.</strong> Near Patidar Society,
              Ellisbridge, Ahmedabad, Gujarat 380006, India.
            </>,
            <>
              <strong className="text-foreground">Rights in the imagery.</strong> Copyright of the
              photographs and of the hostel identity marks is retained by the hostel administration
              and the trust that manages it.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="3. This project">
        <LegalList
          items={[
            <>
              <strong className="text-foreground">Design, engineering and written content.</strong>{" "}
              Prince Patel, the project creator and engineer of this website.
            </>,
            <>
              <strong className="text-foreground">Project type.</strong> Independent project. Not affiliated with, endorsed by, or operated on behalf of K.P.
              Vidhyarthi Bhavan.
            </>
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Software and services">
        <LegalList
          items={[
            "Next.js, React and Tailwind CSS are used under the MIT licence.",
            "shadcn/ui components, Radix UI primitives and Lucide icons are used under the MIT licence.",
            "Icons from React Icons are used under their respective library licences.",
            "Typefaces are self-hosted through next/font/google and are licensed under the SIL Open Font License: Outfit, Plus Jakarta Sans, Geist, Geist Mono, Playfair Display, JetBrains Mono, Noto Sans Gujarati and Anek Gujarati.",
            "Images uploaded by users are hosted on Cloudinary and are delivered through the image optimisation pipeline.",
            "Maps are provided by Google Maps.",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Requesting a correction">
        <p>
          If you are the owner of any material published on this website and you would like it
          removed, replaced or credited differently, please raise the request through the contact
          form on this website and it will be actioned promptly.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
