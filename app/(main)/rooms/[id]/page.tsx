import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Maximize2, Users, Eye, Calendar,
  Phone, MessageCircle, ChevronRight, Zap, Droplets, Wifi as WifiIcon, Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import RoomImageGallery from "@/components/rooms/RoomImageGallery";
import AmenityBadge from "@/components/rooms/AmenityBadge";
import { ROOM_TYPE_LABELS, ROOM_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Room } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getRoom(id: string): Promise<Room | null> {
  try {
    const res = await fetch(`${BASE_URL}/rooms/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const body = await res.json();
    return (body?.data ?? body) as Room;
  } catch {
    return null;
  }
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoom(id);
  if (!room) return { title: "Phòng không tồn tại" };
  return {
    title: `${room.title} | AI Guesthouse`,
    description: room.description.slice(0, 155),
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await getRoom(id);

  if (!room) notFound();

  const isAvailable = room.status === "active";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4" aria-label="breadcrumb">
        <Link href="/" className="hover:text-orange-500">Trang chủ</Link>
        <ChevronRight size={12} />
        <Link href="/rooms" className="hover:text-orange-500">Phòng trọ</Link>
        <ChevronRight size={12} />
        <Link href={`/rooms?city=${encodeURIComponent(room.city)}`} className="hover:text-orange-500">
          {room.city}
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 truncate max-w-[200px]">{room.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <RoomImageGallery images={room.images} title={room.title} />

          {/* Title & meta */}
          <div>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {ROOM_TYPE_LABELS[room.room_type]}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      isAvailable
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ROOM_STATUS_LABELS[room.status]}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-800 leading-snug">
                  {room.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-orange-400" />
                {room.address}, {room.ward}, {room.district}, {room.city}
              </span>
              <span className="flex items-center gap-1">
                <Maximize2 size={14} /> {room.area} m²
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> Tối đa {room.max_people} người
              </span>
              <span className="flex items-center gap-1">
                <Eye size={14} /> {room.views} lượt xem
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Đăng {formatDate(room.created_at)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3">Mô tả chi tiết</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {room.description}
            </p>
          </div>

          {/* Amenities */}
          {room.amenities.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-3">Tiện ích</h2>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((a) => (
                  <AmenityBadge key={a} amenity={a} />
                ))}
              </div>
            </div>
          )}

          {/* Price breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Chi phí hàng tháng</h2>
            <div className="space-y-2.5">
              <PriceLine icon={<span className="text-orange-500 font-bold text-xs">₫</span>} label="Tiền thuê" value={room.price} highlight />
              {room.deposit > 0 && (
                <PriceLine icon={<span className="text-yellow-500 text-xs">⚠</span>} label="Tiền cọc (1 lần)" value={room.deposit} />
              )}
              {room.electricity_price > 0 && (
                <PriceLine icon={<Zap size={13} className="text-yellow-400" />} label="Tiền điện (kWh)" value={room.electricity_price} unit="đ/kWh" />
              )}
              {room.water_price > 0 && (
                <PriceLine icon={<Droplets size={13} className="text-blue-400" />} label="Tiền nước (khối)" value={room.water_price} unit="đ/khối" />
              )}
              {room.internet_price > 0 && (
                <PriceLine icon={<WifiIcon size={13} className="text-indigo-400" />} label="Internet / tháng" value={room.internet_price} />
              )}
              {room.service_price > 0 && (
                <PriceLine icon={<Wrench size={13} className="text-gray-400" />} label="Phí dịch vụ / tháng" value={room.service_price} />
              )}
            </div>
          </div>
        </div>

        {/* ── Right column — Contact card ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-20">
            {/* Price */}
            <div className="text-center border-b border-gray-100 pb-4 mb-4">
              <p className="text-3xl font-bold text-orange-500">
                {formatCurrency(room.price)}
              </p>
              <p className="text-sm text-gray-400">/ tháng</p>
              {room.deposit > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Cọc: {formatCurrency(room.deposit)}
                </p>
              )}
            </div>

            {/* Quick info */}
            <div className="space-y-2 mb-5 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Diện tích</span>
                <span className="font-medium">{room.area} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sức chứa</span>
                <span className="font-medium">{room.max_people} người</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Loại phòng</span>
                <span className="font-medium">{ROOM_TYPE_LABELS[room.room_type]}</span>
              </div>
            </div>

            {/* CTA */}
            {isAvailable ? (
              <div className="space-y-3">
                <a
                  href={`tel:`}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  <Phone size={16} />
                  Liên hệ ngay
                </a>
                <button className="w-full flex items-center justify-center gap-2 border border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 rounded-xl transition-colors">
                  <MessageCircle size={16} />
                  Nhắn tin
                </button>
              </div>
            ) : (
              <div className="text-center py-3 bg-gray-50 rounded-xl text-sm text-gray-500 font-medium">
                Phòng hiện không còn trống
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-4">
              Hãy đề cập AI Guesthouse khi liên hệ chủ nhà
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceLine({
  icon,
  label,
  value,
  unit,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-gray-500">
        {icon}
        {label}
      </span>
      <span className={highlight ? "font-bold text-orange-500" : "font-medium text-gray-700"}>
        {formatCurrency(value)}
        {unit && <span className="text-xs text-gray-400 ml-0.5">{unit}</span>}
      </span>
    </div>
  );
}
