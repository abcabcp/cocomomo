# 🌊 Cocomomo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)



## 프로젝트 소개

Nextjs의 실험 기능과 Three.js 기반 인터랙티브 학습, 에디터 아키텍처를 구현하기 위해 만든 포트폴리오 프로젝트입니다.
<br /><br />
[바로가기](https://coco-momo.com/)

---

## 주요 기능

### 실시간 바다 셰이더
- **시간대별 조명 시스템** - 새벽, 일출, 아침, 오후, 일몰, 밤 6가지 시간대
- **커스텀 GLSL 셰이더** 
- **성능 최적화** - 적응형 DPR과 Intersection Observer 활용

### Bloom Studio (3D 정원 에디터)
[상세 문서](./docs/BLOOM_STUDIO_ARCHITECTURE.md)

- **실행 취소/다시 실행** - Command Pattern으로 구현 (Cmd/Ctrl+Z)
- **인터랙티브 배치** - 클릭이나 드래그로 꽃과 나무 배치
- **씬 저장/불러오기** - LocalStorage를 활용한 데이터 영속성
- **동적 조명** - 시간대별 실시간 조명 변화
- **스크린샷 캡처** - 만든 정원을 PNG로 저장

### UI
- **Snap Scroll Picker** - 시간 선택 인터페이스
- **크기 조절 가능한 모달** - 드래그로 이동 및 크기 조절
- **View Transitions** - Next.js View Transitions API로 부드러운 페이지 전환
- **Parallel Routes** - Next.js App Router의 모달 라우팅
- **Dock 메뉴** - macOS 스타일의 드래그 앤 드롭 메뉴
---

## Stack

### Core
- **Next.js 15.5** 
- **React 19** 
- **TypeScript 5** 

### 3D / Graphics
- **React Three Fiber 9** 
- **Three.js 0.177** 
- **@react-three/drei 10** 
- **GLSL Shaders** 

### State Management
- **Zustand 5** 
- **TanStack Query 5** 
- **TanStack Form** 

### UI & Animation
- **Tailwind CSS 4** 
- **Framer Motion 12** 
- **GSAP 3** 
- **next-view-transitions** 

### Development Tools
- **Biome** 
- **Storybook 8** 
- **Orval** 
- **Sharp** 
- **obj2gltf & gltf-pipeline** 

---

## 프로젝트 구조

```
cocomomo/
├── app/                    
│   ├── @modal/           
│   ├── bloom-studio/     
│   └── page.tsx          
├── bloom-studio/         
│   ├── core/              
│   ├── application/       
│   ├── infrastructure/    
│   └── presentation/     
├── features/              
│   ├── cocomomo/          
│   ├── blog/              
│   ├── foto/              
│   └── garden/            
├── widgets/               
├── shared/                
├── entities/              
├── docs/                  
│   └── BLOOM_STUDIO_ARCHITECTURE.md
└── scripts/               
```

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다 [LICENSE](./LICENSE)
