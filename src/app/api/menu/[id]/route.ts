import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE = "https://api.svoy-lounge.kz/services/api/v3/menus/";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    // Fetch the list of all menus
    const res = await axios.get(API_BASE);
    const menus = res.data;

    if (!Array.isArray(menus)) {
        return NextResponse.json({ error: "Invalid API response format" }, { status: 500 });
    }

    // Find the requested menu based on numeric ID or string alias
    const targetMenu = menus.find((menu: any) => {
      // 1. Direct Numeric Match (e.g. if the frontend passes "1")
      if (Number(id) === menu.id) return true;
      
      // 2. Exact alias match for "common" -> ID 1
      if (id?.toLowerCase() === "common" && menu.id === 1) return true;
      
      // 3. Match against title_en (e.g., "summer" matches "SUMMER")
      if (menu.title_en && id && menu.title_en.toLowerCase() === id.toLowerCase()) return true;

      return false;
    });

    if (!targetMenu) {
        return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json(targetMenu);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: err.response?.status || 500 }
    );
  }
}