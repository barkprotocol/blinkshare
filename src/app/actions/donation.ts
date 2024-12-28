import { ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { sendDonationEmail } from "@/app/utils/emailService";
import { getUserData } from "@/app/firebase/store";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "@/app/firebase/config";

// Conversion: 1 BARK = 0.0000001 SOL (0.00001 USD assuming 1 SOL = 220 USD)
const BARK_PRICE_IN_SOL = 0.0000001;

export const POST = async (req: Request, { params }: { params: { userid: string } }) => {
  try {
    const { userid } = params;

    // Fetch user data
    const { userData, error } = await getUserData(userid);
    if (!userData || error) {
      throw new Error("User data not found");
    }

    // Extract query parameters (name, message, amount)
    const url = new URL(req.url);
    const name = url.searchParams.get("name");
    const message = url.searchParams.get("message");
    let amount = url.searchParams.get("amount") || url.searchParams.get("customAmount");

    if (!amount) {
      throw new Error("Amount is required");
    }

    // Parse amount and validate
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Amount must be a positive number");
    }

    if (amount > 10) {
      throw new Error(`Donation exceeds the maximum allowed amount of 10 BARK`);
    }

    // Convert BARK amount to SOL
    const solAmount = amount * BARK_PRICE_IN_SOL;

    const body = await req.json();

    // Validate account provided in the request
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
      if (!PublicKey.isOnCurve(account)) {
        throw new Error("Invalid Solana public key provided");
      }
    } catch (err) {
      throw new Error("Invalid 'account' provided. It's not a valid pubkey");
    }

    // Setup Solana connection and transaction
    const connection = new Connection(clusterApiUrl("devnet"));
    const TO_PUBKEY = new PublicKey(userData.walletAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: account,
        lamports: solAmount * LAMPORTS_PER_SOL,
        toPubkey: TO_PUBKEY,
      })
    );

    transaction.feePayer = account;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    // Send email confirmation (if user has an email)
    if (userData.email) {
      try {
        await sendDonationEmail(userData.email, solAmount, name, message);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    }

    // Update Firestore with the new supporter
    if (userid) {
      const userRef = doc(db, "users", userid);
      await updateDoc(userRef, {
        supporters: arrayUnion({
          name,
          BARKs: amount.toFixed(5), // Store BARKs in Firestore with fixed decimals
          timestamp: new Date().toISOString(),
        }),
      });
    }

    // Confirm transaction with Solana network
    const signature = await connection.sendTransaction(transaction, [account]);
    console.log('Transaction sent with signature:', signature);

    const confirmation = await connection.confirmTransaction(signature);
    if (confirmation.value.err) {
      throw new Error('Transaction failed');
    }
    console.log('Transaction confirmed successfully');

    const thankYouMessage = name
      ? `Thanks for the BARK, ${name}!`
      : "Thanks for the BARK!";

    // Prepare payload for response
    const payload = {
      fields: {
        type: "transaction", // Add the 'type' property
        transaction, // Include the transaction object
        message: thankYouMessage, // Add the message field
      },
    };

    // Call the function to create a post response with transaction details
    const postResponse = await createPostResponse(payload);

    // Return success response with the post response
    return Response.json(postResponse, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.error("Error in POST:", err);

    // Handle and return errors
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    return Response.json(
      { message },
      {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
};
