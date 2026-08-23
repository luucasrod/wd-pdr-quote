import type { VehicleType, VehicleView } from "@/types/vehicle"

import sedanFront from "@/assets/vehicles/sedan-front.jpg"
import sedanLeft from "@/assets/vehicles/sedan-left.jpg"
import sedanRight from "@/assets/vehicles/sedan-right.jpg"
import sedanTop from "@/assets/vehicles/sedan-top.jpg"
import sedanRear from "@/assets/vehicles/sedan-rear.jpg"

import suvFront from "@/assets/vehicles/suv-front.jpg"
import suvLeft from "@/assets/vehicles/suv-left.jpg"
import suvRight from "@/assets/vehicles/suv-right.jpg"
import suvTop from "@/assets/vehicles/suv-top.jpg"
import suvRear from "@/assets/vehicles/suv-rear.jpg"

import wagonFront from "@/assets/vehicles/wagon-front.jpg"
import wagonLeft from "@/assets/vehicles/wagon-left.jpg"
import wagonRight from "@/assets/vehicles/wagon-right.jpg"
import wagonTop from "@/assets/vehicles/wagon-top.jpg"
import wagonRear from "@/assets/vehicles/wagon-rear.jpg"

import compactFront from "@/assets/vehicles/compact-front.jpg"
import compactLeft from "@/assets/vehicles/compact-left.jpg"
import compactRight from "@/assets/vehicles/compact-right.jpg"
import compactTop from "@/assets/vehicles/compact-top.jpg"
import compactRear from "@/assets/vehicles/compact-rear.jpg"

import vanFront from "@/assets/vehicles/van-front.jpg"
import vanLeft from "@/assets/vehicles/van-left.jpg"
import vanRight from "@/assets/vehicles/van-right.jpg"
import vanTop from "@/assets/vehicles/van-top.jpg"
import vanRear from "@/assets/vehicles/van-rear.jpg"

export interface ViewImage {
  src: string
  aspect: number
}

type ViewImageSet = Record<VehicleView, ViewImage>

export const VEHICLE_IMAGES: Record<VehicleType, ViewImageSet> = {
  sedan: {
    front: { src: sedanFront, aspect: 1.4994 },
    left: { src: sedanLeft, aspect: 1.776 },
    right: { src: sedanRight, aspect: 1.8732 },
    top: { src: sedanTop, aspect: 1.4994 },
    rear: { src: sedanRear, aspect: 1.4994 },
  },
  suv: {
    front: { src: suvFront, aspect: 1.4994 },
    left: { src: suvLeft, aspect: 1.4994 },
    right: { src: suvRight, aspect: 1.4994 },
    top: { src: suvTop, aspect: 1.4994 },
    rear: { src: suvRear, aspect: 1.4994 },
  },
  wagon: {
    front: { src: wagonFront, aspect: 1.4994 },
    left: { src: wagonLeft, aspect: 1.4994 },
    right: { src: wagonRight, aspect: 1.4994 },
    top: { src: wagonTop, aspect: 1.4994 },
    rear: { src: wagonRear, aspect: 1.4994 },
  },
  compact: {
    front: { src: compactFront, aspect: 1.4994 },
    left: { src: compactLeft, aspect: 1.4994 },
    right: { src: compactRight, aspect: 1.4994 },
    top: { src: compactTop, aspect: 1.4994 },
    rear: { src: compactRear, aspect: 1.4994 },
  },
  van: {
    front: { src: vanFront, aspect: 1.4994 },
    left: { src: vanLeft, aspect: 1.4994 },
    right: { src: vanRight, aspect: 1.4994 },
    top: { src: vanTop, aspect: 1.4994 },
    rear: { src: vanRear, aspect: 1.4994 },
  },
}
