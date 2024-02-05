export const metadata = {
  title: "Simple Screenshot",
  description: "Simple API to take a screenshot of a website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
