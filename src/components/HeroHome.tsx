import React from "react";
import { Sparkles, ArrowRight, Star, Clock, MapPin, Coffee, UtensilsCrossed } from "lucide-react";
import { User as UserType, ViewState } from "../types";

interface HeroHomeProps {
  currentUser: UserType | null;
  setView: (view: ViewState) => void;
}

export default function HeroHome({ currentUser, setView }: HeroHomeProps) {
  // Use exact generated image paths
  const images = {
    interior: "/src/assets/images/miyabi_interior_1781584566157.jpg",
    sushi: "/src/assets/images/miyabi_sushi_1781584581849.jpg",
    garden: "/src/assets/images/miyabi_garden_1781584596243.jpg"
  };

  const courseMenu = [
    {
      name: "雅雅自慢・主廚無菜單割烹 (Omakase)",
      price: "NT$ 3,800 /人",
      desc: "選用當季築地直送鮮魚、頂級熟成和牛，包含先付、刺身、烤物、主廚特選握壽司 8 貫、吸物、甘味。極致職人手藝展現。"
    },
    {
      name: "極上壽司美饌 (Premium Sushi Kappo)",
      price: "NT$ 2,600 /人",
      desc: "精緻江戶前手作壽司 10 貫，採用赤醋飯調製，搭配海膽、大腹、星鰻等高階素材。附茶碗蒸、和風味噌湯及御製甘味。"
    },
    {
      name: "築地嚴選握壽司盛合 (Miyabi Tasting)",
      price: "NT$ 1,800 /人",
      desc: "專為首次蒞臨貴賓設計。品嚐 7 貫時令手握壽司與季節烤物，感受天然檜木吧檯特有的溫暖和風與食材純粹風味。"
    }
  ];

  const features = [
    {
      title: "溫暖木質空間",
      desc: "雅庵整體設計以天然檜木與日本進口和紙為主體，柔和的暖黃色燈光灑落落，為您營造最舒心、尊榮的日式料亭氛圍。",
      img: images.interior,
      alt: "雅庵傳統和式塌塌米席座"
    },
    {
      title: "職人嚴選鮮物",
      desc: "料理長齊藤先生每日親自挑選台灣在地港口現撈海產與日本空運食材。運用極限熟成刀工與米其林級赤醋調配，驚艷味蕾。",
      img: images.sushi,
      alt: "職人手作握壽司拼盤"
    },
    {
      title: "幽幽靜禪風中庭",
      desc: "雅庵設有觀景落地窗與日式包廂（可容納4-10人），可近距離將京都風格翠綠竹林、石燈與流水的禪意風景一覽無遺。",
      img: images.garden,
      alt: "京都禪意翠竹中庭景觀"
    }
  ];

  return (
    <div id="hero-home-deck" className="space-y-16 pb-12">
      
      {/* 1. Hero banner area with warm text overlay */}
      <section id="home-hero-banner" className="relative overflow-hidden border border-brand-border bg-brand-dark text-white animate-fade-in">
        <div className="absolute inset-0 z-0">
          <img
            src={images.interior}
            alt="Miyabi Warm Interior Banner"
            className="h-full w-full object-cover opacity-35 transform scale-102 hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
        </div>

        <div className="relative z-10 px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-36 flex flex-col items-start max-w-3xl space-y-8">
          <div className="inline-flex items-center space-x-2 bg-brand-accent/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-gold border border-brand-accent/30">
            <Sparkles className="h-3 w-3" />
            <span>精緻料亭・一期一會</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-widest text-[#FCF9F0] leading-tight">
              雅庵日式餐廳
            </h1>
            <p className="font-serif text-lg sm:text-2xl font-light text-brand-muted italic tracking-[0.25em] pl-1">
              傳承江戶前割烹的職人溫度
            </p>
          </div>
          
          <p className="text-xs sm:text-sm leading-relaxed text-brand-bg/85 max-w-xl font-light">
            踏入雅庵，在檜木幽香與微黃燈光下，感受由料理長為您傾心奉上的當季旬物。無論是慶祝重要紀念日或精緻晚宴，我們皆將以日本傳統「客之至上」精神，為您獻上極致的和風饗宴。
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => setView(currentUser ? "book" : "login")}
              className="flex items-center justify-center space-x-2 bg-brand-accent px-8 py-4 text-xs uppercase tracking-widest font-semibold text-white hover:bg-brand-accent/90 transition-colors cursor-pointer"
            >
              <span>立即預訂席位</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("course-menu-section");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center justify-center space-x-2 border border-brand-border bg-transparent px-8 py-4 text-xs uppercase tracking-widest font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>細看頂級菜單</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Three cards showcasing restaurant spaces & cuisine (Responsive dynamic Cards) */}
      <section id="restaurant-features" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl font-normal tracking-widest text-brand-dark">店鋪空間與極致食藝</h2>
          <div className="h-px w-16 bg-brand-accent mx-auto" />
          <p className="text-xs text-brand-muted tracking-wider font-light leading-relaxed">
            完美融合古意盎然的京都美學與台北現代慢活步調，精雕細琢每一個感官細節。
          </p>
        </div>

        {/* Bento/Card grid */}
        <div id="feature-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <div
              id={`feat-card-${index}`}
              key={index}
              className="group flex flex-col border border-brand-border bg-white transition-all duration-300"
            >
              {/* Card Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={feat.img}
                  alt={feat.alt}
                  className="h-full w-full object-cover filter brightness-[0.95] group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-brand-dark text-white text-[9px] uppercase tracking-widest px-3 py-1.55">
                  雅庵精選
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="font-serif text-lg font-bold text-brand-dark">{feat.title}</h3>
                  <p className="text-xs text-brand-text leading-relaxed font-light">{feat.desc}</p>
                </div>
                <div className="pt-4 border-t border-brand-border flex items-center justify-between text-[11px] uppercase tracking-widest text-[#8C6B3D] font-semibold group-hover:text-brand-dark transition-colors">
                  <span>了解更多細節</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Chef Omakase and Course Menu details */}
      <section id="course-menu-section" className="border border-brand-border bg-brand-sidebar p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-brand-border pb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-brand-accent">
              <UtensilsCrossed className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-widest font-bold">雅雅限定季節美饌</span>
            </div>
            <h2 className="font-serif text-3xl font-normal tracking-widest text-brand-dark">頂級旬魚割烹套餐</h2>
          </div>
          <p className="text-xs text-brand-muted font-light sm:max-w-xs leading-relaxed">
            ※ 所有無菜單及部分壽司席位皆採完全預約制。如欲預訂當期限定 Omakese，建議於 14 天前完成預約。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courseMenu.map((menu, i) => (
            <div
              key={i}
              className="bg-white p-6 border border-brand-border flex flex-col justify-between space-y-6 hover:border-brand-accent transition-colors"
            >
              <div className="space-y-3">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-serif text-base font-bold text-brand-dark leading-snug">{menu.name}</h3>
                  <span className="text-xs font-bold text-brand-accent font-mono">{menu.price}</span>
                </div>
                <p className="text-xs leading-relaxed text-brand-text font-light">{menu.desc}</p>
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <span className="text-[10px] text-brand-muted">• 附：小付、精美茶碗蒸、甘味</span>
                <span className="text-[9px] uppercase tracking-widest font-semibold text-brand-accent bg-[#FCF9F0] px-2 py-1 border border-brand-border">人氣首選</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Elegant reviews and testimonies panel */}
      <section id="guest-feedback" className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Quality review block */}
        <div className="border border-brand-border bg-white p-8 space-y-4">
          <div className="flex items-center space-x-1 text-brand-gold">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
          <blockquote className="font-serif text-xs leading-relaxed text-brand-text italic">
            「和老婆在雅庵慶祝了五週年結婚紀念日，預約了靠窗的包廂位。塌塌米非常的乾淨舒服，檜木香讓人彷彿置身於京都。料理長齊藤師傅親切體貼，握壽司入口即化，尤其對金目鯛和北海道海膽留下了極高地驚嘆，絕對會再次回購與推薦好友！」
          </blockquote>
          <div className="flex items-center space-x-3 pt-2">
            <div className="h-8 w-8 bg-brand-sidebar text-brand-dark text-xs font-bold font-serif flex items-center justify-center border border-brand-border">
              陳
            </div>
            <div>
              <p className="text-xs font-bold text-brand-dark">陳柏維 閣下</p>
              <p className="text-[10px] text-brand-muted">於 2026 年 6 月 10 日 用餐</p>
            </div>
          </div>
        </div>

        {/* Operational info and highlights */}
        <div className="border border-brand-border bg-white p-8 space-y-4">
          <div className="flex items-center space-x-1 text-brand-gold">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
          <blockquote className="font-serif text-xs leading-relaxed text-brand-text italic">
            「雅庵的暖心服務名不虛傳，從訂位成功的確認，到進門的遞茶、脫鞋收納都細緻無比。雖然是使用網站進行預訂，但是介面操作極其舒適流暢。黑鮪鱼大腹的油脂分配得太精美了，午餐 2,600 元的價格有如此表現十分精細划算。」
          </blockquote>
          <div className="flex items-center space-x-3 pt-2">
            <div className="h-8 w-8 bg-brand-sidebar text-brand-dark text-xs font-bold font-serif flex items-center justify-center border border-brand-border">
              林
            </div>
            <div>
              <p className="text-xs font-bold text-brand-dark">林宜庭 大姐</p>
              <p className="text-[10px] text-brand-muted">於 2026 年 5 月 28 日 用餐</p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
