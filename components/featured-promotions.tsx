"use client"
import { Badge } from "@/components/ui/badge"
import { TagIcon } from "lucide-react"
import Image from "next/image"
import type { Promotion } from "@/lib/types"

interface FeaturedPromotionsProps {
  promotions: Promotion[]
}

export function FeaturedPromotions({ promotions }: FeaturedPromotionsProps) {
  return (
    <div className="space-y-4">
      {promotions.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground">No hay promociones activas</div>
      ) : (
        promotions.map((promotion) => (
          <div key={promotion.id} className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm">
            <div className="relative h-16 w-16 flex-shrink-0">
              <Image
                src={promotion.presentation.imageUrl || "/placeholder.svg"}
                alt={promotion.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-medium text-sm truncate">{promotion.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{promotion.presentation.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-sweetBrown">${promotion.discountedPrice.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground line-through">
                  ${promotion.originalPrice.toLocaleString()}
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 bg-sweetPink/20 text-sweetBrown">
              <TagIcon className="h-3 w-3" />
              {promotion.discountPercentage}% OFF
            </Badge>
          </div>
        ))
      )}
    </div>
  )
}
