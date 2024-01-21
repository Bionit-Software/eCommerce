// // DraggableItem.tsx
// import React, { ReactNode } from 'react';
// import { useDrag, DragSourceHookSpec } from 'react-dnd';

// interface DraggableItemProps {
//   type: string;
//   content: string; // Agregamos la propiedad content
//   children: ReactNode;
// }

// const DraggableItem: React.FC<DraggableItemProps> = ({ type, content, children }) => {
//   const [, drag] = useDrag({
//     type,
//     item: { type, content }, // Pasamos el tipo y el contenido al soltar el elemento
//   } as DragSourceHookSpec<any, any, any>);

//   return (
//     <div ref={drag} style={{ border: '1px solid black', margin: '5px', padding: '5px' }}>
//       {children}
//     </div>
//   );
// };

// export default DraggableItem;
// DraggableItem.tsx
// DraggableItem.tsx
import React, { ReactNode } from 'react';
import { useDrag, DragSourceHookSpec } from 'react-dnd';

interface DraggableItemProps {
  type: string;
  children: ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ type, children }) => {
  const [, drag] = useDrag({
    type,
    item: { type, content: children }, // Pasamos el contenido del children como parte del elemento arrastrado
  } as DragSourceHookSpec<any, any, any>);

  return (
    <div ref={drag} style={{ border: '1px solid black', margin: '5px', padding: '5px' }}>
      {children}
    </div>
  );
};

export default DraggableItem;

