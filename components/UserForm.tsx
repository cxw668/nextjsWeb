'use client'

import { FormEvent, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { addUser } from "@/app/actions";

export function UserForm() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    startTransition(async () => {
      const result = await addUser(formData)
      
      if (result.success) {
        toast({
          title: "Success",
          description: `User added successfully!`,
        })
        form.reset()
      } else {
        toast({
          title: "Error",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="please enter your name" required disabled={isPending} />
      </div>
      <div className="flex gap-2">
        <Button type="reset" variant="outline" className="flex-1" disabled={isPending}>Reset</Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Adding..." : "Add User"}
        </Button>
      </div>
    </form>
  )
}
