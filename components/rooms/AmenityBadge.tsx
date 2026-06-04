import { Wifi, Car, Wind, Thermometer, WashingMachine, ShowerHead, Camera, ArrowUpDown, TreePine } from "lucide-react";
import type { Amenity } from "@/types";
import { AMENITY_LABELS } from "@/lib/constants";

const AMENITY_ICONS: Record<Amenity, React.ReactNode> = {
  wifi: <Wifi size={14} />,
  parking: <Car size={14} />,
  air_conditioner: <Wind size={14} />,
  refrigerator: <Thermometer size={14} />,
  washing_machine: <WashingMachine size={14} />,
  private_bathroom: <ShowerHead size={14} />,
  security_camera: <Camera size={14} />,
  elevator: <ArrowUpDown size={14} />,
  balcony: <TreePine size={14} />,
};

interface AmenityBadgeProps {
  amenity: Amenity;
  size?: "sm" | "md";
}

export default function AmenityBadge({ amenity, size = "md" }: AmenityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full font-medium ${
        size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-3 py-1"
      }`}
    >
      {AMENITY_ICONS[amenity]}
      {AMENITY_LABELS[amenity]}
    </span>
  );
}
