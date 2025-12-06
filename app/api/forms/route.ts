import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Form from "@/models/Form";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const form = await Form.create({
      title: body.title || "Untitled Form",
      questions: body.questions || [],
      published: body.published || false,
    });

    return NextResponse.json({
      success: true,
      data: form,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
