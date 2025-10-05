"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { updateFilters, resetFilters } from "@/redux/slices/productsSlice"

const brands = ["Armani", "Tom Ford", "Brioni", "Hugo Boss", "Dolce & Gabbana", "Savile Row Co."]
const countries = ["Italy", "USA", "UK", "Germany"]

export function ProductFilters() {
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.products)
  const [isOpen, setIsOpen] = useState(false)

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...filters.brand, brand] : filters.brand.filter((b) => b !== brand)
    dispatch(updateFilters({ brand: newBrands }))
  }

  const handleCountryChange = (country: string, checked: boolean) => {
    const newCountries = checked ? [...filters.country, country] : filters.country.filter((c) => c !== country)
    dispatch(updateFilters({ country: newCountries }))
  }

  const handlePriceChange = (value: number[]) => {
    dispatch(updateFilters({ priceRange: [value[0], value[1]] as [number, number] }))
  }

  const handleRatingChange = (rating: number) => {
    dispatch(updateFilters({ rating: rating === filters.rating ? 0 : rating }))
  }

  const clearFilters = () => {
    dispatch(resetFilters())
  }

  const activeFiltersCount =
    filters.brand.length +
    filters.country.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0)

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
        </Button>
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${isOpen ? "block" : "hidden lg:block"}`}>
        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Active Filters</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filters.brand.map((brand) => (
                <Badge key={brand} variant="secondary" className="mr-2">
                  {brand}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleBrandChange(brand, false)} />
                </Badge>
              ))}
              {filters.country.map((country) => (
                <Badge key={country} variant="secondary" className="mr-2">
                  {country}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleCountryChange(country, false)} />
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Brand Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Brand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={filters.brand.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                />
                <label htmlFor={brand} className="text-sm font-light cursor-pointer">
                  {brand}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Country Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Country</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {countries.map((country) => (
              <div key={country} className="flex items-center space-x-2">
                <Checkbox
                  id={country}
                  checked={filters.country.includes(country)}
                  onCheckedChange={(checked) => handleCountryChange(country, checked as boolean)}
                />
                <label htmlFor={country} className="text-sm font-light cursor-pointer">
                  {country}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Price Range */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Price Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0].toLocaleString()}</span>
              <span>${filters.priceRange[1].toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Rating Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Minimum Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={() => handleRatingChange(rating)}
                />
                <label htmlFor={`rating-${rating}`} className="text-sm font-light cursor-pointer flex items-center">
                  {rating}+ Stars
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
