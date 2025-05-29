import React from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
export function Injector({
  id = 'promptaid-embed',
  selector = 'body', // Use selector directly from browser's Inspect -> Copy selector
  component,
  position = 'append',
  index = 0,
}: {
  id?: string;
  selector?: string;
  component: React.ReactElement;
  position?: 'append' | 'prepend';
  index?: number;
}) {
  const interval = setInterval(() => {
    const target = document.querySelector(selector!);
    if (!target) return;

    clearInterval(interval);

    if (document.getElementById(id)) return;

    const mountPoint = document.createElement('div');
    mountPoint.id = id;

    if (position === 'prepend') {
      target.prepend(mountPoint);
    } else if (position === 'append') {
      if (index >= 0 && index < target.children.length) {
        target.insertBefore(mountPoint, target.children[index]);
      } else {
        target.appendChild(mountPoint);
      }
    }

    createRoot(mountPoint).render(component);
  }, 500);
}
