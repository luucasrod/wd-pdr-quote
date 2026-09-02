import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { useLanguage } from "@/i18n/language-context"

interface DeleteDialogProps {
  name: string | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteDialog({ name, onCancel, onConfirm }: DeleteDialogProps) {
  const { t } = useLanguage()
  return (
    <Modal
      open={name !== null}
      onOpenChange={(open) => { if (!open) onCancel() }}
      title={t.common.deleteTitle.replace("{name}", name ?? "")}
      description={t.common.deleteDescription}
    >
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>{t.common.cancel}</Button>
        <Button variant="destructive" onClick={onConfirm}>{t.common.deleteAction}</Button>
      </div>
    </Modal>
  )
}

export function UndoDelete({ visible, onUndo }: { visible: boolean; onUndo: () => void }) {
  const { t } = useLanguage()
  if (!visible) return null
  return (
    <div role="status" className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-[var(--radius-lg)] bg-[var(--color-ink-950)] px-4 py-3 text-[13px] text-white shadow-[var(--shadow-soft-lg)]">
      <span>{t.common.deletedNotice}</span>
      <button type="button" onClick={onUndo} className="font-semibold text-[var(--color-amber-400)]">{t.common.undo}</button>
    </div>
  )
}
