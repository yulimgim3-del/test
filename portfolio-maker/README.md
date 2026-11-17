# Portfolio Maker

정보를 입력하면 실시간 미리보기로 웹 포트폴리오를 만들고 HTML 파일로 저장할 수 있는 포트폴리오 제작 도구입니다.

## 주요 기능

- 프로필, 이력, 기술, 연락처 실시간 미리보기
- 프로젝트 추가·수정·복제·정렬·공개 설정
- 색상, 글꼴, 크기, 자간, 행간을 포함한 테마 편집
- 작성 진행률과 발표용 샘플 데이터
- Gemini 기반 자기소개 및 프로젝트 서술 다듬기
- 브라우저 자동 저장과 이미지 최적화
- 관리 UI를 제외한 독립 HTML 파일 다운로드
- 반응형 화면과 키보드 접근성

## 실행 방법

1. `.env.example`을 `.env.local`로 복사합니다.
2. `.env.local`의 `GEMINI_API_KEY`에 Google AI Studio API 키를 입력합니다.
3. Node.js가 설치된 환경에서 아래 명령을 실행합니다.

```powershell
cd portfolio-maker
node server.mjs
```

4. 브라우저에서 <http://127.0.0.1:4173>을 엽니다.

Gemini API 키는 서버에서만 사용되며 `.env.local`은 Git에 업로드되지 않습니다.

## 공개 배포

Vercel에 프로젝트를 연결한 뒤 환경 변수 `GEMINI_API_KEY`를 등록하면 정적 화면과 `api/gemini.mjs` 서버리스 함수가 함께 배포됩니다. API 키는 공개 JavaScript에 포함되지 않습니다.

## 기술 구성

HTML, CSS, JavaScript, Node.js 내장 HTTP 서버, Gemini API, LocalStorage, Canvas API를 사용했습니다. 외부 런타임 패키지는 필요하지 않습니다.
