"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateLinksOrder, deleteLink } from "@/server/actions/links";

type Link = { id: string; title: string; url: string; order: number };

function SortableItem(props: { id: string; link: Link; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md mb-2 ${isDragging ? 'opacity-50 ring-2 ring-primary' : ''}`}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-white">
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1">
        <p className="font-semibold text-white">{props.link.title}</p>
        <p className="text-sm text-muted-foreground truncate">{props.link.url}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => props.onDelete(props.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function LinksList({ initialLinks }: { initialLinks: Link[] }) {
  const [links, setLinks] = useState(initialLinks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: { active: { id: string }; over: { id: string } | null }) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    let reordered: { id: string; order: number }[] = [];

    setLinks((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newArray = arrayMove(items, oldIndex, newIndex);
      reordered = newArray.map((l, index) => ({ id: l.id, order: index }));
      return newArray;
    });

    if (reordered.length > 0) {
      await updateLinksOrder(reordered);
    }
  }

  async function handleDelete(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await deleteLink(id);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
        {links.map((link) => (
          <SortableItem key={link.id} id={link.id} link={link} onDelete={handleDelete} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
