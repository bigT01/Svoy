import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE = "https://api.svoy-lounge.kz/services/api/v3/menus/";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const res = await axios.get(`${API_BASE}${params.id}/`);
    return NextResponse.json(res.data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: err.response?.status || 500 }
    );
  }
}