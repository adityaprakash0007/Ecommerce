import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const FilterSidebar = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  priceRange,
  setPriceRange,
  allProducts = [],
}) => {

  const Categories = allProducts.map((p) => p.category);
  const UniqueCategory = ["All", ...new Set(Categories)];

  const Brands = allProducts.map((p) => p.brand);
  const UniqueBrand = ["All", ...new Set(Brands)];

  const handleCategoryClick = (val) => {
    setCategory(val);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0]) {
      setPriceRange([priceRange[0], value]);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
  };

  return (
    <div className="relative bg-[#071426] border border-white/10 rounded-2xl p-5 h-max hidden md:block w-72 mt-10">

      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-cyan-400/10 blur-[70px] pointer-events-none" />

      <div className="relative">

        <h1 className="text-2xl font-black text-white tracking-tight">
          Filter<span className="text-cyan-400">s</span>
        </h1>

        <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-400 font-semibold mt-1">
          Refine Your Search
        </p>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      </div>

      <div className="relative mt-6">

        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
          Search
        </label>

        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-xl p-2.5 w-full focus-visible:ring-1 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400/40 transition-all duration-300"
        />

      </div>

      <div className="relative mt-6">

        <h2 className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-3">
          Category
        </h2>

        <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">

          {UniqueCategory.map((item, index) => {

            const isActive = category === item;

            return (
              <label
                key={index}
                className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.20)]"
                    : "text-gray-300 hover:bg-white/5 hover:text-cyan-300 border border-transparent hover:border-cyan-400/20"
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  checked={isActive}
                  onChange={() => handleCategoryClick(item)}
                  className="hidden"
                />

                <span
                  className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                    isActive
                      ? "border-black bg-black"
                      : "border-gray-500 group-hover:border-cyan-400"
                  }`}
                >
                  {isActive && <span className="w-1 h-1 rounded-full bg-cyan-400" />}
                </span>

                <span>{item}</span>

              </label>
            );
          })}

        </div>

      </div>

      <div className="relative mt-6">

        <h2 className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-3">
          Brand
        </h2>

        <select
          value={brand}
          onChange={handleBrandChange}
          className="w-full bg-[#050b14] border border-white/10 text-white rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all duration-300 cursor-pointer"
        >
          {UniqueBrand.map((item, index) => (
            <option key={index} value={item} className="bg-[#071426] text-white">
              {item?.toUpperCase()}
            </option>
          ))}
        </select>

      </div>

      <div className="relative mt-6">

        <h2 className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-3">
          Price Range
        </h2>

        <div className="flex items-center justify-between text-sm text-white font-semibold mb-3">

          <span className="text-cyan-400">₹{priceRange[0].toLocaleString('en-IN')}</span>

          <span className="text-gray-500">—</span>

          <span className="text-cyan-400">₹{priceRange[1].toLocaleString('en-IN')}</span>

        </div>

        <div className="flex gap-2 items-center mb-3">

          <input
            type="number"
            min="0"
            max="5000"
            value={priceRange[0]}
            onChange={handleMinChange}
            className="w-full p-2 bg-[#050b14] border border-white/10 text-white rounded-xl text-sm outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
          />

          <span className="text-gray-500">-</span>

          <input
            type="number"
            min="0"
            max="999999"
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="w-full p-2 bg-[#050b14] border border-white/10 text-white rounded-xl text-sm outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
          />

        </div>

        <div className="space-y-2">

          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange[0]}
            onChange={handleMinChange}
            className="w-full accent-cyan-400 cursor-pointer"
          />

          <input
            type="range"
            min="0"
            max="999999"
            step="100"
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="w-full accent-cyan-400 cursor-pointer"
          />

        </div>

      </div>

      <div className="relative mt-8 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <Button
        onClick={resetFilters}
        className="mt-5 w-full bg-cyan-400 text-black font-bold rounded-xl h-11 hover:bg-cyan-300 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
      >
        Reset Filters
      </Button>

    </div>
  );
};

export default FilterSidebar;