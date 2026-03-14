import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE = "https://api.svoy-lounge.kz/services/api/v2/halls/";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    const res = await axios.get(`${API_BASE}${id}/`);
    return NextResponse.json(res.data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: err.response?.status || 500 }
    );
  }
}