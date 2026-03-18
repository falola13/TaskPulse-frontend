"use client";
import Enable2FA from "@/components/auth/Enable2FA";
import { useGetProfile } from "@/lib/queries/profile";
import Image from "next/image";
import React from "react";

const ProfilePage = () => {
  const { data: ProfileData, isLoading, error } = useGetProfile();
  const profile = ProfileData?.data.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
            Account
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile & Security
          </h1>
          <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
            Manage your personal information and keep your TaskPulse account
            secure with two‑factor authentication.
          </p>
        </header>

        {/* Loading & error states */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 animate-pulse rounded-full bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
                  <div className="h-3 w-44 animate-pulse rounded bg-slate-800" />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="h-3 w-full animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800" />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-800" />
              <div className="mt-4 space-y-3">
                <div className="h-3 w-full animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-800" />
                <div className="h-10 w-32 animate-pulse rounded-full bg-slate-800" />
              </div>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <p className="font-medium">Unable to load profile.</p>
            <p className="text-xs text-red-200/80">
              Please refresh the page or try again in a moment.
            </p>
          </div>
        )}

        {!isLoading && !error && profile && (
          <main className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
            {/* Profile card */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                  {profile.imageUrl ? (
                    <Image
                      src={profile.imageUrl}
                      alt={profile.firstName || profile.email || "Profile"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold uppercase text-slate-300">
                      {profile.firstName?.[0] || profile.email?.[0] || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-sm text-slate-400">{profile.email}</p>
                  <p className="mt-2 inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                    Active TaskPulse member
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Name
                  </p>
                  <p className="mt-1 text-sm text-slate-100">
                    {profile.firstName} {profile.lastName}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 break-all text-sm text-slate-100">
                    {profile.email}
                  </p>
                </div>
              </div>
            </section>

            {/* Security / 2FA card */}
            <section className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Security
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Add an extra layer of protection with two‑factor
                  authentication to keep your workspace safe.
                </p>
              </div>

              <div className="mt-2 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                <Enable2FA isTwoFAEnabled={profile.isTwoFAEnabled} />
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
