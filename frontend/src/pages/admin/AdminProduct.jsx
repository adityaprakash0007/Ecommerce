import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ImageUpload from "@/components/ImageUpload"
import { Edit, Search, Trash2 } from 'lucide-react'
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import { toast } from 'sonner'

const AdminProduct = () => {
    const { products } = useSelector(store => store.product)
    const [editProduct, setEditProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [sortOption, setSortOption] = useState("")

    const accessToken = localStorage.getItem("accessToken")
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/product/getallproducts`, { headers: { Authorization: `Bearer ${accessToken}` } })
                if (res.data.success) dispatch(setProducts(res.data.products))
            } catch (error) {
                console.log(error)
                toast.error(error.response?.data?.message || "Failed to load products")
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditProduct(prev => ({ ...prev, [name]: value }))
    }

    const openEditDialog = (product) => setEditProduct(product)

    const handleSave = async (e) => {
        e.preventDefault()
        if (!editProduct?._id) return toast.error("No product selected to update")

        const formData = new FormData()
        formData.append("productName", editProduct.productName)
        formData.append("productDesc", editProduct.productDesc)
        formData.append("productPrice", editProduct.productPrice)
        formData.append("category", editProduct.category)
        formData.append("brand", editProduct.brand)

        const existingImages = (editProduct.productImg || []).filter((img) => !(img instanceof File) && img.public_id).map((img) => img.public_id)
        formData.append("existingImages", JSON.stringify(existingImages))

        ;(editProduct.productImg || []).filter((img) => img instanceof File).forEach((file) => formData.append("files", file))

        try {
            const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/product/update/${editProduct._id}`, formData, { headers: { Authorization: `Bearer ${accessToken}` } })
            if (res.data.success) {
                toast.success("Product updated successfully")
                const updateProducts = products.map((p) => p._id === editProduct._id ? res.data.product : p)
                dispatch(setProducts(updateProducts))
                setOpen(false)
                setEditProduct(null)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to update product")
        }
    }

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return
        try {
            const res = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/product/delete/${productId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
            if (res.data.success) {
                toast.success("Product deleted successfully")
                dispatch(setProducts(products.filter((p) => p._id !== productId)))
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to delete product")
        }
    }

    const filteredProducts = useMemo(() => {
        let result = [...products]
        if (search.trim()) result = result.filter((p) => p.productName?.toLowerCase().includes(search.toLowerCase()))
        if (sortOption === "lowToHigh") result.sort((a, b) => a.productPrice - b.productPrice)
        else if (sortOption === "highToLow") result.sort((a, b) => b.productPrice - a.productPrice)
        return result
    }, [products, search, sortOption])

    const inputClass = "bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-xl outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400/40 transition-all"

    return (
        <div className="relative min-h-screen bg-[#050b14] text-white pl-[350px] py-10 pr-20">

            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6">

                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">Manage <span className="text-cyan-400">Products</span></h1>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mt-2">View, edit and delete your products</p>
                    <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative w-full md:w-[400px]">
                        <Input type="text" placeholder="Search products..." className={`${inputClass} pr-10 h-11`} value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                    </div>

                    <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-full md:w-[220px] h-11 bg-[#071426] border border-white/10 text-white rounded-xl focus:ring-1 focus:ring-cyan-400/50">
                            <SelectValue placeholder="Sort by Price" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#071426] border border-white/10 text-white">
                            <SelectItem value="lowToHigh" className="focus:bg-cyan-400/10 focus:text-cyan-300">Price: Low to High</SelectItem>
                            <SelectItem value="highToLow" className="focus:bg-cyan-400/10 focus:text-cyan-300">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {loading && (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Loading products...</p>
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">{search ? `No products found for "${search}"` : "No products found."}</p>
                        <p className="text-gray-600 text-sm mt-2">Try adjusting your search or filters.</p>
                    </div>
                )}

                {!loading && filteredProducts.map((product) => (
                    <Card key={product._id} className="group relative overflow-hidden bg-[#071426] border border-white/10 rounded-2xl p-4 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_50px_rgba(34,211,238,0.10)]">

                        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-cyan-400/10" />

                        <div className="relative flex items-center justify-between gap-4">

                            <div className="flex items-center gap-4 min-w-0">
                                <div className="relative w-20 h-20 rounded-xl bg-[#050b14] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                    <img src={product.productImg[0]?.url} alt={product.productName} className="w-full h-full object-contain p-1.5" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="font-bold text-white truncate max-w-[400px]">{product.productName}</h1>
                                    <p className="text-xs text-gray-500 mt-0.5">{product.brand || "—"} · {product.category || "—"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 shrink-0">

                                <h1 className="font-black text-white text-lg">₹{Number(product.productPrice).toLocaleString("en-IN")}</h1>

                                <div className="flex items-center gap-3">

                                    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setEditProduct(null) }}>
                                        <form>
                                            <DialogTrigger asChild>
                                                <button type="button" className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center hover:bg-cyan-400 hover:border-cyan-400 transition-all duration-300 cursor-pointer" onClick={() => { openEditDialog(product); setOpen(true) }}>
                                                    <Edit className="w-4 h-4 text-cyan-400 hover:text-black transition-colors" />
                                                </button>
                                            </DialogTrigger>

                                            <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto bg-[#071426] border border-white/10 text-white rounded-2xl">

                                                <DialogHeader>
                                                    <DialogTitle className="text-white text-xl font-bold">Edit Product</DialogTitle>
                                                    <DialogDescription className="text-gray-400">Make changes to your product here. Click save when you're done.</DialogDescription>
                                                </DialogHeader>

                                                <div className="flex flex-col gap-4 mt-2">

                                                    <div className="grid gap-2">
                                                        <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Product Name</Label>
                                                        <Input type="text" name="productName" value={editProduct?.productName || ""} onChange={handleChange} placeholder="EX-Iphone" className={inputClass} required />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Price</Label>
                                                        <Input type="number" name="productPrice" value={editProduct?.productPrice || ""} onChange={handleChange} className={inputClass} required />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="grid gap-2">
                                                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Brand</Label>
                                                            <Input type="text" name="brand" value={editProduct?.brand || ""} onChange={handleChange} placeholder="Ex-apple" className={inputClass} required />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Category</Label>
                                                            <Input type="text" name="category" value={editProduct?.category || ""} onChange={handleChange} placeholder="Ex-mobile" className={inputClass} required />
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Description</Label>
                                                        <Textarea name="productDesc" value={editProduct?.productDesc || ""} onChange={handleChange} placeholder="Enter brief description of the product" className={`${inputClass} min-h-24`} />
                                                    </div>

                                                    <ImageUpload productData={editProduct} setProductData={setEditProduct} />

                                                </div>

                                                <DialogFooter className="mt-2">
                                                    <DialogClose asChild>
                                                        <Button variant="outline" className="bg-transparent border border-white/15 text-white hover:bg-white hover:text-black rounded-xl transition-all">Cancel</Button>
                                                    </DialogClose>
                                                    <Button onClick={handleSave} type="submit" className="bg-cyan-400 text-black font-bold rounded-xl hover:bg-cyan-300 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)]">Save Changes</Button>
                                                </DialogFooter>

                                            </DialogContent>
                                        </form>
                                    </Dialog>

                                    <button type="button" onClick={() => handleDelete(product._id)} className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all duration-300 cursor-pointer">
                                        <Trash2 className="w-4 h-4 text-red-500 hover:text-white transition-colors" />
                                    </button>

                                </div>
                            </div>
                        </div>

                        <div className="mt-3 h-[2px] w-0 bg-cyan-400 transition-all duration-500 group-hover:w-10" />
                    </Card>
                ))}

            </div>
        </div>
    )
}

export default AdminProduct