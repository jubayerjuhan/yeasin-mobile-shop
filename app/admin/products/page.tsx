import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/app/admin/actions";
import { getCategories, getProducts, getProductsPaginated } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card/card";
import { Input } from "@/components/input/input";
import { Label } from "@/components/label/label";
import { AdminForm, ActionForm, SubmitButton } from "@/components/form/admin-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select/select";
import { ImageUploader } from "@/components/image-uploader/image-uploader";
import { Button, buttonVariants } from "@/components/button/button";
import { Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage(props: { searchParams: Promise<{ query?: string, page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1");
  const query = searchParams.query || "";

  const { products, totalPages } = await getProductsPaginated({ search: query, page, limit: 12 });
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground mt-2">Manage your catalog, pricing, and stock.</p>
        </div>
        
        <form method="GET" action="/admin/products" className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              name="query" 
              type="search" 
              placeholder="Search name or SKU..." 
              className="pl-8 w-full md:w-[300px]" 
              defaultValue={query}
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create Product</CardTitle>
              <CardDescription>Add a new device or accessory.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminForm action={createProductAction} submitLabel="Create Product" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="iPhone 15 Pro" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" placeholder="iphone-15-pro" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select name="categoryId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" name="sku" placeholder="IP15P-256-BLK" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (BDT)</Label>
                    <Input id="price" name="price" type="number" placeholder="150000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compareAtPrice">Compare At</Label>
                    <Input id="compareAtPrice" name="compareAtPrice" type="number" placeholder="160000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <ImageUploader name="image" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge">Badge</Label>
                  <Input id="badge" name="badge" placeholder="New / Hot" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <textarea id="shortDescription" name="shortDescription" className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" rows={2} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <textarea id="description" name="description" className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" rows={4} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specs">Specs (One per line)</Label>
                  <textarea id="specs" name="specs" className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" rows={4} />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="featured" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="inStock" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm">In Stock</span>
                  </label>
                </div>
              </AdminForm>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex gap-6 items-start">
                  <ActionForm action={updateProductAction} className="flex-1 space-y-4">
                    <input type="hidden" name="id" value={product.id} />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input name="name" defaultValue={product.name} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Slug</Label>
                        <Input name="slug" defaultValue={product.slug} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select name="categoryId" defaultValue={product.categoryId} required>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input name="sku" defaultValue={product.sku} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input name="price" type="number" defaultValue={product.price} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Compare At Price</Label>
                        <Input name="compareAtPrice" type="number" defaultValue={product.compareAtPrice ?? ""} />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Product Image</Label>
                        <ImageUploader name="image" defaultValue={product.image} />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Badge</Label>
                        <Input name="badge" defaultValue={product.badge ?? ""} />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Short Description</Label>
                        <textarea name="shortDescription" defaultValue={product.shortDescription} className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" rows={2} required />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Description</Label>
                        <textarea name="description" defaultValue={product.description} className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" rows={4} required />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Specs</Label>
                        <textarea name="specs" defaultValue={product.specs.join("\n")} className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" rows={4} />
                      </div>
                      <div className="flex gap-4 col-span-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" name="featured" defaultChecked={product.featured} className="rounded border-gray-300 text-primary focus:ring-primary" />
                          <span className="text-sm">Featured</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" name="inStock" defaultChecked={product.inStock} className="rounded border-gray-300 text-primary focus:ring-primary" />
                          <span className="text-sm">In Stock</span>
                        </label>
                      </div>
                    </div>
                    <div className="pt-2">
                      <SubmitButton label="Save Changes" />
                    </div>
                  </ActionForm>
                  
                  <div className="pt-8">
                    <ActionForm action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <SubmitButton 
                        label={<><Trash2 className="w-4 h-4" /><span className="sr-only">Delete</span></>} 
                        variant="destructive"
                        className="w-10 h-10 p-0"
                      />
                    </ActionForm>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {products.length === 0 && (
            <div className="text-center p-12 border rounded-lg bg-muted/40">
              <p className="text-muted-foreground">No products found. Create one or try a different search.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Link href={`/admin/products?page=${page - 1}${query ? `&query=${query}` : ""}`} className={buttonVariants({ variant: "outline", size: "icon", className: page <= 1 ? "pointer-events-none opacity-50" : "" })}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <span className="text-sm font-medium">Page {page} of {totalPages}</span>
              <Link href={`/admin/products?page=${page + 1}${query ? `&query=${query}` : ""}`} className={buttonVariants({ variant: "outline", size: "icon", className: page >= totalPages ? "pointer-events-none opacity-50" : "" })}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
