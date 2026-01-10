"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Loader2,
} from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialValues?: TaskFormValues;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  submitLabel?: string;
}

export function TaskForm({ initialValues, onSubmit, submitLabel = "Save task" }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialValues ?? { title: "", description: "" },
  });

  const [error, setError] = useState<string | null>(null);

  const submitHandler = async (values: TaskFormValues) => {
    setError(null);
    try {
      await onSubmit(values);
      reset();
    } catch (err: any) {
      setError(err.message || "Failed to save task");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          type="text"
          placeholder="e.g. Finish report"
          {...register("title")}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive flex items-center gap-1"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.title.message}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description">Description <span className="text-muted-foreground">(optional)</span></Label>
        <Textarea
          id="task-description"
          placeholder="Optional details..."
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive flex items-center gap-1"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.description.message}
          </motion.p>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-start gap-2"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
