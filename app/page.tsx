'use client'
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useToast } from "@/components/ui/use-toast";
export default function Home() {
  const { toast } = useToast()
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name")
    const message = formData.get("message")
    
    toast({
      title: "Success",
      description: `Hello ${name}, your message has been sent!`,
    })
  }
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
      <Label htmlFor="name">Name</Label>
      <Input id="name" name="name" placeholder="please enter your name" required />
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" name="message" placeholder="please enter your message" required />
      <div className="flex gap-2">
        <Button type="reset" variant="outline" className="flex-1">Reset</Button>
        <Button type="submit" className="flex-1">Submit</Button>
      </div>
     </form>
    </div>
  );
}
