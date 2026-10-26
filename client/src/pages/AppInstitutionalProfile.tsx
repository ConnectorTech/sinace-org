import React from "react";
import { SinaceModuleHeader } from "@/components/SinaceSectionShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SINACE_INSTITUTIONAL_PROFILE } from "@shared/sinaceCatalog";
import { ArrowUpRight, Building2, Compass, FileText, Info, Mail, MapPin } from "lucide-react";

const instagramHref = `https://instagram.com/${SINACE_INSTITUTIONAL_PROFILE.instagram.replace("@", "")}`;
const phoneHref = `tel:+55${SINACE_INSTITUTIONAL_PROFILE.phone.replace(/\D/g, "")}`;
const emailHref = `mailto:${SINACE_INSTITUTIONAL_PROFILE.email}`;

type ProfileField = {
  label: string;
  value: string;
  href?: string;
};

/** Frentes de atuação do app — antes repetidas no Dashboard, agora só aqui. */
const focusAreas = [
  "Gestão da redução de filas, contratos e cobertura regional do SUS.",
  "Drive de conhecimento cirúrgico com trilhas, protocolos, casos e publicações.",
  "Diretório de especialistas com identidade profissional e currículo.",
  "Network entre especialistas, parceiros, instituições e frentes acadêmicas.",
];

const sections: Array<{
  title: string;
  description: string;
  icon: typeof Building2;
  fields: ProfileField[];
}> = [
  {
    title: "Identificação",
    description: "Dados cadastrais oficiais da instituição.",
    icon: Building2,
    fields: [
      { label: "Nome", value: SINACE_INSTITUTIONAL_PROFILE.legalName },
      { label: "Razão estendida", value: SINACE_INSTITUTIONAL_PROFILE.extendedName },
      { label: "CNPJ", value: SINACE_INSTITUTIONAL_PROFILE.cnpj },
    ],
  },
  {
    title: "Contatos oficiais",
    description: "Canais institucionais de atendimento e comunicação.",
    icon: Mail,
    fields: [
      { label: "Telefone", value: SINACE_INSTITUTIONAL_PROFILE.phone, href: phoneHref },
      { label: "E-mail", value: SINACE_INSTITUTIONAL_PROFILE.email, href: emailHref },
      { label: "Instagram", value: SINACE_INSTITUTIONAL_PROFILE.instagram, href: instagramHref },
    ],
  },
  {
    title: "Atuação",
    description: "Abrangência e posicionamento da plataforma.",
    icon: MapPin,
    fields: [
      { label: "Sede", value: SINACE_INSTITUTIONAL_PROFILE.headquarters },
      { label: "Direção institucional", value: SINACE_INSTITUTIONAL_PROFILE.tagline },
    ],
  },
];

export default function AppInstitutionalProfile() {
  return (
    <div className="space-y-6">
      <SinaceModuleHeader
        eyebrow="Institucional"
        title="Sobre a SINACE"
        description={SINACE_INSTITUTIONAL_PROFILE.extendedName}
        icon={Info}
        badges={[SINACE_INSTITUTIONAL_PROFILE.headquarters]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {sections.map(section => (
          <Card key={section.title}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary">
                <section.icon className="h-4 w-4" />
                <CardTitle className="text-base">{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {section.fields.map(field => (
                  <div key={field.label} className="rounded-tile border border-border/70 bg-tile px-3 py-2">
                    <dt className="app-label text-slate-500">
                      {field.label}
                    </dt>
                    <dd className="mt-1 break-words text-sm leading-6 text-slate-900">
                      {field.href ? (
                        <a
                          href={field.href}
                          target={field.href.startsWith("http") ? "_blank" : undefined}
                          rel={field.href.startsWith("http") ? "noreferrer" : undefined}
                          className="hover:text-primary"
                        >
                          {field.value}
                        </a>
                      ) : (
                        field.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-4 w-4" />
            <CardTitle className="text-base">Objeto social</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-slate-700">{SINACE_INSTITUTIONAL_PROFILE.socialObject}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-primary">
            <Compass className="h-4 w-4" />
            <CardTitle className="text-base">Frentes de atuação</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {focusAreas.map((item, index) => (
            <div key={item} className="flex items-start gap-3 rounded-tile border border-border/70 bg-tile px-3 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/8 text-xs font-semibold text-primary">
                0{index + 1}
              </span>
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-tile border border-border/70 bg-white/82 px-4 py-3">
        <p className="text-sm text-slate-600">Proposta, operação em rede e contato completo estão no site público.</p>
        <Button asChild variant="outline" className="bg-white">
          <a href="/">
            Abrir site público
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
