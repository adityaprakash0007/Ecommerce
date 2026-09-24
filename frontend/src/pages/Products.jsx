import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState } from 'react'
import { toast } from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setProducts } from '@/redux/productSlice'

function Products() {

  const dispatch = useDispatch()

  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 999999])

  const [sortOption, setSortOption] = useState("")

  const getAllProducts = async () => {
    try {
      setLoading(true)

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/product/getAllProducts`
      )

      console.log("API Response:", res.data)

      if (res.data.success) {

        const productsArray = Array.isArray(res.data.products) ? res.data.products : []

        setAllProducts(productsArray)
        dispatch(setProducts(productsArray))
      } else {
        toast.error(res.data.message || "Failed to fetch products")
        dispatch(setProducts([]))
      }

    } catch (error) {
      console.log(error)
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      )
      dispatch(setProducts([]))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  useEffect(() => {

    if (allProducts.length === 0) {
      setProducts([])
      return
    }

    let filtered = [...allProducts]

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== "All") {
      filtered = filtered.filter(
        (p) =>
          p.category?.toLowerCase() === category.toLowerCase()
      )
    }

    if (brand !== "All") {
      filtered = filtered.filter(
        (p) =>
          p.brand?.toLowerCase() === brand.toLowerCase()
      )
    }

    filtered = filtered.filter(
      (p) =>
        p.productPrice >= priceRange[0] &&
        p.productPrice <= priceRange[1]
    )

    if (sortOption === "lowtoHigh") {
      filtered.sort(
        (a, b) => a.productPrice - b.productPrice
      )
    } else if (sortOption === "highToLow") {
      filtered.sort(
        (a, b) => b.productPrice - a.productPrice
      )
    }

    setProducts(filtered)

  }, [
    search,
    category,
    brand,
    priceRange,
    sortOption,
    allProducts
  ])

  return (
    <div className='min-h-screen bg-[#050b14] pt-8 pb-10'>

      <div className='max-w-7xl mx-auto flex gap-7 px-5 md:px-8'>

        <FilterSidebar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
          allProducts={allProducts}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        <div className='flex flex-col flex-1'>

          <div className='flex justify-end mb-4'>
            <Select
              onValueChange={(value) =>
                setSortOption(value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowtoHigh">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="highToLow">
                    Price: High to Low
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7'>

            {
              loading ? (
                <p className="col-span-full text-center text-gray-400">Loading...</p>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    loading={loading}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-400">No Products Found</p>
              )
            }

          </div>
        </div>
      </div>
    </div>
  )
}

export default Products