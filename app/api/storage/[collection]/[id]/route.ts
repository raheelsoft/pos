import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

export async function PUT(request: NextRequest, { params }: { params: Promise<{ collection: string; id: string }> }) {
  try {
    const { collection, id } = await params
    const filePath = path.join(DATA_DIR, `${collection}.json`)

    let items = []
    try {
      const data = await fs.readFile(filePath, "utf-8")
      items = JSON.parse(data)
    } catch {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    const updates = await request.json()
    items = items.map((item: any) => (item.id === id ? { ...item, ...updates } : item))

    await fs.writeFile(filePath, JSON.stringify(items, null, 2))
    const updated = items.find((item: any) => item.id === id)

    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT error:", error)
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  try {
    const { collection, id } = await params
    const filePath = path.join(DATA_DIR, `${collection}.json`)

    let items = []
    try {
      const data = await fs.readFile(filePath, "utf-8")
      items = JSON.parse(data)
    } catch {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    items = items.filter((item: any) => item.id !== id)

    await fs.writeFile(filePath, JSON.stringify(items, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 })
  }
}
