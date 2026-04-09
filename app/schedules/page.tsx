import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .order("work_date", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error("GET /api/schedules error:", error);
      return NextResponse.json(
        { error: "予定取得に失敗しました", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("GET /api/schedules catch:", error);
    return NextResponse.json(
      { error: "予定取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const work_date = body.work_date ?? body.date ?? "";
    const worker_name = body.worker_name ?? body.worker ?? body.name ?? "";
    const site_name = body.site_name ?? body.site ?? body.genba ?? "";
    const work_type = body.work_type ?? body.content ?? body.description ?? "";

    if (!work_date || !worker_name) {
      return NextResponse.json(
        { error: "日付と作業員名は必須です" },
        { status: 400 }
      );
    }

    const insertData = {
      work_date,
      worker_name,
      site_name,
      work_type,
    };

    const { data, error } = await supabase
      .from("schedules")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("POST /api/schedules error:", error);
      return NextResponse.json(
        { error: "予定登録に失敗しました", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/schedules catch:", error);
    return NextResponse.json(
      { error: "予定登録中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
