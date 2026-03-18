"use client";

import { useTwoFactor } from "@/lib/queries/auth";
import { handleError } from "@/utils/errorHandler";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Button from "../ui/Button";
import { useQueryClient } from "@tanstack/react-query";

const Enable2FA = ({ isTwoFAEnabled }: { isTwoFAEnabled: boolean }) => {
  const queryClient = useQueryClient();
  const [qrCode, setQrCode] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const { generate2FAMutation, enable2FAMutation, disable2FAMutation } =
    useTwoFactor();
  const generateSecret = () => {
    generate2FAMutation.mutate(undefined, {
      onSuccess: (res) => {
        toast.success("Successfully generated 2FA");
        setQrCode(res.data.qrCode);
      },
      onError: (err) => {
        toast.error(handleError(err));
      },
    });
  };
  const enable2FA = () => {
    enable2FAMutation.mutate(
      { code: code },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          toast.success(res.data.message);
        },
        onError: (err) => {
          toast.error(handleError(err));
        },
      },
    );
  };
  const disable2FA = () => {
    disable2FAMutation.mutate(undefined, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success(res.data.message);
      },
      onError: (err) => {
        toast.error(handleError(err));
      },
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="">
        {isTwoFAEnabled ? "Disable" : "Enable"} Two-Factor Authentication
      </h1>

      {isTwoFAEnabled ? (
        <div className="text-green-500">
          <p className="text-xs">
            Two Factor Authentication is already enabled
          </p>
          <Button
            onClick={disable2FA}
            type="button"
            variant="danger"
            className="w-full mt-4"
          >
            {disable2FAMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Disable 2-Factor"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {!qrCode ? (
            <Button
              onClick={generateSecret}
              type="button"
              variant="primary"
              className="w-full"
            >
              Generate 2FA Secret
            </Button>
          ) : (
            <img src={qrCode} alt="2FA QR Code" />
          )}
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 2FA Code"
            className="w-full py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button type="button" className="mt-3" onClick={enable2FA}>
            {enable2FAMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Enable 2FA"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Enable2FA;
