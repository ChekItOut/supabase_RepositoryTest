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
- **언어**: TypeScript (strict mode, target: ES2017)
- **런타임**: React 19
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth (쿠키 기반, supabase-ssr)
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui (new-york 스타일) + Radix UI
- **아이콘**: Lucide React
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
   - `proxy.ts`에서 미들웨어 설정 (루트의 `proxy()` 함수가 export됨)
   - **중요**: 각 요청마다 새 클라이언트 생성 (Fluid compute 호환성)
   - **보호된 라우트**: 인증되지 않은 사용자는 자동으로 `/auth/login`으로 리다이렉트
   - **matcher 패턴**: 정적 파일, 이미지, favicon은 미들웨어를 우회

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

**참고**:
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`는 Supabase의 새로운 publishable key 형식을 사용합니다
- Legacy anon key도 이 변수명과 호환됩니다
- Supabase 프로젝트의 API 설정에서 두 값을 모두 확인할 수 있습니다

## 개발 가이드라인

### Supabase 클라이언트 사용

- **Server Component**에서는 `lib/supabase/server.ts`의 `createClient()` 사용
- **Client Component**에서는 `lib/supabase/client.ts`의 `createClient()` 사용
- **Server Actions**에서는 `lib/supabase/server.ts`의 `createClient()` 사용
- **Middleware**에서는 `lib/supabase/proxy.ts`의 `updateSession()` 사용

**중요한 주의사항**:
- Server 클라이언트는 항상 함수 내에서 생성 (Fluid compute 호환성)
- 글로벌 변수에 Supabase 클라이언트를 저장하지 말 것
- Middleware에서 `createServerClient()`와 `supabase.auth.getClaims()` 사이에 다른 코드를 실행하지 말 것
  - 이를 위반하면 사용자가 무작위로 로그아웃될 수 있음

### 타입 안전성

- `lib/database.types.ts`의 타입 사용하여 Supabase 쿼리 타입 안전성 확보
- TypeScript strict mode 활성화됨
- path alias `@/*`를 사용하여 절대 경로로 import

### 스타일링

- Tailwind CSS utility classes 사용
- shadcn/ui 컴포넌트는 `components/ui/` 디렉토리에 위치
- `components.json`에 shadcn/ui 설정 정의됨:
  - 스타일: `new-york`
  - 베이스 컬러: `neutral`
  - CSS 변수 사용 (cssVariables: true)
  - 아이콘 라이브러리: `lucide`
- path alias: `@/components`, `@/lib`, `@/hooks` 등 사용 가능
- 다크 모드는 `next-themes`로 구현

### 인증 흐름

- 로그인/회원가입: `app/auth/` 디렉토리의 페이지 사용
- 세션 확인: `await supabase.auth.getUser()` 사용
- 로그아웃: `await supabase.auth.signOut()` 후 쿠키 정리
- **자동 보호**: 미들웨어(`proxy.ts`)가 인증되지 않은 사용자를 `/auth/login`으로 자동 리다이렉트
  - 예외: `/`, `/auth/*` 경로는 인증 없이 접근 가능
- 보호된 라우트는 레이아웃에서 추가 인증 확인 가능

## MCP 통합

프로젝트는 다음 MCP 서버와 통합되어 있습니다 (`.mcp.json`):

- **supabase**: Supabase 데이터베이스 직접 관리
- **playwright**: 브라우저 자동화 및 테스팅
- **shrimp-task-manager**: 작업 관리 시스템

## 전문 에이전트 시스템

프로젝트는 특화된 작업을 위한 여러 전문 에이전트를 제공합니다 (`.claude/agents/`):

### 개발 에이전트

- **development-planner**: ROADMAP.md 생성 및 관리
  - 한국어로 된 체계적인 로드맵 문서 작성
  - 구조 우선 접근법(Structure-First) 적용
  - PRD 기반 작업 분해 및 우선순위 설정
  - Playwright MCP를 활용한 테스트 체크리스트 포함

- **nextjs-app-developer**: Next.js App Router 구조 설계 전문가
  - 페이지 스캐폴딩 및 라우팅 시스템 구축
  - 레이아웃 아키텍처 설계
  - 병렬/인터셉트 라우트 구현
  - Next.js 15.5.3 App Router 모범 사례 적용

- **nextjs-production-optimizer**: Next.js 프로덕션 최적화
  - 스타터 템플릿을 프로덕션 환경으로 전환
  - 불필요한 보일러플레이트 제거
  - 성능 최적화 및 빌드 설정

### UI/UX 에이전트

- **ui-markup-specialist**: UI 마크업 전문가
  - Next.js, TypeScript, Tailwind CSS, Shadcn UI 사용
  - 정적 마크업과 스타일링에만 집중
  - 반응형 디자인 및 접근성 보장
  - 비즈니스 로직은 제외하고 순수 UI만 담당

### 문서 에이전트

- **prd-generator**: PRD(제품 요구사항 문서) 생성
  - 솔로 개발을 위한 실용적인 PRD 작성
  - 기능 명세 및 개발 계획 수립

- **prd-validator**: PRD 기술 검증
  - PRD의 기술적 타당성 검증
  - 구현 복잡도 및 리스크 분석

### 통합 에이전트

- **notion-api-expert**: Notion API 통합 전문가
  - Notion 데이터베이스 CRUD 작업
  - Next.js와 Notion CMS 연동
  - 타입 안전한 API 통합 구현

- **error-killer**: 로그 및 에러 분석 전문가
  - 에러 로그 체계적 분석
  - 근본 원인 파악 및 해결책 제시

## Claude Code Hooks

프로젝트는 Claude Code 이벤트에 반응하는 훅을 제공합니다 (`.claude/hooks/`):

### notification-hook.sh
- **실행 시점**: Claude Code가 권한 요청이나 사용자 입력을 대기할 때
- **기능**: Slack으로 알림 전송
- **설정**: `.env` 파일에 `SLACK_WEBHOOK_URL` 필요

### stop-hook.sh
- **실행 시점**: Claude Code가 응답을 완료했을 때
- **기능**: Slack으로 작업 완료 알림 전송
- **설정**: `.env` 파일에 `SLACK_WEBHOOK_URL` 필요

**환경 변수 설정 예시**:
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

## 개발 가이드 문서

프로젝트는 상세한 개발 가이드를 제공합니다 (`docs/guides/`):

### project-structure.md
- 폴더 구조 및 파일 조직 규칙
- 파일/폴더 네이밍 컨벤션
- 경로 별칭 (Path Aliases) 사용법
- 코드 조직 베스트 프랙티스

### styling-guide.md
- TailwindCSS v4 사용 규칙
- shadcn/ui 컴포넌트 활용법
- 다크모드 구현 가이드
- 반응형 디자인 패턴
- 색상 시스템 및 CSS 변수

### component-patterns.md
- 재사용 가능한 컴포넌트 패턴
- 컴포넌트 구조화 방법

### forms-react-hook-form.md
- React Hook Form 사용 가이드
- 폼 유효성 검사 패턴

### nextjs-15.md
- Next.js 15 전문 가이드
- App Router 최신 기능 활용법

### 작업완료 체크리스트
```bash
npm run check-all # 모든 검사 통과 확인
npm run build # 빌드 성공 확인
```