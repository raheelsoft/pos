import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  try {
    await ensureDataDir()
    const { collection } = await params
    const filePath = path.join(DATA_DIR, `${collection}.json`)

    try {
      const data = await fs.readFile(filePath, "utf-8")
      return NextResponse.json(JSON.parse(data))
    } catch {
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("GET error:", error)
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  try {
    await ensureDataDir()
    const { collection } = await params
    const filePath = path.join(DATA_DIR, `${collection}.json`)

    let items = []
    try {
      const data = await fs.readFile(filePath, "utf-8")
      items = JSON.parse(data)
    } catch {
      // File doesn't exist, start with empty array
    }

    const newItem = await request.json()
    items.push(newItem)

    await fs.writeFile(filePath, JSON.stringify(items, null, 2))
    return NextResponse.json(newItem)
  } catch (error) {
    console.error("POST error:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
