# 澎湖好行 - 網頁版

澎湖好行購票、劃位及我的車票管理系統的網頁版本。

## 功能特色

- 🎫 **購票系統**：完整的線上購票流程
- 📅 **劃位服務**：有票劃位功能
- 🎟️ **我的車票**：車票管理和查看
- 📊 **滿意度調查**：購票體驗問卷調查

## 技術棧

- **框架**：Next.js 14
- **語言**：TypeScript
- **樣式**：Tailwind CSS
- **UI 組件**：shadcn/ui (Radix UI)
- **部署**：Vercel

## 開發環境設置

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發伺服器：
```bash
npm run dev
```

3. 開啟瀏覽器訪問：
```
http://localhost:3000
```

## 部署到 Vercel

### 方式一：使用 Vercel CLI

1. 安裝 Vercel CLI：
```bash
npm i -g vercel
```

2. 登入 Vercel：
```bash
vercel login
```

3. 部署：
```bash
vercel
```

### 方式二：透過 GitHub 連接

1. 在 [Vercel Dashboard](https://vercel.com/dashboard) 中點擊 "New Project"
2. 選擇 GitHub 倉庫 `Tomalin18/penghu-web`
3. Vercel 會自動檢測 Next.js 專案並配置
4. 點擊 "Deploy" 開始部署

## 環境變數

如需設定環境變數，請在 Vercel 專案設定中添加：

- `NEXT_PUBLIC_*`：公開的環境變數，可在瀏覽器中使用
- 其他環境變數：僅在伺服器端可用

## 專案結構

```
app/
├── purchase/          # 購票相關頁面
├── reservation/       # 劃位相關頁面
├── my-tickets/       # 我的車票頁面
└── survey/           # 滿意度調查頁面

components/
├── desktop-navigation.tsx  # 桌面導航組件
└── ui/                    # UI 組件庫

lib/
└── ticket-storage.ts       # 車票儲存工具
```

## License

Private

