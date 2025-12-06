import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Form from "@/models/Form";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const form = await Form.findById(id);

    if (!form) {
      return NextResponse.json(
        { success: false, error: "Form not found" },
        { status: 404 }
      );
    }

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const form = await Form.findByIdAndUpdate(
      id,
      {
        title: body.title,
        questions: body.questions,
        published: body.published,
      },
      { new: true, runValidators: true }
    );

    if (!form) {
      return NextResponse.json(
        { success: false, error: "Form not found" },
        { status: 404 }
      );
    }

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
