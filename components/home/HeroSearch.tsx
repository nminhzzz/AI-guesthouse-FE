"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, User, Maximize2 } from "lucide-react";
import { ROOM_TYPE_LABELS, GENDER_LABELS } from "@/lib/constants";
import type { RoomType, GenderType } from "@/types";

const POPULAR_CITIES = [
  "Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Bình Dương",
  "Đồng Nai",
  "Cần Thơ",
];

const PRICE_RANGES = [
  { label: "Dưới 2 triệu", min: 0, max: 2_000_000 },
  { label: "2 - 4 triệu", min: 2_000_000, max: 4_000_000 },
  { label: "4 - 7 triệu", min: 4_000_000, max: 7_000_000 },
  { label: "7 - 10 triệu", min: 7_000_000, max: 10_000_000 },
  { label: "Trên 10 triệu", min: 10_000_000, max: undefined },
];

const AREA_PRESETS = [
  { label: "Dưới 20 m²", min: 0, max: 20 },
  { label: "20 - 30 m²", min: 20, max: 30 },
  { label: "30 - 50 m²", min: 30, max: 50 },
  { label: "Trên 50 m²", min: 50, max: undefined },
];

export default function HeroSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [roomType, setRoomType] = useState<RoomType | "">("");
  const [gender, setGender] = useState<GenderType | "">("");
  const [areaRange, setAreaRange] = useState<{ min: number; max?: number } | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max?: number } | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (city) params.set("city", city);
    if (roomType) params.set("type", roomType);
    if (gender) params.set("gender", gender);
    
    if (priceRange) {
      params.set("min_price", String(priceRange.min));
      if (priceRange.max) params.set("max_price", String(priceRange.max));
    }
    
    if (areaRange) {
      params.set("min_area", String(areaRange.min));
      if (areaRange.max) params.set("max_area", String(areaRange.max));
    }
    
    router.push(`/rooms${params.toString() ? "?" + params.toString() : ""}`);
  }

  return (
    <section
      className="relative bg-gradient-to-br from-orange-500 to-orange-600 py-16 md:py-24"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(234,88,12,0.92) 0%, rgba(194,65,12,0.95) 100%)",
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          Tìm phòng trọ nhanh chóng, dễ dàng
        </h1>
        <p className="text-orange-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">
          Ứng dụng AI hỗ trợ tìm trọ thông minh, hàng nghìn phòng trọ, chung cư mini đang hoạt động trên toàn quốc
        </p>

        {/* Room type tabs */}
        <div className="flex justify-center gap-1.5 md:gap-2 mb-3 overflow-x-auto pb-2 scrollbar-none max-w-full">
          <button
            onClick={() => setRoomType("")}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              roomType === ""
                ? "bg-white text-orange-600 shadow-md transform scale-105"
                : "text-white hover:bg-white/10"
            }`}
          >
            Tất cả phòng
          </button>
          {(Object.keys(ROOM_TYPE_LABELS) as RoomType[]).map((t) => (
            <button
              key={t}
              onClick={() => setRoomType(t)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                roomType === t
                  ? "bg-white text-orange-600 shadow-md transform scale-105"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {ROOM_TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Search Form Panel */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-2xl text-left max-w-4xl mx-auto border border-white/20"
        >
          {/* Main filters grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="flex items-center gap-2 border border-gray-150 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập quận, tên đường..."
                className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* City Selection */}
            <div className="flex items-center gap-2 border border-gray-150 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200">
              <MapPin size={16} className="text-gray-400 flex-shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-700 bg-transparent cursor-pointer"
              >
                <option value="">Tỉnh / Thành phố</option>
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Target selection */}
            <div className="flex items-center gap-2 border border-gray-150 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200">
              <User size={16} className="text-gray-400 flex-shrink-0" />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderType)}
                className="flex-1 text-sm outline-none text-gray-700 bg-transparent cursor-pointer"
              >
                <option value="">Tất cả đối tượng</option>
                {Object.keys(GENDER_LABELS).map((g) => (
                  <option key={g} value={g}>
                    {GENDER_LABELS[g as GenderType]}
                  </option>
                ))}
              </select>
            </div>

            {/* Area presets selection */}
            <div className="flex items-center gap-2 border border-gray-150 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200">
              <Maximize2 size={16} className="text-gray-400 flex-shrink-0" />
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setAreaRange(null);
                  } else {
                    const [min, max] = val.split("-");
                    setAreaRange({ min: Number(min), max: max ? Number(max) : undefined });
                  }
                }}
                className="flex-1 text-sm outline-none text-gray-700 bg-transparent cursor-pointer"
              >
                <option value="">Tất cả diện tích</option>
                {AREA_PRESETS.map((preset, index) => (
                  <option key={index} value={`${preset.min}-${preset.max ?? ""}`}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price pills */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-400 font-medium mr-1">Khoảng giá:</span>
              {PRICE_RANGES.map((range) => {
                const isActive =
                  priceRange?.min === range.min && priceRange?.max === range.max;
                return (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() =>
                      setPriceRange(
                        isActive ? null : { min: range.min, max: range.max },
                      )
                    }
                    className={`text-xs px-3 py-1 rounded-full border transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-orange-500 text-white border-orange-500 font-medium"
                        : "border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>

            {/* Search Submit button */}
            <button
              type="submit"
              className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer mt-4 lg:mt-0"
            >
              <Search size={16} />
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Quick links */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
          <span className="text-orange-200 text-xs md:text-sm font-medium">Xem trọ nhanh tại:</span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              onClick={() =>
                router.push(`/rooms?city=${encodeURIComponent(c)}`)
              }
              className="text-xs md:text-sm text-white/90 hover:text-white hover:underline cursor-pointer bg-white/10 px-3 py-1.5 rounded-lg transition-all"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
