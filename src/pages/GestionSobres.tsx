import { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSobresStore } from '../lib/store'
import { formatColones, formatPorcentaje } from '../lib/format'
import { Header } from '../assets/components/organisms/Header'
import { IconBadge } from '../assets/components/atoms/IconBadge'
import { Button } from '../assets/components/atoms/Button'
import { Modal } from '../assets/components/atoms/Modal'
import {
  CheckIcon,
  DotsIcon,
  DragHandleIcon,
  PlusIcon,
  iconoDeSobre,
} from '../assets/components/atoms/Icon'
import type { Sobre, SobreIcono } from '../types'

const ICONOS_DISPONIBLES: SobreIcono[] = [
  'graduacion',
  'avion',
  'hoja',
  'escudo',
  'casa',
  'estrella',
]

interface FormSobre {
  editandoId: string | null
  nombre: string
  prioridad: string
  color: Sobre['color']
  icono: SobreIcono
  saldo: string
}

const FORM_VACIO: FormSobre = {
  editandoId: null,
  nombre: '',
  prioridad: '',
  color: 'green',
  icono: 'hoja',
  saldo: '0',
}

interface FilaSobreProps {
  sobre: Sobre
  menuAbierto: boolean
  onToggleMenu: () => void
  onCerrarMenu: () => void
  onEditar: () => void
  onArchivar: () => void
  onEliminar: () => void
}

function FilaSobre({
  sobre,
  menuAbierto,
  onToggleMenu,
  onCerrarMenu,
  onEditar,
  onArchivar,
  onEliminar,
}: FilaSobreProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sobre.id,
  })
  const Icono = iconoDeSobre(sobre.icono)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-3 ${
        isDragging ? 'relative z-20 shadow-lg' : ''
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Reordenar ${sobre.nombre}`}
        className="flex h-7 w-7 shrink-0 touch-none items-center justify-center text-ink-faint active:cursor-grabbing"
      >
        <DragHandleIcon size={14} />
      </button>
      <IconBadge color={sobre.color} size={30}>
        <Icono size={15} />
      </IconBadge>
      <div className="min-w-0 flex-1">
        <div className="font-display font-semibold text-sm">{sobre.nombre}</div>
        <div className="text-[11px] text-ink-faint">Saldo {formatColones(sobre.saldoActual)}</div>
      </div>
      <div className="text-[12.5px] font-semibold text-ink-soft shrink-0">
        {formatPorcentaje(sobre.prioridad)}
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label={`Opciones de ${sobre.nombre}`}
          className="flex h-7 w-7 items-center justify-center text-ink-faint"
        >
          <DotsIcon size={15} />
        </button>

        {menuAbierto && (
          <>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={onCerrarMenu}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div className="absolute right-0 top-full z-20 mt-1 flex w-36 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
              <button
                type="button"
                onClick={onEditar}
                className="px-3.5 py-2.5 text-left text-[13px] font-medium hover:bg-surface-2"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={onArchivar}
                className="px-3.5 py-2.5 text-left text-[13px] font-medium hover:bg-surface-2"
              >
                Archivar
              </button>
              {sobre.saldoActual === 0 && (
                <button
                  type="button"
                  onClick={onEliminar}
                  className="px-3.5 py-2.5 text-left text-[13px] font-medium hover:bg-surface-2"
                >
                  Eliminar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function GestionSobres() {
  const {
    sobres,
    sumaPrioridadesActivas,
    prioridadesValidas,
    actualizarSobre,
    archivarSobre,
    eliminarSobre,
    agregarSobre,
    reordenarSobres,
  } = useSobresStore()
  const activos = sobres.filter((s) => !s.archivado).sort((a, b) => a.orden - b.orden)

  const [menuAbiertoId, setMenuAbiertoId] = useState<string | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState<FormSobre>(FORM_VACIO)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = activos.findIndex((s) => s.id === active.id)
    const newIndex = activos.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    reordenarSobres(arrayMove(activos, oldIndex, newIndex).map((s) => s.id))
  }

  function abrirModalNuevo() {
    setForm(FORM_VACIO)
    setModalAbierto(true)
  }

  function abrirModalEditar(sobre: Sobre) {
    setForm({
      editandoId: sobre.id,
      nombre: sobre.nombre,
      prioridad: String(sobre.prioridad),
      color: sobre.color,
      icono: sobre.icono,
      saldo: String(sobre.saldoActual),
    })
    setMenuAbiertoId(null)
    setModalAbierto(true)
  }

  function guardar() {
    const p = Number(form.prioridad)
    if (!form.nombre.trim() || !(p > 0)) return
    if (form.editandoId) {
      const saldoNum = Number(form.saldo)
      actualizarSobre(form.editandoId, {
        nombre: form.nombre.trim(),
        prioridad: p,
        color: form.color,
        icono: form.icono,
        ...(Number.isFinite(saldoNum) ? { saldoActual: Math.round(saldoNum) } : {}),
      })
    } else {
      agregarSobre({ nombre: form.nombre.trim(), color: form.color, icono: form.icono, prioridad: p })
    }
    setModalAbierto(false)
  }

  function archivar(sobre: Sobre) {
    archivarSobre(sobre.id)
    setMenuAbiertoId(null)
  }

  function eliminar(sobre: Sobre) {
    if (eliminarSobre(sobre.id)) setMenuAbiertoId(null)
  }

  return (
    <>
      <Header titulo="Gestión de sobres" />

      <div
        className={`mx-5 mt-4 mb-3 flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 ${
          prioridadesValidas ? 'bg-green-soft text-green' : 'bg-surface-2 text-ink-soft'
        }`}
      >
        {prioridadesValidas && <CheckIcon size={15} strokeWidth={2.4} />}
        <span className="text-[12.5px] font-semibold">
          Prioridades: {formatPorcentaje(sumaPrioridadesActivas)} asignado
        </span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 flex flex-col gap-2.5">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={activos.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {activos.map((sobre) => (
              <FilaSobre
                key={sobre.id}
                sobre={sobre}
                menuAbierto={menuAbiertoId === sobre.id}
                onToggleMenu={() =>
                  setMenuAbiertoId((prev) => (prev === sobre.id ? null : sobre.id))
                }
                onCerrarMenu={() => setMenuAbiertoId(null)}
                onEditar={() => abrirModalEditar(sobre)}
                onArchivar={() => archivar(sobre)}
                onEliminar={() => eliminar(sobre)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="shrink-0 border-t border-border bg-bg px-5 pb-6 pt-3.5">
        <Button
          variant="outline-green"
          className="w-full"
          icon={<PlusIcon size={16} />}
          onClick={abrirModalNuevo}
        >
          Agregar sobre
        </Button>
      </div>

      {modalAbierto && (
        <Modal
          titulo={form.editandoId ? 'Editar sobre' : 'Nuevo sobre'}
          onCerrar={() => setModalAbierto(false)}
        >
          <input
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            placeholder="Nombre del sobre"
            className="rounded-xl border border-border px-3 py-2.5 text-sm outline-none placeholder:text-ink-faint"
          />
          <div className="flex gap-2.5">
            <input
              type="number"
              value={form.prioridad}
              onChange={(e) => setForm((f) => ({ ...f, prioridad: e.target.value }))}
              placeholder="% prioridad"
              className="w-28 rounded-xl border border-border px-3 py-2.5 text-sm outline-none placeholder:text-ink-faint"
            />
            <select
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value as Sobre['color'] }))}
              className="flex-1 rounded-xl border border-border px-3 py-2.5 text-sm outline-none"
            >
              <option value="green">Verde</option>
              <option value="celeste">Celeste</option>
            </select>
          </div>
          <div className="flex gap-2">
            {ICONOS_DISPONIBLES.map((ic) => {
              const IconoOpcion = iconoDeSobre(ic)
              return (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, icono: ic }))}
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    form.icono === ic ? 'bg-green text-surface' : 'bg-surface-2 text-ink-soft'
                  }`}
                >
                  <IconoOpcion size={16} />
                </button>
              )
            })}
          </div>
          {form.editandoId && (
            <div className="flex flex-col gap-1.5 border-t border-border pt-3.5">
              <label className="text-[12.5px] font-semibold text-ink-soft">
                Corregir saldo actual
              </label>
              <input
                type="number"
                value={form.saldo}
                onChange={(e) => setForm((f) => ({ ...f, saldo: e.target.value }))}
                placeholder="0"
                className="rounded-xl border border-border px-3 py-2.5 text-sm outline-none placeholder:text-ink-faint"
              />
              <div className="text-[11px] text-ink-faint">
                Cambia el monto directamente sin registrarlo como movimiento — úsalo para
                corregir un error o reflejar dinero movido entre sobres.
              </div>
            </div>
          )}
          <div className="flex gap-2.5">
            <Button variant="outline-green" className="flex-1" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button variant="solid-green" className="flex-1" onClick={guardar}>
              Guardar
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
