"use client";
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import NumberFlow from "@number-flow/react";
import {
  Cpu,
  Target,
  Video,
  Share2,
  Zap,
  Sparkles,
  CheckCheck,
  FileText,
  Layers,
  BarChart3,
  QrCode,
  MessageSquare,
  Globe,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const DEFAULT_RESUME_PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "Essential tools to create your ATS-ready resume and launch a professional portfolio.",
    price: 15,
    yearlyPrice: 120,
    isFree: false,
    buttonText: "Get Starter",
    buttonVariant: "outline" as const,
    popular: false,
    features: [
      { text: "1 ATS-Optimized Normal Resume", icon: <FileText size={20} className="text-blue-600" /> },
      { text: "Normal Web Portfolio", icon: <Globe size={20} className="text-blue-600" /> },
      { text: "Neural PDF & DOCX Parsing", icon: <Cpu size={20} className="text-blue-600" /> },
      { text: "Instant Keyword Match Audit", icon: <Target size={20} className="text-blue-600" /> },
      { text: "Standard Resume Templates", icon: <Layers size={20} className="text-blue-600" /> },
    ],
    includes: [
      "Starter includes:",
      "1 ATS-Optimized Resume",
      "Normal Web Portfolio",
      "Neural PDF & DOCX Parsing",
      "Instant Keyword Match Audit",
    ],
  },
  {
    id: "pro-career",
    name: "Pro Career",
    description: "Complete AI career toolkit with video pitch resumes, interactive portfolios, and cover letter generation.",
    price: 30,
    yearlyPrice: 240,
    isFree: false,
    buttonText: "Upgrade to Pro",
    buttonVariant: "outline" as const,
    popular: false,
    features: [
      { text: "Video Pitch Resume", icon: <Video size={20} className="text-blue-600" /> },
      { text: "Interactive Web Portfolio", icon: <Layers size={20} className="text-blue-600" /> },
      { text: "Full Cover Letter Generation", icon: <Sparkles size={20} className="text-blue-600" /> },
      { text: "Unlimited ATS Resumes & Match Optimizer", icon: <Target size={20} className="text-blue-600" /> },
      { text: "AI Scriptwriter & Teleprompter", icon: <Zap size={20} className="text-blue-600" /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "Video Pitch Resume Studio",
      "Interactive Web Portfolio",
      "AI Cover Letter Generator",
      "AI Teleprompter & Scriptwriter",
    ],
  },
  {
    id: "executive-suite",
    name: "Executive",
    description: "Full executive presence suite with QR code smart resumes, chat-based AI portfolio, and LinkedIn branding.",
    price: 35,
    yearlyPrice: 280,
    isFree: false,
    buttonText: "Get Executive",
    buttonVariant: "default" as const,
    popular: true,
    badge: "Recommended",
    features: [
      { text: "Video Pitch, Normal Resume & QR Code Smart Resume", icon: <QrCode size={20} className="text-amber-500" /> },
      { text: "Cover Letter with 20+ Premium Templates", icon: <FileText size={20} className="text-blue-600" /> },
      { text: "Chat-Based Interactive AI Portfolio", icon: <MessageSquare size={20} className="text-indigo-600" /> },
      { text: "LinkedIn Optimization with 100+ Banners", icon: <TrendingUp size={20} className="text-blue-600" /> },
      { text: "Recruiter Live View Analytics & Priority Support", icon: <BarChart3 size={20} className="text-indigo-600" /> },
    ],
    includes: [
      "Everything in Pro Career, plus:",
      "QR Code Smart Resume",
      "Cover Letter (20 Templates)",
      "Chat-Based AI Portfolio",
      "LinkedIn Optimization (100+ Banners)",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-50 mx-auto flex w-fit rounded-full bg-neutral-50 border border-gray-200 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors cursor-pointer ${
            selected === "0"
              ? "text-white"
              : "text-muted-foreground hover:text-black"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-12 h-8 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors cursor-pointer ${
            selected === "1"
              ? "text-white"
              : "text-muted-foreground hover:text-black"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
              Save 33%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection({
  plans,
  openSignupModal,
}: {
  plans?: any[];
  openSignupModal?: (plan: any) => void;
  isLoadingPlans?: boolean;
}) {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const displayPlans = (plans && plans.length > 0) ? plans : DEFAULT_RESUME_PLANS;

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.25,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  const handlePlanClick = (plan: any) => {
    if (openSignupModal) {
      openSignupModal({
        ...plan,
        selectedBillingCycle: isYearly ? "yearly" : "monthly",
      });
    } else {
      const el = document.getElementById("pricing");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      id="pricing"
      className="px-4 pt-20 pb-24 min-h-screen mx-auto relative bg-neutral-50/80 overflow-hidden border-t border-slate-200/80"
      ref={pricingRef}
    >
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none"
        style={{
          backgroundImage: `
        radial-gradient(circle at center, #206ce8 0%, transparent 70%)
      `,
          opacity: 0.35,
          mixBlendMode: "multiply",
        }}
      />

      <div className="text-center mb-10 max-w-3xl mx-auto relative z-10">
        <TimelineContent
          as="span"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block"
        >
          Flexible Pricing
        </TimelineContent>

        <TimelineContent
          as="h2"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="md:text-5xl sm:text-4xl text-3xl font-extrabold tracking-tight text-slate-900 mb-4"
        >
          Flexible Plans for Every{" "}
          <span className="border border-dashed border-blue-500 px-3 py-1 rounded-xl bg-blue-100 capitalize inline-block text-blue-600">
            Career Stage
          </span>
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="sm:text-base text-sm text-gray-600 sm:w-[75%] w-[85%] mx-auto font-medium leading-relaxed"
        >
          Choose the perfect plan to accelerate your job search, optimize your ATS resume, and launch your video pitch.
        </TimelineContent>
      </div>

      <TimelineContent
        as="div"
        animationNum={3}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="relative z-20 mb-8"
      >
        <PricingSwitch onSwitch={togglePricingPeriod} />
      </TimelineContent>

      <div className="grid md:grid-cols-3 max-w-7xl gap-6 py-4 mx-auto relative z-10">
        {displayPlans.map((plan, index) => {
          const isPlanFree = plan.isFree || plan.monthlyPrice === "Free" || plan.price === 0;
          const currentPrice = isYearly ? (plan.yearlyPrice || plan.price * 10 || 0) : (plan.price || Number(plan.monthlyPrice) || 0);
          const isRecommended = plan.popular || plan.badge === "Recommended" || plan.bestFor === "Recommended";

          return (
            <TimelineContent
              key={plan.id || plan.name}
              as="div"
              animationNum={4 + index}
              timelineRef={pricingRef}
              customVariants={revealVariants}
            >
              <Card
                className={`relative border-neutral-200/90 shadow-md transition-all duration-300 hover:shadow-2xl rounded-3xl overflow-hidden flex flex-col justify-between h-full ${
                  isRecommended ? "ring-2 ring-blue-500 bg-blue-50/40 shadow-xl" : "bg-white"
                }`}
              >
                <CardHeader className="text-left pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                      {plan.name}
                    </h3>
                    {isRecommended && (
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                        {plan.badge || plan.bestFor || "Recommended"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium min-h-[40px] leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline pt-3">
                    {isPlanFree ? (
                      <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                        Free
                      </span>
                    ) : (
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900 mr-0.5">$</span>
                        <NumberFlow
                          value={currentPrice}
                          className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight"
                        />
                      </div>
                    )}
                    <span className="text-gray-500 ml-1.5 font-bold text-xs uppercase tracking-wider">
                      {isPlanFree ? "forever" : (isYearly ? "/year" : "/month")}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex flex-col justify-between flex-grow">
                  <button
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full mb-6 p-3.5 text-sm sm:text-base font-black uppercase tracking-wider rounded-2xl cursor-pointer transition-all duration-200 active:scale-95 shadow-md ${
                      isRecommended
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/25 text-white hover:brightness-110"
                        : plan.buttonVariant === "outline"
                          ? "bg-slate-900 hover:bg-blue-600 text-white shadow-slate-900/20 hover:shadow-blue-600/30"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {plan.buttonText || plan.btnText || "Get started"}
                  </button>

                  <ul className="space-y-3 font-semibold py-2">
                    {(plan.features || []).map((feature: any, featureIndex: number) => {
                      const text = typeof feature === "string" ? feature : feature.text;
                      const isBold = typeof feature === "object" ? feature.bold : false;
                      const isStrikethrough = typeof feature === "object" ? feature.isStrikethrough : false;
                      const icon = typeof feature === "object" && feature.icon ? feature.icon : <FileText size={18} className="text-blue-600" />;

                      return (
                        <li key={featureIndex} className={`flex items-center text-xs sm:text-sm ${isStrikethrough ? 'opacity-40 line-through' : 'text-gray-700'}`}>
                          <span className="text-neutral-800 grid place-content-center shrink-0 mr-3">
                            {icon}
                          </span>
                          <span className={isBold ? "font-bold text-slate-900" : "font-medium"}>
                            {text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {(plan.includes && plan.includes.length > 0) && (
                    <div className="space-y-2.5 pt-4 mt-4 border-t border-neutral-200/80">
                      <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-gray-900 mb-2">
                        {plan.includes[0]}
                      </h4>
                      <ul className="space-y-2">
                        {plan.includes.slice(1).map((item: string, itemIdx: number) => (
                          <li key={itemIdx} className="flex items-center text-xs font-semibold text-gray-600">
                            <span className="h-5 w-5 bg-blue-50 border border-blue-300 rounded-full grid place-content-center shrink-0 mr-2.5">
                              <CheckCheck className="h-3.5 w-3.5 text-blue-600" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TimelineContent>
          );
        })}
      </div>
    </div>
  );
}
