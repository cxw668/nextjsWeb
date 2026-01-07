'use client'

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { deleteUser, updateUser } from "@/app/actions";
import { Edit2, Trash2, X, Check } from "lucide-react";

interface UserActionsProps {
  user: {
    id: number;
    name: string | null;
    hobby: string | null;
  };
}

export function UserActions({ user }: UserActionsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [hobby, setHobby] = useState(user.hobby || "");

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    startTransition(async () => {
      const result = await deleteUser(user.id);
      if (result.success) {
        toast({
          title: "Deleted",
          description: "User has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete user",
          variant: "destructive",
        });
      }
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("hobby", hobby);

    startTransition(async () => {
      const result = await updateUser(user.id, formData);
      if (result.success) {
        setIsEditing(false);
        toast({
          title: "Updated",
          description: "User updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update user",
          variant: "destructive",
        });
      }
    });
  };

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="flex flex-col gap-2 mt-2 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-md border border-zinc-200 dark:border-zinc-700">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor={`edit-name-${user.id}`} className="text-[10px] uppercase text-zinc-500">Name</Label>
            <Input
              id={`edit-name-${user.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-sm"
              placeholder="Name"
              required
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={`edit-hobby-${user.id}`} className="text-[10px] uppercase text-zinc-500">Hobby</Label>
            <Input
              id={`edit-hobby-${user.id}`}
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              className="h-8 text-sm"
              placeholder="Hobby"
              disabled={isPending}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
            disabled={isPending}
            className="h-8 px-2"
          >
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="h-8 px-2"
          >
            <Check className="w-4 h-4 mr-1" /> {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsEditing(true)}
        className="text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400"
        title="Edit User"
      >
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDelete}
        className="text-zinc-500 hover:text-red-600 dark:hover:text-red-400"
        title="Delete User"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
