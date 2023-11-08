"use client";
import { GlobalContext } from "@/context/globalContext";
import {
  HomeIcon,
  PuzzlePieceIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import DesktopNav from "./desktop";
import MobileNav from "./mobile";

type TNavigation = {
  name: string;
  href: string;
  icon: JSX.Element;
}[];
export interface NavProps {
  navigation: TNavigation;
  path: string;
}

export default function Navigation() {
  const path = usePathname();
  const { playUrl, setPageReady } = useContext(GlobalContext);

  useEffect(() => {
    if (/sso-callback/.test(path)) {
      setPageReady(true)
    }
  }, [path, setPageReady])

  const navigation = [
    { name: "Home", href: "/", icon: <HomeIcon height={25} width={25} /> },
    {
      name: "Play",
      href: playUrl,
      icon: <PuzzlePieceIcon height={25} width={25} />,
    },
    {
      name: "Score Board",
      href: "/scoreboard",
      icon: <StarIcon height={25} width={25} />,
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <DesktopNav
        {...{
          path,
          navigation,
        }}
      />

      {/* Mobile Navigation */}
      <MobileNav {...{ path, navigation }} />
    </>
  );
}
