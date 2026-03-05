"use client";

import { useState } from "react";
import type { Tables } from "@/lib/database.types";
import { updateProfile } from "./actions";

type Profile = Tables<"profiles">;

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setMessage(null);

    const result = await updateProfile(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "프로필이 업데이트되었습니다!" });
      setIsEditing(false);
    }

    setIsLoading(false);
  }

  return (
    <div className="max-w-2xl">
      {message && (
        <div
          className={`mb-4 p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          {/* 전체 이름 */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium mb-2"
            >
              전체 이름
            </label>
            {isEditing ? (
              <input
                type="text"
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name || ""}
                className="w-full px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="px-3 py-2 bg-muted rounded-md">
                {profile.full_name || "설정되지 않음"}
              </p>
            )}
          </div>

          {/* 자기소개 */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              자기소개
            </label>
            {isEditing ? (
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={profile.bio || ""}
                className="w-full px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="px-3 py-2 bg-muted rounded-md min-h-[100px]">
                {profile.bio || "설정되지 않음"}
              </p>
            )}
          </div>

          {/* 연락처 */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              연락처
            </label>
            {isEditing ? (
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={profile.phone || ""}
                className="w-full px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="px-3 py-2 bg-muted rounded-md">
                {profile.phone || "설정되지 않음"}
              </p>
            )}
          </div>

          {/* 주소 */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              주소
            </label>
            {isEditing ? (
              <input
                type="text"
                id="address"
                name="address"
                defaultValue={profile.address || ""}
                className="w-full px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="px-3 py-2 bg-muted rounded-md">
                {profile.address || "설정되지 않음"}
              </p>
            )}
          </div>

          {/* 생년월일 */}
          <div>
            <label
              htmlFor="date_of_birth"
              className="block text-sm font-medium mb-2"
            >
              생년월일
            </label>
            {isEditing ? (
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                defaultValue={profile.date_of_birth || ""}
                className="w-full px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="px-3 py-2 bg-muted rounded-md">
                {profile.date_of_birth || "설정되지 않음"}
              </p>
            )}
          </div>

          {/* 성별 */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-2">
              성별
            </label>
            {isEditing ? (
              <select
                id="gender"
                name="gender"
                defaultValue={profile.gender || ""}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">선택 안 함</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="other">기타</option>
                <option value="prefer_not_to_say">응답하지 않음</option>
              </select>
            ) : (
              <p className="px-3 py-2 bg-muted rounded-md">
                {profile.gender === "male"
                  ? "남성"
                  : profile.gender === "female"
                    ? "여성"
                    : profile.gender === "other"
                      ? "기타"
                      : profile.gender === "prefer_not_to_say"
                        ? "응답하지 않음"
                        : "설정되지 않음"}
              </p>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? "저장 중..." : "저장"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setMessage(null);
                }}
                disabled={isLoading}
                className="px-4 py-2 border rounded-md hover:bg-muted disabled:opacity-50"
              >
                취소
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              수정
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
