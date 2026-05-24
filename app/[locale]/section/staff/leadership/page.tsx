import { notFound } from "next/navigation";
import { Link } from "../../../../../i18n/navigation";
import { SiteShell } from "../../../../components";
import { sections } from "../../../../data";

export default async function LeadershipPage() {
  const section = sections.find((s) => s.slug === "staff");
  const page = section?.links.find((p) => p.slug === "leadership");

  if (!section || !page) {
    notFound();
  }

  return (
    <SiteShell>
      <section className="subhero subhero--compact">
        <div>
          <Link href={`/section/${section.slug}`}>{section.title}</Link>
          <h1>{page.title}</h1>
        </div>
      </section>

      <section className="section-wrap">
        <div className="director-bio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/director.jpg"
            alt="Արմեն Հավհաննիսյան"
            className="director-photo"
          />
          <div className="director-header">
            <p className="director-role">Տնօրեն</p>
            <h2>Արմեն Հովհաննիսյան</h2>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
