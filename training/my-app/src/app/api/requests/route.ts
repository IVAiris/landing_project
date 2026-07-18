import { NextResponse } from "next/server";
import { z } from "zod";
import { requestSchema } from "@/lib/validation/requestSchema";

export async function POST(request: Request) {
  const body = await request.json();
  const result = requestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        message: "Проверьте правильность заполнения формы",
        errors: z.flattenError(result.error).fieldErrors,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "API-роут работает",
    received: result.data,
  });
}
