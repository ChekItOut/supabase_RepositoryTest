# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js와 Supabase를 사용하는 풀스택 웹 애플리케이션입니다. 쿠키 기반 인증을 통해 Server Components, Client Components, Server Actions, Route Handlers 전반에서 사용자 세션을 사용할 수 있습니다.

## 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

## 기술 스택

- **프레임워크**: Next.js 15+ (App Router)
- **언어**: TypeScript (strict mode)
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth (쿠키 기반, supabase-ssr)
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui + Radix UI
- **테마**: next-themes (다크/라이트 모드)
- **폰트**: Geist Sans

## 아키텍처

### Supabase 클라이언트 생성 패턴

프로젝트는 세 가지 Supabase 클라이언트 패턴을 사용합니다:

1. **Server Components** (`lib/supabase/server.ts`):
   - `createClient()` 함수를 사용하여 서버 컴포넌트에서 Supabase 접근
   - 쿠키를 통한 세션 관리
   - **중요**: 각 함수 내에서 새 클라이언트를 생성해야 함 (글로벌 변수 사용 금지)

2. **Client Components** (`lib/supabase/client.ts`):
   - `createClient()` 함수를 사용하여 클라이언트 컴포넌트에서 Supabase 접근
   - 브라우저에서 실행

3. **Middleware/Proxy** (`lib/supabase/proxy.ts`):
   - `updateSession()` 함수로 모든 요청에서 세션 갱신
   - `proxy.ts`에서 미들웨어 설정

### 디렉토리 구조

- `app/`: Next.js App Router 페이지 및 레이아웃
  - `auth/`: 인증 관련 페이지 (로그인, 회원가입, 비밀번호 재설정)
  - `profile/`: 사용자 프로필 관리 (Server Actions 사용)
  - `protected/`: 인증이 필요한 보호된 페이지
  - `instruments/`: 악기 관련 페이지
- `lib/`: 유틸리티 및 공유 로직
  - `supabase/`: Supabase 클라이언트 설정
  - `database.types.ts`: Supabase 데이터베이스 타입 정의
- `components/`: 재사용 가능한 React 컴포넌트
  - `ui/`: shadcn/ui 컴포넌트
  - `auth-*`: 인증 관련 컴포넌트
- `proxy.ts`: 세션 갱신을 위한 미들웨어 설정

### 데이터베이스 스키마

- `profiles` 테이블: 사용자 프로필 정보
  - `id` (UUID, auth.users 외래 키)
  - `full_name`, `bio`, `phone`, `address`, `date_of_birth`, `gender`
  - `created_at`, `updated_at`

### Server Actions

- Server Actions는 `"use server"` 지시어를 사용
- `app/profile/actions.ts`: 프로필 업데이트 예제
- `revalidatePath()`를 사용하여 캐시 무효화

## 환경 변수

`.env.local` 파일에 다음 변수 필요:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## 개발 가이드라인

### Supabase 클라이언트 사용

- **Server Component**에서는 `lib/supabase/server.ts`의 `createClient()` 사용
- **Client Component**에서는 `lib/supabase/client.ts`의 `createClient()` 사용
- **Server Actions**에서는 `lib/supabase/server.ts`의 `createClient()` 사용
- Server 클라이언트는 항상 함수 내에서 생성 (Fluid compute 호환성)

### 타입 안전성

- `lib/database.types.ts`의 타입 사용하여 Supabase 쿼리 타입 안전성 확보
- TypeScript strict mode 활성화됨
- path alias `@/*`를 사용하여 절대 경로로 import

### 스타일링

- Tailwind CSS utility classes 사용
- shadcn/ui 컴포넌트는 `components/ui/` 디렉토리에 위치
- `components.json`에 shadcn/ui 설정 정의됨
- 다크 모드는 `next-themes`로 구현

### 인증 흐름

- 로그인/회원가입: `app/auth/` 디렉토리의 페이지 사용
- 세션 확인: `await supabase.auth.getUser()` 사용
- 로그아웃: `await supabase.auth.signOut()` 후 쿠키 정리
- 보호된 라우트는 레이아웃에서 인증 확인

## MCP 통합

프로젝트는 다음 MCP 서버와 통합되어 있습니다 (`.mcp.json`):

- **supabase**: Supabase 데이터베이스 직접 관리
- **playwright**: 브라우저 자동화 및 테스팅
- **shrimp-task-manager**: 작업 관리 시스템
