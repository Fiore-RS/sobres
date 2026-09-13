import { useRef, useState } from 'react'
import { useSobresStore } from '../lib/store'
import { respaldoValido } from '../lib/storage'
import { Header } from '../assets/components/organisms/Header'
import { DownloadIcon, UploadIcon } from '../assets/components/atoms/Icon'
import { Modal } from '../assets/components/atoms/Modal'
import { Button } from '../assets/components/atoms/Button'

function formatearFechaRelativa(timestamp?: number): string {
  if (!timestamp) return 'Todavía no hiciste ningún respaldo'
  const dias = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000))
  if (dias <= 0) return 'Último respaldo: hoy'
  if (dias === 1) return 'Último respaldo: hace 1 día'
  return `Último respaldo: hace ${dias} días`
}

const OPCIONES_TEMA = [
  ['claro', 'Claro'],
  ['oscuro', 'Oscuro'],
  ['sistema', 'Sistema'],
] as const

export function Configuracion() {
  const { exportarRespaldo, importarRespaldo, ultimoRespaldo, reiniciarRegistro, tema, setTema } =
    useSobresStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmarReinicioAbierto, setConfirmarReinicioAbierto] = useState(false)

  function confirmarReinicio() {
    reiniciarRegistro()
    setConfirmarReinicioAbierto(false)
  }

  function exportar() {
    const respaldo = exportarRespaldo()
    const blob = new Blob([JSON.stringify(respaldo, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sobres-respaldo-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function elegirArchivoImportar() {
    inputRef.current?.click()
  }

  async function onArchivoSeleccionado(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const texto = await file.text()
      const data = JSON.parse(texto)
      if (!respaldoValido(data)) {
        alert('Ese archivo no tiene el formato de un respaldo de Sobres.')
        return
      }
      const confirmado = confirm(
        'Importar este respaldo reemplaza por completo tus datos actuales. ¿Continuar?',
      )
      if (confirmado) importarRespaldo(data)
    } catch {
      alert('No se pudo leer ese archivo.')
    }
  }

  return (
    <>
      <Header titulo="Configuración" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <div className="text-[12.5px] text-ink-faint">Apariencia</div>
          <div className="flex gap-2">
            {OPCIONES_TEMA.map(([valor, etiqueta]) => (
              <button
                key={valor}
                type="button"
                onClick={() => setTema(valor)}
                className={`flex-1 rounded-full px-3.5 py-2 text-[12.5px] ${
                  tema === valor
                    ? 'bg-green font-semibold text-surface'
                    : 'border border-border bg-surface font-medium text-ink-soft'
                }`}
              >
                {etiqueta}
              </button>
            ))}
          </div>
          <div className="px-0.5 text-[11.5px] text-ink-faint">
            "Sistema" sigue el modo claro/oscuro configurado en tu teléfono o navegador.
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-2.5">
          <div className="text-[12.5px] text-ink-faint">Respaldo</div>

          <button
            type="button"
            onClick={exportar}
            className="flex items-center gap-3 rounded-2xl border-[1.5px] border-green px-4 py-3.5 text-green"
          >
            <UploadIcon size={17} />
            <span className="text-sm font-semibold">Exportar respaldo</span>
          </button>

          <button
            type="button"
            onClick={elegirArchivoImportar}
            className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5"
          >
            <DownloadIcon size={17} />
            <span className="text-sm font-semibold">Importar respaldo</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={onArchivoSeleccionado}
          />

          <div className="px-0.5 text-[11.5px] text-ink-faint">
            Importar reemplaza por completo tus datos actuales. Se te va a pedir confirmación
            antes de continuar.
          </div>
          <div className="px-0.5 text-[11.5px] text-ink-faint">
            {formatearFechaRelativa(ultimoRespaldo)}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-2.5">
          <div className="text-[12.5px] text-ink-faint">Zona de peligro</div>

          <button
            type="button"
            onClick={() => setConfirmarReinicioAbierto(true)}
            className="flex items-center gap-3 rounded-2xl border-[1.5px] border-red-400 px-4 py-3.5 text-red-500"
          >
            <span className="text-sm font-semibold">Reiniciar registro</span>
          </button>

          <div className="px-0.5 text-[11.5px] text-ink-faint">
            Borra todos los movimientos y deja los sobres en ₡0, sin tocar sus nombres,
            prioridades ni colores. Útil si los datos actuales son de prueba.
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-2.5">
          <div className="text-[12.5px] text-ink-faint">Acerca de</div>
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4.5">
            <div className="font-display font-semibold text-base text-green">Sobres</div>
            <div className="text-[13px] leading-relaxed text-ink-soft">
              Guía visual para repartir tus ingresos por sobres, según tus propias
              prioridades. No se conecta a tu banco ni a ninguna cuenta — todos los datos
              quedan en este dispositivo.
            </div>
            <div className="mt-1 text-[11.5px] text-ink-faint">v0.1 &middot; MVP</div>
          </div>
        </div>
      </div>

      {confirmarReinicioAbierto && (
        <Modal
          titulo="¿Reiniciar registro?"
          onCerrar={() => setConfirmarReinicioAbierto(false)}
        >
          <div className="text-sm leading-relaxed text-ink-soft">
            Esto borra todo el historial de movimientos y deja el saldo de todos los sobres
            en ₡0. Los sobres (nombres, prioridades, colores) se mantienen. Esta acción no
            se puede deshacer.
          </div>
          <div className="flex gap-2.5">
            <Button
              variant="outline-green"
              className="flex-1"
              onClick={() => setConfirmarReinicioAbierto(false)}
            >
              Cancelar
            </Button>
            <Button variant="solid-red" className="flex-1" onClick={confirmarReinicio}>
              Sí, reiniciar
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
