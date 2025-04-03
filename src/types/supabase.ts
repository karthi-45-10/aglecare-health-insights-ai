
import { Database as OriginalDatabase } from "@/integrations/supabase/types";

// Extend the original Database type with our custom tables
export interface Database extends OriginalDatabase {
  public: {
    Tables: {
      health_analyses: {
        Row: {
          id: string;
          user_id: string;
          symptoms: string;
          input_type: string;
          analysis: string;
          recommendation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symptoms: string;
          input_type: string;
          analysis: string;
          recommendation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symptoms?: string;
          input_type?: string;
          analysis?: string;
          recommendation?: string | null;
          created_at?: string;
        };
      };
    } & OriginalDatabase["public"]["Tables"];
    Views: OriginalDatabase["public"]["Views"];
    Functions: OriginalDatabase["public"]["Functions"];
    Enums: OriginalDatabase["public"]["Enums"];
    CompositeTypes: OriginalDatabase["public"]["CompositeTypes"];
  };
}
