import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { secretKey } = await request.json()
    
    // Check if secret key matches
    if (secretKey === process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: true })
    }

    return new NextResponse("Unauthorized", { status: 401 })
  } catch (error) {
    console.error("Error verifying admin:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 