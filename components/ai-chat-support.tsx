"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Menu,
  Ticket,
  Camera,
  HelpCircle,
  Bus,
  MessageCircle,
  MapPin,
  Navigation,
  Clock,
  Star,
  Sparkles,
  ChevronRight,
  CreditCard,
  RefreshCw,
  Search,
  AlertCircle,
  Map,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "booking" | "route" | "schedule" | "attractions" | "faq" | "service" | "default"
}

const faqData = {
  "zh-TW": {
    ticketing: {
      icon: Ticket,
      title: "票務相關 - 常見問題",
      color: "bg-yellow-500",
      questions: ["如何購買車票？", "可以現場購票嗎？", "票價如何計算？", "有優惠票種嗎？", "購票需要證件嗎？"],
    },
    route: {
      icon: Map,
      title: "路線查詢 - 常見問題",
      color: "bg-blue-500",
      questions: [
        "有哪些路線可選擇？",
        "如何查詢路線資訊？",
        "路線會經過哪些景點？",
        "路線行駛時間多久？",
        "如何轉乘其他路線？",
      ],
    },
    schedule: {
      icon: Clock,
      title: "班次時刻 - 常見問題",
      color: "bg-red-500",
      questions: [
        "班次時刻表在哪裡查詢？",
        "首末班車時間？",
        "假日班次有調整嗎？",
        "班次會延誤嗎？",
        "如何查詢即時班次？",
      ],
    },
    payment: {
      icon: CreditCard,
      title: "付款問題 - 常見問題",
      color: "bg-amber-500",
      questions: ["支援哪些付款方式？", "可以使用信用卡嗎？", "支援行動支付嗎？", "付款失敗怎麼辦？", "如何索取發票？"],
    },
    refund: {
      icon: RefreshCw,
      title: "退改票 - 常見問題",
      color: "bg-blue-600",
      questions: ["如何申請退票？", "退票手續費多少？", "可以改票嗎？", "退票期限是多久？", "線上可以退改票嗎？"],
    },
    service: {
      icon: MessageCircle,
      title: "服務諮詢 - 常見問題",
      color: "bg-gray-400",
      questions: ["如何聯繫客服？", "客服服務時間？", "可以預約客服嗎？", "如何提供服務建議？", "有多語言服務嗎？"],
    },
    lostItems: {
      icon: Search,
      title: "遺失物品 - 常見問題",
      color: "bg-gray-500",
      questions: [
        "如何查詢遺失物品？",
        "遺失物品保管多久？",
        "在哪裡領取遺失物品？",
        "需要什麼證件領取？",
        "可以線上查詢嗎？",
      ],
    },
    emergency: {
      icon: AlertCircle,
      title: "緊急狀況 - 常見問題",
      color: "bg-red-600",
      questions: ["發生緊急狀況怎麼辦？", "緊急聯絡電話？", "車上有急救設備嗎？", "如何通報事故？", "有保險理賠嗎？"],
    },
  },
  en: {
    ticketing: {
      icon: Ticket,
      title: "Ticketing - FAQ",
      color: "bg-yellow-500",
      questions: [
        "How to purchase tickets?",
        "Can I buy tickets on-site?",
        "How is the fare calculated?",
        "Are there discounted tickets?",
        "Do I need ID to purchase?",
      ],
    },
    route: {
      icon: Map,
      title: "Route Query - FAQ",
      color: "bg-blue-500",
      questions: [
        "What routes are available?",
        "How to query route information?",
        "Which attractions does the route pass?",
        "How long does the route take?",
        "How to transfer to other routes?",
      ],
    },
    schedule: {
      icon: Clock,
      title: "Schedule - FAQ",
      color: "bg-red-500",
      questions: [
        "Where to check the timetable?",
        "First and last bus times?",
        "Are schedules adjusted on holidays?",
        "Will buses be delayed?",
        "How to check real-time schedule?",
      ],
    },
    payment: {
      icon: CreditCard,
      title: "Payment - FAQ",
      color: "bg-amber-500",
      questions: [
        "What payment methods are supported?",
        "Can I use credit cards?",
        "Is mobile payment supported?",
        "What if payment fails?",
        "How to request an invoice?",
      ],
    },
    refund: {
      icon: RefreshCw,
      title: "Refund/Change - FAQ",
      color: "bg-blue-600",
      questions: [
        "How to apply for a refund?",
        "What is the refund fee?",
        "Can I change my ticket?",
        "What is the refund deadline?",
        "Can I refund/change online?",
      ],
    },
    service: {
      icon: MessageCircle,
      title: "Service Inquiry - FAQ",
      color: "bg-gray-400",
      questions: [
        "How to contact customer service?",
        "Customer service hours?",
        "Can I book customer service?",
        "How to provide service suggestions?",
        "Is multilingual service available?",
      ],
    },
    lostItems: {
      icon: Search,
      title: "Lost Items - FAQ",
      color: "bg-gray-500",
      questions: [
        "How to query lost items?",
        "How long are lost items kept?",
        "Where to collect lost items?",
        "What ID is needed to collect?",
        "Can I query online?",
      ],
    },
    emergency: {
      icon: AlertCircle,
      title: "Emergency - FAQ",
      color: "bg-red-600",
      questions: [
        "What to do in an emergency?",
        "Emergency contact number?",
        "Is there first aid equipment on board?",
        "How to report an accident?",
        "Is there insurance coverage?",
      ],
    },
  },
  ja: {
    ticketing: {
      icon: Ticket,
      title: "チケット関連 - よくある質問",
      color: "bg-yellow-500",
      questions: [
        "チケットの購入方法は？",
        "現地で購入できますか？",
        "運賃の計算方法は？",
        "割引チケットはありますか？",
        "購入に身分証明書は必要ですか？",
      ],
    },
    route: {
      icon: Map,
      title: "ルート検索 - よくある質問",
      color: "bg-blue-500",
      questions: [
        "どのルートが選択できますか？",
        "ルート情報の検索方法は？",
        "ルートはどの観光地を通りますか？",
        "ルートの所要時間は？",
        "他のルートへの乗り換え方法は？",
      ],
    },
    schedule: {
      icon: Clock,
      title: "時刻表 - よくある質問",
      color: "bg-red-500",
      questions: [
        "時刻表はどこで確認できますか？",
        "始発と最終便の時間は？",
        "休日は時刻表が変更されますか？",
        "バスは遅延しますか？",
        "リアルタイムの時刻表の確認方法は？",
      ],
    },
    payment: {
      icon: CreditCard,
      title: "支払い - よくある質問",
      color: "bg-amber-500",
      questions: [
        "どの支払い方法がサポートされていますか？",
        "クレジットカードは使えますか？",
        "モバイル決済はサポートされていますか？",
        "支払いが失敗した場合は？",
        "領収書の発行方法は？",
      ],
    },
    refund: {
      icon: RefreshCw,
      title: "払い戻し/変更 - よくある質問",
      color: "bg-blue-600",
      questions: [
        "払い戻しの申請方法は？",
        "払い戻し手数料はいくらですか？",
        "チケットの変更はできますか？",
        "払い戻しの期限は？",
        "オンラインで払い戻し/変更できますか？",
      ],
    },
    service: {
      icon: MessageCircle,
      title: "サービス問い合わせ - よくある質問",
      color: "bg-gray-400",
      questions: [
        "カスタマーサービスへの連絡方法は？",
        "カスタマーサービスの営業時間は？",
        "カスタマーサービスの予約はできますか？",
        "サービスの提案方法は？",
        "多言語サービスはありますか？",
      ],
    },
    lostItems: {
      icon: Search,
      title: "遺失物 - よくある質問",
      color: "bg-gray-500",
      questions: [
        "遺失物の検索方法は？",
        "遺失物の保管期間は？",
        "遺失物の受け取り場所は？",
        "受け取りに必要な身分証明書は？",
        "オンラインで検索できますか？",
      ],
    },
    emergency: {
      icon: AlertCircle,
      title: "緊急時 - よくある質問",
      color: "bg-red-600",
      questions: [
        "緊急時の対応方法は？",
        "緊急連絡先は？",
        "車内に救急設備はありますか？",
        "事故の報告方法は？",
        "保険補償はありますか？",
      ],
    },
  },
  ko: {
    ticketing: {
      icon: Ticket,
      title: "티켓 관련 - 자주 묻는 질문",
      color: "bg-yellow-500",
      questions: [
        "티켓 구매 방법은?",
        "현장에서 구매할 수 있나요?",
        "요금 계산 방법은?",
        "할인 티켓이 있나요?",
        "구매 시 신분증이 필요한가요?",
      ],
    },
    route: {
      icon: Map,
      title: "노선 검색 - 자주 묻는 질문",
      color: "bg-blue-500",
      questions: [
        "어떤 노선을 선택할 수 있나요?",
        "노선 정보 검색 방법은?",
        "노선은 어떤 관광지를 지나가나요?",
        "노선 소요 시간은?",
        "다른 노선으로 환승하는 방법은?",
      ],
    },
    schedule: {
      icon: Clock,
      title: "시간표 - 자주 묻는 질문",
      color: "bg-red-500",
      questions: [
        "시간표는 어디서 확인하나요?",
        "첫차와 막차 시간은?",
        "공휴일에 시간표가 조정되나요?",
        "버스가 지연되나요?",
        "실시간 시간표 확인 방법은?",
      ],
    },
    payment: {
      icon: CreditCard,
      title: "결제 - 자주 묻는 질문",
      color: "bg-amber-500",
      questions: [
        "어떤 결제 방법을 지원하나요?",
        "신용카드를 사용할 수 있나요?",
        "모바일 결제를 지원하나요?",
        "결제 실패 시 어떻게 하나요?",
        "영수증 발급 방법은?",
      ],
    },
    refund: {
      icon: RefreshCw,
      title: "환불/변경 - 자주 묻는 질문",
      color: "bg-blue-600",
      questions: [
        "환불 신청 방법은?",
        "환불 수수료는 얼마인가요?",
        "티켓을 변경할 수 있나요?",
        "환불 기한은?",
        "온라인으로 환불/변경할 수 있나요?",
      ],
    },
    service: {
      icon: MessageCircle,
      title: "서비스 문의 - 자주 묻는 질문",
      color: "bg-gray-400",
      questions: [
        "고객 서비스 연락 방법은?",
        "고객 서비스 시간은?",
        "고객 서비스를 예약할 수 있나요?",
        "서비스 제안 방법은?",
        "다국어 서비스가 있나요?",
      ],
    },
    lostItems: {
      icon: Search,
      title: "분실물 - 자주 묻는 질문",
      color: "bg-gray-500",
      questions: [
        "분실물 검색 방법은?",
        "분실물 보관 기간은?",
        "분실물 수령 장소는?",
        "수령 시 필요한 신분증은?",
        "온라인으로 검색할 수 있나요?",
      ],
    },
    emergency: {
      icon: AlertCircle,
      title: "긴급 상황 - 자주 묻는 질문",
      color: "bg-red-600",
      questions: [
        "긴급 상황 발생 시 어떻게 하나요?",
        "긴급 연락처는?",
        "차량에 응급 장비가 있나요?",
        "사고 신고 방법은?",
        "보험 보상이 있나요?",
      ],
    },
  },
}

function FAQCard({ language = "zh-TW" }: { language?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const langFaqData = faqData[language as keyof typeof faqData] || faqData["zh-TW"]

  const categoryLabels = {
    "zh-TW": {
      title: "常見問題分類",
      backButton: "返回分類選擇",
      ticketing: "票務相關",
      route: "路線查詢",
      schedule: "班次時刻",
      payment: "付款問題",
      refund: "退改票",
      service: "服務諮詢",
      lostItems: "遺失物品",
      emergency: "緊急狀況",
    },
    en: {
      title: "FAQ Categories",
      backButton: "Back to Categories",
      ticketing: "Ticketing",
      route: "Route Query",
      schedule: "Schedule",
      payment: "Payment",
      refund: "Refund/Change",
      service: "Service",
      lostItems: "Lost Items",
      emergency: "Emergency",
    },
    ja: {
      title: "よくある質問カテゴリ",
      backButton: "カテゴリ選択に戻る",
      ticketing: "チケット関連",
      route: "ルート検索",
      schedule: "時刻表",
      payment: "支払い",
      refund: "払い戻し/変更",
      service: "サービス問い合わせ",
      lostItems: "遺失物",
      emergency: "緊急時",
    },
    ko: {
      title: "자주 묻는 질문 카테고리",
      backButton: "카테고리 선택으로 돌아가기",
      ticketing: "티켓 관련",
      route: "노선 검색",
      schedule: "시간표",
      payment: "결제",
      refund: "환불/변경",
      service: "서비스 문의",
      lostItems: "분실물",
      emergency: "긴급 상황",
    },
  }

  const labels = categoryLabels[language as keyof typeof categoryLabels] || categoryLabels["zh-TW"]

  if (selectedCategory) {
    const category = langFaqData[selectedCategory as keyof typeof langFaqData]
    const IconComponent = category.icon

    return (
      <div className="mt-3 bg-card border border-border rounded-lg p-4 max-w-[280px]">
        <div className="flex items-center gap-2 mb-4">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", category.color)}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm">{category.title}</h3>
        </div>

        <div className="space-y-2 mb-4">
          {category.questions.map((question, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors text-left"
              onClick={() => {
                console.log("[v0] FAQ question clicked:", question)
              }}
            >
              <span className="text-sm">{question}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>

        <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedCategory(null)}>
          {labels.backButton}
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-3 bg-card border border-border rounded-lg p-4 max-w-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-sm">{labels.title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setSelectedCategory("ticketing")}
          className="flex flex-col items-center justify-center gap-2 p-3 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
        >
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">{labels.ticketing}</span>
        </button>

        <button
          onClick={() => setSelectedCategory("route")}
          className="flex flex-col items-center justify-center gap-2 p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Map className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">{labels.route}</span>
        </button>

        <button
          onClick={() => setSelectedCategory("schedule")}
          className="flex flex-col items-center justify-center gap-2 p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">{labels.schedule}</span>
        </button>

        <button
          onClick={() => setSelectedCategory("payment")}
          className="flex flex-col items-center justify-center gap-2 p-3 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
        >
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">{labels.payment}</span>
        </button>

        <button
          onClick={() => setSelectedCategory("refund")}
          className="flex flex-col items-center justify-center gap-2 p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">{labels.refund}</span>
        </button>

        <button
          onClick={() => setSelectedCategory("service")}
          className="flex flex-col items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">{labels.service}</span>
        </button>

        <button
          onClick={() => setSelectedCategory("lostItems")}
          className="flex flex-col items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">{labels.lostItems}</span>
        </button>

        <button
          onClick={() => setSelectedCategory("emergency")}
          className="flex flex-col items-center justify-center gap-2 p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">{labels.emergency}</span>
        </button>
      </div>
    </div>
  )
}

const cardTranslations = {
  "zh-TW": {
    booking: {
      title: "線上訂票表單",
      routeLabel: "路線選擇",
      routePlaceholder: "選擇路線",
      dateLabel: "乘車日期",
      datePlaceholder: "年/月/日",
      passengerLabel: "乘客人數",
      passengerPlaceholder: "人數",
      continueButton: "繼續訂票流程",
      routes: {
        north: "北環線",
        xihu: "西嶼線",
        south: "南環線",
      },
      passengers: {
        "1": "1人",
        "2": "2人",
        "3": "3人",
        "4": "4人",
        "5": "5人",
      },
    },
    route: {
      title: "智慧路線規劃",
      startPoint: "起點",
      endPoint: "終點",
      planButton: "規劃路線",
    },
    schedule: {
      title: "即時班次查詢",
      routePlaceholder: "選擇路線",
      stopPlaceholder: "選擇站點",
      queryButton: "查詢班次",
      timetableButton: "時刻表",
      nearestStopButton: "最近站點",
      routes: {
        north: "北環線",
        xihu: "西嶼線",
        south: "南環線",
      },
      stops: {
        airport: "澎湖機場",
        magong: "馬公市區",
        baisha: "白沙",
      },
    },
    attractions: {
      name: "澎湖跨海大橋",
      description: "澎湖著名地標，連接白沙與西嶼的跨海大橋",
      reviews: "評論",
      businessHoursButton: "營業時間",
      viewDetailsButton: "查看詳情",
      fixedToursButton: "固定遊程",
      randomButton: "隨機推薦",
    },
  },
  en: {
    booking: {
      title: "Online Booking Form",
      routeLabel: "Route Selection",
      routePlaceholder: "Select Route",
      dateLabel: "Travel Date",
      datePlaceholder: "YYYY/MM/DD",
      passengerLabel: "Passengers",
      passengerPlaceholder: "Count",
      continueButton: "Continue Booking",
      routes: {
        north: "North Ring Line",
        xihu: "Xiyu Line",
        south: "South Ring Line",
      },
      passengers: {
        "1": "1 Person",
        "2": "2 People",
        "3": "3 People",
        "4": "4 People",
        "5": "5 People",
      },
    },
    route: {
      title: "Smart Route Planning",
      startPoint: "Start Point",
      endPoint: "End Point",
      planButton: "Plan Route",
    },
    schedule: {
      title: "Real-time Schedule Query",
      routePlaceholder: "Select Route",
      stopPlaceholder: "Select Stop",
      queryButton: "Query Schedule",
      timetableButton: "Timetable",
      nearestStopButton: "Nearest Stop",
      routes: {
        north: "North Ring Line",
        xihu: "Xiyu Line",
        south: "South Ring Line",
      },
      stops: {
        airport: "Penghu Airport",
        magong: "Magong City",
        baisha: "Baisha",
      },
    },
    attractions: {
      name: "Penghu Cross-Sea Bridge",
      description: "Famous Penghu landmark connecting Baisha and Xiyu",
      reviews: "reviews",
      businessHoursButton: "Business Hours",
      viewDetailsButton: "View Details",
      fixedToursButton: "Fixed Tours",
      randomButton: "Random Pick",
    },
  },
  ja: {
    booking: {
      title: "オンライン予約フォーム",
      routeLabel: "ルート選択",
      routePlaceholder: "ルートを選択",
      dateLabel: "乗車日",
      datePlaceholder: "年/月/日",
      passengerLabel: "乗客数",
      passengerPlaceholder: "人数",
      continueButton: "予約を続ける",
      routes: {
        north: "北環線",
        xihu: "西嶼線",
        south: "南環線",
      },
      passengers: {
        "1": "1名",
        "2": "2名",
        "3": "3名",
        "4": "4名",
        "5": "5名",
      },
    },
    route: {
      title: "スマートルートプランニング",
      startPoint: "出発地",
      endPoint: "目的地",
      planButton: "ルートを計画",
    },
    schedule: {
      title: "リアルタイム時刻表検索",
      routePlaceholder: "ルートを選択",
      stopPlaceholder: "停留所を選択",
      queryButton: "時刻表を検索",
      timetableButton: "時刻表",
      nearestStopButton: "最寄りの停留所",
      routes: {
        north: "北環線",
        xihu: "西嶼線",
        south: "南環線",
      },
      stops: {
        airport: "澎湖空港",
        magong: "馬公市街地",
        baisha: "白沙",
      },
    },
    attractions: {
      name: "澎湖跨海大橋",
      description: "白沙と西嶼を結ぶ澎湖の有名なランドマーク",
      reviews: "レビュー",
      businessHoursButton: "営業時間",
      viewDetailsButton: "詳細を見る",
      fixedToursButton: "定期ツアー",
      randomButton: "ランダム推薦",
    },
  },
  ko: {
    booking: {
      title: "온라인 예약 양식",
      routeLabel: "노선 선택",
      routePlaceholder: "노선 선택",
      dateLabel: "탑승일",
      datePlaceholder: "년/월/일",
      passengerLabel: "승객 수",
      passengerPlaceholder: "인원",
      continueButton: "예약 계속하기",
      routes: {
        north: "북환선",
        xihu: "서서선",
        south: "남환선",
      },
      passengers: {
        "1": "1명",
        "2": "2명",
        "3": "3명",
        "4": "4명",
        "5": "5명",
      },
    },
    route: {
      title: "스마트 경로 계획",
      startPoint: "출발지",
      endPoint: "목적지",
      dateTimePlaceholder: "년/월/일 시:분",
      planButton: "경로 계획",
    },
    schedule: {
      title: "실시간 시간표 조회",
      routePlaceholder: "노선 선택",
      stopPlaceholder: "정류장 선택",
      queryButton: "시간표 조회",
      timetableButton: "시간표",
      nearestStopButton: "가장 가까운 정류장",
      routes: {
        north: "북환선",
        xihu: "서서선",
        south: "남환선",
      },
      stops: {
        airport: "펑후 공항",
        magong: "마공 시내",
        baisha: "백사",
      },
    },
    attractions: {
      name: "펑후 크로스 씨 ��리지",
      description: "백사와 서서를 연결하는 펑후의 유명한 랜드마크",
      reviews: "리뷰",
      businessHoursButton: "영업 시간",
      viewDetailsButton: "상세 보기",
      fixedToursButton: "정기 투어",
      randomButton: "랜덤 추천",
    },
  },
}

function BookingFormCard({ language = "zh-TW" }: { language?: string }) {
  const router = useRouter()
  const [selectedRoute, setSelectedRoute] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [passengerCount, setPassengerCount] = useState("")

  const t = cardTranslations[language as keyof typeof cardTranslations]?.booking || cardTranslations["zh-TW"].booking

  const handleContinue = () => {
    router.push("/purchase/tickets")
  }

  return (
    <div className="mt-3 bg-card border border-border rounded-lg p-4 max-w-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
          <Ticket className="w-4 h-4 text-destructive-foreground" />
        </div>
        <h3 className="font-semibold text-sm">{t.title}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t.routeLabel}</label>
          <Select value={selectedRoute} onValueChange={setSelectedRoute}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.routePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">{t.routes.north}</SelectItem>
              <SelectItem value="xihu">{t.routes.xihu}</SelectItem>
              <SelectItem value="south">{t.routes.south}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-2 block">{t.dateLabel}</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs"
              placeholder={t.datePlaceholder}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t.passengerLabel}</label>
            <Select value={passengerCount} onValueChange={setPassengerCount}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.passengerPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t.passengers["1"]}</SelectItem>
                <SelectItem value="2">{t.passengers["2"]}</SelectItem>
                <SelectItem value="3">{t.passengers["3"]}</SelectItem>
                <SelectItem value="4">{t.passengers["4"]}</SelectItem>
                <SelectItem value="5">{t.passengers["5"]}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          <Ticket className="w-4 h-4 mr-2" />
          {t.continueButton}
        </Button>
      </div>
    </div>
  )
}

function RouteQueryCard({ language = "zh-TW" }: { language?: string }) {
  const router = useRouter()
  const [startPoint, setStartPoint] = useState("")
  const [endPoint, setEndPoint] = useState("")

  const t = cardTranslations[language as keyof typeof cardTranslations]?.route || cardTranslations["zh-TW"].route

  const handlePlanRoute = () => {
    // 時刻表頁面已移除
    console.log("[v0] Route planning - schedule page removed")
  }

  return (
    <div className="mt-3 bg-card border border-border rounded-lg p-4 max-w-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-sm">{t.title}</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              type="text"
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              placeholder={t.startPoint}
              className="text-sm"
            />
          </div>

          <div>
            <Input
              type="text"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              placeholder={t.endPoint}
              className="text-sm"
            />
          </div>
        </div>

        <Button onClick={handlePlanRoute} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Navigation className="w-4 h-4 mr-2" />
          {t.planButton}
        </Button>
      </div>
    </div>
  )
}

function ScheduleQueryCard({ language = "zh-TW" }: { language?: string }) {
  const router = useRouter()
  const [selectedRoute, setSelectedRoute] = useState("")
  const [selectedStop, setSelectedStop] = useState("")

  const t = cardTranslations[language as keyof typeof cardTranslations]?.schedule || cardTranslations["zh-TW"].schedule

  const handleQuerySchedule = () => {
    // 時刻表頁面已移除
    console.log("[v0] Schedule query - schedule page removed")
  }

  const handleViewTimetable = () => {
    // 時刻表頁面已移除
    console.log("[v0] View timetable - schedule page removed")
  }

  const handleNearestStop = () => {
    // 時刻表頁面已移除
    console.log("[v0] Nearest stop - schedule page removed")
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="bg-card border border-border rounded-lg p-4 max-w-[280px]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm">{t.title}</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.routePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">{t.routes.north}</SelectItem>
                <SelectItem value="xihu">{t.routes.xihu}</SelectItem>
                <SelectItem value="south">{t.routes.south}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedStop} onValueChange={setSelectedStop}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.stopPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="airport">{t.stops.airport}</SelectItem>
                <SelectItem value="magong">{t.stops.magong}</SelectItem>
                <SelectItem value="baisha">{t.stops.baisha}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleQuerySchedule} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {t.queryButton}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-[280px]">
        <Button
          onClick={handleViewTimetable}
          variant="outline"
          className="flex items-center justify-center gap-2 h-12 bg-transparent"
        >
          <Clock className="w-4 h-4 text-destructive" />
          <span className="text-sm">{t.timetableButton}</span>
        </Button>
        <Button
          onClick={handleNearestStop}
          variant="outline"
          className="flex items-center justify-center gap-2 h-12 bg-transparent"
        >
          <MapPin className="w-4 h-4 text-destructive" />
          <span className="text-sm">{t.nearestStopButton}</span>
        </Button>
      </div>
    </div>
  )
}

function AttractionsCard({ language = "zh-TW" }: { language?: string }) {
  const router = useRouter()

  const t =
    cardTranslations[language as keyof typeof cardTranslations]?.attractions || cardTranslations["zh-TW"].attractions

  const handleViewDetails = () => {
    // 景點頁面已移除
    console.log("[v0] View details - attractions page removed")
  }

  const handleBusinessHours = () => {
    alert("營業時間：全天開放")
  }

  const handleFixedTours = () => {
    // 景點頁面已移除
    console.log("[v0] Fixed tours - attractions page removed")
  }

  const handleRandomRecommendation = () => {
    // 景點頁面已移除
    console.log("[v0] Random recommendation - attractions page removed")
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="bg-card border border-border rounded-lg p-4 max-w-[280px]">
        <div className="flex gap-3 mb-3">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">{t.name}</h3>
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">4.8</span>
              <span className="text-xs text-muted-foreground">(1,234 {t.reviews})</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3">{t.description}</p>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleBusinessHours}
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-1 h-9 text-xs bg-transparent"
          >
            <Clock className="w-3 h-3" />
            {t.businessHoursButton}
          </Button>
          <Button
            onClick={handleViewDetails}
            size="sm"
            className="flex items-center justify-center gap-1 h-9 text-xs bg-green-600 hover:bg-green-700 text-white"
          >
            {t.viewDetailsButton}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-[280px]">
        <Button
          onClick={handleFixedTours}
          variant="outline"
          className="flex items-center justify-center gap-2 h-12 bg-transparent"
        >
          <MapPin className="w-4 h-4 text-destructive" />
          <span className="text-sm">{t.fixedToursButton}</span>
        </Button>
        <Button
          onClick={handleRandomRecommendation}
          variant="outline"
          className="flex items-center justify-center gap-2 h-12 bg-transparent"
        >
          <Sparkles className="w-4 h-4 text-destructive" />
          <span className="text-sm">{t.randomButton}</span>
        </Button>
      </div>
    </div>
  )
}

function CustomerServiceCard({ language = "zh-TW" }: { language?: string }) {
  const serviceOptionsData = {
    "zh-TW": {
      title: "客服服務選單",
      options: [
        {
          id: "lost-items",
          label: "遺失物查詢",
          icon: "📄",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          id: "ticket-proof",
          label: "購票證明索取",
          icon: "📄",
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          id: "complaint",
          label: "申訴管道聯繫",
          icon: "📞",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          id: "emergency",
          label: "緊急聯絡資訊",
          icon: "⚠️",
          color: "text-red-600",
          bgColor: "bg-red-50",
        },
      ],
    },
    en: {
      title: "Customer Service Menu",
      options: [
        {
          id: "lost-items",
          label: "Lost Items Query",
          icon: "📄",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          id: "ticket-proof",
          label: "Ticket Proof Request",
          icon: "📄",
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          id: "complaint",
          label: "Complaint Channel",
          icon: "📞",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          id: "emergency",
          label: "Emergency Contact",
          icon: "⚠️",
          color: "text-red-600",
          bgColor: "bg-red-50",
        },
      ],
    },
    ja: {
      title: "カスタマーサービスメニュー",
      options: [
        {
          id: "lost-items",
          label: "遺失物検索",
          icon: "📄",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          id: "ticket-proof",
          label: "チケット証明書請求",
          icon: "📄",
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          id: "complaint",
          label: "苦情チャンネル",
          icon: "📞",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          id: "emergency",
          label: "緊急連絡先",
          icon: "⚠️",
          color: "text-red-600",
          bgColor: "bg-red-50",
        },
      ],
    },
    ko: {
      title: "고객 서비스 메뉴",
      options: [
        {
          id: "lost-items",
          label: "분실물 검색",
          icon: "📄",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          id: "ticket-proof",
          label: "티켓 증명서 요청",
          icon: "📄",
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          id: "complaint",
          label: "불만 접수 채널",
          icon: "📞",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          id: "emergency",
          label: "긴급 연락처",
          icon: "⚠️",
          color: "text-red-600",
          bgColor: "bg-red-50",
        },
      ],
    },
  }

  const serviceData = serviceOptionsData[language as keyof typeof serviceOptionsData] || serviceOptionsData["zh-TW"]

  const handleServiceClick = (serviceId: string) => {
    console.log("[v0] Service option clicked:", serviceId)
    // Handle service option click - could show more details or navigate
  }

  return (
    <div className="mt-3 bg-card border border-border rounded-lg p-4 max-w-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-sm">{serviceData.title}</h3>
      </div>

      <div className="space-y-2">
        {serviceData.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleServiceClick(option.id)}
            className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors text-left"
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", option.bgColor)}>
              <span className="text-lg">{option.icon}</span>
            </div>
            <span className={cn("text-sm font-medium", option.color)}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const multilingualData = {
  "zh-TW": {
    quickActions: [
      { id: "booking", label: "線上訂票", icon: Ticket, query: "我想要線上訂票，請顯示訂票表單" },
      { id: "route", label: "路線查詢", icon: MapPin, query: "我想查詢路線資訊，請顯示可用的路線" },
      {
        id: "schedule",
        label: "即時班次",
        icon: Bus,
        query: "我需要即時班次資訊，包含公車時刻表、最近站點查詢、船班狀態和延誤通知",
      },
      { id: "attractions", label: "景點推薦", icon: Camera, query: "請推薦澎湖景點並提供遊程規劃" },
      { id: "faq", label: "常見問題", icon: HelpCircle, query: "顯示票務相關的常見問題" },
      { id: "service", label: "客服服務", icon: MessageCircle, query: "我需要客服服務，請顯示服務選單" },
    ],
    welcomeMessage: "您好！我是澎湖好行AI客服助手 🌊 很高興為您服務！請問有什麼可以幫助您的嗎？",
    inputPlaceholder: "輸入您的問題...",
    typingIndicator: "AI客服正在輸入中...",
    responses: {
      booking:
        "關於購票服務：\n\n🎫 線上購票：可至官網或APP購買\n💳 付款方式：信用卡、行動支付\n📱 電子票券：購買後可直接使用手機票券\n🔄 退改票：發車前2小時可辦理\n\n需要我為您導引至購票頁面嗎？",
      route:
        "澎湖好行路線資訊：\n\n🚌 主要路線：\n• 媽宮北環線 (每30分鐘一班)\n• 媽宮南環線 (每45分鐘一班)\n• 湖西線 (每小時一班)\n\n⏰ 營運時間：06:00-22:00\n📍 起點站：澎湖機場/馬公市區\n\n請問您想查詢哪條路線的詳細資訊？",
      schedule: "即時班次查詢服務：\n\n🚌 請選擇查詢路線和站點，我會為您提供最新的班次資訊和預估到站時間。",
      attractions:
        "澎湖熱門景點推薦：\n\n🏖️ 必訪景點：\n• 跨海大橋 - 澎湖地標\n• 二崁古厝 - 傳統建築\n• 奎壁山 - 摩西分海\n• 池東大菓葉玄武岩 - 自然奇觀\n\n🌅 最佳拍照時間：\n• 日出：奎壁山 (05:30-06:30)\n• 日落：西嶼燈塔 (17:30-18:30)\n\n需要我為您規劃一日遊行程嗎？",
      faq: "請選擇您想了解的問題分類：",
      service:
        "感謝您的詢問！我已經收到您的問題，讓我為您查詢相關資訊...\n\n如果您需要更詳細的協助，可以透過以下方式聯繫我們：\n\n📞 客服專線：06-926-6751\n📧 Email：service@phbus.com.tw\n🕒 服務時間：08:00-18:00",
      default:
        "感謝您的詢問！我已經收到您的問題，讓我為您查詢相關資訊... 如果您需要更詳細的協助，也可以透過以下方式聯繫我們：\n\n📞 客服專線：06-926-6751\n📧 Email：service@phbus.com.tw\n🕒 服務時間：08:00-18:00",
    },
  },
  en: {
    quickActions: [
      {
        id: "booking",
        label: "Online Booking",
        icon: Ticket,
        query: "I want to book tickets online, please show me the booking form",
      },
      {
        id: "route",
        label: "Route Query",
        icon: MapPin,
        query: "I want to query route information, please show available routes",
      },
      {
        id: "schedule",
        label: "Real-time Schedule",
        icon: Bus,
        query:
          "I need real-time schedule information, including bus timetables, nearest stop queries, ferry status and delay notifications",
      },
      {
        id: "attractions",
        label: "Attractions",
        icon: Camera,
        query: "Please recommend Penghu attractions and provide itinerary planning",
      },
      { id: "faq", label: "FAQ", icon: HelpCircle, query: "Show frequently asked questions about ticketing" },
      {
        id: "service",
        label: "Customer Service",
        icon: MessageCircle,
        query: "I need customer service, please show the service menu",
      },
    ],
    welcomeMessage:
      "Hello! I'm the Penghu Easy Go AI customer service assistant 🌊 Nice to serve you! How can I help you?",
    inputPlaceholder: "Enter your question...",
    typingIndicator: "AI customer service is typing...",
    responses: {
      booking:
        "About Booking Service:\n\n🎫 Online Booking: Available on official website or APP\n💳 Payment Methods: Credit card, mobile payment\n📱 E-Ticket: Use mobile ticket directly after purchase\n🔄 Refund/Change: Available 2 hours before departure\n\nWould you like me to guide you to the booking page?",
      route:
        "Penghu Easy Go Route Information:\n\n🚌 Main Routes:\n• Magong North Ring Line (Every 30 minutes)\n• Magong South Ring Line (Every 45 minutes)\n• Xihu Line (Every hour)\n\n⏰ Operating Hours: 06:00-22:00\n📍 Starting Point: Penghu Airport/Magong City\n\nWhich route would you like to know more about?",
      schedule:
        "Real-time schedule query service:\n\n🚌 Please select the route and stop to query, I will provide you with the latest schedule information and estimated arrival time.",
      attractions:
        "Popular Penghu Attractions:\n\n🏖️ Must-Visit Spots:\n• Cross-Sea Bridge - Penghu Landmark\n• Erkan Old House - Traditional Architecture\n• Kuibishan - Moses Parting Sea\n• Chidong Daguoye Basalt - Natural Wonder\n\n🌅 Best Photo Times:\n• Sunrise: Kuibishan (05:30-06:30)\n• Sunset: Xiyu Lighthouse (17:30-18:30)\n\nWould you like me to plan a day trip itinerary for you?",
      faq: "Please select the question category you want to know about:",
      service:
        "Thank you for your inquiry! I have received your question, let me search for relevant information...\n\nIf you need more detailed assistance, you can also contact us through the following methods:\n\n📞 Customer Service Hotline: 06-926-6751\n📧 Email: service@phbus.com.tw\n🕒 Service Hours: 08:00-18:00",
      default:
        "Thank you for your inquiry! I have received your question, let me search for relevant information... If you need more detailed assistance, you can also contact us through the following methods:\n\n📞 Customer Service Hotline: 06-926-6751\n📧 Email: service@phbus.com.tw\n🕒 Service Hours: 08:00-18:00",
    },
  },
  ja: {
    quickActions: [
      {
        id: "booking",
        label: "オンライン予約",
        icon: Ticket,
        query: "オンラインでチケットを予約したいので、予約フォームを表示してください",
      },
      {
        id: "route",
        label: "ルート検索",
        icon: MapPin,
        query: "ルート情報を検索したいので、利用可能なルートを表示してください",
      },
      {
        id: "schedule",
        label: "リアルタイム時刻表",
        icon: Bus,
        query: "リアルタイムの時刻表情報が必要です。バスの時刻表、最寄りの停留所検索、フェリーの状況、遅延通知を含む",
      },
      {
        id: "attractions",
        label: "観光地推薦",
        icon: Camera,
        query: "澎湖の観光地を推薦し、旅程プランを提供してください",
      },
      { id: "faq", label: "よくある質問", icon: HelpCircle, query: "チケットに関するよくある質問を表示" },
      {
        id: "service",
        label: "カスタマーサービス",
        icon: MessageCircle,
        query: "カスタマーサービスが必要です。サービスメニューを表示してください",
      },
    ],
    welcomeMessage:
      "こんにちは！私は澎湖好行AIカスタマーサービスアシスタントです 🌊 お手伝いできて嬉しいです！何かお手伝いできることはありますか？",
    inputPlaceholder: "質問を入力してください...",
    typingIndicator: "AIカスタマーサービスが入力中...",
    responses: {
      booking:
        "予約サービスについて：\n\n🎫 オンライン予約：公式サイトまたはAPPで購入可能\n💳 支払い方法：クレジットカード、モバイル決済\n📱 電子チケット：購入後すぐにモバイルチケットを使用可能\n🔄 払い戻し/変更：出発2時間前まで可能\n\n予約ページへご案内しましょうか？",
      route:
        "澎湖好行ルート情報：\n\n🚌 主要ルート：\n• 媽宮北環線（30分ごと）\n• 媽宮南環線（45分ごと）\n• 湖西線（1時間ごと）\n\n⏰ 運行時間：06:00-22:00\n📍 出発地：澎湖空港/馬公市街地\n\nどのルートの詳細情報をお知りになりたいですか？",
      schedule:
        "リアルタイム時刻表検索サービス：\n\n🚌 検索したい路線と停留所を選択してください。最新の時刻表情報と到着予定時刻をお知らせします。",
      attractions:
        "澎湖人気観光地推薦：\n\n🏖️ 必見スポット：\n• 跨海大橋 - 澎湖のランドマーク\n• 二崁古厝 - 伝統建築\n• 奎壁山 - モーゼの海割れ\n• 池東大菓葉玄武岩 - 自然の奇観\n\n🌅 ベスト撮影時間：\n• 日の出：奎壁山 (05:30-06:30)\n• 日の入り：西嶼燈塔 (17:30-18:30)\n\n一日観光プランを作成しましょうか？",
      faq: "知りたい質問カテゴリを選択してください：",
      service:
        "お問い合わせありがとうございます！ご質問を受け付けました。関連情報を検索いたします...\n\nより詳細なサポートが必要な場合��、以下の方法でお問い合わせください：\n\n📞 カスタマーサービス専用電話：06-926-6751\n📧 Email：service@phbus.com.tw\n🕒 サービス時間：08:00-18:00",
      default:
        "お問い合わせありがとうございます！ご質問を受け付けました。関連情報を検索いたします... よ���詳細なサポートが必要な場合は、以下の方法でお問い合わせください：\n\n📞 カスタマーサービス専用電話：06-926-6751\n📧 Email：service@phbus.com.tw\n🕒 サービス時間：08:00-18:00",
    },
  },
  ko: {
    quickActions: [
      {
        id: "booking",
        label: "온라인 예약",
        icon: Ticket,
        query: "온라인으로 티켓을 예약하고 싶습니다. 예약 양식을 보여주세요",
      },
      {
        id: "route",
        label: "노선 검색",
        icon: MapPin,
        query: "노선 정보를 검색하고 싶습니다. 이용 가능한 노선을 보여주세요",
      },
      {
        id: "schedule",
        label: "실시간 시간표",
        icon: Bus,
        query: "실시간 시간표 정보가 필요합니다. 버스 시간표, 가장 가까운 정류장 검색, 페리 상태 및 지연 알림 포함",
      },
      {
        id: "attractions",
        label: "관광지 추천",
        icon: Camera,
        query: "펑후 관광지를 추천하고 여행 계획을 제공해 주세요",
      },
      { id: "faq", label: "자주 묻는 질문", icon: HelpCircle, query: "티켓 관련 자주 묻는 질문 표시" },
      {
        id: "service",
        label: "고객 서비스",
        icon: MessageCircle,
        query: "고객 서비스가 필요합니다. 서비스 메뉴를 표시해 주세요",
      },
    ],
    welcomeMessage:
      "안녕하세요! 저는 펑후 이지고 AI 고객 서비스 어시스턴트입니다 🌊 서비스를 제공하게 되어 기쁩니다! 무엇을 도와드릴까요?",
    inputPlaceholder: "질문을 입력하세요...",
    typingIndicator: "AI 고객 서비스가 입력 중...",
    responses: {
      booking:
        "예약 서비스 안내：\n\n🎫 온라인 예약：공식 사이트 또는 APP에서 구매 가능\n💳 결�� 방법：신용카드, 모바일 결제\n📱 전자 티켓：구매 후 바로 모바일 티켓 사용 가능\n🔄 환불/변경：출발 2시간 전까지 가능\n\n예약 페이지로 안내해 드릴까요?",
      route:
        "펑후 이지고 노선 정보:\n\n🚌 주요 노선:\n• 마궁북환선 (30분마다)\n• 마궁남환선 (45분마다)\n• 호서선 (매시간)\n\n⏰ 운영 시간: 06:00-22:00\n📍 출발지: 펑후 공항/마공 시내\n\n어떤 노선의 자세한 정보를 알고 싶으신가요?",
      schedule:
        "실시간 시간표 조회 서비스:\n\n🚌 조회할 노선과 정류장을 선택해 주세요. 최신 시간표 정보와 예상 도착 시간을 제공해 드리겠습니다.",
      attractions:
        "펑후 인기 관광지 추천:\n\n🏖️ 필수 방문지:\n• 跨海大橋 - 펑후 랜드마크\n• 二崁古厝 - 전통 건축\n• 奎壁山 - 모세의 기적\n• 池東大菓葉玄武岩 - 자연 경관\n\n🌅 최고의 사진 촬영 시간:\n• 일출: 奎壁山 (05:30-06:30)\n• 일몰: 西嶼燈塔 (17:30-18:30)\n\n하루 여행 일정을 계획해 드릴까요?",
      faq: "알고 싶은 질문 카테고리를 선택해 주세요:",
      service:
        "문의해 주셔서 감사합니다! 질문을 접수했습니다. 관련 정보를 검색해 드리겠습니다...\n\n더 자세한 도움이 필요하시면 다음 방법으로 연락해 주세요：\n\n📞 고객 서비스 전용 전화: 06-926-6751\n📧 Email：service@phbus.com.tw\n🕒 서비스 시간：08:00-18:00",
      default:
        "문의해 주셔서 감사합니다! 질문을 접수했습니다. 관련 정보를 검색해 드리겠습니다... 더 자세한 도움이 필요하시면 다음 방법으로 연락해 주세요：\n\n📞 고객 서비스 전용 전화: 06-926-6751\n📧 Email：service@phbus.com.tw\n🕒 서비스 시간：08:00-18:00",
    },
  },
}

function QuickActions({ onActionClick, language }: { onActionClick: (action: string) => void; language: string }) {
  const quickActions =
    multilingualData[language as keyof typeof multilingualData]?.quickActions || multilingualData["zh-TW"].quickActions

  return (
    <div className="p-3 bg-muted border-t">
      <div className="grid grid-cols-3 gap-2">
        {quickActions.map((action) => {
          const IconComponent = action.icon
          return (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => onActionClick(action.query)}
              className="h-auto p-2 flex flex-col items-center gap-1 text-xs hover:bg-accent"
            >
              <div className="flex items-center justify-center">
                <IconComponent className="w-3 h-3 text-muted-foreground" />
              </div>
              <span className="text-foreground leading-tight text-center">{action.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

function ChatMessage({ message, language }: { message: Message; language: string }) {
  const isUser = message.sender === "user"

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs">🤖</span>
        </div>
      )}

      <div className="max-w-[80%]">
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            isUser ? "bg-primary text-primary-foreground" : "bg-card border border-border"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {!isUser && message.type === "booking" && <BookingFormCard language={language} />}
        {!isUser && message.type === "route" && <RouteQueryCard language={language} />}
        {!isUser && message.type === "schedule" && <ScheduleQueryCard language={language} />}
        {!isUser && message.type === "attractions" && <AttractionsCard language={language} />}
        {!isUser && message.type === "faq" && <FAQCard language={language} />}
        {!isUser && message.type === "service" && <CustomerServiceCard language={language} />}

        <div className={`${isUser ? "text-right" : "text-left"} mt-1`}>
          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
        </div>
      </div>

      {isUser && (
        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-primary-foreground text-xs">👤</span>
        </div>
      )}
    </div>
  )
}

export default function AiChatSupport({ language = "zh-TW" }: { language?: string }) {
  const langData = multilingualData[language as keyof typeof multilingualData] || multilingualData["zh-TW"]

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: langData.welcomeMessage,
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([
      {
        id: "1",
        content: langData.welcomeMessage,
        sender: "ai",
        timestamp: new Date(),
      },
    ])
  }, [language, langData.welcomeMessage])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responseContent = generateAiResponse(messageContent, langData)
      let messageType: "booking" | "route" | "schedule" | "attractions" | "faq" | "service" | "default" = "default"
      if (responseContent === langData.responses.booking) {
        messageType = "booking"
      } else if (responseContent === langData.responses.route) {
        messageType = "route"
      } else if (responseContent === langData.responses.schedule) {
        messageType = "schedule"
      } else if (responseContent === langData.responses.attractions) {
        messageType = "attractions"
      } else if (responseContent === langData.responses.faq) {
        messageType = "faq"
      } else if (responseContent === langData.responses.service) {
        messageType = "service"
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "ai",
        timestamp: new Date(),
        type: messageType,
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAiResponse = (input: string, langData: any): string => {
    const lowerInput = input.toLowerCase()

    // Check for booking keywords in multiple languages
    if (
      lowerInput.includes("線上訂票") ||
      lowerInput.includes("訂票") ||
      lowerInput.includes("購票") ||
      lowerInput.includes("booking") ||
      lowerInput.includes("book") ||
      lowerInput.includes("ticket") ||
      lowerInput.includes("予約") ||
      lowerInput.includes("예약")
    ) {
      return langData.responses.booking
    }

    // Check for route keywords
    if (
      lowerInput.includes("路線查詢") ||
      lowerInput.includes("路線") ||
      lowerInput.includes("route") ||
      lowerInput.includes("ルート") ||
      lowerInput.includes("노선")
    ) {
      return langData.responses.route
    }

    // Check for schedule keywords
    if (
      lowerInput.includes("即時班次") ||
      lowerInput.includes("班次查詢") ||
      lowerInput.includes("schedule") ||
      lowerInput.includes("timetable") ||
      lowerInput.includes("時刻表") ||
      lowerInput.includes("시간표")
    ) {
      return langData.responses.schedule
    }

    // Check for attractions keywords
    if (
      lowerInput.includes("景點推薦") ||
      lowerInput.includes("景點") ||
      lowerInput.includes("attractions") ||
      lowerInput.includes("sightseeing") ||
      lowerInput.includes("観光地") ||
      lowerInput.includes("관광지")
    ) {
      return langData.responses.attractions
    }

    // Check for FAQ keywords
    if (
      lowerInput.includes("常見問題") ||
      lowerInput.includes("faq") ||
      lowerInput.includes("よくある質問") ||
      lowerInput.includes("자주 묻는 질문")
    ) {
      return langData.responses.faq
    }

    // Check for service keywords
    if (
      lowerInput.includes("客服服務") ||
      lowerInput.includes("客服") ||
      lowerInput.includes("服務選單") ||
      lowerInput.includes("customer service") ||
      lowerInput.includes("service") ||
      lowerInput.includes("カスタマーサービス") ||
      lowerInput.includes("고객 서비스")
    ) {
      return langData.responses.service
    }

    return langData.responses.default
  }

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} language={language} />
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                {langData.typingIndicator}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {showQuickActions && (
        <div className="flex-shrink-0">
          <QuickActions onActionClick={handleQuickAction} language={language} />
        </div>
      )}

      <div className="flex-shrink-0 border-t bg-background sticky bottom-0 z-50 mb-16">
        <div className="flex gap-2 px-3 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={cn(
              "flex-shrink-0 p-2 h-10 w-10 border border-border hover:bg-accent",
              showQuickActions && "bg-primary text-primary-foreground hover:bg-primary/90 border-primary",
            )}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={langData.inputPlaceholder}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="bg-primary hover:bg-primary/90 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
