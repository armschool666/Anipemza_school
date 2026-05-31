"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sections } from "../data";
import type { ImportedFile } from "../file-utils";
import { parseFileLinks, type AdminEntry } from "../material-types";
import {
  deleteEntry,
  deleteEntryFiles,
  deleteUploadedFile,
  fetchMaterials,
  logout,
  saveEntry,
  uploadFiles,
} from "./admin-api";
import { adminStrings as s } from "./admin-strings";
import { MaterialForm, type FormState } from "./material-form";
import { MaterialList } from "./material-list";

const firstSection = sections[0];
const firstPage = firstSection.links[0];

const emptyForm: FormState = {
  title: "",
  sectionSlug: firstSection.slug,
  pageSlug: firstPage.slug,
  body: "",
  files: "",
};

export function AdminPanel() {
  const router = useRouter();
  const [entries, setEntries] = useState<AdminEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [keptFiles, setKeptFiles] = useState<ImportedFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [showOnlySelectedPage, setShowOnlySelectedPage] = useState(true);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    fetchMaterials()
      .then(setEntries)
      .catch(() => setMessage(s.loadFailed));
  }, []);

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
    router.refresh();
  }

  async function handleRemoveKeptFile(file: ImportedFile) {
    setKeptFiles((prev) => prev.filter((f) => f.href !== file.href));
    await deleteUploadedFile(file.href);
  }

  function resetForm() {
    setEditingId(null);
    setKeptFiles([]);
    setSavedEntryId(null);
    setForm((current) => ({
      ...emptyForm,
      sectionSlug: current.sectionSlug,
      pageSlug: current.pageSlug,
    }));
  }

  function startEdit(entry: AdminEntry) {
    setEditingId(entry.id);
    setKeptFiles([...entry.files]);
    setSavedEntryId(null);
    setPreviewId(null);
    setForm({
      title: entry.title,
      sectionSlug: entry.sectionSlug,
      pageSlug: entry.pageSlug,
      body: entry.body,
      files: "",
    });
    setMessage(s.editing);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setMessage(s.fillTitleAndBody);
      return;
    }

    const selectedSection =
      sections.find((sec) => sec.slug === form.sectionSlug) ?? firstSection;
    const selectedPage =
      selectedSection.links.find((page) => page.slug === form.pageSlug) ??
      selectedSection.links[0];

    const formElement = event.currentTarget;
    const fileInput = formElement.elements.namedItem("uploadFiles") as HTMLInputElement | null;
    setIsSaving(true);
    setMessage("");

    try {
      const uploaded = await uploadFiles(fileInput?.files ?? null);
      const manualFiles = parseFileLinks(form.files);
      const allFiles = [...keptFiles, ...uploaded, ...manualFiles];

      const basePayload = {
        title: form.title.trim(),
        sectionSlug: selectedSection.slug,
        sectionTitle: selectedSection.title,
        pageSlug: selectedPage.slug,
        pageTitle: selectedPage.title,
        body: form.body.trim(),
        files: allFiles,
      };

      const payload = editingId
        ? {
            ...basePayload,
            id: editingId,
            date:
              entries.find((e) => e.id === editingId)?.date ??
              new Date().toISOString().slice(0, 10),
          }
        : basePayload;

      const saved = await saveEntry(payload, !!editingId);
      setEntries((current) =>
        editingId
          ? current.map((entry) => (entry.id === saved.id ? saved : entry))
          : [saved, ...current],
      );

      if (fileInput) fileInput.value = "";
      setSavedEntryId(saved.id);
      setEditingId(null);
      setKeptFiles([]);
      setForm((current) => ({
        ...emptyForm,
        sectionSlug: current.sectionSlug,
        pageSlug: current.pageSlug,
      }));
      setMessage(editingId ? s.updated : s.saved);
    } catch {
      setMessage(s.saveFailed);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemove(entry: AdminEntry) {
    if (!window.confirm(s.confirmDelete(entry.title))) return;
    try {
      await deleteEntryFiles(entry.files);
      const ok = await deleteEntry(entry.id);
      if (ok) {
        setEntries((current) => current.filter((item) => item.id !== entry.id));
        if (editingId === entry.id) resetForm();
        if (savedEntryId === entry.id) setSavedEntryId(null);
        setMessage(s.deleted);
      } else {
        setMessage(s.deleteFailed);
      }
    } catch {
      setMessage(s.deleteFailed);
    }
  }

  const savedEntry = savedEntryId ? entries.find((e) => e.id === savedEntryId) ?? null : null;

  return (
    <div>
      <div className="admin-tab-bar">
        <button type="button" className="logout-button" onClick={handleLogout}>
          {s.logout}
        </button>
      </div>

      <section className="admin-grid">
        <MaterialForm
          form={form}
          onFormChange={setForm}
          editingId={editingId}
          keptFiles={keptFiles}
          onRemoveKeptFile={handleRemoveKeptFile}
          isSaving={isSaving}
          message={message}
          savedEntry={savedEntry}
          onSubmit={handleSubmit}
          onCancelEdit={resetForm}
        />

        <MaterialList
          entries={entries}
          selectedSectionSlug={form.sectionSlug}
          selectedPageSlug={form.pageSlug}
          showOnlySelectedPage={showOnlySelectedPage}
          searchQuery={searchQuery}
          previewId={previewId}
          onToggleShowOnly={setShowOnlySelectedPage}
          onSearch={setSearchQuery}
          onEdit={startEdit}
          onTogglePreview={setPreviewId}
          onRemove={handleRemove}
        />
      </section>
    </div>
  );
}
