import Link from "next/link";
import Image from "next/image";
import { MapPin, Maximize2, Eye } from "lucide-react";
import type { Room } from "@/types";
import { ROOM_TYPE_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils/format";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const thumbnail = room.images[room.thumbnail_index] ?? room.images[0];
  const typeLabel = ROOM_TYPE_LABELS[room.room_type];

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail.url}
            alt={room.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">Chưa có ảnh</span>
          </div>
        )}

        {/* Type badge */}
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {typeLabel}
        </span>

        {/* Image count */}
        {room.images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {room.images.length} ảnh
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1.5 group-hover:text-orange-500 transition-colors">
          {room.title}
        </h3>

        {/* Price */}
        <p className="text-orange-500 font-bold text-base mb-2">
          {formatCurrency(room.price)}
          <span className="text-xs font-normal text-gray-500">/tháng</span>
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            <span className="truncate max-w-[130px]">
              {room.district}, {room.city}
            </span>
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex items-center gap-0.5">
              <Maximize2 size={11} />
              {room.area} m²
            </span>
            <span className="flex items-center gap-0.5">
              <Eye size={11} />
              {room.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
