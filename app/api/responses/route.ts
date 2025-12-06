import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Response from "@/models/Response";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const response = await Response.create({
      formId: body.formId,
      answers: body.answers,
    });

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
