import { supabase } from "../constants/supabase";

export const reaccionesRepository = {
  async setReaccion(userId, targetId, targetType, tipoReaccion) {
    //actualizar reacciones
    //guardar reaccion
    const { data, error } = await supabase
      .from("user_reacciones")
      .upsert(
        {
          user_id: userId,
          target_id: Number(targetId),
          target_type: targetType,
          tipo_reaccion: tipoReaccion,
        },
        { onConflict: "user_id, target_id, target_type" },
      )
      .select();

    if (error) throw error;
    return data;
  },

  async getReacciones(userId, targetType) {
    const { data, error } = await supabase
      .from("user_reacciones")
      .select("target_id, tipo_reaccion")
      .eq("user_id", userId)
      .eq("target_type", targetType);

    if (error) throw error;
    return data;
  },

  async getReaccion(userId, targetId, targetType) {
    const { data, error } = await supabase
      .from("user_reacciones")
      .select("tipo_reaccion")
      .eq("user_id", userId)
      .eq("target_id", targetId)
      .eq("target_type", targetType)
      .maybeSingle();

    if (error) throw error;
    return data ? data.tipo_reaccion : null;
  },

  async getTotalesReaccionVotacion(idVotacion) {
    try {
      const { data, error } = await supabase.rpc("total_reacciones_votacion", {
        p_id_votacion: Number(idVotacion),
      });

      if (error) throw error;

      const resultado = data?.[0];

      return {
        totalLikes: Number(resultado?.total_likes ?? 0),
        totalDislikes: Number(resultado?.total_dislikes ?? 0),
      };
    } catch (error) {
      console.error("Error al obtener totales de reacción:", error.message);

      return {
        totalLikes: 0,
        totalDislikes: 0,
      };
    }
  },
};
