import React, { ReactNode, useState } from 'react';
import { useDrop, DropTargetHookSpec, DropTargetMonitor } from 'react-dnd';

interface DropTargetProps {
  onDrop: (type: string, content: ReactNode) => void;
  onCancel: () => void;
  children: ReactNode;
}

const DropTarget: React.FC<DropTargetProps> = ({ onDrop, onCancel, children }) => {
  const [droppedType, setDroppedType] = useState<string | null>(null);
  const [droppedContent, setDroppedContent] = useState<ReactNode | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ['ITEM', 'SLIDER'],
    drop: (item: { type: string; content: ReactNode }) => {
      setDroppedType(item.type);
      setDroppedContent(item.content);
      onDrop(item.type, item.content);
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleCancelClick = () => {
    setDroppedType(null);
    setDroppedContent(null);
    onCancel();// Asegúrate de que se llame a la función onModalClose aquí
  };

  return (
    <div ref={drop}>
      {droppedType && (
        <div className="relative">
          <p>Slot content: {droppedType}</p>
          {droppedContent && <div>{droppedContent}</div>}
          <button className="rounded-full bg-meta-1 text-white leading-none p-2 absolute top-0 right-0 cursor-pointer" onClick={handleCancelClick}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      )}
      {droppedType === null && children}
    </div>
  );
};

export default DropTarget;