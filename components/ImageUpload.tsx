'use client'

import { useState, useRef } from "react"
import { trpc } from "@/utils/trpc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload, ImageIcon, Loader2, FileImage } from "lucide-react"

export function ImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  
  const utils = trpc.useUtils()
  const uploadMutation = trpc.image.upload.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
      setFile(null)
      setPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      utils.image.list.invalidate()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setUploading(false)
    }
  })

  const { data: images, isLoading: loadingImages } = trpc.image.list.useQuery()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file || !preview) return

    setUploading(true)
    try {
      // Remove the prefix (data:image/png;base64,) from the base64 string
      const base64Data = preview.split(",")[1]
      
      await uploadMutation.mutateAsync({
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64Data,
      })
    } catch (error) {
      console.error("Upload error:", error)
    }
  }

  return (
    <div className="flex justify-center items-center w-full p-6">
      <div className="max-w-125 bg-card rounded-xl border p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Upload New Image
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="image-upload">Select Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="cursor-pointer"
              />
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload to Database
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center border-2 p-4">
            {preview ? (
              <div className="">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">No preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ml-5 space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FileImage className="w-5 h-5" />
          Uploaded Images ({images?.length || 0})
        </h3>
        
        {loadingImages ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : images && images.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col w-[80px] h-[110px]">
                <div className="w-[80px] h-[80px] relative overflow-hidden bg-muted">
                  <img
                    src={`data:${img.type};base64,${img.data}`}
                    alt={img.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="text-[10px] bg-background border-t h-[30px] flex flex-col justify-center">
                  <p className="font-medium truncate leading-tight" title={img.name}>{img.name}</p>
                  <p className="text-muted-foreground text-[8px] leading-tight">{(img.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">No images uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
