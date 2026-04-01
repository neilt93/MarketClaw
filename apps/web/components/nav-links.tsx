"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/receipts", label: "Receipts" },
  { href: "/dashboard/listings", label: "Listings" },
  { href: "/dashboard/offers", label: "Offers" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm ${
              isActive
                ? "font-medium text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
