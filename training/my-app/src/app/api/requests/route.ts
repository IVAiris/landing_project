import { NextResponse } from "next/server";
import { z } from "zod";
import { requestSchema } from "@/lib/validation/requestSchema";
import { saveRequest } from "@/lib/db";

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

  try {
    await saveRequest(result.data);
  } catch {
    return NextResponse.json(
      { message: "Не удалось сохранить заявку, попробуйте позже" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Заявка сохранена",
  });
}
