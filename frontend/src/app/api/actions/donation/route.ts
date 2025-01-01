import { POST as handleDonation } from "@/app/actions/donation";
import { NextRequest, NextResponse } from "next/server";

// POST handler for donation processing
export async function POST(req: NextRequest, { params }: { params: { userid: string } }) {
  try {
    // Call the donation handler
    const response = await handleDonation(req, { params });
    
    // Return the response as JSON
    return NextResponse.json(response);
  } catch (err) {
    console.error("Error processing POST donation:", err);

    // Return an error response in case of failure
    return NextResponse.json(
      { message: "An error occurred while processing the donation request." },
      { status: 500 }
    );
  }
}
