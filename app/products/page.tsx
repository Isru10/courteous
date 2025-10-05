"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setProducts, setLoading, setPagination, resetFilters } from "@/redux/slices/productsSlice"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const { products, loading, filters, pagination } = useAppSelector((state) => state.products)
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.page, sortBy])

  const fetchProducts = async () => {
    dispatch(setLoading(true))

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortBy,
      })

      if (filters.brand.length > 0) params.set("brand", filters.brand.join(","))
      if (filters.country.length > 0) params.set("country", filters.country.join(","))
      if (filters.priceRange[0] > 0) params.set("minPrice", filters.priceRange[0].toString())
      if (filters.priceRange[1] < 10000) params.set("maxPrice", filters.priceRange[1].toString())
      if (filters.rating > 0) params.set("rating", filters.rating.toString())

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      dispatch(setProducts(data.products))
      dispatch(setPagination(data.pagination))
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }))
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="heading-large mb-4">Our Collection</h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Discover our complete range of premium tuxedos and formal wear, carefully curated from the world's finest
            designers.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {pagination.total} products
              </p>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={pagination.page === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
                <Button variant="outline" onClick={() => dispatch(resetFilters())}>
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
