"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useState } from "react";
import { useRegister } from "@/lib/queries/auth";
import { toast } from "sonner";
import FormError from "../ui/FormError";
import { handleError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    email: z.email("Invalid Email Address"),
    firstName: z.string().min(2, "First Name is required"),
    lastName: z.string().min(2, "Last Name is required"),
    password: z.string().min(8, "Password must be 8 characters long"),
    confirmPassword: z.string().min(2, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const registerMutation = useRegister();
  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    registerMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.data.message);
        router.push("/dashboard");
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
      <h2 className="text-2xl font-bold mb-2 ">Create your Account</h2>
      {serverError && <FormError message={serverError} />}
      <p className="text-sm text-gray-500 mb-4">
        Please fill in the details below to create your account
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
        <Input
          label="First Name"
          type="text"
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <Input
          label="Last Name"
          type="text"
          {...register("lastName")}
          error={errors.lastName?.message}
        />
      </div>
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Input
        label="Confirm Password"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Button
        isLoading={registerMutation.isPending}
        type="submit"
        className="w-full"
      >
        {registerMutation.isPending ? "Creating Account..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;
