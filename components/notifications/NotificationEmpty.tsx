export default function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
      <span className="text-4xl mb-2">🔔</span>
      <p className="text-sm font-medium">Không có thông báo nào</p>
      <p className="text-xs mt-1">Mọi hoạt động sẽ hiển thị ở đây</p>
    </div>
  );
}
