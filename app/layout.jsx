import "./globals.css";

export const metadata = {
  title: "家长沟通教练",
  description: "帮初中家长生成具体沟通话术和7天行动方案"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
