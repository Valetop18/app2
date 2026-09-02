import { supabase } from "../constants/supabase";

export const profilesRepository = {
  async updateCircunscripcionAndDistrito(
    userId,
    circunscripcion,
    distrito,
    region,
    comuna,
  ) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          circunscripcion,
          distrito,
          region,
          comuna,
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(
        "Error actualizando circunscripción, distrito, región y comuna:",
        error,
      );

      throw error;
    }
  },
};