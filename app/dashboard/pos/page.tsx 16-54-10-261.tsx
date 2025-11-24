"use client"

import { useEffect, useState } from "react"
import { productsService } from "@/lib/services/products-service"
import { salesService } from "@/lib/services/sales-service"
import { authService } from "@/lib/services/auth-service"
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

// Types
type Product = {
  id: string
  name: string
  price: number
  stock_quantity: number
  image_url: string | null
  category_id: string
  sku: string
}

type Category = {
  id: string
  name: string
}

type CartItem = Product & {
  quantity: number
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mobile">("cash")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: categoriesData } = await productsService.getCategories()
    const { data: productsData } = await productsService.getProducts()

    if (categoriesData) setCategories(categoriesData)
    if (productsData) setProducts(productsData.filter((p: any) => p.is_active))
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + delta)
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setIsProcessing(true)

    try {
      const {
        data: { user },
      } = await authService.getUser()
      if (!user) throw new Error("No user found")

      // 1. Create Sale Record
      const saleData = {
        sale_number: `SALE-${Date.now()}`,
        cashier_id: user.id, // Using profile id which matches user id
        subtotal,
        tax,
        total,
        payment_method: paymentMethod,
        payment_status: "completed",
      }

      // 2. Create Sale with Items via Service
      const saleItems = cart.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      }))

      const { error: saleError } = await salesService.createSale(saleData, saleItems)

      if (saleError) throw saleError

      toast.success("Sale completed successfully!")
      setCart([])
      setShowCheckout(false)
      fetchData() // Refresh product stock (if we implemented stock updates in service)
    } catch (error) {
      console.error(error)
      toast.error("Failed to process sale")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-4">
      {/* Product Section */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All Items</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </Tabs>

        <ScrollArea className="flex-1 rounded-md border p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer transition-all hover:bg-accent hover:border-primary"
                onClick={() => addToCart(product)}
              >
                <CardContent className="flex flex-col items-center p-4">
                  <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-lg bg-muted text-4xl">
                    {product.image_url ? (
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      product.name.charAt(0)
                    )}
                  </div>
                  <h3 className="text-center font-medium line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Stock: {product.stock_quantity}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart Section */}
      <Card className="flex w-[400px] flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Current Order</h2>
          <p className="text-sm text-muted-foreground">{cart.length} items</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex flex-1 flex-col">
                  <span className="font-medium line-clamp-1">{item.name}</span>
                  <span className="text-sm text-muted-foreground">${item.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
                <div className="mb-2 rounded-full bg-muted p-4">
                  <Banknote className="h-8 w-8" />
                </div>
                <p>Cart is empty</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-muted/20">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg" disabled={cart.length === 0}>
                Charge ${total.toFixed(2)}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Complete Payment</DialogTitle>
                <DialogDescription>
                  Select payment method to complete the transaction of ${total.toFixed(2)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-4 py-4">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-24"
                  onClick={() => setPaymentMethod("cash")}
                >
                  <Banknote className="h-6 w-6" />
                  Cash
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-24"
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="h-6 w-6" />
                  Card
                </Button>
                <Button
                  variant={paymentMethod === "mobile" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-24"
                  onClick={() => setPaymentMethod("mobile")}
                >
                  <MoreHorizontal className="h-6 w-6" />
                  Other
                </Button>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCheckout(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCheckout} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Complete Sale"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  )
}
