import "./globals.css";


export const metadata = {
  title: "Smart Spindle",
  description: "Smart Spindle Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
