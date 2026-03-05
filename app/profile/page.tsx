import { Suspense } from "react";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { ProfileForm } from "./profile-form";

async function ProfileData() {
  const supabase = await createClient();

  // 사용자 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 프로필 데이터 조회
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return <div>프로필을 찾을 수 없습니다.</div>;
  }

  return <ProfileForm profile={profile} />;
}

export default function ProfilePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1 className="font-bold text-3xl mb-4">프로필</h1>
        <p className="text-muted-foreground">
          프로필 정보를 확인하고 수정할 수 있습니다.
        </p>
      </div>

      <Suspense fallback={<div>프로필 로딩 중...</div>}>
        <ProfileData />
      </Suspense>
    </div>
  );
}
