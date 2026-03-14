'use client';

import dynamic from 'next/dynamic';

const GardenEditorContainer = dynamic(
  () =>
    import('@/bloom-studio/presentation/containers/GardenEditorContainer').then(
      m => m.GardenEditorContainer,
    ),
  { ssr: false },
);

export default function Page() {
  return (
    <div className="w-dvw h-dvh">
      <GardenEditorContainer />
    </div>
  );
}
