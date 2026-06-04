import { Suspense } from "react";
import RoomCard from "@/components/rooms/RoomCard";
import RoomCardSkeleton from "@/components/rooms/RoomCardSkeleton";
import RoomFilter from "@/components/rooms/RoomFilter";
import Pagination from "@/components/ui/Pagination";
import type { Room, RoomListResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const PAGE_SIZE = 12;

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

async function fetchRooms(searchParams: Record<string, string | undefined>) {
  const page = Number(searchParams.page ?? 1);
  const limit = PAGE_SIZE;

  // Nếu có bất cứ filter nào → dùng /rooms/search/filter, ngược lại dùng /rooms
  const hasFilter =
    searchParams.city ||
    searchParams.district ||
    searchParams.ward ||
    searchParams.min_price ||
    searchParams.max_price ||
    searchParams.min_area ||
    searchParams.max_area ||
    searchParams.type ||
    searchParams.gender ||
    searchParams.amenities ||
    searchParams.sort_by ||
    searchParams.sort_order ||
    searchParams.search;

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (searchParams.city) params.set("city", searchParams.city);
  if (searchParams.district) params.set("district", searchParams.district);
  if (searchParams.ward) params.set("ward", searchParams.ward);
  if (searchParams.min_price) params.set("min_price", searchParams.min_price);
  if (searchParams.max_price) params.set("max_price", searchParams.max_price);
  if (searchParams.min_area) params.set("min_area", searchParams.min_area);
  if (searchParams.max_area) params.set("max_area", searchParams.max_area);
  if (searchParams.type) params.set("room_type", searchParams.type); // map type -> room_type
  if (searchParams.gender) params.set("gender", searchParams.gender);
  if (searchParams.amenities) params.set("amenities", searchParams.amenities);
  if (searchParams.sort_by) params.set("sort_by", searchParams.sort_by);
  if (searchParams.sort_order)
    params.set("sort_order", searchParams.sort_order);

  // Map search keyword sang district nếu chưa có district cụ thể
  if (searchParams.search && !searchParams.district) {
    params.set("district", searchParams.search);
  }

  const endpoint = hasFilter
    ? `${BASE_URL}/rooms/search/filter?${params.toString()}`
    : `${BASE_URL}/rooms?${params.toString()}`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 10 } }); // revalidate 10s để hiển thị tin mới nhanh hơn
    if (!res.ok) return { items: [], total: 0, page, totalPages: 0 };
    const body = await res.json();
    const data: RoomListResponse = body?.data ?? body;
    const items: Room[] = data.items ?? [];
    const total = data.total ?? items.length;

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    return { items: [], total: 0, page, totalPages: 0 };
  }
}

export default async function RoomsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { items, total, page, totalPages } = await fetchRooms(sp);

  const activeFiltersText = [
    sp.search && `"${sp.search}"`,
    sp.city,
    sp.district,
    sp.type,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page title */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">
          {activeFiltersText
            ? `Kết quả cho: ${activeFiltersText}`
            : "Tất cả phòng trọ"}
        </h1>
        {total > 0 && (
          <p className="text-sm text-gray-500 mt-0.5">
            Tìm thấy{" "}
            <span className="font-semibold text-gray-700">{total}</span> phòng
          </p>
        )}
      </div>

      <div className="flex gap-6 items-start">
        {/* Filter sidebar / mobile filter */}
        <Suspense>
          <RoomFilter />
        </Suspense>

        {/* Room grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile search bar is inside RoomFilter, desktop shows above grid */}
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <RoomCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg
                  className="w-16 h-16 mb-4 text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <p className="text-lg font-medium">Không tìm thấy phòng nào</p>
                <p className="text-sm mt-1">
                  Thử thay đổi bộ lọc hoặc tìm kiếm khác
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((room) => (
                    <RoomCard key={room._id} room={room} />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  total={total}
                />
              </>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
