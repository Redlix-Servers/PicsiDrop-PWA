import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Picsi Drop Partner Portal",
  description: "Securely manage logistics and deliveries.",
  manifest: "/manifest-partner.json",
  icons: {
    icon: "/PicsiDrop/Partner.png",
    apple: "/PicsiDrop/Partner.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Picsi Partner",
  },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
          <link rel="apple-touch-icon" href="/PicsiDrop/Partner.png" />
          <link rel="shortcut icon" href="/PicsiDrop/Partner.png" />
      </head>
      {children}
    </>
  );
}
