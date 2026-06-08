import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/actions";
import { getCategories } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card/card";
import { Input } from "@/components/input/input";
import { Label } from "@/components/label/label";
import { AdminForm, ActionForm, SubmitButton } from "@/components/form/admin-form";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <p className="text-muted-foreground mt-2">Manage product categories for your store.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create Category</CardTitle>
              <CardDescription>Add a new category to group your products.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminForm action={createCategoryAction} submitLabel="Create Category" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Accessories" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" placeholder="accessories" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" placeholder="Optional description..." />
                </div>
              </AdminForm>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex gap-6 items-start">
                  <ActionForm action={updateCategoryAction} className="flex-1 grid grid-cols-2 gap-4">
                    <input type="hidden" name="id" value={category.id} />
                    <div className="space-y-2">
                      <Label htmlFor={`name-${category.id}`}>Name</Label>
                      <Input id={`name-${category.id}`} name="name" defaultValue={category.name} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`slug-${category.id}`}>Slug</Label>
                      <Input id={`slug-${category.id}`} name="slug" defaultValue={category.slug} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`sortOrder-${category.id}`}>Sort Order</Label>
                      <Input id={`sortOrder-${category.id}`} name="sortOrder" type="number" defaultValue={category.sortOrder} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${category.id}`}>Description</Label>
                      <Input id={`description-${category.id}`} name="description" defaultValue={category.description} />
                    </div>
                    <div className="col-span-2 pt-2">
                      <SubmitButton label="Save Changes" />
                    </div>
                  </ActionForm>
                  
                  <div className="pt-8">
                    <ActionForm action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={category.id} />
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
          {categories.length === 0 && (
            <div className="text-center p-12 border rounded-lg bg-muted/40">
              <p className="text-muted-foreground">No categories found. Create one to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
