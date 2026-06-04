"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ROOM_TYPE_LABELS, AMENITY_LABELS, GENDER_LABELS } from "@/lib/constants";
import type { RoomType, GenderType, Amenity } from "@/types";
import Button from "@/components/ui/Button";

const PRICE_RANGES = [
  { label: "Dưới 2 triệu", min: 0, max: 2_000_000 },
  { label: "2 – 4 triệu", min: 2_000_000, max: 4_000_000 },
  { label: "4 – 7 triệu", min: 4_000_000, max: 7_000_000 },
  { label: "7 – 10 triệu", min: 7_000_000, max: 10_000_000 },
  { label: "Trên 10 triệu", min: 10_000_000, max: undefined },
];

const AREA_RANGES = [
  { label: "Dưới 20 m²", min: 0, max: 20 },
  { label: "20 – 30 m²", min: 20, max: 30 },
  { label: "30 – 50 m²", min: 30, max: 50 },
  { label: "50 – 70 m²", min: 50, max: 70 },
  { label: "Trên 70 m²", min: 70, max: undefined },
];

const POPULAR_CITIES = [
  "Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Bình Dương",
  "Đồng Nai",
  "Cần Thơ",
];

export default function RoomFilter() {
  const router = useRouter();
  const sp = useSearchParams();

  const [search, setSearch] = useState(sp.get("search") ?? "");
  const [city, setCity] = useState(sp.get("city") ?? "");
  const [district, setDistrict] = useState(sp.get("district") ?? "");
  const [ward, setWard] = useState(sp.get("ward") ?? "");
  const [type, setType] = useState<RoomType | "">(
    (sp.get("type") as RoomType) ?? "",
  );
  const [minPrice, setMinPrice] = useState(sp.get("min_price") ?? "");
  const [maxPrice, setMaxPrice] = useState(sp.get("max_price") ?? "");
  const [minArea, setMinArea] = useState(sp.get("min_area") ?? "");
  const [maxArea, setMaxArea] = useState(sp.get("max_area") ?? "");
  const [gender, setGender] = useState<GenderType | "">(
    (sp.get("gender") as GenderType) ?? "",
  );
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [sortBy, setSortBy] = useState(sp.get("sort_by") ?? "created_at");
  const [sortOrder, setSortOrder] = useState(sp.get("sort_order") ?? "desc");
  
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync với URL khi params thay đổi từ bên ngoài (e.g. hero search)
  useEffect(() => {
    setSearch(sp.get("search") ?? "");
    setCity(sp.get("city") ?? "");
    setDistrict(sp.get("district") ?? "");
    setWard(sp.get("ward") ?? "");
    setType((sp.get("type") as RoomType) ?? "");
    setMinPrice(sp.get("min_price") ?? "");
    setMaxPrice(sp.get("max_price") ?? "");
    setMinArea(sp.get("min_area") ?? "");
    setMaxArea(sp.get("max_area") ?? "");
    setGender((sp.get("gender") as GenderType) ?? "");

    const amenitiesParam = sp.get("amenities");
    if (amenitiesParam) {
      setSelectedAmenities(amenitiesParam.split(",") as Amenity[]);
    } else {
      setSelectedAmenities([]);
    }

    setSortBy(sp.get("sort_by") ?? "created_at");
    setSortOrder(sp.get("sort_order") ?? "desc");
  }, [sp]);

  const applyFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (city) params.set("city", city);
    if (district.trim()) params.set("district", district.trim());
    if (ward.trim()) params.set("ward", ward.trim());
    if (type) params.set("type", type);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (minArea) params.set("min_area", minArea);
    if (maxArea) params.set("max_area", maxArea);
    if (gender) params.set("gender", gender);
    if (selectedAmenities.length > 0) {
      params.set("amenities", selectedAmenities.join(","));
    }
    if (sortBy) params.set("sort_by", sortBy);
    if (sortOrder) params.set("sort_order", sortOrder);
    params.set("page", "1");
    
    router.push(`/rooms?${params.toString()}`);
    setMobileOpen(false);
  }, [
    search,
    city,
    district,
    ward,
    type,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    gender,
    selectedAmenities,
    sortBy,
    sortOrder,
    router,
  ]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyFilter();
  }

  function clearAll() {
    setSearch("");
    setCity("");
    setDistrict("");
    setWard("");
    setType("");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setGender("");
    setSelectedAmenities([]);
    setSortBy("created_at");
    setSortOrder("desc");
    router.push("/rooms");
  }

  function setPricePreset(min: number, max?: number) {
    setMinPrice(String(min));
    setMaxPrice(max ? String(max) : "");
  }

  function setAreaPreset(min: number, max?: number) {
    setMinArea(String(min));
    setMaxArea(max ? String(max) : "");
  }

  function toggleAmenity(amenity: Amenity) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  }

  const hasActiveFilter =
    !!search ||
    !!city ||
    !!district ||
    !!ward ||
    !!type ||
    !!minPrice ||
    !!maxPrice ||
    !!minArea ||
    !!maxArea ||
    !!gender ||
    selectedAmenities.length > 0 ||
    sortBy !== "created_at" ||
    sortOrder !== "desc";

  const filterContent = (
    <div className="space-y-5">
      {/* Sắp xếp */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Sắp xếp theo
        </p>
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split(":");
            setSortBy(by);
            setSortOrder(order);
          }}
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-400 bg-white"
        >
          <option value="created_at:desc">Mới nhất</option>
          <option value="price:asc">Giá tăng dần</option>
          <option value="price:desc">Giá giảm dần</option>
          <option value="area:desc">Diện tích lớn nhất</option>
          <option value="views:desc">Lượt xem nhiều nhất</option>
        </select>
      </div>

      {/* Loại phòng */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Loại phòng
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setType("")}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
              type === ""
                ? "bg-orange-500 text-white border-orange-500"
                : "border-gray-200 text-gray-600 hover:border-orange-400"
            }`}
          >
            Tất cả
          </button>
          {(Object.keys(ROOM_TYPE_LABELS) as RoomType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                type === t
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-gray-200 text-gray-600 hover:border-orange-400"
              }`}
            >
              {ROOM_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Đối tượng thuê */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Đối tượng thuê
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(GENDER_LABELS) as GenderType[]).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g === "all" ? "" : g)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                (g === "all" && gender === "") || gender === g
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-gray-200 text-gray-600 hover:border-orange-400"
              }`}
            >
              {GENDER_LABELS[g]}
            </button>
          ))}
        </div>
      </div>

      {/* Vị trí */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Tỉnh / Thành phố
          </p>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Tất cả tỉnh thành</option>
            {POPULAR_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Quận / Huyện
          </p>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="VD: Quận 1, Bình Thạnh..."
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Phường / Xã
          </p>
          <input
            type="text"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            placeholder="VD: Bến Thành, Phường 15..."
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Khoảng giá */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Khoảng giá
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRICE_RANGES.map((r) => {
            const active =
              minPrice === String(r.min) &&
              maxPrice === (r.max ? String(r.max) : "");
            return (
              <button
                key={r.label}
                onClick={() =>
                  active
                    ? (setMinPrice(""), setMaxPrice(""))
                    : setPricePreset(r.min, r.max)
                }
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  active
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-200 text-gray-600 hover:border-orange-400"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        {/* Custom price range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Tối thiểu"
            min={0}
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-400"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Tối đa"
            min={0}
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Diện tích */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Diện tích
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {AREA_RANGES.map((r) => {
            const active =
              minArea === String(r.min) &&
              maxArea === (r.max ? String(r.max) : "");
            return (
              <button
                key={r.label}
                onClick={() =>
                  active
                    ? (setMinArea(""), setMaxArea(""))
                    : setAreaPreset(r.min, r.max)
                }
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  active
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-200 text-gray-600 hover:border-orange-400"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        {/* Custom area range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
            placeholder="Min m²"
            min={0}
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-400"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
            placeholder="Max m²"
            min={0}
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Tiện ích */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Tiện ích phòng
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(AMENITY_LABELS) as Amenity[]).map((a) => {
            const active = selectedAmenities.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`text-left text-xs px-3 py-2 rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? "bg-orange-50 border-orange-400 text-orange-600 font-medium"
                    : "border-gray-200 text-gray-600 hover:border-orange-400"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${active ? "bg-orange-500" : "bg-gray-300"}`} />
                {AMENITY_LABELS[a]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button onClick={applyFilter} className="flex-1 cursor-pointer">
          Áp dụng
        </Button>
        {hasActiveFilter && (
          <Button
            variant="secondary"
            onClick={clearAll}
            className="flex-shrink-0 cursor-pointer"
          >
            <X size={14} /> Xoá lọc
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar filter ── */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-orange-500" />
              Bộ lọc
            </h2>
            {hasActiveFilter && (
              <button
                onClick={clearAll}
                className="text-xs text-orange-500 hover:underline cursor-pointer"
              >
                Xoá tất cả
              </button>
            )}
          </div>
          {filterContent}
        </div>
      </aside>

      {/* ── Mobile: search bar + filter button ── */}
      <div className="lg:hidden w-full">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus-within:border-orange-400 transition-shadow">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo địa chỉ, quận..."
              className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
              hasActiveFilter
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            <SlidersHorizontal size={15} />
            Lọc
            {hasActiveFilter && (
              <span className="bg-white text-orange-500 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 rounded-xl text-sm font-semibold cursor-pointer"
          >
            Tìm
          </button>
        </form>

        {/* Mobile filter drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="flex-1 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="w-80 max-w-full bg-white h-full overflow-y-auto p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Bộ lọc</h2>
                <button onClick={() => setMobileOpen(false)} className="cursor-pointer">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
