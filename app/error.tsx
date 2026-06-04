"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Có lỗi xảy ra</h2>
      <button onClick={reset}>Thử lại</button>
    </div>
  );
}
