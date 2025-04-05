import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // In a real implementation, you would save this to your database
    console.log("Creating expected result:", data)

    // Mock response
    return NextResponse.json(
      {
        ...data,
        id: Math.floor(Math.random() * 1000).toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating expected result:", error)
    return NextResponse.json({ error: "Failed to create expected result" }, { status: 500 })
  }
}

