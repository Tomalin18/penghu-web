"use client"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  AlertCircle,
  Bus,
  Plane,
  Ship,
  MapIcon,
  Minus,
  Plus,
  Headphones,
  Navigation,
  Bike,
  Wifi,
  BatteryCharging,
  DoorOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { TicketTypeSelector } from "@/components/ticket-type-selector"
import { DesktopNavigation } from "@/components/desktop-navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { attractions } from "@/data/attractions"
import Link from "next/link"

interface TicketDetail {
  id: string
  name: string
  price: number
  image: string
  description: string
  packageContents: string[]
  usageInstructions: string[]
  importantNotes: string[]
  usageRestrictions: string[]
}

export default function WebTicketDetailPage({ params }: { params: { ticketId: string } }) {
  const router = useRouter()
  const { ticketId } = params
  const isMobile = useIsMobile()
  const [selectedTicketType, setSelectedTicketType] = useState("一日券")
  const [ticket, setTicket] = useState<TicketDetail | undefined>(undefined)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [ticketQuantities, setTicketQuantities] = useState({
    adult: 1,
    child: 0,
    senior: 0,
    care: 0,
    student: 0,
    discount: 0,
    love: 0,
  })

  const timetableData = {
    north: [
      { time: "08:28", station: "西衛東站", status: "準點", stopDuration: "2分鐘", departure: "08:30" },
      { time: "08:36", station: "馬公港站", status: "準點", stopDuration: "2分鐘", departure: "08:38" },
      { time: "08:40", station: "公車總站", status: "準點", stopDuration: "2分鐘", departure: "08:42" },
      { time: "08:45", station: "自由塔(勝國)站", status: "準點", stopDuration: "2分鐘", departure: "08:47" },
      { time: "08:49", station: "第三漁港(雅霖)站", status: "準點", stopDuration: "2分鐘", departure: "08:51" },
      { time: "08:55", station: "文澳(元泰.百世多麗)站", status: "準點", stopDuration: "2分鐘", departure: "08:57" },
      { time: "09:07", station: "東衛站", status: "準點", stopDuration: "2分鐘", departure: "09:09" },
      { time: "09:30", station: "跨海大橋(西嶼端)", status: "準點", stopDuration: "15分鐘", departure: "09:45" },
      { time: "10:05", station: "三仙塔", status: "準點", stopDuration: "15分鐘", departure: "10:20" },
      { time: "10:35", station: "大菓葉玄武岩柱", status: "準點", stopDuration: "20分鐘", departure: "10:55" },
      { time: "11:00", station: "二崁聚落", status: "準點", stopDuration: "40分鐘", departure: "11:40" },
      { time: "11:50", station: "通梁古榕", status: "準點", stopDuration: "20分鐘", departure: "12:00" },
      { time: "12:20", station: "東衛站", status: "準點", stopDuration: "2分鐘", departure: "12:22" },
      { time: "12:33", station: "文澳(元泰.百世多麗)站", status: "準點", stopDuration: "2分鐘", departure: "12:35" },
      { time: "12:39", station: "第三漁港(雅霖)站", status: "準點", stopDuration: "2分鐘", departure: "12:41" },
      { time: "12:43", station: "自由塔(勝國)站", status: "準點", stopDuration: "2分鐘", departure: "12:45" },
      { time: "12:48", station: "公車總站", status: "準點", stopDuration: "2分鐘", departure: "12:50" },
      { time: "12:52", station: "馬公港站", status: "準點", stopDuration: "2分鐘", departure: "12:54" },
      { time: "13:00", station: "西衛東站", status: "準點", stopDuration: "2分鐘", departure: "13:02" },
    ],
    south: [
      { time: "08:28", station: "馬公港站", status: "準點", stopDuration: "2分鐘", departure: "08:30" },
      { time: "08:32", station: "公車總站", status: "準點", stopDuration: "2分鐘", departure: "08:34" },
      { time: "08:36", station: "自由塔(勝國)站", status: "準點", stopDuration: "2分鐘", departure: "08:38" },
      { time: "08:40", station: "第三漁港(雅霖)站", status: "準點", stopDuration: "2分鐘", departure: "08:42" },
      { time: "08:44", station: "文澳(元泰.百世多麗)站", status: "準點", stopDuration: "2分鐘", departure: "08:46" },
      { time: "09:05", station: "風櫃洞", status: "準點", stopDuration: "30分鐘", departure: "09:35" },
      { time: "09:45", station: "澎湖縣水產種苗繁殖場", status: "準點", stopDuration: "50分鐘", departure: "10:35" },
      { time: "10:50", station: "山水沙灘", status: "準點", stopDuration: "30分鐘", departure: "11:20" },
      { time: "11:30", station: "鎖港子午塔", status: "準點", stopDuration: "20分鐘", departure: "11:50" },
      { time: "12:05", station: "文澳(元泰.百世多麗)站", status: "準點", stopDuration: "2分鐘", departure: "12:07" },
      { time: "12:08", station: "第三漁港(雅霖)站", status: "準點", stopDuration: "2分鐘", departure: "12:10" },
      { time: "12:12", station: "自由塔(勝國)站", status: "準點", stopDuration: "2分鐘", departure: "12:14" },
      { time: "12:16", station: "公車總站", status: "準點", stopDuration: "2分鐘", departure: "12:18" },
      { time: "12:20", station: "馬公港站", status: "準點", stopDuration: "2分鐘", departure: "12:22" },
    ],
    xihu: [
      { time: "08:30", station: "馬公港站", status: "準點", stopDuration: "2分鐘", departure: "08:32" },
      { time: "08:34", station: "公車總站", status: "準點", stopDuration: "2分鐘", departure: "08:36" },
      { time: "08:39", station: "自由塔(勝國)站", status: "準點", stopDuration: "2分鐘", departure: "08:41" },
      { time: "08:43", station: "第三漁港(雅霖)站", status: "準點", stopDuration: "2分鐘", departure: "08:45" },
      { time: "08:47", station: "文澳(元泰.百世多麗)站", status: "準點", stopDuration: "2分鐘", departure: "08:49" },
      { time: "09:00", station: "澎湖機場站", status: "準點", stopDuration: "2分鐘", departure: "09:02" },
      { time: "09:10", station: "北寮奎壁山", status: "準點", stopDuration: "30分鐘", departure: "09:40" },
      { time: "09:50", station: "南寮社區", status: "準點", stopDuration: "35分鐘", departure: "10:25" },
      { time: "10:35", station: "龍門閉鎖陣地", status: "準點", stopDuration: "30分鐘", departure: "11:05" },
      { time: "11:21", station: "澎湖機場站", status: "準點", stopDuration: "2分鐘", departure: "11:23" },
      { time: "11:35", station: "澎湖生活博物館", status: "準點", stopDuration: "45分鐘", departure: "12:20" },
      { time: "12:22", station: "文澳(元泰.百世多麗)站", status: "準點", stopDuration: "2分鐘", departure: "12:24" },
      { time: "12:26", station: "第三漁港(雅霖)站", status: "準點", stopDuration: "2分鐘", departure: "12:28" },
      { time: "12:30", station: "自由塔(勝國)站", status: "準點", stopDuration: "2分鐘", departure: "12:32" },
      { time: "12:34", station: "公車總站", status: "準點", stopDuration: "2分鐘", departure: "12:36" },
      { time: "12:40", station: "馬公港站", status: "準點", stopDuration: "2分鐘", departure: "12:42" },
    ],
  }

  const routes = [
    {
      id: "north",
      name: "北環線",
      color: "bg-[#6FA650]",
      primaryColor: "#6FA650",
      secondaryColor: "#EAF4EE",
      alertColor: "#598348",
    },
    {
      id: "south",
      name: "澎南線",
      color: "bg-[#D96B3E]",
      primaryColor: "#D96B3E",
      secondaryColor: "#FFFBE4",
      alertColor: "#C66239",
    },
    {
      id: "xihu",
      name: "湖西線",
      color: "bg-[#63A0B5]",
      primaryColor: "#63A0B5",
      secondaryColor: "#E8F5FC",
      alertColor: "#3D8098",
    },
  ]

  const getTicketRoutes = (ticketId: string): string[] => {
    if (ticketId.includes("north") && ticketId.includes("xihu")) {
      return ["north", "xihu"]
    } else if (ticketId.includes("north") && ticketId.includes("south")) {
      return ["north", "south"]
    } else if (ticketId.includes("xihu") && ticketId.includes("south")) {
      return ["xihu", "south"]
    } else if (ticketId.includes("north") || ticketId === "magong-north-1" || ticketId === "north-airport-combo") {
      return ["north"]
    } else if (ticketId.includes("xihu") || ticketId === "magong-xihu-1" || ticketId === "xihu-airport-combo") {
      return ["xihu"]
    } else if (ticketId.includes("south") || ticketId === "magong-south-1" || ticketId === "south-airport-combo") {
      return ["south"]
    } else if (ticketId.includes("penghu-3")) {
      return ["north", "xihu", "south"]
    }
    return []
  }

  const getTicketType = (id: string): string => {
    if (id.includes("-1") || id === "magong-north-1" || id === "magong-xihu-1" || id === "magong-south-1") {
      return "一日券"
    } else if (id.includes("-2") || id.includes("2-day")) {
      return "二日券"
    } else if (id.includes("-3") || id.includes("3-day") || id.includes("penghu-3")) {
      return "三日券"
    } else {
      return "其他票券"
    }
  }

  const nearbyTransportation: Record<
    string,
    {
      buses: {
        government: string[]
        scenic: string[]
      }
      flights: string[]
      ships: string[]
      youbike: string[]
      wifi: string[]
      charging: string[]
      restroom: string[]
    }
  > = {
    西衛東站: {
      buses: {
        government: ["1路公車", "2路公車", "7路公車"],
        scenic: ["北環線觀光巴士", "市區環線"],
      },
      flights: [],
      ships: ["馬公港渡輪"],
      youbike: ["西衛站"],
      wifi: ["iTaiwan"],
      charging: ["7-11西衛門市"],
      restroom: ["西衛東站公廁"],
    },
    馬公港站: {
      buses: {
        government: ["1路公車", "2路公車", "3路公車", "4路公車", "5路公車"],
        scenic: ["北環線觀光巴士", "南環線觀光巴士", "湖西線觀光巴士"],
      },
      flights: ["澎湖機場接駁車"],
      ships: ["嘉義布袋港", "高雄港", "台南安平港", "七美島", "望安島"],
      youbike: ["馬公港站", "第一漁港站"],
      wifi: ["iTaiwan", "Penghu Free WiFi"],
      charging: ["馬公遊客服務中心", "全家馬公港門市"],
      restroom: ["馬公港公廁", "遊客服務中心"],
    },
    公車總站: {
      buses: {
        government: ["1路公車", "2路公車", "3路公車", "4路公車", "5路公車", "6路公車", "7路公車", "8路公車"],
        scenic: ["北環線觀光巴士", "南環線觀光巴士", "湖西線觀光巴士", "西嶼線觀光巴士"],
      },
      flights: ["澎湖機場接駁車"],
      ships: [],
      youbike: ["公車總站", "縣政府站"],
      wifi: ["iTaiwan", "Penghu Free WiFi"],
      charging: ["全家公車總站門市", "OK超商馬公店"],
      restroom: ["公車總站公廁"],
    },
    澎湖機場站: {
      buses: {
        government: ["機場接駁車", "3路公車"],
        scenic: ["湖西線觀光巴士"],
      },
      flights: ["台北松山", "台中清泉崗", "高雄小港", "嘉義", "台南"],
      ships: [],
      youbike: ["澎湖機場站"],
      wifi: ["iTaiwan", "Airport Free WiFi"],
      charging: ["機場航廈充電站", "7-11機場門市"],
      restroom: ["機場航廈公廁"],
    },
    "跨海大橋(西嶼端)": {
      buses: {
        government: ["西嶼環島公車"],
        scenic: ["北環線觀光巴士", "西嶼線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["漁翁島遊客中心"],
      restroom: ["跨海大橋公廁"],
    },
    風櫃洞: {
      buses: {
        government: ["澎南線公車", "5路公車"],
        scenic: ["南環線觀光巴士"],
      },
      flights: [],
      ships: ["觀光遊艇"],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["風櫃溫王殿"],
      restroom: ["風櫃洞景點公廁"],
    },
    山水沙灘: {
      buses: {
        government: ["澎南線公車", "5路公車"],
        scenic: ["南環線觀光巴士"],
      },
      flights: [],
      ships: ["海上活動船隻"],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["山水30沙灘"],
      restroom: ["山水沙灘公廁"],
    },
    北寮奎壁山: {
      buses: {
        government: ["湖西線公車", "3路公車"],
        scenic: ["湖西線觀光巴士"],
      },
      flights: [],
      ships: ["潮間帶導覽船"],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["北寮社區活動中心"],
      restroom: ["奎壁山景點公廁"],
    },
    "自由塔(勝國)站": {
      buses: {
        government: ["1路公車", "2路公車"],
        scenic: ["北環線觀光巴士", "南環線觀光巴士", "湖西線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["7-11自由塔門市"],
      restroom: [],
    },
    "第三漁港(雅霖)站": {
      buses: {
        government: ["1路公車", "2路公車"],
        scenic: ["北環線觀光巴士", "南環線觀光巴士", "湖西線觀光巴士"],
      },
      flights: [],
      ships: ["觀光漁船"],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["全家第三漁港門市"],
      restroom: ["第三漁港公廁"],
    },
    "文澳(元泰.百世多麗)站": {
      buses: {
        government: ["1路公車", "2路公車", "3路公車"],
        scenic: ["北環線觀光巴士", "南環線觀光巴士", "湖西線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["元泰大飯店", "百世多麗酒店"],
      restroom: ["飯店公共洗手間"],
    },
    東衛站: {
      buses: {
        government: ["1路公車"],
        scenic: ["北環線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: [],
      restroom: ["東衛社區活動中心"],
    },
    三仙塔: {
      buses: {
        government: ["西嶼環島公車"],
        scenic: ["北環線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: [],
      restroom: ["三仙塔景點公廁"],
    },
    二崁聚落: {
      buses: {
        government: ["西嶼環島公車"],
        scenic: ["北環線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["二崁社區咖啡館"],
      restroom: ["二崁聚落公廁"],
    },
    通梁古榕: {
      buses: {
        government: ["西嶼環島公車"],
        scenic: ["北環線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["通梁社區活動中心"],
      restroom: ["通梁古榕景點公廁"],
    },
    大菓葉玄武岩柱: {
      buses: {
        government: ["西嶼環島公車"],
        scenic: ["北環線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: [],
      restroom: ["大菓葉景點公廁"],
    },
    澎湖縣水產種苗繁殖場: {
      buses: {
        government: ["澎南線公車", "5路公車"],
        scenic: ["南環線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: [],
      restroom: ["水產繁殖場公廁"],
    },
    鎖港子午塔: {
      buses: {
        government: ["澎南線公車", "5路公車"],
        scenic: ["南環線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["鎖港社區活動中心"],
      restroom: ["鎖港公廁"],
    },
    南寮社區: {
      buses: {
        government: ["湖西線公車", "3路公車"],
        scenic: ["湖西線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: ["南寮社區活動中心"],
      restroom: ["南寮社區公廁"],
    },
    龍門閉鎖陣地: {
      buses: {
        government: ["湖西線公車", "3路公車"],
        scenic: ["湖西線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: [],
      wifi: ["iTaiwan"],
      charging: [],
      restroom: ["龍門景點公廁"],
    },
    澎湖生活博物館: {
      buses: {
        government: ["湖西線公車", "3路公車"],
        scenic: ["湖西線觀光巴士"],
      },
      flights: [],
      ships: [],
      youbike: ["澎湖生活博物館站"],
      wifi: ["iTaiwan", "博物館WiFi"],
      charging: ["博物館服務台"],
      restroom: ["博物館公廁"],
    },
  }

  const getNearbyTransport = (stationName: string) => {
    return (
      nearbyTransportation[stationName] || {
        buses: {
          government: ["當地接駁車"],
          scenic: ["觀光巴士"],
        },
        flights: [],
        ships: [],
        youbike: [],
        wifi: [],
        charging: [],
        restroom: [],
      }
    )
  }

  // 根據站點名稱找到對應的景點資料
  const getAttractionByStation = (stationName: string) => {
    const stationToAttractionMap: Record<string, string> = {
      "跨海大橋(西嶼端)": "penghu-cross-sea-bridge",
      "三仙塔": "waian-sanxian-tower",
      "大菓葉玄武岩柱": "daguoye-basalt",
      "二崁聚落": "erkan-village",
      "通梁古榕": "tongliang-ancient-banyan",
      "風櫃洞": "fengguei-cave",
      "澎湖縣水產種苗繁殖場": "penghu-aquarium",
      "山水沙灘": "shanshui-beach",
      "鎖港子午塔": "suogang-tower",
      "北寮奎壁山": "kuibishan-moses-sea",
      "南寮社區": "nanliao-community",
      "龍門閉鎖陣地": "longmen-closed-stronghold",
      "澎湖生活博物館": "penghu-living-museum",
    }

    const attractionId = stationToAttractionMap[stationName]
    if (attractionId) {
      return attractions.find((a) => a.id === attractionId)
    }
    return undefined
  }

  useEffect(() => {
    const ticketDetails: Record<string, TicketDetail> = {
      "magong-north-1": {
        id: "magong-north-1",
        name: "媽宮・北環線 一日券",
        price: 150,
        image: "/images/ticket-north-ring-premium.png",
        description:
          "探索澎湖北環線的美麗景點，包含跨海大橋、通樑古榕、二崁古厝等知名景點。一日券讓您輕鬆暢遊北環線所有站點，體驗澎湖的自然美景與人文風情。",
        packageContents: [
          "台灣好行北環線一日無限搭乘",
          "澎湖跨海大橋景點導覽",
          "通樑古榕樹景點介紹",
          "二崁古厝文化體驗",
          "小門鯨魚洞地質奇觀",
          "竹灣螃蟹博物館參觀",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
      "magong-xihu-1": {
        id: "magong-xihu-1",
        name: "媽宮・湖西線 一日券",
        price: 125,
        image: "/images/ticket-xihu.png",
        description:
          "深度體驗澎湖湖西鄉的寧靜之美，造訪隘門沙灘、林投公園、青螺濕地等自然景觀，感受澎湖東海岸的獨特魅力。",
        packageContents: [
          "台灣好行湖西線一日無限搭乘",
          "隘門沙灘戲水體驗",
          "林投公園生態導覽",
          "青螺濕地賞鳥活動",
          "菓葉日出觀景台",
          "奎壁山摩西分海奇景",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
      "magong-south-1": {
        id: "magong-south-1",
        name: "媽宮・澎南線 一日券",
        price: 100,
        image: "/images/ticket-south-premium.png",
        description:
          "探索澎湖南部的人文風情與自然美景，包含風櫃洞、山水沙灘、嵵裡沙灘等知名景點，體驗澎湖南環線的獨特魅力。",
        packageContents: [
          "台灣好行澎南線一日無限搭乘",
          "風櫃洞地質奇觀導覽",
          "山水沙灘休閒體驗",
          "嵵裡沙灘玄武岩景觀",
          "鎖港紫菜故鄉文化",
          "時裡沙灘夕陽美景",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
      "north-xihu-2": {
        id: "north-xihu-2",
        name: "台灣好行 二日券 北環・湖西線",
        price: 250,
        image: "/images/ticket-north-xihu-2day.png",
        description:
          "兩日深度暢遊澎湖北環線與湖西線，從跨海大橋到奎壁山分海，完整體驗澎湖北部與東部的自然奇景與人文風情。",
        packageContents: [
          "台灣好行北環線二日無限搭乘",
          "台灣好行湖西線二日無限搭乘",
          "跨海大橋、通樑古榕景點導覽",
          "奎壁山摩西分海體驗",
          "隘門沙灘、林投公園生態遊",
          "二崁古厝文化深度體驗",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
      "north-south-2": {
        id: "north-south-2",
        name: "台灣好行 二日券 北環・澎南線",
        price: 225,
        image: "/images/ticket-north-south-2day.png",
        description:
          "結合澎湖北環線與澎南線的精華景點，從跨海大橋到風櫃洞，兩日內完整體驗澎湖環島的自然美景與地質奇觀。",
        packageContents: [
          "台灣好行北環線二日無限搭乘",
          "台灣好行澎南線二日無限搭乘",
          "跨海大橋、通樑古榕景點導覽",
          "風櫃洞地質奇觀體驗",
          "山水沙灘、嵵裡沙灘遊覽",
          "二崁古厝與鎖港文化體驗",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
      "xihu-south-2": {
        id: "xihu-south-2",
        name: "台灣好行 二日券 湖西・澎南線",
        price: 200,
        image: "/images/ticket-xihu-south-2day.png",
        description: "深度探索澎湖東部與南部的自然風光，從奎壁山分海到風櫃洞，體驗澎湖最具特色的地質景觀與海岸風情。",
        packageContents: [
          "台灣好行湖西線二日無限搭乘",
          "台灣好行澎南線二日無限搭乘",
          "奎壁山分海與隘門沙灘體驗",
          "風櫃洞、山水沙灘地質遊覽",
          "二崁古厝深度文化體驗",
          "青螺濕地生態與鎖港文化",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
      "penghu-3-600": {
        id: "penghu-3-600",
        name: "台灣好行 三日券 北環・湖西・澎南線",
        price: 600,
        image: "/images/ticket-3day-600.png",
        description:
          "澎湖全島三日暢遊券,涵蓋北環線、湖西線、澎南線所有景點，讓您充分體驗澎湖的自然美景、人文風情與地質奇觀。",
        packageContents: [
          "台灣好行三線三日無限搭乘",
          "跨海大橋、通樑古榕完整導覽",
          "奎壁山分海與隘門沙灘體驗",
          "風櫃洞、山水沙灘地質遊覽",
          "二崁古厝深度文化體驗",
          "青螺濕地生態與螃蟹博物館",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
      "penghu-3-300": {
        id: "penghu-3-300",
        name: "台灣好行 三日券 北環・湖西・澎南線",
        price: 300,
        image: "/images/ticket-3day-300.png",
        description: "經濟實惠的澎湖三日遊券，涵蓋所有主要景點路線，適合預算有限但想完整體驗澎湖風情的旅客。",
        packageContents: [
          "台灣好行三線三日無限搭乘",
          "主要景點基礎導覽服務",
          "跨海大橋與通樑古榕參觀",
          "奎壁山分海時段體驗",
          "風櫃洞與山水沙灘遊覽",
          "基礎文化景點介紹",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
      "north-airport-combo": {
        id: "north-airport-combo",
        name: "媽宮・暢遊北環線一日券+空港快線",
        price: 300,
        image: "/images/ticket-magong-north-300.png",
        description: "結合機場接送與北環線觀光的便利套票，從機場直達市區後暢遊北環線所有景點，適合短期旅遊的完美選擇。",
        packageContents: [
          "機場快線來回接送服務",
          "台灣好行北環線一日無限搭乘",
          "跨海大橋景點導覽",
          "通樑古榕與二崁古厝體驗",
          "小門鯨魚洞地質奇觀",
          "竹灣螃蟹博物館參觀",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
      "xihu-airport-combo": {
        id: "xihu-airport-combo",
        name: "媽宮・湖西慢旅趣一日券+空港快線",
        price: 250,
        image: "/images/ticket-magong-xihu-250.png",
        description: "機場接送搭配湖西線慢旅行，體驗澎湖東海岸的寧靜美景，從奎壁山分海到隘門沙灘，享受悠閒的島嶼時光。",
        packageContents: [
          "機場快線來回接送服務",
          "台灣好行湖西線一日無限搭乘",
          "奎壁山摩西分海體驗",
          "隘門沙灘與林投公園遊覽",
          "青螺濕地生態導覽",
          "菓葉日出觀景台參觀",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
      "south-airport-combo": {
        id: "south-airport-combo",
        name: "媽宮・澎南輕旅行一日券+空港快線",
        price: 200,
        image: "/images/ticket-magong-south-200.png",
        description: "最經濟的機場接送加觀光套票，暢遊澎湖南部的風櫃洞、山水沙灘等熱門景點，適合預算有限的輕旅行。",
        packageContents: [
          "機場快線來回接送服務",
          "台灣好行澎南線一日無限搭乘",
          "風櫃洞地質奇觀導覽",
          "山水沙灘與嵵裡沙灘遊覽",
          "鎖港紫菜故鄉文化體驗",
          "時裡沙灘夕陽美景欣賞",
        ],
        usageInstructions: [
          "**預約制購票流程：**\n\n• **預約時間**：須於乘車日前一日 20:00 前完成購票與劃位\n\n• **購票方式**：\n  - **實體票券** → 7-11 ibon、全家 FamiPort、和盟電子商務股份有限公司澎湖分公司、KLOOK、Trip.com\n  - **電子票證** → 悠遊卡、一卡通\n  - **行動支付** → 悠遊付、iPASS Money\n\n• **搭乘方式**：使用 QR Code 或電子票證感應即可上車",
        ],
        importantNotes: [
          "**劃位與購票限制：**\n\n• 購票後需劃位，名額有限，先到先得\n• 乘車日前一日晚上 8 點後，將無法購票或劃位\n• 當日若有空位，僅能購買**單日券**（不提供二日券、三日券）\n\n**優惠資訊：**\n\n• **電子票證及行動支付**於 2023/08/01 – 2025/10/31 享**五折優惠**\n• 已享 50% 優待之族群（長者、身心障礙者及陪同者、6–12歲兒童）不可再重複折扣",
        ],
        usageRestrictions: [
          "**付款限制：**\n\n• 不接受車上現金購票，僅能事先購票或使用電子票、行動支付\n\n**票種限制：**\n\n• 當日購票僅限**單日券**\n• 優待票需符合資格（長者、身心障礙及陪同者、兒童 6–12 歲或身高 115–150 公分）\n\n**使用期限：**\n\n• 需依購票規範當日或票種有效期間使用，逾期無效",
        ],
      },
    }

    const foundTicket = ticketDetails[ticketId]
    setTicket(foundTicket)

    if (foundTicket) {
      setSelectedTicketType(getTicketType(ticketId))
    }
  }, [ticketId])

  const handleTicketTypeChange = (type: string) => {
    setSelectedTicketType(type)
    router.push(`/web/purchase/tickets?type=${encodeURIComponent(type)}`)
  }

  const handlePurchase = () => {
    setIsDrawerOpen(true)
  }

  const updateQuantity = (type: keyof typeof ticketQuantities, delta: number) => {
    setTicketQuantities((prev: typeof ticketQuantities) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }))
  }

  const handleComplete = () => {
    const totalTickets = (Object.values(ticketQuantities) as number[]).reduce((sum: number, qty: number) => sum + qty, 0)
    if (totalTickets === 0) {
      return
    }
    setIsDrawerOpen(false)

    const params = new URLSearchParams({
      ticketId,
      adult: ticketQuantities.adult.toString(),
      discount: ticketQuantities.discount.toString(),
      senior: ticketQuantities.senior.toString(),
      love: ticketQuantities.love.toString(),
      child: ticketQuantities.child.toString(),
    })
    router.push(`/web/purchase/passenger-info?${params.toString()}`)
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        {!isMobile && <DesktopNavigation activeTab="purchase" />}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">票券資訊不存在</p>
          <Button onClick={() => router.push("/web/purchase/tickets")} className="mt-4">
            返回購票頁面
          </Button>
        </div>
        {isMobile && <MobileNavigation activeTab="purchase" />}
      </div>
    )
  }

  const ticketTypes = [
    {
      id: "adult",
      label: "全票",
      description: "非澎湖籍",
    },
    {
      id: "discount",
      label: "澎湖籍居民票",
      description: "持有澎湖籍證明",
    },
    {
      id: "senior",
      label: "長者票",
      description: "65歲以上",
    },
    {
      id: "love",
      label: "愛心票",
      description: "持身心障礙證明及陪同者",
    },
    {
      id: "child",
      label: "兒童票",
      description: "6歲~12歲或身高115~150公分",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isMobile && <DesktopNavigation activeTab="purchase" />}
      
      <header className="bg-primary px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/web/purchase/tickets" className="text-primary-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 font-bold text-lg md:text-xl text-primary-foreground text-center">票券詳情</h1>
        </div>
      </header>

      <div className="sticky top-0 md:top-16 z-35 bg-transparent backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TicketTypeSelector selectedType={selectedTicketType} onTypeChange={handleTicketTypeChange} />
        </div>
      </div>

      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="py-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">{ticket.name}</h2>
            <p className="text-lg md:text-xl font-semibold text-primary mt-2">
              NT$ {ticket.price}~{ticket.price * 2}
            </p>
          </div>

          {/* Hero Banner */}
          <div className="mb-6">
            <img
              src={ticket.image || "/placeholder.svg?height=200&width=400&query=澎湖觀光巴士票券"}
              alt={ticket.name}
              className="w-full h-48 md:h-64 object-cover rounded-lg shadow-sm"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              票券說明
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{ticket.description}</p>
          </div>

          {/* Route Schedule */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Bus className="h-5 w-5 mr-2 text-primary" />
              行車路線
            </h3>

            {getTicketRoutes(ticketId).length > 1 ? (
              <Tabs defaultValue={getTicketRoutes(ticketId)[0]} className="w-full">
                <TabsList
                  className={`grid w-full ${getTicketRoutes(ticketId).length === 2 ? "grid-cols-2" : "grid-cols-3"} mb-4`}
                >
                  {getTicketRoutes(ticketId).map((routeId) => {
                    const route = routes.find((r) => r.id === routeId)
                    return (
                      <TabsTrigger key={routeId} value={routeId} className="text-sm">
                        {route?.name}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                {getTicketRoutes(ticketId).map((routeId) => {
                  const route = routes.find((r) => r.id === routeId)
                  const routeTimetable = timetableData[routeId as keyof typeof timetableData]

                  return (
                    <TabsContent key={routeId} value={routeId} className="space-y-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${route?.color}`} />
                        <h4 className="font-medium text-foreground">{route?.name}</h4>
                      </div>

                      <div className="space-y-0 relative">
                        {routeTimetable.map((schedule, index) => {
                          const isFirst = index === 0
                          const isLast = index === routeTimetable.length - 1

                          let dotColor = route?.primaryColor
                          let stopType = "景點"

                          if (isFirst) {
                            dotColor = "#22c55e" // green
                            stopType = "起點"
                          } else if (isLast) {
                            dotColor = "#ef4444" // red
                            stopType = "終點"
                          }

                          const nearbyTransport = getNearbyTransport(schedule.station)
                          const attraction = getAttractionByStation(schedule.station)

                          return (
                            <div key={index} className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full flex-shrink-0 z-10"
                                style={{ backgroundColor: dotColor }}
                              />

                              <div className="flex-1 flex items-center justify-between ml-4 py-3">
                                <div className="flex items-center space-x-3">
                                  {attraction ? (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <span className="font-medium text-primary text-sm cursor-pointer underline hover:text-primary/80 transition-colors">
                                          {schedule.station}
                                        </span>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-sm max-h-[80vh]">
                                        <DialogHeader>
                                          <DialogTitle>{attraction.title}</DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="h-[60vh] pr-4">
                                          <div className="space-y-4">
                                            {/* Image */}
                                            {attraction.image && (
                                              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                                <Image
                                                  src={attraction.image || "/placeholder.svg"}
                                                  alt={attraction.title}
                                                  fill
                                                  className="object-cover"
                                                />
                                              </div>
                                            )}

                                            {/* Categories */}
                                            <div className="flex flex-wrap gap-2">
                                              {attraction.category.map((cat) => (
                                                <Badge key={cat} variant="secondary">
                                                  {cat}
                                                </Badge>
                                              ))}
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-muted-foreground">{attraction.description}</p>

                                            {/* Detailed Description */}
                                            <Card>
                                              <CardContent className="pt-4">
                                                <p className="text-sm leading-relaxed whitespace-pre-line">
                                                  {attraction.detailedDescription}
                                                </p>
                                              </CardContent>
                                            </Card>

                                            {/* Highlights */}
                                            {attraction.highlights && (
                                              <Card>
                                                <CardContent className="pt-4">
                                                  <h4 className="font-medium mb-2">景點特色</h4>
                                                  <ul className="space-y-2">
                                                    {attraction.highlights.map((highlight, idx) => (
                                                      <li key={idx} className="flex items-start gap-2 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                        <span>{highlight}</span>
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </CardContent>
                                              </Card>
                                            )}

                                            {/* Visit Info */}
                                            <Card>
                                              <CardContent className="pt-4 space-y-2">
                                                <h4 className="font-medium mb-2">參觀資訊</h4>
                                                <div className="flex justify-between text-sm">
                                                  <span className="text-muted-foreground">開放時間</span>
                                                  <span>{attraction.visitInfo.openingHours}</span>
                                                </div>
                                                {attraction.visitInfo.recommendedDuration && (
                                                  <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">建議停留</span>
                                                    <span>{attraction.visitInfo.recommendedDuration}</span>
                                                  </div>
                                                )}
                                                <div className="flex justify-between text-sm">
                                                  <span className="text-muted-foreground">門票費用</span>
                                                  <span>{attraction.visitInfo.admission}</span>
                                                </div>
                                              </CardContent>
                                            </Card>

                                            {/* Location */}
                                            <Card>
                                              <CardContent className="pt-4">
                                                <h4 className="font-medium mb-2">地點資訊</h4>
                                                <p className="text-sm text-muted-foreground">{attraction.location.address}</p>
                                                {attraction.transportation?.fromMagong && (
                                                  <p className="text-sm text-muted-foreground mt-2">
                                                    <span className="font-medium text-foreground">交通：</span>
                                                    {attraction.transportation.fromMagong}
                                                  </p>
                                                )}
                                              </CardContent>
                                            </Card>
                                          </div>
                                        </ScrollArea>
                                      </DialogContent>
                                    </Dialog>
                                  ) : (
                                    <span className="font-medium text-foreground text-sm">{schedule.station}</span>
                                  )}
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs px-2 py-0.5 cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{
                                          backgroundColor: route?.secondaryColor,
                                          color: route?.alertColor,
                                        }}
                                      >
                                        附近交通
                                      </Badge>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center text-lg">
                                          <MapIcon className="h-5 w-5 mr-2 text-primary" />
                                          {schedule.station}
                                        </DialogTitle>
                                        <p className="text-sm text-muted-foreground">附近交通與設施</p>
                                      </DialogHeader>
                                      
                                      <ScrollArea className="max-h-[60vh]">
                                        <div className="space-y-1 pr-2">
                                          {/* 公車路線 */}
                                          {(nearbyTransport.buses.government.length > 0 ||
                                            nearbyTransport.buses.scenic.length > 0) && (
                                            <Card className="border-l-4 border-l-blue-500">
                                              <CardContent className="p-2">
                                                <div className="flex items-center mb-1">
                                                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                                    <Bus className="h-3 w-3 text-blue-600" />
                                                  </div>
                                                  <h4 className="font-semibold text-foreground text-sm">公車路線</h4>
                                                </div>
                                                
                                                <div className="space-y-1">
                                                  {/* Government buses */}
                                                  {nearbyTransport.buses.government.length > 0 && (
                                                    <div>
                                                      <p className="text-xs font-medium text-muted-foreground mb-0.5">澎湖縣政府公共車船管理處</p>
                                                      <div className="grid grid-cols-2 gap-1">
                                                        {nearbyTransport.buses.government.map((bus, idx) => (
                                                          <div key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium text-center">
                                                            {bus}
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* Scenic area buses */}
                                                  {nearbyTransport.buses.scenic.length > 0 && (
                                                    <div>
                                                      <p className="text-xs font-medium text-muted-foreground mb-0.5">澎湖國家風景區管理處</p>
                                                      <div className="grid grid-cols-2 gap-1">
                                                        {nearbyTransport.buses.scenic.map((bus, idx) => (
                                                          <div key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium text-center">
                                                            {bus}
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )}

                                          {/* 航班資訊 */}
                                          {nearbyTransport.flights.length > 0 && (
                                            <Card className="border-l-4 border-l-green-500">
                                              <CardContent className="p-2">
                                                <div className="flex items-center mb-1">
                                                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                                    <Plane className="h-3 w-3 text-green-600" />
                                                  </div>
                                                  <h4 className="font-semibold text-foreground text-sm">航班資訊</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1">
                                                  {nearbyTransport.flights.map((flight, idx) => (
                                                    <div key={idx} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium text-center">
                                                      {flight}
                                                    </div>
                                                  ))}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )}

                                          {/* 船班資訊 */}
                                          {nearbyTransport.ships.length > 0 && (
                                            <Card className="border-l-4 border-l-purple-500">
                                              <CardContent className="p-2">
                                                <div className="flex items-center mb-1">
                                                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                                                    <Ship className="h-3 w-3 text-purple-600" />
                                                  </div>
                                                  <h4 className="font-semibold text-foreground text-sm">船班資訊</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1">
                                                  {nearbyTransport.ships.map((ship, idx) => (
                                                    <div key={idx} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium text-center">
                                                      {ship}
                                                    </div>
                                                  ))}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )}

                                          {/* YouBike站點 */}
                                          {nearbyTransport.youbike.length > 0 && (
                                            <Card className="border-l-4 border-l-orange-500">
                                              <CardContent className="p-2">
                                                <div className="flex items-center mb-1">
                                                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                                                    <Bike className="h-3 w-3 text-orange-600" />
                                                  </div>
                                                  <h4 className="font-semibold text-foreground text-sm">YouBike站點</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1">
                                                  {nearbyTransport.youbike.map((bike, idx) => (
                                                    <div key={idx} className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium text-center">
                                                      {bike}
                                                    </div>
                                                  ))}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )}

                                          {/* 設施服務 */}
                                          <div className="flex flex-wrap gap-1">
                                            {/* WiFi熱點 */}
                                            {nearbyTransport.wifi.length > 0 && (
                                              <Card className="border-l-4 border-l-cyan-500 flex-1 min-w-[45%]">
                                                <CardContent className="p-2">
                                                  <div className="flex items-center mb-1">
                                                    <div className="w-5 h-5 bg-cyan-100 rounded-full flex items-center justify-center mr-1">
                                                      <Wifi className="h-2.5 w-2.5 text-cyan-600" />
                                                    </div>
                                                    <h5 className="font-medium text-xs text-foreground">WiFi熱點</h5>
                                                  </div>
                                                  <div className="space-y-0.5">
                                                    {nearbyTransport.wifi.map((wifi, idx) => (
                                                      <div key={idx} className="bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded text-xs text-center">
                                                        {wifi}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            )}

                                            {/* 充電站 */}
                                            {nearbyTransport.charging.length > 0 && (
                                              <Card className="border-l-4 border-l-emerald-500 flex-1 min-w-[45%]">
                                                <CardContent className="p-2">
                                                  <div className="flex items-center mb-1">
                                                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-1">
                                                      <BatteryCharging className="h-2.5 w-2.5 text-emerald-600" />
                                                    </div>
                                                    <h5 className="font-medium text-xs text-foreground">充電站</h5>
                                                  </div>
                                                  <div className="space-y-0.5">
                                                    {nearbyTransport.charging.map((charging, idx) => (
                                                      <div key={idx} className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-xs text-center">
                                                        {charging}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            )}

                                            {/* 洗手間 */}
                                            {nearbyTransport.restroom.length > 0 && (
                                              <Card className="border-l-4 border-l-pink-500 flex-1 min-w-[45%]">
                                                <CardContent className="p-2">
                                                  <div className="flex items-center mb-1">
                                                    <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center mr-1">
                                                      <DoorOpen className="h-2.5 w-2.5 text-pink-600" />
                                                    </div>
                                                    <h5 className="font-medium text-xs text-foreground">洗手間</h5>
                                                  </div>
                                                  <div className="space-y-0.5">
                                                    {nearbyTransport.restroom.map((restroom, idx) => (
                                                      <div key={idx} className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded text-xs text-center">
                                                        {restroom}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            )}
                                          </div>

                                          {/* 無交通資訊時顯示 */}
                                          {nearbyTransport.buses.government.length === 0 &&
                                            nearbyTransport.buses.scenic.length === 0 &&
                                            nearbyTransport.flights.length === 0 &&
                                            nearbyTransport.ships.length === 0 &&
                                            nearbyTransport.youbike.length === 0 &&
                                            nearbyTransport.wifi.length === 0 &&
                                            nearbyTransport.charging.length === 0 &&
                                            nearbyTransport.restroom.length === 0 && (
                                              <Card>
                                                <CardContent className="p-6 text-center">
                                                  <MapIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                                  <p className="text-sm text-muted-foreground">此站點暫無其他交通資訊</p>
                                                </CardContent>
                                              </Card>
                                            )}
                                        </div>
                                      </ScrollArea>
                                    </DialogContent>
                                  </Dialog>
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-accent"
                                      onClick={() => {
                                        console.log(`[v0] Audio guide clicked for station: ${schedule.station}`)
                                      }}
                                    >
                                      <Headphones className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-accent"
                                      onClick={() => {
                                        console.log(`[v0] Navigation clicked for station: ${schedule.station}`)
                                      }}
                                    >
                                      <Navigation className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-foreground">{schedule.time}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </TabsContent>
                  )
                })}
              </Tabs>
            ) : (
              <div className="space-y-4">
                {getTicketRoutes(ticketId).map((routeId) => {
                  const route = routes.find((r) => r.id === routeId)
                  const routeTimetable = timetableData[routeId as keyof typeof timetableData]

                  return (
                    <div key={routeId} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${route?.color}`} />
                        <h4 className="font-medium text-foreground">{route?.name}</h4>
                      </div>

                      <div className="space-y-0 relative">
                        {routeTimetable.map((schedule, index) => {
                          const isFirst = index === 0
                          const isLast = index === routeTimetable.length - 1

                          let dotColor = route?.primaryColor
                          let stopType = "景點"

                          if (isFirst) {
                            dotColor = "#22c55e" // green
                            stopType = "起點"
                          } else if (isLast) {
                            dotColor = "#ef4444" // red
                            stopType = "終點"
                          }

                          const nearbyTransport = getNearbyTransport(schedule.station)
                          const attraction = getAttractionByStation(schedule.station)

                          return (
                            <div key={index} className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full flex-shrink-0 z-10"
                                style={{ backgroundColor: dotColor }}
                              />

                              <div className="flex-1 flex items-center justify-between ml-4 py-3">
                                <div className="flex items-center space-x-3">
                                  {attraction ? (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <span className="font-medium text-primary text-sm cursor-pointer underline hover:text-primary/80 transition-colors">
                                          {schedule.station}
                                        </span>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-sm max-h-[80vh]">
                                        <DialogHeader>
                                          <DialogTitle>{attraction.title}</DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="h-[60vh] pr-4">
                                          <div className="space-y-4">
                                            {/* Image */}
                                            {attraction.image && (
                                              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                                <Image
                                                  src={attraction.image || "/placeholder.svg"}
                                                  alt={attraction.title}
                                                  fill
                                                  className="object-cover"
                                                />
                                              </div>
                                            )}

                                            {/* Categories */}
                                            <div className="flex flex-wrap gap-2">
                                              {attraction.category.map((cat) => (
                                                <Badge key={cat} variant="secondary">
                                                  {cat}
                                                </Badge>
                                              ))}
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-muted-foreground">{attraction.description}</p>

                                            {/* Detailed Description */}
                                            <Card>
                                              <CardContent className="pt-4">
                                                <p className="text-sm leading-relaxed whitespace-pre-line">
                                                  {attraction.detailedDescription}
                                                </p>
                                              </CardContent>
                                            </Card>

                                            {/* Highlights */}
                                            {attraction.highlights && (
                                              <Card>
                                                <CardContent className="pt-4">
                                                  <h4 className="font-medium mb-2">景點特色</h4>
                                                  <ul className="space-y-2">
                                                    {attraction.highlights.map((highlight, idx) => (
                                                      <li key={idx} className="flex items-start gap-2 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                        <span>{highlight}</span>
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </CardContent>
                                              </Card>
                                            )}

                                            {/* Visit Info */}
                                            <Card>
                                              <CardContent className="pt-4 space-y-2">
                                                <h4 className="font-medium mb-2">參觀資訊</h4>
                                                <div className="flex justify-between text-sm">
                                                  <span className="text-muted-foreground">開放時間</span>
                                                  <span>{attraction.visitInfo.openingHours}</span>
                                                </div>
                                                {attraction.visitInfo.recommendedDuration && (
                                                  <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">建議停留</span>
                                                    <span>{attraction.visitInfo.recommendedDuration}</span>
                                                  </div>
                                                )}
                                                <div className="flex justify-between text-sm">
                                                  <span className="text-muted-foreground">門票費用</span>
                                                  <span>{attraction.visitInfo.admission}</span>
                                                </div>
                                              </CardContent>
                                            </Card>

                                            {/* Location */}
                                            <Card>
                                              <CardContent className="pt-4">
                                                <h4 className="font-medium mb-2">地點資訊</h4>
                                                <p className="text-sm text-muted-foreground">{attraction.location.address}</p>
                                                {attraction.transportation?.fromMagong && (
                                                  <p className="text-sm text-muted-foreground mt-2">
                                                    <span className="font-medium text-foreground">交通：</span>
                                                    {attraction.transportation.fromMagong}
                                                  </p>
                                                )}
                                              </CardContent>
                                            </Card>
                                          </div>
                                        </ScrollArea>
                                      </DialogContent>
                                    </Dialog>
                                  ) : (
                                    <span className="font-medium text-foreground text-sm">{schedule.station}</span>
                                  )}
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs px-2 py-0.5 cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{
                                          backgroundColor: route?.secondaryColor,
                                          color: route?.alertColor,
                                        }}
                                      >
                                        附近交通
                                      </Badge>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center text-lg">
                                          <MapIcon className="h-5 w-5 mr-2 text-primary" />
                                          {schedule.station}
                                        </DialogTitle>
                                        <p className="text-sm text-muted-foreground">附近交通與設施</p>
                                      </DialogHeader>
                                      
                                      <ScrollArea className="max-h-[60vh]">
                                        <div className="space-y-1 pr-2">
                                          {/* 公車路線 */}
                                          {(nearbyTransport.buses.government.length > 0 ||
                                            nearbyTransport.buses.scenic.length > 0) && (
                                            <Card className="border-l-4 border-l-blue-500">
                                              <CardContent className="p-2">
                                                <div className="flex items-center mb-1">
                                                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                                    <Bus className="h-3 w-3 text-blue-600" />
                                                  </div>
                                                  <h4 className="font-semibold text-foreground text-sm">公車路線</h4>
                                                </div>
                                                
                                                <div className="space-y-1">
                                                  {/* Government buses */}
                                                  {nearbyTransport.buses.government.length > 0 && (
                                                    <div>
                                                      <p className="text-xs font-medium text-muted-foreground mb-0.5">澎湖縣政府公共車船管理處</p>
                                                      <div className="grid grid-cols-2 gap-1">
                                                        {nearbyTransport.buses.government.map((bus, idx) => (
                                                          <div key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium text-center">
                                                            {bus}
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* Scenic area buses */}
                                                  {nearbyTransport.buses.scenic.length > 0 && (
                                                    <div>
                                                      <p className="text-xs font-medium text-muted-foreground mb-0.5">澎湖國家風景區管理處</p>
                                                      <div className="grid grid-cols-2 gap-1">
                                                        {nearbyTransport.buses.scenic.map((bus, idx) => (
                                                          <div key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium text-center">
                                                            {bus}
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )}

                                          {/* 航班資訊 */}
                                          {nearbyTransport.flights.length > 0 && (
                                            <Card className="border-l-4 border-l-green-500">
                                              <CardContent className="p-2">
                                                <div className="flex items-center mb-1">
                                                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                                    <Plane className="h-3 w-3 text-green-600" />
                                                  </div>
                                                  <h4 className="font-semibold text-foreground text-sm">航班資訊</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1">
                                                  {nearbyTransport.flights.map((flight, idx) => (
                                                    <div key={idx} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium text-center">
                                                      {flight}
                                                    </div>
                                                  ))}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )}

                                          {/* 船班資訊 */}
                                          {nearbyTransport.ships.length > 0 && (
                                            <Card className="border-l-4 border-l-purple-500">
                                              <CardContent className="p-2">
                                                <div className="flex items-center mb-1">
                                                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                                                    <Ship className="h-3 w-3 text-purple-600" />
                                                  </div>
                                                  <h4 className="font-semibold text-foreground text-sm">船班資訊</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1">
                                                  {nearbyTransport.ships.map((ship, idx) => (
                                                    <div key={idx} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium text-center">
                                                      {ship}
                                                    </div>
                                                  ))}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )}

                                          {/* YouBike站點 */}
                                          {nearbyTransport.youbike.length > 0 && (
                                            <Card className="border-l-4 border-l-orange-500">
                                              <CardContent className="p-2">
                                                <div className="flex items-center mb-1">
                                                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                                                    <Bike className="h-3 w-3 text-orange-600" />
                                                  </div>
                                                  <h4 className="font-semibold text-foreground text-sm">YouBike站點</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1">
                                                  {nearbyTransport.youbike.map((bike, idx) => (
                                                    <div key={idx} className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium text-center">
                                                      {bike}
                                                    </div>
                                                  ))}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )}

                                          {/* 設施服務 */}
                                          <div className="flex flex-wrap gap-1">
                                            {/* WiFi熱點 */}
                                            {nearbyTransport.wifi.length > 0 && (
                                              <Card className="border-l-4 border-l-cyan-500 flex-1 min-w-[45%]">
                                                <CardContent className="p-2">
                                                  <div className="flex items-center mb-1">
                                                    <div className="w-5 h-5 bg-cyan-100 rounded-full flex items-center justify-center mr-1">
                                                      <Wifi className="h-2.5 w-2.5 text-cyan-600" />
                                                    </div>
                                                    <h5 className="font-medium text-xs text-foreground">WiFi熱點</h5>
                                                  </div>
                                                  <div className="space-y-0.5">
                                                    {nearbyTransport.wifi.map((wifi, idx) => (
                                                      <div key={idx} className="bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded text-xs text-center">
                                                        {wifi}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            )}

                                            {/* 充電站 */}
                                            {nearbyTransport.charging.length > 0 && (
                                              <Card className="border-l-4 border-l-emerald-500 flex-1 min-w-[45%]">
                                                <CardContent className="p-2">
                                                  <div className="flex items-center mb-1">
                                                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-1">
                                                      <BatteryCharging className="h-2.5 w-2.5 text-emerald-600" />
                                                    </div>
                                                    <h5 className="font-medium text-xs text-foreground">充電站</h5>
                                                  </div>
                                                  <div className="space-y-0.5">
                                                    {nearbyTransport.charging.map((charging, idx) => (
                                                      <div key={idx} className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-xs text-center">
                                                        {charging}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            )}

                                            {/* 洗手間 */}
                                            {nearbyTransport.restroom.length > 0 && (
                                              <Card className="border-l-4 border-l-pink-500 flex-1 min-w-[45%]">
                                                <CardContent className="p-2">
                                                  <div className="flex items-center mb-1">
                                                    <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center mr-1">
                                                      <DoorOpen className="h-2.5 w-2.5 text-pink-600" />
                                                    </div>
                                                    <h5 className="font-medium text-xs text-foreground">洗手間</h5>
                                                  </div>
                                                  <div className="space-y-0.5">
                                                    {nearbyTransport.restroom.map((restroom, idx) => (
                                                      <div key={idx} className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded text-xs text-center">
                                                        {restroom}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            )}
                                          </div>

                                          {/* 無交通資訊時顯示 */}
                                          {nearbyTransport.buses.government.length === 0 &&
                                            nearbyTransport.buses.scenic.length === 0 &&
                                            nearbyTransport.flights.length === 0 &&
                                            nearbyTransport.ships.length === 0 &&
                                            nearbyTransport.youbike.length === 0 &&
                                            nearbyTransport.wifi.length === 0 &&
                                            nearbyTransport.charging.length === 0 &&
                                            nearbyTransport.restroom.length === 0 && (
                                              <Card>
                                                <CardContent className="p-6 text-center">
                                                  <MapIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                                  <p className="text-sm text-muted-foreground">此站點暫無其他交通資訊</p>
                                                </CardContent>
                                              </Card>
                                            )}
                                        </div>
                                      </ScrollArea>
                                    </DialogContent>
                                  </Dialog>
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-accent"
                                      onClick={() => {
                                        console.log(`[v0] Audio guide clicked for station: ${schedule.station}`)
                                      }}
                                    >
                                      <Headphones className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-accent"
                                      onClick={() => {
                                        console.log(`[v0] Navigation clicked for station: ${schedule.station}`)
                                      }}
                                    >
                                      <Navigation className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-foreground">{schedule.time}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Accordion Sections */}
          <div className="mb-6">
            <Accordion type="multiple" className="space-y-2">
              {/* Package Contents */}
              <AccordionItem value="package-contents">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    套票資訊
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {/* 乘車須知 */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-foreground">乘車須知：</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">
                            持本車票仍請務必上網劃位，劃位網址：
                            <a
                              href="https://www.penghufuneasy.com.tw"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline ml-1"
                            >
                              https://www.penghufuneasy.com.tw
                            </a>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">
                            旅客使用本車票，應自行確認是否在有效期限內，逾期未使用視同作廢。
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">
                            旅客搭乘澎湖好行公車，乘車時請主動出示本車票，俾利駕駛員驗票。
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">
                            購買優待票之旅客，乘車時請主動出示相關優待身分證明文件，俾利駕駛員查驗身分。
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">
                            搭乘當日、搭乘後一日可憑購票證明不限次數免費搭乘澎湖縣內公車(專車除外)
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* 補票、退票及手續費規定 */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-foreground">補票、退票及手續費規定：</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">
                            持本車票搭乘非本路線之好行公車，應依實際搭乘之路線補收票價。
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">
                            若旅客需辦理退票，請洽原購票通路，相關退票所衍生之手續費，依各銷售通路規定辦裡之。
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">本車票逾期未使用，不受理退票。</span>
                        </li>
                      </ul>
                    </div>

                    {/* 聯絡專線 */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-foreground">聯絡專線：</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">
                            電話：
                            <a href="tel:0906315953" className="text-primary hover:underline ml-1">
                              0906315953
                            </a>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">Line客服：@845izxyb</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Usage Instructions */}
              <AccordionItem value="usage-instructions">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    使用說明
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {ticket.usageInstructions.map((instruction: string, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {instruction.split("\n").map((line: string, lineIndex: number) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <h4 key={lineIndex} className="font-semibold text-foreground mb-2 mt-3 first:mt-0">
                                {line.replace(/\*\*/g, "")}
                              </h4>
                            )
                          } else if (line.startsWith("• **") && line.includes("**")) {
                            const parts = line.split("**")
                            return (
                              <div key={lineIndex} className="flex items-start mb-2">
                                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>
                                  <strong className="text-foreground">{parts[1]}</strong>
                                  {parts[2]}
                                </span>
                              </div>
                            )
                          } else if (line.startsWith("• ")) {
                            return (
                              <div key={lineIndex} className="flex items-start mb-2">
                                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>{line.substring(2)}</span>
                              </div>
                            )
                          } else if (line.startsWith("  - **") && line.includes("**")) {
                            const parts = line.split("**")
                            return (
                              <div key={lineIndex} className="flex items-start mb-1 ml-6">
                                <span className="inline-block w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                                <span>
                                  <strong className="text-foreground">{parts[1]}</strong>
                                  {parts[2]}
                                </span>
                              </div>
                            )
                          } else if (line.trim() === "") {
                            return <div key={lineIndex} className="h-2"></div>
                          } else if (line.trim()) {
                            return (
                              <div key={lineIndex} className="mb-1">
                                {line}
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Important Notes */}
              <AccordionItem value="important-notes">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    注意事項
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {ticket.importantNotes.map((note: string, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {note.split("\n").map((line: string, lineIndex: number) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <h4 key={lineIndex} className="font-semibold text-foreground mb-2 mt-3 first:mt-0">
                                {line.replace(/\*\*/g, "")}
                              </h4>
                            )
                          } else if (line.startsWith("• **") && line.includes("**")) {
                            const parts = line.split("**")
                            return (
                              <div key={lineIndex} className="flex items-start mb-2">
                                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>
                                  <strong className="text-foreground">{parts[1]}</strong>
                                  {parts[2]}
                                </span>
                              </div>
                            )
                          } else if (line.startsWith("• ")) {
                            return (
                              <div key={lineIndex} className="flex items-start mb-2">
                                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>{line.substring(2)}</span>
                              </div>
                            )
                          } else if (line.trim() === "") {
                            return <div key={lineIndex} className="h-2"></div>
                          } else if (line.trim()) {
                            return (
                              <div key={lineIndex} className="mb-1">
                                {line}
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Usage Restrictions */}
              <AccordionItem value="usage-restrictions">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    使用限制
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {ticket.usageRestrictions.map((restriction: string, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {restriction.split("\n").map((line: string, lineIndex: number) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <h4 key={lineIndex} className="font-semibold text-foreground mb-2 mt-3 first:mt-0">
                                {line.replace(/\*\*/g, "")}
                              </h4>
                            )
                          } else if (line.startsWith("• **") && line.includes("**")) {
                            const parts = line.split("**")
                            return (
                              <div key={lineIndex} className="flex items-start mb-2">
                                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>
                                  <strong className="text-foreground">{parts[1]}</strong>
                                  {parts[2]}
                                </span>
                              </div>
                            )
                          } else if (line.startsWith("• ")) {
                            return (
                              <div key={lineIndex} className="flex items-start mb-2">
                                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>{line.substring(2)}</span>
                              </div>
                            )
                          } else if (line.startsWith("  - **") && line.includes("**")) {
                            const parts = line.split("**")
                            return (
                              <div key={lineIndex} className="flex items-start mb-1 ml-6">
                                <span className="inline-block w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                                <span>
                                  <strong className="text-foreground">{parts[1]}</strong>
                                  {parts[2]}
                                </span>
                              </div>
                            )
                          } else if (line.trim() === "") {
                            return <div key={lineIndex} className="h-2"></div>
                          } else if (line.trim()) {
                            return (
                              <div key={lineIndex} className="mb-1">
                                {line}
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Price and Purchase Bar - Fixed at bottom */}
      <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-sm border-t shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-primary font-bold text-lg md:text-xl">
              NT$ {ticket.price}~{ticket.price * 2}
            </div>
            <Button
              onClick={handlePurchase}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium text-base md:text-lg"
            >
              立即購票
            </Button>
          </div>
        </div>
      </div>

      {isMobile && <MobileNavigation activeTab="purchase" />}

      {/* Drawer for ticket selection */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center text-lg">選擇乘客人數</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 py-2 space-y-2 max-h-[60vh] overflow-y-auto">
            {ticketTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{type.label}</div>
                  <div className="text-sm text-muted-foreground">{type.description}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-transparent"
                    onClick={() => updateQuantity(type.id as keyof typeof ticketQuantities, -1)}
                    disabled={ticketQuantities[type.id as keyof typeof ticketQuantities] === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {ticketQuantities[type.id as keyof typeof ticketQuantities]}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-transparent"
                    onClick={() => updateQuantity(type.id as keyof typeof ticketQuantities, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DrawerFooter className="px-4 pb-6">
            <Button
              onClick={handleComplete}
              className="w-full hover:bg-[rgba(43,138,160,0.9)] text-white py-6 rounded-lg font-medium text-base bg-primary"
              disabled={(Object.values(ticketQuantities) as number[]).reduce((sum: number, qty: number) => sum + qty, 0) === 0}
            >
              前往購票
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
