# Bloom Studio 아키텍처

3D 정원 에디터의 설계 및 구현 방식

---

## 아키텍처 개요

**Clean Architecture** 

```
bloom-studio/
├── core/              # 도메인 로직 (타입, 서비스, 이벤트)
├── application/       # 유스케이스 (훅, 커맨드, Facade)
├── infrastructure/    # 외부 의존성 (3D 로더, 캐시)
└── presentation/      # UI 컴포넌트 (React, Canvas)
```

**의존성 방향**: `presentation → application → core`

---

## 핵심 레이어

### 1. Core (도메인)

**타입 정의** (`core/types/garden.types.ts`)
```typescript
// 배치된 오브젝트
interface PlacedObject {
  id: string;
  type: 'anemone' | 'crocus' | 'rose' | 'tree';
  position: [number, number, number];
  rotation: number;
  scale: number;
  color: string | null;
}

// 브러시 설정
interface BrushConfig {
  type: ObjectType | null;
  size: number;
  color: string | null;
}
```

**서비스** (`core/services/`)
- `ObjectService` - 오브젝트 생성 및 설정
- `SceneSerializer` - LocalStorage 저장/불러오기

**이벤트** (`core/events/DomainEventBus.ts`)
- 오브젝트 배치/삭제/씬 저장 등의 도메인 이벤트 발행

---

### 2. Application (유스케이스)

**주요 훅**

`useGardenEditor` - 에디터 핵심 기능
```typescript
{
  placeObject,    // 오브젝트 배치
  deleteObject,   // 오브젝트 삭제
  undo, redo,     // 실행 취소/다시 실행
  saveScene,      // 씬 저장
  loadScene,      // 씬 불러오기
  clearScene      // 씬 초기화
}
```

`useBrush` - 브러시 도구
```typescript
{
  selectBrush,           // 브러시 선택
  handleGroundClick,     // 클릭 배치
  handleGroundDragMove,  // 드래그 배치
}
```

`useCapture` - 스크린샷 캡처
```typescript
{
  setRenderer,  // 렌더러 등록
  capture       // PNG 캡처
}
```

**Command Pattern** (`application/commands/`)
- `PlaceObjectCommand` - 오브젝트 배치 명령
- `RemoveObjectCommand` - 오브젝트 삭제 명령
- `CommandHistory` - Undo/Redo 스택 관리

**Facade** (`application/facade/GardenFacade.ts`)
- 모든 기능을 하나로 통합하여 제공

---

### 3. Infrastructure (인프라)

**ModelLoader** (`infrastructure/loaders/ModelLoader.ts`)
- OBJ, FBX, GLB 파일 로딩
- Draco 압축 해제
- 모델 정규화 (크기, 위치, 회전)
- Z-up → Y-up 좌표계 변환

**ModelCache** (`infrastructure/cache/ModelCache.ts`)
- 로드된 모델 캐싱
- 중복 로딩 방지

---

### 4. Presentation (UI)

**GardenScene** - 3D 씬 렌더링
- `DynamicSky` - 시간대별 하늘/조명
- `Ground` - 땅과 잔디
- `PlacedObjects` - 배치된 오브젝트들
- `GhostObject` - 마우스 따라다니는 미리보기
- `CanvasPointerHandler` - 마우스/터치 이벤트

**UI 패널**
- `ObjectPanel` - 오브젝트 선택
- `PropertyPanel` - 속성 조정
- `ControlPanel` - 저장/불러오기/캡처

---

## 주요 기능 구현

### 1. 오브젝트 배치

**플로우**
```
사용자 클릭
  ↓
CanvasPointerHandler
  ↓
handleGroundClick(point)
  ↓
createPlacedObject()
  ↓
PlaceObjectCommand.execute()
  ↓
Zustand Store 업데이트
  ↓
PlacedObjectMesh 렌더링
```

### 2. Undo/Redo

**Command Pattern 사용**
```typescript
// 실행
commandHistory.execute(new PlaceObjectCommand(...));

// Undo
commandHistory.undo();  // 마지막 명령 취소

// Redo
commandHistory.redo();  // 취소한 명령 다시 실행
```

**키보드 단축키**
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo

### 3. 씬 저장/불러오기

**LocalStorage 활용**
```typescript
// 저장
sceneSerializer.save(placedObjects);

// 불러오기
const objects = sceneSerializer.load();
setObjects(objects);
```

**데이터 구조**
```json
{
  "version": 1,
  "objects": [...],
  "createdAt": "2026-03-14T12:00:00.000Z",
  "updatedAt": "2026-03-14T12:30:00.000Z"
}
```

### 4. 시간대별 조명

**시간 → 조명 설정 매핑**
```typescript
function getSkyConfig(hour: number) {
  if (hour >= 5 && hour < 8)   return 새벽_설정;
  if (hour >= 8 && hour < 11)  return 아침_설정;
  if (hour >= 11 && hour < 16) return 낮_설정;
  if (hour >= 16 && hour < 20) return 저녁_설정;
  return 밤_설정;
}
```

`useCurrentTimeStore` 변경 → `DynamicSky` 리렌더링 → 조명 업데이트

---

## 성능 최적화

### 3D 에셋
- **GLB + Draco 압축** - 모델 92% 감소
- **Sharp 텍스처 압축** - 텍스처 98% 감소
- **모델 캐싱** - 중복 로딩 방지
- 모델: 22.84MB → 1.79MB (92% 감소)
- 텍스처: 30MB → 0.6MB (98% 감소)
- 총합: 53MB → 2.4MB (95.5% 감소)


### 렌더링
- **DPR 제한** - `Math.min(devicePixelRatio, 1.5)`
- **Shadow Map** - `1024x1024`
- **Grass 인스턴스** - `9000개`
- **Intersection Observer** - 화면에 보일 때만 렌더링

---

## 확장 가이드

### 새 오브젝트 추가

1. **GLB 파일 준비** - `public/flower/sunflower/sunflower.glb`

2. **타입 추가** (`garden.types.ts`)
```typescript
export const GARDEN_OBJECTS = [
  // ...
  {
    type: 'sunflower',
    label: 'Sunflower',
    category: 'flower',
    path: '/flower/sunflower/sunflower.glb',
    loaderType: 'gltf',
    defaultScale: 1.5,
    defaultColor: '#fbbf24',
    previewColor: '#fbbf24',
  },
];
```

3. **완료** - 자동으로 UI에 표시됨

### 새 Command 추가

```typescript
export class MoveObjectCommand implements Command {
  constructor(
    private objectId: string,
    private oldPosition: [number, number, number],
    private newPosition: [number, number, number],
    private updateFn: Function
  ) {}

  execute() {
    this.updateFn(this.objectId, this.newPosition);
  }

  undo() {
    this.updateFn(this.objectId, this.oldPosition);
  }
}
```

---

## 트러블슈팅

### 모델이 누워있는 경우
```typescript
// garden.types.ts
rotationFix: [Math.PI / 2, 0, 0]  // X축 90도 회전
```

### 시간 변경이 반영 안 되는 경우
- `DynamicSky`가 `useCurrentTimeStore` 구독하는지 확인
- `SceneContent`도 동일하게 구독 필요

### Undo가 작동 안 하는 경우
- `PlaceObjectCommand` 사용하는지 확인
- `commandHistory.execute()` 호출 확인
- 직접 `addObject()` 호출하면 히스토리에 안 남음
