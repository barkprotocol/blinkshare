import { NextRequest, NextResponse } from "next/server";
import { POST as handleDonation } from "@/app/actions/donation";

// POST handler for donation processing based on dynamic user ID
export async function POST(req: NextRequest, { params }: { params: { userid: string } }) {
  try {
    // Call the donation handler, passing the request and the dynamic user ID
    const response = await handleDonation(req, { params });
    
    // Return the response as JSON
    return NextResponse.json(response);
  } catch (err) {
    console.error("Error processing POST donation for user:", params.userid, err);

    // Return an error response in case of failure
    return NextResponse.json(
      { message: "An error occurred while processing the donation request." },
      { status: 500 }
    );
  }
}
