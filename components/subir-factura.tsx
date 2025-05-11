"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { processReceipt } from "@/app/actions"

export function SubirFactura() {
  const [step, setStep] = useState<"upload" | "processing">("upload")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async () => {
    if (file && preview) {
      setStep("processing")

      try {
        // Procesar la imagen con OpenAI
        const result = await processReceipt(preview)

        if (result.success) {
          router.push("/validar-datos")
        } else {
          // En caso de error, también redirigimos a validar datos
          // pero podríamos mostrar un mensaje de error
          router.push("/validar-datos")
        }
      } catch (error) {
        console.error("Error processing receipt:", error)
        router.push("/validar-datos")
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Atrás</span>
        </Button>
        <h1 className="text-xl font-medium ml-2">Nueva factura</h1>
      </header>

      {/* Body */}
      <main className="flex-1 p-4 flex flex-col items-center justify-center">
        {step === "upload" ? (
          <div className="w-full max-w-md">
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center h-[200px] mb-4"
              style={{
                backgroundImage: preview ? `url(${preview})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!preview && (
                <>
                  <Upload className="h-10 w-10 text-slate-400 mb-2" />
                  <p className="text-center text-slate-500 mb-2">Arrastra y suelta tu factura aquí</p>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input type="file" id="receipt" accept="image/*" className="hidden" onChange={handleFileChange} />
              <label htmlFor="receipt">
                <Button className="w-full" variant="outline" asChild>
                  <span>Seleccionar imagen</span>
                </Button>
              </label>
              {file && <Button onClick={handleSubmit}>Procesar factura</Button>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-lg font-medium">Procesando con IA...</p>
            <p className="text-sm text-slate-500 mt-2">Estamos extrayendo los datos de tu factura</p>
          </div>
        )}
      </main>
    </div>
  )
}
