export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessment_results: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string | null
          difficulty: string
          id: string
          score: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          difficulty: string
          id?: string
          score: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          difficulty?: string
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          tier: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          tier: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          tier?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_all_day: boolean | null
          priority: string | null
          start_date: string
          title: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_all_day?: boolean | null
          priority?: string | null
          start_date: string
          title: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_all_day?: boolean | null
          priority?: string | null
          start_date?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          download_url: string | null
          earned_date: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          download_url?: string | null
          earned_date?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          download_url?: string | null
          earned_date?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_notes: {
        Row: {
          content: string
          course_id: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_notes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          assessment_score: number | null
          completed: boolean | null
          completed_lessons: number[] | null
          course_id: string | null
          current_lesson_index: number | null
          id: string
          last_accessed: string | null
          progress_percentage: number | null
          user_id: string | null
        }
        Insert: {
          assessment_score?: number | null
          completed?: boolean | null
          completed_lessons?: number[] | null
          course_id?: string | null
          current_lesson_index?: number | null
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          assessment_score?: number | null
          completed?: boolean | null
          completed_lessons?: number[] | null
          course_id?: string | null
          current_lesson_index?: number | null
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          field: string
          id: string
          lessons_count: number | null
          level: string
          rating: number | null
          reviews_count: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          field: string
          id?: string
          lessons_count?: number | null
          level: string
          rating?: number | null
          reviews_count?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          field?: string
          id?: string
          lessons_count?: number | null
          level?: string
          rating?: number | null
          reviews_count?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          event_id: string
          registration_date: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          registration_date?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          registration_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          location: string | null
          max_participants: number | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          location?: string | null
          max_participants?: number | null
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          location?: string | null
          max_participants?: number | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_discussions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_discussions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string | null
          id: string
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "forum_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_path_courses: {
        Row: {
          course_id: string
          learning_path_id: string
          order_index: number
        }
        Insert: {
          course_id: string
          learning_path_id: string
          order_index: number
        }
        Update: {
          course_id?: string
          learning_path_id?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_path_courses_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string
          estimated_time: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty: string
          estimated_time?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string
          estimated_time?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          location: string | null
          occupation: string | null
          phone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          occupation?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          occupation?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          color: string | null
          completed: boolean | null
          created_at: string | null
          due_date: string | null
          favorite: boolean | null
          id: string
          priority: string | null
          text: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          favorite?: boolean | null
          id?: string
          priority?: string | null
          text: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          favorite?: boolean | null
          id?: string
          priority?: string | null
          text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_date: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_id?: string | null
          earned_date?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_id?: string | null
          earned_date?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
