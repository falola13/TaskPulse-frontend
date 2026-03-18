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
      <h2 className="text-2xl font-bold mb-2 text-white">
        Login into your Account
      </h2>
      {serverError && <FormError message={serverError} />}
      <p className="text-sm text-gray-500 mb-4">
        Please fill in the details below to login into your account
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

      {/* Social Login Buttons */}
      <div className="flex flex-col space-y-2">
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
          <Button type="button" className="bg-red-500 hover:bg-red-600 w-full">
            Login with Google
          </Button>
        </a>
        <Button
          type="button"
          className="bg-black hover:bg-gray-800 w-full"
          onClick={() => {
            const redirect = encodeURIComponent(
              `${window.location.origin}/profile`,
            );
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github?redirect_uri=${redirect}`;
          }}
        >
          Login with Github
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
