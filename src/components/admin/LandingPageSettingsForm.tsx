import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import type { LandingPageContent } from "@/lib/content-types";
import { SITE_FALLBACK, deepMerge } from "@/lib/content-defaults";
import { ImageUploadInput } from "./ImageUploadInput";

export function LandingPageSettingsForm({
  initialContent,
  onSave,
  isPending
}: {
  initialContent: any | null;
  onSave: (content: LandingPageContent) => void;
  isPending: boolean;
}) {
  const [content, setContent] = useState<LandingPageContent | null>(null);

  useEffect(() => {
    // If there's no initial content or it's an empty object, fallback to defaults
    // Also merge the object to ensure deeply nested keys exist
    const hasData = initialContent && Object.keys(initialContent).length > 0;
    if (hasData) {
      setContent(deepMerge(SITE_FALLBACK.landing_page_content, initialContent));
    } else {
      setContent(SITE_FALLBACK.landing_page_content);
    }
  }, [initialContent]);

  if (!content) return null;

  const updateNested = (section: keyof LandingPageContent, field: string, value: any) => {
    setContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value
        }
      };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(content);
  };

  return (
    <form onSubmit={handleSave} className="bg-paper border border-ink/20 rounded-sm p-6 space-y-8">
      {/* One Stop Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-ink border-b border-ink/20 pb-2">One Stop Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul (Awal)</Label>
            <Input value={content.one_stop.title_start} onChange={e => updateNested("one_stop", "title_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul (Highlight Italic)</Label>
            <Input value={content.one_stop.title_highlight} onChange={e => updateNested("one_stop", "title_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Deskripsi</Label>
          <Textarea value={content.one_stop.description} onChange={e => updateNested("one_stop", "description", e.target.value)} className="bg-note border-ink/20 text-ink" rows={3} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Label (Pisahkan dengan koma)</Label>
          <Input value={content.one_stop.labels.join(", ")} onChange={e => updateNested("one_stop", "labels", e.target.value.split(",").map(s => s.trim()))} className="bg-note border-ink/20 text-ink" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Kartu (Awal)</Label>
            <Input value={content.one_stop.card_title_start} onChange={e => updateNested("one_stop", "card_title_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Kartu (Highlight)</Label>
            <Input value={content.one_stop.card_title_highlight} onChange={e => updateNested("one_stop", "card_title_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Deskripsi Kartu</Label>
          <Textarea value={content.one_stop.card_description} onChange={e => updateNested("one_stop", "card_description", e.target.value)} className="bg-note border-ink/20 text-ink" rows={2} />
        </div>
        <ImageUploadInput label="Foto Section One Stop" value={content.one_stop.image || ""} onChange={(v) => updateNested("one_stop", "image", v || null)} folder="landing" description="Foto katalog di samping kartu One Stop." />
      </div>

      {/* Why MarkasMerchan */}
      <div className="space-y-4 pt-4 border-t border-ink/20">
        <h2 className="text-base font-bold text-ink border-b border-ink/20 pb-2">Why MarkasMerchan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul (Awal)</Label>
            <Input value={content.why.title_start} onChange={e => updateNested("why", "title_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul (Highlight Italic)</Label>
            <Input value={content.why.title_highlight} onChange={e => updateNested("why", "title_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-ink/80">Nilai/Alasan</Label>
          {content.why.values.map((v, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2 rounded-sm border border-ink/15 bg-note p-3">
              <div className="min-w-[200px] flex-1 space-y-1">
                <Label className="text-[10px] uppercase text-ink/60">Teks</Label>
                <Input
                  value={v.title}
                  onChange={e => {
                    const values = content.why.values.map((x, j) => j === i ? { ...x, title: e.target.value } : x);
                    updateNested("why", "values", values);
                  }}
                  className="bg-paper border-ink/20 text-ink"
                />
              </div>
              <div className="w-36 space-y-1">
                <Label className="text-[10px] uppercase text-ink/60">Warna</Label>
                <select
                  value={v.color}
                  onChange={e => {
                    const values = content.why.values.map((x, j) => j === i ? { ...x, color: e.target.value } : x);
                    updateNested("why", "values", values);
                  }}
                  className="h-9 w-full rounded-sm border border-ink/20 bg-paper px-2 text-sm text-ink"
                >
                  <option value="bg-paper">Putih</option>
                  <option value="bg-sky">Biru</option>
                  <option value="bg-yellow">Kuning</option>
                  <option value="bg-red">Merah</option>
                </select>
              </div>
              <div className="w-28 space-y-1">
                <Label className="text-[10px] uppercase text-ink/60">Kemiringan</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={v.rot}
                  onChange={e => {
                    const values = content.why.values.map((x, j) => j === i ? { ...x, rot: Number(e.target.value) || 0 } : x);
                    updateNested("why", "values", values);
                  }}
                  className="bg-paper border-ink/20 text-ink"
                />
              </div>
              <button
                type="button"
                onClick={() => updateNested("why", "values", content.why.values.filter((_, j) => j !== i))}
                className="h-9 rounded-sm border border-ink/20 px-3 text-xs font-semibold text-ink/70 hover:bg-ink/5"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => updateNested("why", "values", [...content.why.values, { title: "", color: "bg-paper", rot: 0 }])}
            className="rounded-sm border border-ink/30 px-3 py-2 text-xs font-semibold text-ink hover:bg-ink/5"
          >
            + Tambah nilai
          </button>
        </div>

      </div>

      {/* Consultation Section */}
      <div className="space-y-4 pt-4 border-t border-ink/20">
        <h2 className="text-base font-bold text-ink border-b border-ink/20 pb-2">Design Consultation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul (Awal)</Label>
            <Input value={content.consultation.title_start} onChange={e => updateNested("consultation", "title_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul (Highlight)</Label>
            <Input value={content.consultation.title_highlight} onChange={e => updateNested("consultation", "title_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Deskripsi</Label>
          <Textarea value={content.consultation.description} onChange={e => updateNested("consultation", "description", e.target.value)} className="bg-note border-ink/20 text-ink" rows={3} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Teks Tombol</Label>
          <Input value={content.consultation.button_text} onChange={e => updateNested("consultation", "button_text", e.target.value)} className="bg-note border-ink/20 text-ink" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Judul Kartu</Label>
          <Input value={content.consultation.card_title} onChange={e => updateNested("consultation", "card_title", e.target.value)} className="bg-note border-ink/20 text-ink" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Fitur (Pisahkan dengan koma)</Label>
          <Input value={content.consultation.features.join(", ")} onChange={e => updateNested("consultation", "features", e.target.value.split(",").map(s => s.trim()))} className="bg-note border-ink/20 text-ink" />
        </div>
      </div>

      {/* Bulk Order */}
      <div className="space-y-4 pt-4 border-t border-ink/20">
        <h2 className="text-base font-bold text-ink border-b border-ink/20 pb-2">Bulk Order</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul (Awal)</Label>
            <Input value={content.bulk_order.title_start} onChange={e => updateNested("bulk_order", "title_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul (Highlight)</Label>
            <Input value={content.bulk_order.title_highlight} onChange={e => updateNested("bulk_order", "title_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Deskripsi</Label>
          <Textarea value={content.bulk_order.description} onChange={e => updateNested("bulk_order", "description", e.target.value)} className="bg-note border-ink/20 text-ink" rows={3} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Target/Pita (Pisahkan dengan koma)</Label>
          <Input value={content.bulk_order.targets.join(", ")} onChange={e => updateNested("bulk_order", "targets", e.target.value.split(",").map(s => s.trim()))} className="bg-note border-ink/20 text-ink" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Teks Tombol</Label>
          <Input value={content.bulk_order.button_text} onChange={e => updateNested("bulk_order", "button_text", e.target.value)} className="bg-note border-ink/20 text-ink" />
        </div>
      </div>


      {/* Hero Section */}
      <div className="space-y-4 pt-4 border-t border-ink/20">
        <h2 className="text-base font-bold text-ink border-b border-ink/20 pb-2">Hero (Tombol & Teks Berjalan)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Teks Tombol Utama</Label>
            <Input value={content.hero.cta_primary} onChange={e => updateNested("hero", "cta_primary", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Teks Tombol Kedua (WhatsApp)</Label>
            <Input value={content.hero.cta_secondary} onChange={e => updateNested("hero", "cta_secondary", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Teks Berjalan Beranda</Label>
          <Input value={content.hero.marquee_text} onChange={e => updateNested("hero", "marquee_text", e.target.value)} className="bg-note border-ink/20 text-ink" />
        </div>
      </div>

      {/* Products Page */}
      <div className="space-y-4 pt-4 border-t border-ink/20">
        <h2 className="text-base font-bold text-ink border-b border-ink/20 pb-2">Halaman Our Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul (Awal)</Label>
            <Input value={content.products_page.hero_title_start} onChange={e => updateNested("products_page", "hero_title_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul (Highlight)</Label>
            <Input value={content.products_page.hero_title_highlight} onChange={e => updateNested("products_page", "hero_title_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Deskripsi</Label>
          <Textarea value={content.products_page.description} onChange={e => updateNested("products_page", "description", e.target.value)} className="bg-note border-ink/20 text-ink" rows={3} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Teks Berjalan</Label>
          <Input value={content.products_page.marquee_text} onChange={e => updateNested("products_page", "marquee_text", e.target.value)} className="bg-note border-ink/20 text-ink" />
        </div>
      </div>

      {/* About Page */}
      <div className="space-y-4 pt-4 border-t border-ink/20">
        <h2 className="text-base font-bold text-ink border-b border-ink/20 pb-2">Halaman About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Header (Awal)</Label>
            <Input value={content.about_page.hero_title_start} onChange={e => updateNested("about_page", "hero_title_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Header (Highlight)</Label>
            <Input value={content.about_page.hero_title_highlight} onChange={e => updateNested("about_page", "hero_title_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Section (Awal)</Label>
            <Input value={content.about_page.title_start} onChange={e => updateNested("about_page", "title_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Section (Highlight)</Label>
            <Input value={content.about_page.title_highlight} onChange={e => updateNested("about_page", "title_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Paragraf 1</Label>
          <Textarea value={content.about_page.paragraph_1} onChange={e => updateNested("about_page", "paragraph_1", e.target.value)} className="bg-note border-ink/20 text-ink" rows={3} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Paragraf 2 (opsional)</Label>
          <Textarea value={content.about_page.paragraph_2} onChange={e => updateNested("about_page", "paragraph_2", e.target.value)} className="bg-note border-ink/20 text-ink" rows={3} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploadInput label="Foto About 1" value={content.about_page.image_1 || ""} onChange={(v) => updateNested("about_page", "image_1", v || null)} folder="about" description="Foto studio/brand ke-1." />
          <ImageUploadInput label="Foto About 2" value={content.about_page.image_2 || ""} onChange={(v) => updateNested("about_page", "image_2", v || null)} folder="about" description="Foto studio/brand ke-2." />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Teks Berjalan</Label>
          <Input value={content.about_page.marquee_text} onChange={e => updateNested("about_page", "marquee_text", e.target.value)} className="bg-note border-ink/20 text-ink" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Kartu "Siapa yang kami layani"</Label>
            <Input value={content.about_page.serve_title} onChange={e => updateNested("about_page", "serve_title", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Daftar Klien (pisahkan koma)</Label>
            <Input value={content.about_page.serve_items.join(", ")} onChange={e => updateNested("about_page", "serve_items", e.target.value.split(",").map(s => s.trim()))} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Judul Kartu "Cara kerja kami"</Label>
          <Input value={content.about_page.how_title} onChange={e => updateNested("about_page", "how_title", e.target.value)} className="bg-note border-ink/20 text-ink" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Deskripsi Cara Kerja</Label>
          <Textarea value={content.about_page.how_description} onChange={e => updateNested("about_page", "how_description", e.target.value)} className="bg-note border-ink/20 text-ink" rows={3} />
        </div>
      </div>

      {/* Contact Page */}
      <div className="space-y-4 pt-4 border-t border-ink/20">
        <h2 className="text-base font-bold text-ink border-b border-ink/20 pb-2">Halaman Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Header (Awal)</Label>
            <Input value={content.contact_page.hero_title_start} onChange={e => updateNested("contact_page", "hero_title_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Header (Highlight)</Label>
            <Input value={content.contact_page.hero_title_highlight} onChange={e => updateNested("contact_page", "hero_title_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Kartu (Awal)</Label>
            <Input value={content.contact_page.card_title_start} onChange={e => updateNested("contact_page", "card_title_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Kartu (Highlight)</Label>
            <Input value={content.contact_page.card_title_highlight} onChange={e => updateNested("contact_page", "card_title_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Deskripsi Kartu</Label>
          <Textarea value={content.contact_page.description} onChange={e => updateNested("contact_page", "description", e.target.value)} className="bg-note border-ink/20 text-ink" rows={3} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Teks Tombol WhatsApp</Label>
            <Input value={content.contact_page.wa_button_text} onChange={e => updateNested("contact_page", "wa_button_text", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Teks Tombol Instagram</Label>
            <Input value={content.contact_page.ig_button_text} onChange={e => updateNested("contact_page", "ig_button_text", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Judul Info Kontak</Label>
            <Input value={content.contact_page.info_title} onChange={e => updateNested("contact_page", "info_title", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
        <ImageUploadInput label="Foto Halaman Contact" value={content.contact_page.image || ""} onChange={(v) => updateNested("contact_page", "image", v || null)} folder="contact" description="Foto brand di section kontak." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Teks Penutup (Awal)</Label>
            <Input value={content.contact_page.closing_start} onChange={e => updateNested("contact_page", "closing_start", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ink/80">Teks Penutup (Highlight)</Label>
            <Input value={content.contact_page.closing_highlight} onChange={e => updateNested("contact_page", "closing_highlight", e.target.value)} className="bg-note border-ink/20 text-ink" />
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="space-y-4 pt-4 border-t border-ink/20">
        <h2 className="text-base font-bold text-ink border-b border-ink/20 pb-2">Marquee (Teks Berjalan)</h2>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-ink/80">Teks</Label>
          <Input value={content.marquee.text} onChange={e => updateNested("marquee", "text", e.target.value)} className="bg-note border-ink/20 text-ink" />
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-ink/20">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 px-6 bg-ink text-paper font-bold text-sm rounded-sm shadow-cut hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Menyimpan..." : "Simpan Konten Landing Page"}
        </button>
      </div>
    </form>
  );
}
