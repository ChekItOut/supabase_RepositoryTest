"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  // 사용자 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "인증되지 않은 사용자입니다." };
  }

  // FormData에서 값 추출
  const full_name = formData.get("full_name") as string;
  const bio = formData.get("bio") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const date_of_birth = formData.get("date_of_birth") as string;
  const gender = formData.get("gender") as string;

  // 프로필 업데이트
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: full_name || null,
      bio: bio || null,
      phone: phone || null,
      address: address || null,
      date_of_birth: date_of_birth || null,
      gender: gender || null,
    })
    .eq("id", user.id);

  if (error) {
    console.error("프로필 업데이트 오류:", error);
    return { error: "프로필 업데이트에 실패했습니다." };
  }

  // 페이지 재검증
  revalidatePath("/profile");

  return { success: true };
}
