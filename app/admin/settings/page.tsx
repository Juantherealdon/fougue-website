"use client"

import { useState } from "react"
import {
  Save,
  Building,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Languages,
  Upload,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface Settings {
  company: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    website: string
    logo: string
    description: string
  }
  payment: {
    currency: string
    taxRate: number
    stripeEnabled: boolean
    stripePublicKey: string
    stripeSecretKey: string
    paypalEnabled: boolean
    paypalClientId: string
    bankTransferEnabled: boolean
    bankDetails: string
  }
  notifications: {
    emailNotifications: boolean
    orderConfirmation: boolean
    reservationConfirmation: boolean
    paymentReceived: boolean
    lowStockAlert: boolean
    newCustomer: boolean
    marketingEmails: boolean
    smsNotifications: boolean
    whatsappNotifications: boolean
  }
  booking: {
    requireDeposit: boolean
    depositPercentage: number
    cancellationPolicy: string
    minAdvanceBooking: number
    maxAdvanceBooking: number
    autoConfirm: boolean
    sendReminders: boolean
    reminderDays: number
  }
  appearance: {
    primaryColor: string
    accentColor: string
    fontFamily: string
    logoPosition: string
    showSocialLinks: boolean
    facebookUrl: string
    instagramUrl: string
    linkedinUrl: string
  }
  localization: {
    defaultLanguage: string
    timezone: string
    dateFormat: string
    timeFormat: string
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    passwordMinLength: number
    requireSpecialChars: boolean
    ipWhitelist: string
  }
}

const initialSettings: Settings = {
  company: {
    name: "Fougue",
    email: "contact@fougue.ae",
    phone: "+971 50 123 4567",
    address: "Sheikh Zayed Road",
    city: "Dubai",
    country: "United Arab Emirates",
    website: "https://fougue.ae",
    logo: "/images/fougue-logo-red-transparent.png",
    description: "Agence de conciergerie spécialisée dans les expériences romantiques et les cadeaux premium à Dubai.",
  },
  payment: {
    currency: "AED",
    taxRate: 5,
    stripeEnabled: true,
    stripePublicKey: "pk_live_****",
    stripeSecretKey: "sk_live_****",
    paypalEnabled: false,
    paypalClientId: "",
    bankTransferEnabled: true,
    bankDetails: "Emirates NBD\nIBAN: AE12 3456 7890 1234 5678 901\nSWIFT: EABORB",
  },
  notifications: {
    emailNotifications: true,
    orderConfirmation: true,
    reservationConfirmation: true,
    paymentReceived: true,
    lowStockAlert: true,
    newCustomer: true,
    marketingEmails: false,
    smsNotifications: false,
    whatsappNotifications: true,
  },
  booking: {
    requireDeposit: true,
    depositPercentage: 30,
    cancellationPolicy: "Annulation gratuite jusqu'à 48h avant l'expérience. Passé ce délai, 50% du montant sera retenu.",
    minAdvanceBooking: 2,
    maxAdvanceBooking: 90,
    autoConfirm: false,
    sendReminders: true,
    reminderDays: 2,
  },
  appearance: {
    primaryColor: "#800913",
    accentColor: "#1E1E1E",
    fontFamily: "Cormorant Garamond",
    logoPosition: "left",
    showSocialLinks: true,
    facebookUrl: "https://facebook.com/fougue",
    instagramUrl: "https://instagram.com/fougue",
    linkedinUrl: "https://linkedin.com/company/fougue",
  },
  localization: {
    defaultLanguage: "fr",
    timezone: "Asia/Dubai",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 60,
    passwordMinLength: 8,
    requireSpecialChars: true,
    ipWhitelist: "",
  },
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [activeTab, setActiveTab] = useState("company")
  const [isSaving, setIsSaving] = useState(false)
  const [showStripeSecret, setShowStripeSecret] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const updateCompany = (field: keyof Settings["company"], value: string) => {
    setSettings((prev) => ({
      ...prev,
      company: { ...prev.company, [field]: value },
    }))
  }

  const updatePayment = (field: keyof Settings["payment"], value: string | number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      payment: { ...prev.payment, [field]: value },
    }))
  }

  const updateNotifications = (field: keyof Settings["notifications"], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }))
  }

  const updateBooking = (field: keyof Settings["booking"], value: string | number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      booking: { ...prev.booking, [field]: value },
    }))
  }

  const updateAppearance = (field: keyof Settings["appearance"], value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, [field]: value },
    }))
  }

  const updateLocalization = (field: keyof Settings["localization"], value: string) => {
    setSettings((prev) => ({
      ...prev,
      localization: { ...prev.localization, [field]: value },
    }))
  }

  const updateSecurity = (field: keyof Settings["security"], value: string | number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, [field]: value },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1E1E1E]">
            <span className="text-[#800913]">Parametres</span>
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            Configurez votre boutique et vos preferences
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#800913] hover:bg-[#800913]/90 text-white"
        >
          {isSaving ? (
            "Enregistrement..."
          ) : saved ? (
            <>
              <Check size={18} className="mr-2" />
              Enregistre
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              Enregistrer
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-[#1E1E1E]/10 p-1 h-auto flex flex-wrap">
          <TabsTrigger
            value="company"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            <Building size={16} className="mr-2" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            <CreditCard size={16} className="mr-2" />
            Paiement
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            <Bell size={16} className="mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="booking"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            <Globe size={16} className="mr-2" />
            Reservations
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            <Palette size={16} className="mr-2" />
            Apparence
          </TabsTrigger>
          <TabsTrigger
            value="localization"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            <Languages size={16} className="mr-2" />
            Localisation
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            <Shield size={16} className="mr-2" />
            Securite
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Informations de l'entreprise</CardTitle>
              <CardDescription>Details de votre entreprise affiches sur le site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-[#F8F8F8] flex items-center justify-center overflow-hidden">
                    <Image
                      src={settings.company.logo || "/placeholder.svg"}
                      alt="Logo"
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 p-0 border-[#1E1E1E]/10 bg-transparent"
                  >
                    <Upload size={14} />
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nom de l'entreprise</Label>
                      <Input
                        value={settings.company.name}
                        onChange={(e) => updateCompany("name", e.target.value)}
                        className="mt-1 border-[#1E1E1E]/10"
                      />
                    </div>
                    <div>
                      <Label>Site web</Label>
                      <Input
                        value={settings.company.website}
                        onChange={(e) => updateCompany("website", e.target.value)}
                        className="mt-1 border-[#1E1E1E]/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={settings.company.email}
                    onChange={(e) => updateCompany("email", e.target.value)}
                    className="mt-1 border-[#1E1E1E]/10"
                  />
                </div>
                <div>
                  <Label>Telephone</Label>
                  <Input
                    value={settings.company.phone}
                    onChange={(e) => updateCompany("phone", e.target.value)}
                    className="mt-1 border-[#1E1E1E]/10"
                  />
                </div>
              </div>

              <div>
                <Label>Adresse</Label>
                <Input
                  value={settings.company.address}
                  onChange={(e) => updateCompany("address", e.target.value)}
                  className="mt-1 border-[#1E1E1E]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ville</Label>
                  <Input
                    value={settings.company.city}
                    onChange={(e) => updateCompany("city", e.target.value)}
                    className="mt-1 border-[#1E1E1E]/10"
                  />
                </div>
                <div>
                  <Label>Pays</Label>
                  <Input
                    value={settings.company.country}
                    onChange={(e) => updateCompany("country", e.target.value)}
                    className="mt-1 border-[#1E1E1E]/10"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={settings.company.description}
                  onChange={(e) => updateCompany("description", e.target.value)}
                  className="mt-1 border-[#1E1E1E]/10 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Configuration des paiements</CardTitle>
              <CardDescription>Gerez vos methodes de paiement et devises</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Devise</Label>
                  <Select
                    value={settings.payment.currency}
                    onValueChange={(value) => updatePayment("currency", value)}
                  >
                    <SelectTrigger className="mt-1 border-[#1E1E1E]/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED - Dirham</SelectItem>
                      <SelectItem value="USD">USD - Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - Livre Sterling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Taux de TVA (%)</Label>
                  <Input
                    type="number"
                    value={settings.payment.taxRate}
                    onChange={(e) => updatePayment("taxRate", Number(e.target.value))}
                    className="mt-1 border-[#1E1E1E]/10"
                  />
                </div>
              </div>

              <Separator />

              {/* Stripe */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-[#1E1E1E]/60">Accepter les cartes de credit</p>
                  </div>
                  <Switch
                    checked={settings.payment.stripeEnabled}
                    onCheckedChange={(checked) => updatePayment("stripeEnabled", checked)}
                  />
                </div>
                {settings.payment.stripeEnabled && (
                  <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-[#800913]/20">
                    <div>
                      <Label>Cle publique</Label>
                      <Input
                        value={settings.payment.stripePublicKey}
                        onChange={(e) => updatePayment("stripePublicKey", e.target.value)}
                        className="mt-1 border-[#1E1E1E]/10"
                      />
                    </div>
                    <div>
                      <Label>Cle secrete</Label>
                      <div className="relative mt-1">
                        <Input
                          type={showStripeSecret ? "text" : "password"}
                          value={settings.payment.stripeSecretKey}
                          onChange={(e) => updatePayment("stripeSecretKey", e.target.value)}
                          className="border-[#1E1E1E]/10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStripeSecret(!showStripeSecret)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40 hover:text-[#1E1E1E]"
                        >
                          {showStripeSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* PayPal */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-[#1E1E1E]/60">Accepter les paiements PayPal</p>
                  </div>
                  <Switch
                    checked={settings.payment.paypalEnabled}
                    onCheckedChange={(checked) => updatePayment("paypalEnabled", checked)}
                  />
                </div>
                {settings.payment.paypalEnabled && (
                  <div className="pl-4 border-l-2 border-[#800913]/20">
                    <Label>Client ID</Label>
                    <Input
                      value={settings.payment.paypalClientId}
                      onChange={(e) => updatePayment("paypalClientId", e.target.value)}
                      className="mt-1 border-[#1E1E1E]/10"
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Bank Transfer */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Virement bancaire</p>
                    <p className="text-sm text-[#1E1E1E]/60">Accepter les virements</p>
                  </div>
                  <Switch
                    checked={settings.payment.bankTransferEnabled}
                    onCheckedChange={(checked) => updatePayment("bankTransferEnabled", checked)}
                  />
                </div>
                {settings.payment.bankTransferEnabled && (
                  <div className="pl-4 border-l-2 border-[#800913]/20">
                    <Label>Coordonnees bancaires</Label>
                    <Textarea
                      value={settings.payment.bankDetails}
                      onChange={(e) => updatePayment("bankDetails", e.target.value)}
                      className="mt-1 border-[#1E1E1E]/10 min-h-[100px] font-mono text-sm"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Preferences de notifications</CardTitle>
              <CardDescription>Configurez les notifications email et SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-[#1E1E1E]/60">Recevoir les notifications par email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateNotifications("emailNotifications", checked)}
                  />
                </div>

                {settings.notifications.emailNotifications && (
                  <>
                    <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5 pl-4">
                      <div>
                        <p className="text-sm font-medium">Confirmation de commande</p>
                        <p className="text-xs text-[#1E1E1E]/60">Email envoye apres chaque commande</p>
                      </div>
                      <Switch
                        checked={settings.notifications.orderConfirmation}
                        onCheckedChange={(checked) => updateNotifications("orderConfirmation", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5 pl-4">
                      <div>
                        <p className="text-sm font-medium">Confirmation de reservation</p>
                        <p className="text-xs text-[#1E1E1E]/60">Email envoye apres chaque reservation</p>
                      </div>
                      <Switch
                        checked={settings.notifications.reservationConfirmation}
                        onCheckedChange={(checked) => updateNotifications("reservationConfirmation", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5 pl-4">
                      <div>
                        <p className="text-sm font-medium">Paiement recu</p>
                        <p className="text-xs text-[#1E1E1E]/60">Notification a reception d'un paiement</p>
                      </div>
                      <Switch
                        checked={settings.notifications.paymentReceived}
                        onCheckedChange={(checked) => updateNotifications("paymentReceived", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5 pl-4">
                      <div>
                        <p className="text-sm font-medium">Nouveau client</p>
                        <p className="text-xs text-[#1E1E1E]/60">Notification pour chaque nouveau client</p>
                      </div>
                      <Switch
                        checked={settings.notifications.newCustomer}
                        onCheckedChange={(checked) => updateNotifications("newCustomer", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5 pl-4">
                      <div>
                        <p className="text-sm font-medium">Alerte stock bas</p>
                        <p className="text-xs text-[#1E1E1E]/60">Notification quand le stock est faible</p>
                      </div>
                      <Switch
                        checked={settings.notifications.lowStockAlert}
                        onCheckedChange={(checked) => updateNotifications("lowStockAlert", checked)}
                      />
                    </div>
                  </>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5">
                <div>
                  <p className="font-medium">Notifications SMS</p>
                  <p className="text-sm text-[#1E1E1E]/60">Recevoir les notifications par SMS</p>
                </div>
                <Switch
                  checked={settings.notifications.smsNotifications}
                  onCheckedChange={(checked) => updateNotifications("smsNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Notifications WhatsApp</p>
                  <p className="text-sm text-[#1E1E1E]/60">Recevoir les notifications par WhatsApp</p>
                </div>
                <Switch
                  checked={settings.notifications.whatsappNotifications}
                  onCheckedChange={(checked) => updateNotifications("whatsappNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Settings */}
        <TabsContent value="booking" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Configuration des reservations</CardTitle>
              <CardDescription>Gerez les regles de reservation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5">
                <div>
                  <p className="font-medium">Acompte requis</p>
                  <p className="text-sm text-[#1E1E1E]/60">Demander un acompte a la reservation</p>
                </div>
                <Switch
                  checked={settings.booking.requireDeposit}
                  onCheckedChange={(checked) => updateBooking("requireDeposit", checked)}
                />
              </div>

              {settings.booking.requireDeposit && (
                <div className="pl-4 border-l-2 border-[#800913]/20">
                  <Label>Pourcentage d'acompte (%)</Label>
                  <Input
                    type="number"
                    value={settings.booking.depositPercentage}
                    onChange={(e) => updateBooking("depositPercentage", Number(e.target.value))}
                    className="mt-1 border-[#1E1E1E]/10 w-32"
                    min={0}
                    max={100}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Reservation minimum (jours a l'avance)</Label>
                  <Input
                    type="number"
                    value={settings.booking.minAdvanceBooking}
                    onChange={(e) => updateBooking("minAdvanceBooking", Number(e.target.value))}
                    className="mt-1 border-[#1E1E1E]/10"
                  />
                </div>
                <div>
                  <Label>Reservation maximum (jours a l'avance)</Label>
                  <Input
                    type="number"
                    value={settings.booking.maxAdvanceBooking}
                    onChange={(e) => updateBooking("maxAdvanceBooking", Number(e.target.value))}
                    className="mt-1 border-[#1E1E1E]/10"
                  />
                </div>
              </div>

              <div>
                <Label>Politique d'annulation</Label>
                <Textarea
                  value={settings.booking.cancellationPolicy}
                  onChange={(e) => updateBooking("cancellationPolicy", e.target.value)}
                  className="mt-1 border-[#1E1E1E]/10 min-h-[100px]"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5">
                <div>
                  <p className="font-medium">Confirmation automatique</p>
                  <p className="text-sm text-[#1E1E1E]/60">Confirmer automatiquement les reservations</p>
                </div>
                <Switch
                  checked={settings.booking.autoConfirm}
                  onCheckedChange={(checked) => updateBooking("autoConfirm", checked)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Rappels automatiques</p>
                  <p className="text-sm text-[#1E1E1E]/60">Envoyer des rappels avant l'experience</p>
                </div>
                <Switch
                  checked={settings.booking.sendReminders}
                  onCheckedChange={(checked) => updateBooking("sendReminders", checked)}
                />
              </div>

              {settings.booking.sendReminders && (
                <div className="pl-4 border-l-2 border-[#800913]/20">
                  <Label>Jours avant le rappel</Label>
                  <Input
                    type="number"
                    value={settings.booking.reminderDays}
                    onChange={(e) => updateBooking("reminderDays", Number(e.target.value))}
                    className="mt-1 border-[#1E1E1E]/10 w-32"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Personnalisation de l'apparence</CardTitle>
              <CardDescription>Modifiez les couleurs et le style du site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Couleur principale</Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateAppearance("primaryColor", e.target.value)}
                      className="w-12 h-10 cursor-pointer border border-[#1E1E1E]/10"
                    />
                    <Input
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateAppearance("primaryColor", e.target.value)}
                      className="border-[#1E1E1E]/10 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <Label>Couleur secondaire</Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      value={settings.appearance.accentColor}
                      onChange={(e) => updateAppearance("accentColor", e.target.value)}
                      className="w-12 h-10 cursor-pointer border border-[#1E1E1E]/10"
                    />
                    <Input
                      value={settings.appearance.accentColor}
                      onChange={(e) => updateAppearance("accentColor", e.target.value)}
                      className="border-[#1E1E1E]/10 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Police de caracteres</Label>
                  <Select
                    value={settings.appearance.fontFamily}
                    onValueChange={(value) => updateAppearance("fontFamily", value)}
                  >
                    <SelectTrigger className="mt-1 border-[#1E1E1E]/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cormorant Garamond">Cormorant Garamond</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Lora">Lora</SelectItem>
                      <SelectItem value="Inter">Inter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Position du logo</Label>
                  <Select
                    value={settings.appearance.logoPosition}
                    onValueChange={(value) => updateAppearance("logoPosition", value)}
                  >
                    <SelectTrigger className="mt-1 border-[#1E1E1E]/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Gauche</SelectItem>
                      <SelectItem value="center">Centre</SelectItem>
                      <SelectItem value="right">Droite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5">
                <div>
                  <p className="font-medium">Afficher les liens sociaux</p>
                  <p className="text-sm text-[#1E1E1E]/60">Afficher les icones reseaux sociaux dans le footer</p>
                </div>
                <Switch
                  checked={settings.appearance.showSocialLinks}
                  onCheckedChange={(checked) => updateAppearance("showSocialLinks", checked)}
                />
              </div>

              {settings.appearance.showSocialLinks && (
                <div className="space-y-4 pl-4 border-l-2 border-[#800913]/20">
                  <div>
                    <Label>URL Facebook</Label>
                    <Input
                      value={settings.appearance.facebookUrl}
                      onChange={(e) => updateAppearance("facebookUrl", e.target.value)}
                      className="mt-1 border-[#1E1E1E]/10"
                    />
                  </div>
                  <div>
                    <Label>URL Instagram</Label>
                    <Input
                      value={settings.appearance.instagramUrl}
                      onChange={(e) => updateAppearance("instagramUrl", e.target.value)}
                      className="mt-1 border-[#1E1E1E]/10"
                    />
                  </div>
                  <div>
                    <Label>URL LinkedIn</Label>
                    <Input
                      value={settings.appearance.linkedinUrl}
                      onChange={(e) => updateAppearance("linkedinUrl", e.target.value)}
                      className="mt-1 border-[#1E1E1E]/10"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization Settings */}
        <TabsContent value="localization" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Parametres de localisation</CardTitle>
              <CardDescription>Langue, fuseau horaire et formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Langue par defaut</Label>
                  <Select
                    value={settings.localization.defaultLanguage}
                    onValueChange={(value) => updateLocalization("defaultLanguage", value)}
                  >
                    <SelectTrigger className="mt-1 border-[#1E1E1E]/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Francais</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fuseau horaire</Label>
                  <Select
                    value={settings.localization.timezone}
                    onValueChange={(value) => updateLocalization("timezone", value)}
                  >
                    <SelectTrigger className="mt-1 border-[#1E1E1E]/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dubai">Dubai (GMT+4)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Format de date</Label>
                  <Select
                    value={settings.localization.dateFormat}
                    onValueChange={(value) => updateLocalization("dateFormat", value)}
                  >
                    <SelectTrigger className="mt-1 border-[#1E1E1E]/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Format d'heure</Label>
                  <Select
                    value={settings.localization.timeFormat}
                    onValueChange={(value) => updateLocalization("timeFormat", value)}
                  >
                    <SelectTrigger className="mt-1 border-[#1E1E1E]/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 heures</SelectItem>
                      <SelectItem value="12h">12 heures (AM/PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Parametres de securite</CardTitle>
              <CardDescription>Protegez votre compte et vos donnees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5">
                <div>
                  <p className="font-medium">Authentification a deux facteurs</p>
                  <p className="text-sm text-[#1E1E1E]/60">Securite supplementaire pour votre compte</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => updateSecurity("twoFactorAuth", checked)}
                />
              </div>

              <div>
                <Label>Expiration de session (minutes)</Label>
                <Input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSecurity("sessionTimeout", Number(e.target.value))}
                  className="mt-1 border-[#1E1E1E]/10 w-32"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <p className="font-medium">Politique de mot de passe</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Longueur minimum</Label>
                    <Input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => updateSecurity("passwordMinLength", Number(e.target.value))}
                      className="mt-1 border-[#1E1E1E]/10"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      checked={settings.security.requireSpecialChars}
                      onCheckedChange={(checked) => updateSecurity("requireSpecialChars", checked)}
                    />
                    <span className="text-sm">Caracteres speciaux requis</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label>Liste blanche IP (une IP par ligne)</Label>
                <Textarea
                  value={settings.security.ipWhitelist}
                  onChange={(e) => updateSecurity("ipWhitelist", e.target.value)}
                  className="mt-1 border-[#1E1E1E]/10 min-h-[100px] font-mono text-sm"
                  placeholder="Laisser vide pour autoriser toutes les IPs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
