import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSearch from "@/components/home/HeroSearch";
import RoomCard from "@/components/rooms/RoomCard";
import type { Room, RoomListResponse } from "@/types";

// Server-side fetch rooms — gọi thẳng backend, không qua apiClient
async function getFeaturedRooms(): Promise<Room[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/rooms?page=1&limit=8`,
      {
        next: { revalidate: 60 }, // ISR: revalidate mỗi 60 giây
      },
    );
    if (!res.ok) return [];
    const body = await res.json();
    // Backend trả về { success, message, data: { items, page, limit, total } }
    const data: RoomListResponse = body?.data ?? body;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const rooms = await getFeaturedRooms();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <HeroSearch />

        {/* Featured rooms */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Phòng trọ mới nhất
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Cập nhật liên tục, tìm được phòng ưng ý ngay hôm nay
              </p>
            </div>
            <Link
              href="/rooms"
              className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Xem tất cả <ArrowRight size={15} />
            </Link>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Chưa có phòng nào</p>
              <p className="text-sm mt-1">Hãy quay lại sau</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section className="bg-orange-50 border-y border-orange-100 py-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Bạn có phòng cho thuê?
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              Đăng tin miễn phí, tiếp cận hàng nghìn người thuê mỗi ngày. Dễ
              dàng, nhanh chóng, hiệu quả.
            </p>
            <Link
              href="/register?role=owner"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Đăng tin ngay — Miễn phí
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
