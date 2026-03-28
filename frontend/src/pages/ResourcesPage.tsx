import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/common/SectionHeader";
import Hero from "../components/Hero";
import { fetchPublicResources, type PublicResource } from "../utils/backend";

const ResourcesPage = () => {
  const [allResources, setAllResources] = useState<PublicResource[]>([]);
  const previewCount = 3;
  const [showAllResources, setShowAllResources] = useState(false);
  const getFileTypeLabel = (file: string) => {
    try {
      const url = new URL(file, window.location.origin);
      const nameFromPath = url.pathname.split("/").pop() || "";
      const extMatch = nameFromPath.match(/\.([a-z0-9]+)$/i);
      const extension = extMatch?.[1]?.toLowerCase() || "";
      if (!extension) {
        return "File";
      }
      if (extension === "jpeg") {
        return "JPG";
      }
      return extension.toUpperCase();
    } catch {
      const extMatch = file.match(/\.([a-z0-9]+)(\?.*)?$/i);
      const extension = extMatch?.[1]?.toLowerCase() || "";
      if (!extension) {
        return "File";
      }
      if (extension === "jpeg") {
        return "JPG";
      }
      return extension.toUpperCase();
    }
  };
  const getDownloadName = (file: string, title: string) => {
    try {
      const cleanTitle = title.trim() ? title.trim().replace(/\s+/g, "-") : "resource";
      const url = new URL(file, window.location.origin);
      const nameFromPath = url.pathname.split("/").pop() || "";
      const extMatch = nameFromPath.match(/\.[a-z0-9]+$/i);
      const extension = extMatch ? extMatch[0] : ".pdf";
      return `${cleanTitle}${extension}`;
    } catch {
      return title.trim() ? `${title.trim().replace(/\s+/g, "-")}.pdf` : "resource.pdf";
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchPublicResources()
      .then((resources) => {
        if (isMounted) setAllResources(resources);
      })
      .catch((error) => console.error("Failed to load resources", error));
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16">
      <Hero
        title="Resources"
        highlight="Download & Grow"
        subtitle="Download sermon outlines, bible study notes, and more."
        image="/bible.jpeg"
      />

      <section className="section-shell">
        <SectionHeader
          eyebrow="Weekly"
          title="Weekly Resources"
          subtitle="Download outlines for Bible Study, Sunday School, and more."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {(showAllResources ? allResources : allResources.slice(0, previewCount)).map((resource) => (
            <div key={resource.id || `${resource.title}-${resource.date}`} className="card text-left">
              <h3 className="text-xl font-semibold text-brand-navy">{resource.title}</h3>
              <p className="text-sm text-slate-600">{resource.date}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue">
                {getFileTypeLabel(resource.file)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={resource.file}
                  download={getDownloadName(resource.file, resource.title)}
                  className="btn-primary"
                >
                  Download file
                </a>
                <a href={resource.file} target="_blank" rel="noreferrer" className="btn-ghost">
                  Preview
                </a>
              </div>
            </div>
          ))}
        </div>
        {allResources.length > previewCount && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllResources((prev) => !prev)}
              className="btn-ghost"
            >
              {showAllResources ? "Show Less" : "See More Resources"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ResourcesPage;
