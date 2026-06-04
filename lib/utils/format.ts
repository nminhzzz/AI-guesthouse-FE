// Format số tiền: 5000000 → "5.000.000 đ"
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Format diện tích: 25 → "25 m²"
export function formatArea(area: number): string {
  return `${area} m²`;
}

// Format ngày tháng
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(date));
}

// Lấy ID từ Room document (Beanie có thể trả _id hoặc id)
export function getRoomId(room: { id?: string; _id?: string }): string {
  return room.id ?? room._id ?? "";
}
