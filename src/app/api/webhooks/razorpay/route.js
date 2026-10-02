import { NextResponse } from "next/server";
import { paymentService } from "@/services";
import { apiResponse, handleApiError } from "@/lib/response";

export async function POST(req) {
  try {
    const payload = await req.json();
    const signature = req.headers.get("x-razorpay-signature");
    const result = await paymentService.handleWebhook(payload, signature);
    return apiResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
