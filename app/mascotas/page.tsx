import { Suspense } from "react"
import PetFilters from "@/components/pet-filters"
import PetList from "@/components/pet-list"
import { Skeleton } from "@/components/ui/skeleton"

export default function PetsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Mascotas en Adopción</h1>
        <p className="text-gray-600">
          Encuentra a tu compañero perfecto entre nuestras mascotas disponibles para adopción.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <PetFilters />
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<PetListSkeleton />}>
            <PetList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function PetListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

