import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useAdminSiteSettings,
  useUpdateSiteSettings,
  useAdminContactSettings,
  useUpdateContactSettings,
} from "@/hooks/use-admin-data";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { LandingPageSettingsForm } from "@/components/admin/LandingPageSettingsForm";
import { toast } from "sonner";
import {
  Settings,
  Save,
  Phone,
  MapPin,
  Globe,
  Mail,
  Instagram,
  Clock,
  Loader2,
  Image as ImageIcon,
  LayoutTemplate,
  FileText,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type ActiveSection = null | "hero" | "beranda" | "kontak" | "footer";

function AdminSettings() {
  const router = useRouter();
  const { data: siteSettings, isLoading: loadingSite } = useAdminSiteSettings();
  const { data: contactSettings, isLoading: loadingContact } = useAdminContactSettings();

  const updateSiteSettings = useUpdateSiteSettings();
  const updateContactSettings = useUpdateContactSettings();

  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  // Hero fields
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCtaPrimary, setHeroCtaPrimary] = useState("");
  const [heroCtaSecondary, setHeroCtaSecondary] = useState("");
  const [heroImage1, setHeroImage1] = useState("");
  const [heroImage2, setHeroImage2] = useState("");
  const [heroImage3, setHeroImage3] = useState("");

  // Footer field
  const [footerText, setFooterText] = useState("");

  // Contact fields
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [contactImage, setContactImage] = useState("");

  useEffect(() => {
    if (siteSettings) {
      setHeroTitle((siteSettings as any).hero_title || "");
      setHeroSubtitle((siteSettings as any).hero_subtitle || "");
      setFooterText((siteSettings as any).footer_text || "");
      const raw = siteSettings as any;
      setHeroImage1(raw.hero_image_1 || "");
      setHeroImage2(raw.hero_image_2 || "");
      setHeroImage3(raw.hero_image_3 || "");
      // Load CTA from landing_page_content
      const lp = raw.landing_page_content;
      setHeroCtaPrimary(lp?.hero?.cta_primary || "");
      setHeroCtaSecondary(lp?.hero?.cta_secondary || "");
    }
  }, [siteSettings]);

  useEffect(() => {
    if (contactSettings) {
      setWhatsappNumber(contactSettings.whatsapp_number || "");
      setEmail(contactSettings.email || "");
      setAddress(contactSettings.address || "");
      setBusinessHours(contactSettings.business_hours || "");
      setInstagramUrl(contactSettings.instagram_url || "");
      setGoogleMapsUrl(contactSettings.google_maps_url || "");
      setContactImage((contactSettings as any).contact_image || "");
    }
  }, [contactSettings]);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save hero images & text
      const currentLp = (siteSettings as any)?.landing_page_content || {};
      await updateSiteSettings.mutateAsync({
        id: siteSettings?.id,
        hero_title: heroTitle.trim() || null,
        hero_subtitle: heroSubtitle.trim() || null,
        hero_image_1: heroImage1.trim() || null,
        hero_image_2: heroImage2.trim() || null,
        hero_image_3: heroImage3.trim() || null,
        landing_page_content: {
          ...currentLp,
          hero: {
            ...(currentLp?.hero || {}),
            cta_primary: heroCtaPrimary.trim() || "Lihat Katalog Produk",
            cta_secondary: heroCtaSecondary.trim() || "Gratis konsultasi desain",
          }
        },
      } as any);
      toast.success("Hero section berhasil disimpan!");
      router.invalidate();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan.");
    }
  };

  const handleSaveFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSiteSettings.mutateAsync({
        id: siteSettings?.id,
        footer_text: footerText.trim() || null,
      } as any);
      toast.success("Footer berhasil disimpan!");
      router.invalidate();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan.");
    }
  };

  const handleSaveLandingPage = async (content: any) => {
    try {
      await updateSiteSettings.mutateAsync({
        id: siteSettings?.id,
        landing_page_content: content,
      } as any);
      toast.success("Konten halaman berhasil disimpan!");
      router.invalidate();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan konten.");
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContactSettings.mutateAsync({
        ...(contactSettings?.id ? { id: contactSettings.id } : {}),
        whatsapp_number: whatsappNumber.trim() || null,
        email: email.trim() || null,
        address: address.trim() || null,
        business_hours: businessHours.trim() || null,
        instagram_url: instagramUrl.trim() || null,
        google_maps_url: googleMapsUrl.trim() || null,
        contact_image: contactImage.trim() || null,
      } as any);
      toast.success("Informasi kontak berhasil disimpan!");
      router.invalidate();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan kontak.");
    }
  };

  if (loadingSite || loadingContact) {
    return (
      <div className="py-16 text-center text-ink/50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet" />
        <p className="text-sm">Memuat pengaturan situs...</p>
      </div>
    );
  }

  const sections = [
    {
      id: "hero" as ActiveSection,
      icon: <Sparkles className="h-5 w-5 text-yellow" />,
      title: "Hero Section",
      description: "Badge, tagline, tombol CTA, dan 3 foto showcase utama",
    },
    {
      id: "beranda" as ActiveSection,
      icon: <LayoutTemplate className="h-5 w-5 text-violet" />,
      title: "Halaman Beranda",
      description: "Konten section One Stop, Consultation, dan Bulk Order",
    },
    {
      id: "kontak" as ActiveSection,
      icon: <Phone className="h-5 w-5 text-green-600" />,
      title: "Kontak & Lokasi",
      description: "WhatsApp, email, Instagram, alamat, jam operasional",
    },
    {
      id: "footer" as ActiveSection,
      icon: <FileText className="h-5 w-5 text-ink/50" />,
      title: "Footer",
      description: "Teks copyright yang tampil di bagian bawah website",
    },
  ];

  const sectionTitles: Record<string, string> = {
    hero: "Hero Section",
    beranda: "Halaman Beranda",
    kontak: "Kontak & Lokasi",
    footer: "Footer",
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        {activeSection && (
          <button
            onClick={() => setActiveSection(null)}
            className="h-8 w-8 flex items-center justify-center rounded-sm border border-ink/20 hover:bg-ink/5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-ink" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold font-sans text-ink tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-violet" />
            {activeSection ? sectionTitles[activeSection] : "Pengaturan Situs"}
          </h1>
          <p className="text-ink/50 text-xs mt-0.5">
            {activeSection
              ? "Edit konten section ini, lalu klik Simpan."
              : "Pilih section yang ingin kamu kelola."}
          </p>
        </div>
      </div>

      {/* Section List */}
      {!activeSection && (
        <div className="bg-paper border border-ink/20 rounded-sm overflow-hidden divide-y divide-ink/10">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-ink/5 transition-colors group"
            >
              <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-sm bg-note border border-ink/10">
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink">{section.title}</p>
                <p className="text-xs text-ink/50 mt-0.5 truncate">{section.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-ink/30 group-hover:text-ink/60 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Section: Hero */}
      {activeSection === "hero" && (
        <form onSubmit={handleSaveHero} className="bg-paper border border-ink/20 rounded-sm p-6 space-y-6">
          {/* Teks */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-ink border-b border-ink/20 pb-2 uppercase tracking-wide">
              Teks Hero
            </h2>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Tagline (Teks Merah / Italic)</Label>
              <Input
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Satu Tempat, Semua Kebutuhan Merch Lo — Hasil rapi, Tepat Waktu, Bebas Ribet"
                className="bg-note border-ink/20 text-ink"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Badge (Teks Biru Kecil di Atas)</Label>
              <Textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Partner Custom Merch & Apparel Terpercaya untuk Kampus, Event, & Corporate"
                rows={2}
                className="bg-note border-ink/20 text-ink"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Teks Tombol Utama</Label>
                <Input
                  value={heroCtaPrimary}
                  onChange={(e) => setHeroCtaPrimary(e.target.value)}
                  placeholder="Lihat Katalog Produk"
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Teks Tombol Kedua (WhatsApp)</Label>
                <Input
                  value={heroCtaSecondary}
                  onChange={(e) => setHeroCtaSecondary(e.target.value)}
                  placeholder="Gratis konsultasi desain"
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
            </div>
          </div>
          {/* 3 Foto */}
          <div className="space-y-4 pt-2 border-t border-ink/20">
            <h2 className="text-sm font-bold text-ink border-b border-ink/20 pb-2 uppercase tracking-wide">
              3 Foto Showcase
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImageUploadInput
                label="Foto Hero 1"
                value={heroImage1}
                onChange={setHeroImage1}
                folder="hero"
                description="Foto kiri / atas"
              />
              <ImageUploadInput
                label="Foto Hero 2"
                value={heroImage2}
                onChange={setHeroImage2}
                folder="hero"
                description="Foto tengah"
              />
              <ImageUploadInput
                label="Foto Hero 3"
                value={heroImage3}
                onChange={setHeroImage3}
                folder="hero"
                description="Foto kanan / bawah"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end border-t border-ink/20">
            <button
              type="submit"
              disabled={updateSiteSettings.isPending}
              className="h-10 px-6 bg-ink text-paper font-bold text-sm rounded-sm shadow-cut hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {updateSiteSettings.isPending ? "Menyimpan..." : "Simpan Hero Section"}
            </button>
          </div>
        </form>
      )}

      {/* Section: Halaman Beranda */}
      {activeSection === "beranda" && (
        <LandingPageSettingsForm
          initialContent={(siteSettings?.landing_page_content as any) || null}
          onSave={handleSaveLandingPage}
          isPending={updateSiteSettings.isPending}
        />
      )}

      {/* Section: Kontak */}
      {activeSection === "kontak" && (
        <form onSubmit={handleSaveContact} className="bg-paper border border-ink/20 rounded-sm p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-ink border-b border-ink/20 pb-2 uppercase tracking-wide">
              Media Sosial & Komunikasi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-green-600" />
                  Nomor WhatsApp Admin *
                </Label>
                <Input
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="6281234567890 (tanpa +)"
                  required
                  className="bg-note border-ink/20 text-ink font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-sky" />
                  Email Official
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@markasmerchan.com"
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                  <Instagram className="h-3.5 w-3.5 text-pink-600" />
                  URL Instagram
                </Label>
                <Input
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/markasmerchan"
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-yellow" />
                  Jam Operasional
                </Label>
                <Input
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder="Senin - Sabtu: 09.00 - 18.00 WIB"
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-ink/20">
            <h2 className="text-sm font-bold text-ink border-b border-ink/20 pb-2 uppercase tracking-wide">
              Lokasi
            </h2>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-red" />
                Alamat Workshop
              </Label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Merchandise Raya No. 88, Jakarta Selatan..."
                rows={3}
                className="bg-note border-ink/20 text-ink"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-violet" />
                URL Google Maps
              </Label>
              <Input
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="bg-note border-ink/20 text-ink"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-ink/20">
            <h2 className="text-sm font-bold text-ink border-b border-ink/20 pb-2 uppercase tracking-wide">
              Foto Section Kontak
            </h2>
            <ImageUploadInput
              label="Foto Brand (Section Kontak)"
              value={contactImage}
              onChange={setContactImage}
              folder="contact"
              description="Foto yang tampil di section kontak halaman depan & halaman Contact."
            />
          </div>

          <div className="pt-2 flex justify-end border-t border-ink/20">
            <button
              type="submit"
              disabled={updateContactSettings.isPending}
              className="h-10 px-6 bg-ink text-paper font-bold text-sm rounded-sm shadow-cut hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {updateContactSettings.isPending ? "Menyimpan..." : "Simpan Kontak & Lokasi"}
            </button>
          </div>
        </form>
      )}

      {/* Section: Footer */}
      {activeSection === "footer" && (
        <form onSubmit={handleSaveFooter} className="bg-paper border border-ink/20 rounded-sm p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-ink border-b border-ink/20 pb-2 uppercase tracking-wide">
              Teks Footer
            </h2>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Teks Copyright Footer</Label>
              <Input
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="© 2026 MarkasMerchan. All rights reserved."
                className="bg-note border-ink/20 text-ink"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end border-t border-ink/20">
            <button
              type="submit"
              disabled={updateSiteSettings.isPending}
              className="h-10 px-6 bg-ink text-paper font-bold text-sm rounded-sm shadow-cut hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {updateSiteSettings.isPending ? "Menyimpan..." : "Simpan Footer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
