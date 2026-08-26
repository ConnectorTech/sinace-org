import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { Eye, EyeOff, CheckCircle2, User, Stethoscope, Lock, Mail, Building, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { SINACE_PUBLIC_IMAGES } from "@/lib/sinacePublicSite";

const logoImage = SINACE_PUBLIC_IMAGES.logo;

// --- Validadores ---
const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let split = cpf.split('').map(el => parseInt(el));
  let rest = (split.slice(0, 9).reduce((acc, el, i) => acc + el * (10 - i), 0) * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== split[9]) return false;
  rest = (split.slice(0, 10).reduce((acc, el, i) => acc + el * (11 - i), 0) * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== split[10]) return false;
  return true;
};

// --- Schemas ---
const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  cpf: z.string().refine((val) => validateCPF(val), { message: "CPF inválido" }),
  cep: z.string().min(8, { message: "CEP inválido" }).max(9),
  addressLine1: z.string().min(1, { message: "Endereço é obrigatório" }),
  city: z.string().min(1, { message: "Cidade é obrigatória" }),
  state: z.string().length(2, { message: "Estado deve ter 2 letras" }),
  isDoctor: z.boolean().default(false),
  crm: z.string().optional(),
  crmUf: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isDoctor) {
    if (!data.crm || data.crm.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CRM é obrigatório", path: ["crm"] });
    }
    if (!data.crmUf || data.crmUf.trim().length !== 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "UF do CRM é obrigatória", path: ["crmUf"] });
    }
  }
});

// --- Utilitários de Força de Senha ---
const checkPasswordStrength = (password: string) => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength; // 0-4
};

const getStrengthColor = (strength: number) => {
  if (strength <= 1) return "bg-red-500";
  if (strength === 2 || strength === 3) return "bg-yellow-500";
  if (strength >= 4) return "bg-green-500";
  return "bg-slate-200";
};

const getStrengthLabel = (strength: number) => {
  if (strength === 0) return "";
  if (strength <= 1) return "Fraca";
  if (strength === 2 || strength === 3) return "Média";
  if (strength >= 4) return "Forte";
  return "";
};

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeTab, setActiveTab] = useState("login");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");
      setLocation("/app");
      setTimeout(() => window.location.reload(), 100);
    },
    onError: (err) => toast.error(err.message || "Credenciais inválidas"),
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
      setActiveTab("login");
      loginForm.setValue("email", registerForm.getValues("email"));
    },
    onError: (err) => toast.error(err.message || "Erro ao realizar cadastro"),
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "", email: "", password: "", cpf: "", cep: "",
      addressLine1: "", city: "", state: "", isDoctor: false, crm: "", crmUf: ""
    },
  });

  const isDoctor = registerForm.watch("isDoctor");

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    // limpar mascara do CPF e CEP antes de enviar
    const payload = {
      ...values,
      cpf: values.cpf.replace(/[^\d]+/g, ''),
      cep: values.cep.replace(/[^\d]+/g, ''),
    };
    registerMutation.mutate(payload);
  };

  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (data.erro) {
          toast.error("CEP não encontrado");
          return;
        }
        registerForm.setValue("addressLine1", `${data.logradouro}, ${data.bairro}`);
        registerForm.setValue("city", data.localidade);
        registerForm.setValue("state", data.uf);
        registerForm.trigger(["addressLine1", "city", "state"]);
      } catch (error) {
        toast.error("Erro ao buscar CEP");
      }
    }
  };

  // Funções de máscara
  const applyCpfMask = (v: string) => {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  };

  const applyCepMask = (v: string) => {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    return v;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-100/40 blur-3xl" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Button variant="ghost" className="mb-4 text-slate-500 hover:text-slate-900 -ml-4" onClick={() => setLocation("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Home
        </Button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <img src={logoImage} alt="Marca SINACE" className="h-10 w-auto object-contain" />
            SINACE
          </h1>
          <p className="text-slate-500 mt-3 text-sm">Plataforma Nacional de Inteligência Cirúrgica</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>

          {/* ABA DE LOGIN */}
          <TabsContent value="login" className="animate-in fade-in zoom-in-95 duration-200">
            <Card className="border-0 shadow-2xl shadow-slate-200/50">
              <CardHeader>
                <CardTitle>Bem-vindo de volta</CardTitle>
                <CardDescription>Acesse sua área médica ou administrativa.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input placeholder="seu@email.com" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input type={showPassword ? "text" : "password"} className="pl-10 pr-10" {...field} />
                              <button
                                type="button"
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={loginMutation.isPending}>
                      {loginMutation.isPending ? "Entrando..." : "Acessar Plataforma"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA DE CADASTRO */}
          <TabsContent value="register" className="animate-in fade-in zoom-in-95 duration-200">
            <Card className="border-0 shadow-2xl shadow-slate-200/50">
              <CardHeader>
                <CardTitle>Cadastro de Profissional</CardTitle>
                <CardDescription>Junte-se à rede SINACE de especialistas.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    
                    <FormField control={registerForm.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={registerForm.control} name="cpf" render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={14} onChange={e => field.onChange(applyCpfMask(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={registerForm.control} name="cep" render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={9} onChange={e => {
                              const val = applyCepMask(e.target.value);
                              field.onChange(val);
                              if (val.length === 9) fetchCep(val);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={registerForm.control} name="addressLine1" render={({ field }) => (
                      <FormItem><FormLabel>Endereço</FormLabel><FormControl><Input placeholder="Rua, Bairro..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={registerForm.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={registerForm.control} name="state" render={({ field }) => (
                        <FormItem><FormLabel>UF</FormLabel><FormControl><Input maxLength={2} className="uppercase" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>

                    <div className="my-6 border-t border-slate-100 pt-4">
                      <FormField control={registerForm.control} name="isDoctor" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-slate-50/50">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-semibold text-slate-700">Sou Médico / Especialista</FormLabel>
                            <p className="text-[0.8rem] text-slate-500">Habilite para preencher os dados de CRM.</p>
                          </div>
                        </FormItem>
                      )} />
                    </div>

                    <AnimatePresence>
                      {isDoctor && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden grid grid-cols-2 gap-4">
                          <FormField control={registerForm.control} name="crm" render={({ field }) => (
                            <FormItem><FormLabel>CRM</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={registerForm.control} name="crmUf" render={({ field }) => (
                            <FormItem><FormLabel>UF do CRM</FormLabel><FormControl><Input maxLength={2} className="uppercase" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="my-6 border-t border-slate-100 pt-4">
                      <FormField control={registerForm.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>E-mail (Login)</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      
                      <FormField control={registerForm.control} name="password" render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                className="pr-10" 
                                {...field} 
                                onChange={e => {
                                  field.onChange(e);
                                  setPasswordStrength(checkPasswordStrength(e.target.value));
                                }} 
                              />
                              <button type="button" className="absolute right-3 top-3 text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          {/* Força da senha */}
                          {field.value && (
                            <div className="mt-2 space-y-1">
                              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                <div className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`} style={{ width: `${(passwordStrength / 4) * 100}%` }} />
                              </div>
                              <p className={`text-xs font-medium text-right ${passwordStrength <= 1 ? 'text-red-500' : passwordStrength >= 4 ? 'text-green-500' : 'text-yellow-600'}`}>
                                Força: {getStrengthLabel(passwordStrength)}
                              </p>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 mt-6" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? "Cadastrando..." : "Criar Conta SINACE"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
