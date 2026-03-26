"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useState } from "react";
import { useLogin } from "@/lib/queries/auth";
import { toast } from "sonner";
import FormError from "../ui/FormError";
import { handleError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  email: z.email("Invalid Email Address"),
  password: z.string().min(8, "Password must be 8 characters long"),
});

type FormSchema = z.infer<typeof formSchema>;

const LoginForm = () => {
  const loginMutation = useLogin();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",

      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.data.message);
        if (res.data.twoFaRequired === true) {
          router.replace("/verify-2fa");
        } else {
          router.push("/dashboard");
        }
      },
      onError: (err) => {
        console.log(err);
        toast.error(handleError(err));
        setServerError(handleError(err));
      },
    });
  };

  const [serverError, setServerError] = useState("");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-2xl"
    >
      <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
        Login to your account
      </h2>
      {serverError && <FormError message={serverError} />}
      <p className="text-sm text-gray-500 mb-4">
        Please fill in the details below to log in.
      </p>

      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        {...register("password")}
        error={errors.password?.message}
        type={showPassword ? "text" : "password"}
        icon={
          showPassword ? (
            <EyeOffIcon
              onClick={() => setShowPassword(!showPassword)}
              className="w-4 h-4 "
            />
          ) : (
            <EyeIcon
              onClick={() => setShowPassword(!showPassword)}
              className="w-4 h-4 "
            />
          )
        }
      />

      <Button
        isLoading={loginMutation.isPending}
        type="submit"
        className="w-full"
      >
        Login
      </Button>

      {/* Divider */}
      <div className="flex items-center my-4 ">
        <div className="grow border-t border-gray-300"></div>
        <span className="text-gray-500 text-sm">Or</span>
        <div className="grow border-t border-gray-300"></div>
      </div>

      {/* Social login — brand logos */}
      <div className="flex flex-col gap-3">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:focus-visible:ring-zinc-500"
          aria-label="Sign in with Google"
        >
          <Image
            src="/oauth/google.svg"
            alt=""
            width={22}
            height={22}
            className="shrink-0"
            unoptimized
          />
          <span>Sign in with Google</span>
        </a>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#24292f] bg-[#24292f] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f2328] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Sign in with GitHub"
          onClick={() => {
            const redirect = encodeURIComponent(
              `${window.location.origin}/profile`,
            );
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github?redirect_uri=${redirect}`;
          }}
        >
          <Image
            src="/oauth/github.svg"
            alt=""
            width={22}
            height={22}
            className="shrink-0"
            unoptimized
          />
          <span>Sign in with GitHub</span>
        </button>
      </div>

      {/* Navigation is handled by AuthWrapper mini-navbar */}
    </form>
  );
};

export default LoginForm;
