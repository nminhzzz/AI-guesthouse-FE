import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const FOOTER_ROOMS = [
  { label: "Phòng trọ Hồ Chí Minh", href: "/rooms?city=Hồ Chí Minh" },
  { label: "Phòng trọ Hà Nội", href: "/rooms?city=Hà Nội" },
  { label: "Phòng trọ Đà Nẵng", href: "/rooms?city=Đà Nẵng" },
  { label: "Phòng trọ Bình Dương", href: "/rooms?city=Bình Dương" },
  { label: "Phòng trọ Đồng Nai", href: "/rooms?city=Đồng Nai" },
  { label: "Phòng trọ Cần Thơ", href: "/rooms?city=Cần Thơ" },
];

const FOOTER_ABOUT = [
  { label: "Giới thiệu", href: "/about" },
  { label: "Quy chế hoạt động", href: "/terms" },
  { label: "Chính sách bảo mật", href: "/privacy" },
  { label: "Liên hệ", href: "/contact" },
];

const FOOTER_SUPPORT = [
  { label: "Câu hỏi thường gặp", href: "/faq" },
  { label: "Hướng dẫn đăng tin", href: "/guide" },
  { label: "Quy định đăng tin", href: "/rules" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-white font-bold text-lg">
                AI<span className="text-orange-400">Guesthouse</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Kênh thông tin phòng trọ hàng đầu Việt Nam, kết nối hàng triệu người
              thuê và chủ nhà mỗi tháng.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="tel:0909316890" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                <Phone size={14} />
                0909 316 890
              </a>
              <a href="mailto:support@aiguesthouse.vn" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                <Mail size={14} />
                support@aiguesthouse.vn
              </a>
              <span className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                TP. Hồ Chí Minh, Việt Nam
              </span>
            </div>
          </div>

          {/* Room links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Phòng trọ theo tỉnh thành
            </h4>
            <ul className="space-y-2">
              {FOOTER_ROOMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-orange-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Về AI Guesthouse
            </h4>
            <ul className="space-y-2">
              {FOOTER_ABOUT.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-orange-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-semibold mb-4 mt-6 text-sm uppercase tracking-wide">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-2">
              {FOOTER_SUPPORT.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-orange-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Post CTA */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Theo dõi chúng tôi
            </h4>
            <div className="flex gap-3 mb-6">
              <a
                href="#"
                className="w-9 h-9 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors text-sm font-bold"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Youtube"
              >
                YT
              </a>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-orange-400 mb-2">
                Bạn có phòng cho thuê?
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Đăng tin miễn phí, tiếp cận hàng nghìn người thuê mỗi ngày.
              </p>
              <Link
                href="/my-rooms/create"
                className="block text-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Đăng tin ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} AI Guesthouse. Tất cả quyền được bảo lưu.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-gray-300">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-gray-300">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
