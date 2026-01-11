'use client'

import { useState, useEffect } from "react"
import { trpc } from "@/utils/trpc"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"

import Uppy from '@uppy/core'
import Dashboard from '@uppy/react/dashboard'
import Tus from '@uppy/tus'

import '@uppy/core/css/style.min.css'
import '@uppy/dashboard/css/style.min.css'

export function ImageUpload() {
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const [mounted, setMounted] = useState(false)
  
  const [uppy] = useState(() => 
    new Uppy({
      id: 'image-upload',
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
    }).use(Tus, {    
      endpoint: '/api/upload',
      chunkSize: 5 * 1024 * 1024, // 5MB chunks
    })
  )

  useEffect(() => {
    setMounted(true)
    
    uppy.on('complete', (result) => {
      if (result.successful && result.successful.length > 0) {
        toast({
          title: "Success",
          description: "Image uploaded successfully via Tus",
        })
        utils.image.list.invalidate()
        uppy.cancelAll() // Clear the dashboard after success
      }
      
      if (result.failed && result.failed.length > 0) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        })
      }
    })

    return () => {
      uppy.clear()
    }
  }, [uppy, toast, utils])

  const { data: images, isLoading: loadingImages } = trpc.image.list.useQuery()

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center w-full p-6 gap-8">
      <div className="w-full max-w-2xl bg-card rounded-xl border p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Upload New Image (Tus Optimized)
        </h2>
        
        <Dashboard 
          uppy={uppy}
          width="100%"
          height={350}
          hideProgressDetails={false}
          note="Images only, up to 1 file"
        />
      </div>

      <div className="w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">Uploaded Images</h3>
        {loadingImages ? (
          <div className="flex justify-center p-8">
            <span className="animate-spin mr-2">⏳</span> Loading...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images?.map((image) => (
              <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden border bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={`data:${image.type};base64,${image.data}`}
                  alt={image.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  <p className="text-white text-xs truncate font-medium">{image.name}</p>
                  <p className="text-white/70 text-[10px]">{(image.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
            {images?.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-8 border rounded-lg border-dashed">
                No images uploaded yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
