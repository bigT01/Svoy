import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE = "https://api.svoy-lounge.kz/services/api/v2/halls/";

export async function GET(req: Request) {
  try {
    const url = req.url.split("/api/halls")[1] || "";
    const res = await axios.get(`${API_BASE}${url}`);
    return NextResponse.json(res.data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: err.response?.status || 500 }
    );
  }
}