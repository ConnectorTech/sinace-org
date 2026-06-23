import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  SINACE_PUBLIC_METADATA_BY_PATH,
  SINACE_PUBLIC_OG_IMAGE,
  SINACE_PUBLIC_SITE_URL,
} from "@/lib/sinacePublicSite";

const SITE_URL = SINACE_PUBLIC_SITE_URL;
const OG_IMAGE_URL = SINACE_PUBLIC_OG_IMAGE;

type MetadataSet = {
  title: string;
  description: string;
  keywords: string;
  robots: string;
  ogType: "website";
};

const appMetadata: MetadataSet = {
  title: "SINACE App | Plataforma Cirúrgica e Educacional",
  description:
    "Ambiente autenticado da SINACE com diretório médico, publicações institucionais, enciclopédia cirúrgica, estudos de caso e áreas privadas de trabalho.",
  keywords:
    "SINACE app, plataforma cirúrgica, enciclopédia cirúrgica, diretório médico, estudos de caso, educação em saúde",
  robots: "noindex, nofollow, noarchive",
  ogType: "website",
};

const notFoundMetadata: MetadataSet = {
  title: "Página não encontrada | SINACE",
  description: "A rota acessada não foi encontrada no site institucional da SINACE.",
  keywords: "SINACE, página não encontrada",
  robots: "noindex, nofollow, noarchive",
  ogType: "website",
};

function ensureMetaAttribute(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function ensureCanonical(href: string) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export default function SeoRouteManager() {
  const [location] = useLocation();

  useEffect(() => {
    const pathname = location || "/";
    const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
    const metadata = normalizedPath.startsWith("/app")
      ? appMetadata
      : normalizedPath === "/404"
        ? notFoundMetadata
        : SINACE_PUBLIC_METADATA_BY_PATH[normalizedPath] ?? SINACE_PUBLIC_METADATA_BY_PATH["/"];
    const canonicalHref = normalizedPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`;

    document.title = metadata.title;
    ensureMetaAttribute("name", "description", metadata.description);
    ensureMetaAttribute("name", "keywords", metadata.keywords);
    ensureMetaAttribute("name", "robots", metadata.robots);
    ensureMetaAttribute("property", "og:title", metadata.title);
    ensureMetaAttribute("property", "og:description", metadata.description);
    ensureMetaAttribute("property", "og:type", metadata.ogType);
    ensureMetaAttribute("property", "og:site_name", "SINACE");
    ensureMetaAttribute("name", "author", "SINACE — Sistema Nacional Hospitalar de Cirurgias Especializadas");
    ensureMetaAttribute("property", "og:url", canonicalHref);
    ensureMetaAttribute("property", "og:image", OG_IMAGE_URL);
    ensureMetaAttribute("property", "og:image:alt", "Equipe cirúrgica da SINACE");
    ensureMetaAttribute("name", "twitter:card", "summary_large_image");
    ensureMetaAttribute("name", "twitter:title", metadata.title);
    ensureMetaAttribute("name", "twitter:description", metadata.description);
    ensureMetaAttribute("name", "twitter:image", OG_IMAGE_URL);
    ensureCanonical(canonicalHref);
  }, [location]);

  return null;
}
