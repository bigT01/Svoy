import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE = "https://api.svoy-lounge.kz/services/api/v1/dishes/";

// GET /api/dishes — список блюд
export async function GET() {
  try {
    const res = await axios.get(API_BASE);
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Error in GET dishes:", err);
    return NextResponse.json({ error: err.message }, { status: err.response?.status || 500 });
  }
}