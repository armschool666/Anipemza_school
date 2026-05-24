import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "../../../../i18n/navigation";
import { SiteShell } from "../../../components";
import { sections } from "../../../data";

export function generateStaticParams() {
  return sections.map((section) => ({ slug: section.slug }));
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations();
  const section = sections.find((item) => item.slug === slug);

  if (!section) {
    notFound();
  }

  return (
    <SiteShell>
      <section className="subhero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={section.image} alt={section.title} loading="lazy" />
        <div>
          <Link href="/">{t("section.homeLink")}</Link>
          <h1>{section.title}</h1>
          <p>{section.description}</p>
        </div>
      </section>

      <section className="section-wrap">
        <div className="section-heading">
          <p className="eyebrow">{t("section.structureEyebrow")}</p>
          <h2>{section.title}</h2>
        </div>
        <div className="list-grid">
          {section.links.map((link) => (
            <Link
              className="list-card"
              href={`/section/${section.slug}/${link.slug}`}
              key={link.slug}
            >
              <div>
                <h3>{link.title}</h3>
                <p>{link.body}</p>
              </div>
              <span className="list-card-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
