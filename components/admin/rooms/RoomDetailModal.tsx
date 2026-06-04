"use client";

import { X, MapPin, DollarSign, Users, Zap, Droplets, Wifi, CheckCircle, XCircle, EyeOff, RotateCcw, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Room } from "@/types";
import RoomStatusBadge from "@/components/admin/RoomStatusBadge";

const AMENITY_LABEL: Record<string, string> = {
  wifi: "WiFi", parking: "Bãi xe", air_conditioner: "Điều hòa",
  refrigerator: "Tủ lạnh", washing_machine: "Máy giặt",
  private_bathroom: "WC riêng", security_camera: "Camera",
  elevator: "Thang máy", balcony: "Ban công",
};

const ROOM_TYPE_LABEL: Record<string, string> = {
  room: "Phòng trọ", apartment: "Chung cư mini",
  dormitory: "Ký túc xá", house: "Nhà nguyên căn",
};

const GENDER_LABEL: Record<string, string> = {
  all: "Tất cả", male: "Nam", female: "Nữ",
};

interface Props {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (room: Room) => void;
  onReject: (room: Room) => void;
  onHide: (room: Room) => void;
  onRestore: (room: Room) => void;
  onDelete: (room: Room) => void;
}

export default function RoomDetailModal({ room, isOpen, onClose, onApprove, onReject, onHide, onRestore, onDelete }: Props) {
  const [imgIdx, setImgIdx] = useState(0);

  if (!isOpen || !room) return null;

  const images = room.images ?? [];
  const current = images[imgIdx];

  const action = (fn: (r: Room) => void) => {
    fn(room);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-800 truncate max-w-xs">{room.title}</h2>
            <RoomStatusBadge status={room.status} />
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Images */}
          {images.length > 0 && (
            <div>
              <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-100 relative">
                <Image src={current.url} alt={`img-${imgIdx}`} fill className="object-cover" unoptimized />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === imgIdx ? "border-orange-500" : "border-transparent"}`}
                    >
                      <Image src={img.url} alt="" width={56} height={56} className="object-cover w-full h-full" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <InfoItem icon={<DollarSign size={14} />} label="Giá thuê" value={`${room.price.toLocaleString("vi-VN")}đ/tháng`} />
            <InfoItem icon={<DollarSign size={14} />} label="Đặt cọc" value={`${room.deposit.toLocaleString("vi-VN")}đ`} />
            <InfoItem label="Loại phòng" value={ROOM_TYPE_LABEL[room.room_type] ?? room.room_type} />
            <InfoItem label="Diện tích" value={`${room.area} m²`} />
            <InfoItem icon={<Users size={14} />} label="Sức chứa" value={`${room.max_people} người · ${GENDER_LABEL[room.gender]}`} />
            <InfoItem label="Lượt xem" value={`${room.views} · ♥ ${room.favorite_count}`} />
          </div>

          {/* Giá phụ */}
          {(room.electricity_price > 0 || room.water_price > 0 || room.internet_price > 0 || room.service_price > 0) && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Chi phí dịch vụ</p>
              <div className="grid grid-cols-2 gap-2">
                {room.electricity_price > 0 && <InfoItem icon={<Zap size={13} />} label="Điện" value={`${room.electricity_price.toLocaleString("vi-VN")}đ/kWh`} />}
                {room.water_price > 0 && <InfoItem icon={<Droplets size={13} />} label="Nước" value={`${room.water_price.toLocaleString("vi-VN")}đ/m³`} />}
                {room.internet_price > 0 && <InfoItem icon={<Wifi size={13} />} label="Internet" value={`${room.internet_price.toLocaleString("vi-VN")}đ/tháng`} />}
                {room.service_price > 0 && <InfoItem label="Dịch vụ" value={`${room.service_price.toLocaleString("vi-VN")}đ/tháng`} />}
              </div>
            </div>
          )}

          {/* Địa chỉ */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin size={14} className="mt-0.5 flex-shrink-0 text-orange-400" />
            <span>{room.address}, {room.ward}, {room.district}, {room.city}</span>
          </div>

          {/* Tiện ích */}
          {room.amenities?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tiện ích</p>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((a) => (
                  <span key={a} className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
                    {AMENITY_LABEL[a] ?? a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mô tả */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Mô tả</p>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{room.description}</p>
          </div>

          {/* Meta */}
          <div className="text-xs text-gray-400 flex gap-4">
            <span>Đăng: {new Date(room.created_at).toLocaleDateString("vi-VN")}</span>
            <span>Cập nhật: {new Date(room.updated_at).toLocaleDateString("vi-VN")}</span>
            <span>Owner ID: {room.owner_id}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2 flex-shrink-0">
          {room.status === "pending" && (
            <>
              <button onClick={() => action(onApprove)} className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">
                <CheckCircle size={15} /> Duyệt
              </button>
              <button onClick={() => action(onReject)} className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
                <XCircle size={15} /> Từ chối
              </button>
            </>
          )}
          {room.status === "active" && (
            <button onClick={() => action(onHide)} className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
              <EyeOff size={15} /> Ẩn phòng
            </button>
          )}
          {room.status === "hidden" && (
            <button onClick={() => action(onRestore)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
              <RotateCcw size={15} /> Khôi phục
            </button>
          )}
          {room.status !== "deleted" && (
            <button onClick={() => action(onDelete)} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors ml-auto">
              <Trash2 size={15} /> Xóa phòng
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-1.5">
      {icon && <span className="text-orange-400 mt-0.5">{icon}</span>}
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700">{value}</p>
      </div>
    </div>
  );
}
