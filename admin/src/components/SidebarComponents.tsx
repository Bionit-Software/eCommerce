// Sidebar.tsx
import React from 'react';
import DraggableItem from './DraggableItem';

const SidebarComponents: React.FC = () => {
    return (
        <div className="bg-gray-200 p-4">
            <h3 className="mb-4">Sidebar</h3>
            <DraggableItem type="SLIDER">
                <p>Elemento Sidebar 1</p>
                <img src="http://localhost:3000/uploads/1705509906978-7_imagen4.jpg" alt="Imagen" />
            </DraggableItem>
            <DraggableItem type="ITEM">
                <p>Elemento Sidebar 2</p>
            </DraggableItem>
        </div>
    );
};

export default SidebarComponents;
