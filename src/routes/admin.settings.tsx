import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useAdminSiteSettings,
  useUpdateSiteSettings,
  useAdminContactSettings,
  useUpdateContactSettings,
} from "@/hooks/use-admin-data";
import { toast } from "sonner";
import { Settings, Save, Store, Phone, MapPin, Globe, Mail, Instagram, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const { data: siteSettings, isLoading: loadingSite } = useAdminSiteSettings();
  const { data: contactSettings, isLoading: loadingContact } = useAdminContactSettings();

  const updateSiteSettings = useUpdateSiteSettings();
  const updateContactSettings = useUpdateContactSettings();

  // Site Settings Form
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [footerText, setFooterText] = useState("");

  // Contact Settings Form
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  useEffect(() => {
    if (siteSettings) {
      setBrandName(siteSettings.brand_name || "MarkasMerchan");
      setTagline(siteSettings.tagline || "");
      setDescription(siteSettings.description || "");
      setLogoUrl(siteSettings.logo_url || "");
      setHeroTitle(siteSettings.hero_title || "");
      setHeroSubtitle(siteSettings.hero_subtitle || "");
      setFooterText(siteSettings.footer_text || "");
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
    }
  }, [contactSettings]);

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSiteSettings.mutateAsync({
        id: siteSettings?.id,
        brand_name: brandName.trim() || null,
        tagline: tagline.trim() || null,
        description: description.trim() || null,
        logo_url: logoUrl.trim() || null,
        hero_title: heroTitle.trim() || null,
        hero_subtitle: heroSubtitle.trim() || null,
        footer_text: footerText.trim() || null,
      });
      toast.success("Pengaturan situs berhasil disimpan!");
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan pengaturan situs.");
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContactSettings.mutateAsync({
        id: contactSettings?.id,
        whatsapp_number: whatsappNumber.trim() || null,
        email: email.trim() || null,
        address: address.trim() || null,
        business_hours: businessHours.trim() || null,
        instagram_url: instagramUrl.trim() || null,
        google_maps_url: googleMapsUrl.trim() || null,
      });
      toast.success("Informasi kontak berhasil disimpan!");
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan kontak.");
    }
  };

  if (loadingSite || loadingContact) {
    return (
      <div className="py-16 text-center text-ink/50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Memuat pengaturan situs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Pengaturan Situs & Kontak
        </h1>
        <p className="text-ink/50 text-sm">
          Sesuaikan branding website, konten hero section, dan nomor WhatsApp admin.
        </p>
      </div>

      <Tabs defaultValue="site" className="space-y-6">
        <TabsList className="bg-paper border border-ink/20 p-1 rounded-sm">
          <TabsTrigger value="site" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold rounded-lg">
            <Store className="h-4 w-4 mr-2" />
            Branding & Metadata
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold rounded-lg">
            <Phone className="h-4 w-4 mr-2" />
            Informasi Kontak & Lokasi
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Site Branding */}
        <TabsContent value="site">
          <form onSubmit={handleSaveSite} className="bg-paper border border-ink/20 rounded-sm p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-ink border-b border-ink/20 pb-2">
                Identitas Brand & SEO
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-ink/80">Nama Brand / Toko</Label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="MarkasMerchan"
                    className="bg-note border-ink/20 text-ink"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-ink/80">Tagline Website</Label>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Satu Tempat, Semua Kebutuhan Merch Lo."
                    className="bg-note border-ink/20 text-ink"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">URL Logo Brand</Label>
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-note border-ink/20 text-ink"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Deskripsi Toko (SEO)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vendor pembuatan apparel custom, t-shirt, hoodie, totebag..."
                  rows={3}
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-ink/20">
              <h2 className="text-lg font-bold text-ink border-b border-ink/20 pb-2">
                Konten Hero Section (Beranda)
              </h2>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Judul Utama (Hero Title)</Label>
                <Input
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Bikin Merch Impian Lo Tanpa Ribet"
                  className="bg-note border-ink/20 text-ink"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Sub-Judul Hero</Label>
                <Textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Solusi cetak merchandise berkualitas tinggi dengan harga kompetitif..."
                  rows={2}
                  className="bg-note border-ink/20 text-ink"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Teks Footer Website</Label>
                <Input
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="© 2026 MarkasMerchan. All rights reserved."
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={updateSiteSettings.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-sm shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {updateSiteSettings.isPending ? "Menyimpan..." : "Simpan Perubahan Situs"}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Tab 2: Contact Info */}
        <TabsContent value="contact">
          <form onSubmit={handleSaveContact} className="bg-paper border border-ink/20 rounded-sm p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-ink border-b border-ink/20 pb-2">
                Kontak & Customer Support
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-green-600" />
                    Nomor WhatsApp Admin (Format 62...)
                  </Label>
                  <Input
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="6281234567890"
                    className="bg-note border-ink/20 text-ink font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-400" />
                    Email Official
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="halo@markasmerchan.com"
                    className="bg-note border-ink/20 text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5 text-pink-400" />
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
                    <Clock className="h-3.5 w-3.5 text-ink" />
                    Jam Operasional / Work Hours
                  </Label>
                  <Input
                    value={businessHours}
                    onChange={(e) => setBusinessHours(e.target.value)}
                    placeholder="Senin - Sabtu: 09:00 - 18:00 WIB"
                    className="bg-note border-ink/20 text-ink"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-red-400" />
                  Alamat Lengkap Workshop / Kantor
                </Label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Merchandise No. 88, Jakarta Selatan, DKI Jakarta 12340"
                  rows={3}
                  className="bg-note border-ink/20 text-ink"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-cyan-400" />
                  URL Google Maps Embed / Link
                </Label>
                <Input
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={updateContactSettings.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-sm shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {updateContactSettings.isPending ? "Menyimpan..." : "Simpan Informasi Kontak"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
