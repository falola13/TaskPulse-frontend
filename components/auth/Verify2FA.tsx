"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { handleError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import { useTwoFactor } from "@/lib/queries/auth";

const formSchema = z.object({
  code: z
    .string()
    .min(6, "Code must be at least 6 characters")
    .max(10, "Code must be at most 10 characters"),
});

type FormSchema = z.infer<typeof formSchema>;

const Verify2FA = () => {
  const router = useRouter();

  const { verifyMutation } = useTwoFactor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    verifyMutation.mutate(
      { code: data.code },
      {
        onSuccess: (res) => {
          toast.success(
            res.data.message || "Two-factor authentication verified",
          );
          router.push("/dashboard");
        },
        onError: (err) => {
          toast.error(handleError(err));
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4 py-10 text-white flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Verify Two-Factor Authentication
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Enter the 2FA code from your authenticator app to complete sign-in.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Authentication Code"
            type="text"
            {...register("code")}
            error={errors.code?.message}
            placeholder="e.g. 123 456"
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={verifyMutation.isPending}
          >
            Verify & Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Verify2FA;
