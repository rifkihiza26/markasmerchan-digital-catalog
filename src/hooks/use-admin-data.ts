import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { uploadMediaFile, MEDIA_BUCKET } from "@/lib/storage";

// ==================== PRODUCTS ====================
export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_categories(name)")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TablesInsert<"products">) => {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: TablesUpdate<"products"> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}

// ==================== CATEGORIES ====================
export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TablesInsert<"product_categories">) => {
      const { data, error } = await supabase
        .from("product_categories")
        .insert(payload)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: TablesUpdate<"product_categories"> & { id: string }) => {
      const { data, error } = await supabase
        .from("product_categories")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}

// ==================== PROJECTS ====================
export function useAdminProjects() {
  return useQuery({
    queryKey: ["admin", "projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TablesInsert<"projects">) => {
      const { data, error } = await supabase
        .from("projects")
        .insert(payload)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: TablesUpdate<"projects"> & { id: string }) => {
      const { data, error } = await supabase
        .from("projects")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// ==================== PARTNERS ====================
export function useAdminPartners() {
  return useQuery({
    queryKey: ["admin", "partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TablesInsert<"partners">) => {
      const { data, error } = await supabase
        .from("partners")
        .insert(payload)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: TablesUpdate<"partners"> & { id: string }) => {
      const { data, error } = await supabase
        .from("partners")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
  });
}

// ==================== SETTINGS ====================
export function useAdminSiteSettings() {
  return useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: TablesUpdate<"site_settings"> & { id?: string }) => {
      // Find existing row ID if not provided
      let targetId = id;
      if (!targetId) {
        const { data: existing } = await supabase
          .from("site_settings")
          .select("id")
          .limit(1)
          .maybeSingle();
        if (existing?.id) {
          targetId = existing.id;
        }
      }

      if (targetId) {
        const { data, error } = await supabase
          .from("site_settings")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", targetId)
          .select()
          .maybeSingle();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("site_settings")
          .insert(payload as TablesInsert<"site_settings">)
          .select()
          .maybeSingle();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      queryClient.invalidateQueries({ queryKey: ["site_context"] });
    },
  });
}

export function useAdminContactSettings() {
  return useQuery({
    queryKey: ["admin", "contact_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateContactSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: TablesUpdate<"contact_settings"> & { id?: string }) => {
      let targetId = id;
      if (!targetId) {
        const { data: existing } = await supabase
          .from("contact_settings")
          .select("id")
          .limit(1)
          .maybeSingle();
        if (existing?.id) {
          targetId = existing.id;
        }
      }

      if (targetId) {
        const { data, error } = await supabase
          .from("contact_settings")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", targetId)
          .select()
          .maybeSingle();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("contact_settings")
          .insert(payload as TablesInsert<"contact_settings">)
          .select()
          .maybeSingle();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contact_settings"] });
      queryClient.invalidateQueries({ queryKey: ["site_context"] });
    },
  });
}

// ==================== MEDIA ASSETS ====================
export function useAdminMediaAssets() {
  return useQuery({
    queryKey: ["admin", "media_assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("media_assets query error:", error);
        return [];
      }
      return data ?? [];
    },
  });
}

export function useUploadMediaAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, folder = "uploads" }: { file: File; folder?: string }) => {
      const { path, url } = await uploadMediaFile(file, folder);

      const { data, error } = await supabase
        .from("media_assets")
        .insert({
          file_name: file.name,
          path,
          public_url: url,
          mime_type: file.type,
          size_bytes: file.size,
          folder,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "media_assets"] });
    },
  });
}

export function useDeleteMediaAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, path }: { id: string; path?: string }) => {
      if (path) {
        await supabase.storage.from(MEDIA_BUCKET).remove([path]);
      }
      const { error } = await supabase.from("media_assets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "media_assets"] });
    },
  });
}
