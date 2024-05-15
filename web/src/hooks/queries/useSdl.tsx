import { queryKeys } from "@/lib/consts";
import { db } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useSdl = () => {
  const { data: sdls } = useQuery({
    queryKey: [queryKeys.sdl],
    queryFn: async () => {
      const { data, error } = await db.from("sdl").select("*");
      if (error) throw error;
      return data;
    },
  });

  return sdls;
};
