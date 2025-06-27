'use client';

import { useMemo, useState } from 'react';

type DragAndDropProps<TData extends { order: number }> = {
  items: TData[];
};

export function useDragAndDrop<TData extends { order: number }>({
  items,
}: DragAndDropProps<TData>) {
  const [selectedItem, setSelectedItem] = useState<TData | null>(null);
  const [dragging, setDragging] = useState(false);
  const [orderedItems, setOrderedItems] = useState<TData[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [targetGapIndex, setTargetGapIndex] = useState<number | null>(null);
  const [itemRects, setItemRects] = useState<DOMRect[]>([]);
  const [lastReorderTime, setLastReorderTime] = useState(0);

  useMemo(() => {
    setOrderedItems([...items].sort((a, b) => a.order - b.order));
  }, [items]);

  const sortItems = useMemo(() => orderedItems, [orderedItems]);

  const onDragStart = (index: number, e: React.DragEvent) => {
    const itemElements = e.currentTarget.parentElement?.children;
    if (itemElements) {
      const rects = Array.from(itemElements).map((item) =>
        item.getBoundingClientRect(),
      );
      setItemRects(rects);
    }

    setDraggedIndex(index);
    setSelectedItem(sortItems[index]);
    setDragging(true);
    setLastReorderTime(Date.now());
  };

  const onDragEnd = () => {
    setDragging(false);
    setSelectedItem(null);
    setDraggedIndex(null);
    setTargetIndex(null);
    setTargetGapIndex(null);
    setItemRects([]);
  };

  const onDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const now = Date.now();
    if (now - lastReorderTime < 100) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const itemRect = itemRects[index];

    if (!itemRect) return;

    const itemWidth = itemRect.width;
    const itemHeight = itemRect.height;
    const itemLeft = itemRect.left;
    const itemRight = itemRect.right;
    const itemTop = itemRect.top;
    const itemBottom = itemRect.bottom;

    const xThreshold = 0.4;
    const yThreshold = 0.5;

    const isLeftSide = mouseX < itemLeft + itemWidth * xThreshold;
    const isRightSide = mouseX > itemRight - itemWidth * xThreshold;
    const isTopSide = mouseY < itemTop + itemHeight * yThreshold;
    const isBottomSide = mouseY > itemBottom - itemHeight * yThreshold;

    let shouldReorder = false;

    if (isLeftSide && draggedIndex > index) {
      shouldReorder = true;
    } else if (isRightSide && draggedIndex < index) {
      shouldReorder = true;
    } else if (isTopSide) {
      shouldReorder = true;
    } else if (isBottomSide) {
      shouldReorder = true;
    }

    if (!shouldReorder) {
      return;
    }

    setTargetIndex(index);
    setTargetGapIndex(index > draggedIndex ? index : index - 1);
    setLastReorderTime(now);

    const newItems = [...orderedItems];
    const draggedItem = newItems[draggedIndex];

    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    newItems.forEach((item, idx) => {
      item.order = idx;
    });

    setOrderedItems(newItems);
    setDraggedIndex(index);
  };

  return {
    dragging,
    setDragging,
    sortItems,
    onDragStart,
    onDragEnd,
    onDragOver,
    selectedItem,
    draggedIndex,
    targetIndex,
    targetGapIndex,
  };
}
