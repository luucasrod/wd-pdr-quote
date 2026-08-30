import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normaliza texto para busca: minusculas, sem acentos e sem separadores.
 * Sem isto "orcamento" nao encontra "orcamento" acentuado e a matricula
 * "AA-00-AA" nao e encontrada por "aa00aa" — os dois casos sao a norma em Portugal.
 */
export function normalizeForSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[\s\-.]/g, "")
}
