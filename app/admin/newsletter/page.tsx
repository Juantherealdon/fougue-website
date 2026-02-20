"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  TrendingUp, 
  Mail, 
  MailOpen,
  Search,
  Download,
  Filter,
  MoreHorizontal,
  Send,
  FileText,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface Subscriber {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  interests?: string[]
  subscription_type: 'simple' | 'waitlist'
  source: string
  status: string
  type: 'client' | 'prospect'
  created_at: string
}

interface Stats {
  totalSubscribers: number
  newThisMonth: number
  avgOpenRate: number
}

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState<'audience' | 'campaigns'>('audience')
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState<Stats>({ totalSubscribers: 0, newThisMonth: 0, avgOpenRate: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter')
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data.subscribers || [])
        setStats(data.stats || { totalSubscribers: 0, newThisMonth: 0, avgOpenRate: 0 })
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    }
    setIsLoading(false)
  }

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = filterSource === 'all' || sub.source === filterSource
    const matchesType = filterType === 'all' || sub.type === filterType
    return matchesSearch && matchesSource && matchesType
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      footer: 'Footer',
      popup: 'Popup',
      checkout: 'Checkout'
    }
    return labels[source] || source
  }

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('audience')}
          className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${
            activeTab === 'audience'
              ? 'bg-[#1E1E1E] text-white'
              : 'text-[#1E1E1E]/60 hover:text-[#1E1E1E]'
          }`}
        >
          Audience
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${
            activeTab === 'campaigns'
              ? 'bg-[#1E1E1E] text-white'
              : 'text-[#1E1E1E]/60 hover:text-[#1E1E1E]'
          }`}
        >
          Campagnes
        </button>
      </div>

      {activeTab === 'audience' ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#1E1E1E]/60">
                  Total Abonnés
                </CardTitle>
                <Users className="h-4 w-4 text-[#1E1E1E]/40" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-[#1E1E1E]">
                  {stats.totalSubscribers}
                </div>
                <p className="text-xs text-[#1E1E1E]/50 mt-1">
                  Inscrits à la newsletter
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#1E1E1E]/60">
                  Nouveaux ce mois
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-[#1E1E1E]">
                  +{stats.newThisMonth}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Depuis le 1er du mois
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#1E1E1E]/60">
                  Taux d'ouverture moyen
                </CardTitle>
                <MailOpen className="h-4 w-4 text-[#1E1E1E]/40" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-[#1E1E1E]">
                  {stats.avgOpenRate}%
                </div>
                <p className="text-xs text-[#1E1E1E]/50 mt-1">
                  Sur les 30 derniers jours
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Subscribers Table */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <CardTitle className="text-lg font-medium">
                  Liste des inscrits
                </CardTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Search */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1E1E1E]/40" />
                    <Input
                      placeholder="Rechercher un email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 border-[#1E1E1E]/10"
                    />
                  </div>
                  
                  {/* Filters */}
                  <Select value={filterSource} onValueChange={setFilterSource}>
                    <SelectTrigger className="w-full sm:w-32 border-[#1E1E1E]/10">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="checkout">Checkout</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-32 border-[#1E1E1E]/10">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="client">Clients</SelectItem>
                      <SelectItem value="prospect">Prospects</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon" className="border-[#1E1E1E]/10 bg-transparent">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800913]" />
                </div>
              ) : filteredSubscribers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#1E1E1E]/40">
                  <Mail className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Aucun abonné</p>
                  <p className="text-sm">Les inscriptions apparaîtront ici</p>
                </div>
              ) : (
                <div className="rounded-lg border border-[#1E1E1E]/10 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F8F8F8]">
                        <TableHead className="font-medium">Date</TableHead>
                        <TableHead className="font-medium">Email</TableHead>
                        <TableHead className="font-medium">Nom Complet</TableHead>
                        <TableHead className="font-medium">Intérêts</TableHead>
                        <TableHead className="font-medium">Source</TableHead>
                        <TableHead className="font-medium">Type</TableHead>
                        <TableHead className="font-medium">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscribers.map((subscriber) => {
                        const fullName = subscriber.first_name && subscriber.last_name 
                          ? `${subscriber.first_name} ${subscriber.last_name}`
                          : '-'
                        const interests = subscriber.interests || []
                        const visibleInterests = interests.slice(0, 2)
                        const remainingCount = interests.length - visibleInterests.length

                        return (
                          <TableRow 
                            key={subscriber.id} 
                            className="hover:bg-[#F8F8F8]/50 cursor-pointer"
                            onClick={() => setSelectedSubscriber(subscriber)}
                          >
                            <TableCell className="text-[#1E1E1E]/60">
                              {formatDate(subscriber.created_at)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {subscriber.email}
                            </TableCell>
                            <TableCell className="text-[#1E1E1E]/70">
                              {fullName}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 flex-wrap">
                                {visibleInterests.length > 0 ? (
                                  <>
                                    {visibleInterests.map((interest, idx) => (
                                      <Badge 
                                        key={idx} 
                                        variant="secondary"
                                        className="bg-[#FBF5EF] text-[#800913] border-[#800913]/20"
                                      >
                                        {interest}
                                      </Badge>
                                    ))}
                                    {remainingCount > 0 && (
                                      <Badge variant="outline" className="border-[#1E1E1E]/20">
                                        +{remainingCount} autres
                                      </Badge>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-[#1E1E1E]/40 text-sm">-</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1E1E1E]/5 text-[#1E1E1E]/70">
                                {getSourceLabel(subscriber.source)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {subscriber.type === 'client' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                  Client
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  Prospect
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {subscriber.status === 'active' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  Actif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                  Désabonné
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {/* Results count */}
              {!isLoading && filteredSubscribers.length > 0 && (
                <p className="text-sm text-[#1E1E1E]/50 mt-4">
                  {filteredSubscribers.length} résultat{filteredSubscribers.length > 1 ? 's' : ''}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        /* Campaigns Tab */
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Campagnes</CardTitle>
              <Button className="bg-[#800913] hover:bg-[#800913]/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle campagne
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-[#1E1E1E]/40">
              <Send className="h-16 w-16 mb-6 opacity-30" />
              <p className="text-xl font-medium mb-2">Aucune campagne</p>
              <p className="text-sm text-center max-w-md">
                Créez votre première campagne email pour communiquer avec vos abonnés.
                <br />
                Intégration avec des services comme Resend ou Mailchimp à venir.
              </p>
              <Button variant="outline" className="mt-6 border-[#1E1E1E]/20 bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Voir la documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscriber Detail Sheet */}
      <Sheet open={!!selectedSubscriber} onOpenChange={(open) => !open && setSelectedSubscriber(null)}>
        <SheetContent className="sm:max-w-md flex flex-col p-0">
          {selectedSubscriber && (
            <>
              <SheetHeader className="border-b bg-white p-6">
                <SheetTitle className="text-lg font-semibold text-[#1E1E1E]">Détails de l'abonné</SheetTitle>
                <SheetDescription className="text-[#1E1E1E]/60">
                  Informations complètes sur cet abonné
                </SheetDescription>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Type Badge */}
                <div>
                  {selectedSubscriber.type === 'client' ? (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      Client
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      Prospect
                    </Badge>
                  )}
                </div>

                {/* Personal Info */}
                <div className="space-y-5">
                  <div className="pb-4 border-b border-[#1E1E1E]/10">
                    <label className="text-xs font-semibold text-[#1E1E1E]/60 uppercase tracking-wider">Email</label>
                    <p className="mt-2 text-sm text-[#1E1E1E]">{selectedSubscriber.email}</p>
                  </div>
                  
                  {selectedSubscriber.first_name && selectedSubscriber.last_name && (
                    <div className="pb-4 border-b border-[#1E1E1E]/10">
                      <label className="text-xs font-semibold text-[#1E1E1E]/60 uppercase tracking-wider">Nom complet</label>
                      <p className="mt-2 text-sm text-[#1E1E1E]">
                        {selectedSubscriber.first_name} {selectedSubscriber.last_name}
                      </p>
                    </div>
                  )}

                  {selectedSubscriber.phone && (
                    <div className="pb-4 border-b border-[#1E1E1E]/10">
                      <label className="text-xs font-semibold text-[#1E1E1E]/60 uppercase tracking-wider">Téléphone</label>
                      <p className="mt-2 text-sm text-[#1E1E1E]">{selectedSubscriber.phone}</p>
                    </div>
                  )}

                  <div className="pb-4 border-b border-[#1E1E1E]/10">
                    <label className="text-xs font-semibold text-[#1E1E1E]/60 uppercase tracking-wider">Date d'inscription</label>
                    <p className="mt-2 text-sm text-[#1E1E1E]">{formatDate(selectedSubscriber.created_at)}</p>
                  </div>

                  <div className="pb-4 border-b border-[#1E1E1E]/10">
                    <label className="text-xs font-semibold text-[#1E1E1E]/60 uppercase tracking-wider">Source</label>
                    <p className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#1E1E1E]/5 text-[#1E1E1E]/70">
                        {getSourceLabel(selectedSubscriber.source)}
                      </span>
                    </p>
                  </div>

                  <div className="pb-4 border-b border-[#1E1E1E]/10">
                    <label className="text-xs font-semibold text-[#1E1E1E]/60 uppercase tracking-wider">Type d'inscription</label>
                    <p className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#1E1E1E]/5 text-[#1E1E1E]/70">
                        {selectedSubscriber.subscription_type === 'waitlist' ? 'Waitlist' : 'Simple'}
                      </span>
                    </p>
                  </div>

                  <div className="pb-4 border-b border-[#1E1E1E]/10">
                    <label className="text-xs font-semibold text-[#1E1E1E]/60 uppercase tracking-wider">Statut</label>
                    <p className="mt-2">
                      {selectedSubscriber.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Désabonné
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Interests */}
                  {selectedSubscriber.interests && selectedSubscriber.interests.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold text-[#1E1E1E]/60 uppercase tracking-wider block mb-3">
                        Intérêts ({selectedSubscriber.interests.length})
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubscriber.interests.map((interest, idx) => (
                          <Badge 
                            key={idx}
                            variant="secondary"
                            className="bg-[#FBF5EF] text-[#800913] border border-[#800913]/20"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
