import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider, useAppContext } from './AppContext';

describe('AppContext Task Management Logic', () => {
  it('should initialize with default tasks', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: ({ children }) => <AppProvider>{children}</AppProvider>,
    });
    expect(result.current.tasks.length).toBeGreaterThan(0);
  });

  it('should add a new task', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: ({ children }) => <AppProvider>{children}</AppProvider>,
    });

    const initialLength = result.current.tasks.length;

    act(() => {
      result.current.addTask({
        title: 'New Test Task',
        description: 'Test Description',
        status: 'todo',
      });
    });

    expect(result.current.tasks.length).toBe(initialLength + 1);
    expect(result.current.tasks[result.current.tasks.length - 1].title).toBe('New Test Task');
  });

  it('should update a task status', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: ({ children }) => <AppProvider>{children}</AppProvider>,
    });

    const taskIdToUpdate = result.current.tasks[0].id;

    act(() => {
      result.current.updateTaskStatus(taskIdToUpdate, 'in-progress');
    });

    const updatedTask = result.current.tasks.find(t => t.id === taskIdToUpdate);
    expect(updatedTask?.status).toBe('in-progress');
  });

  it('should delete a task', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: ({ children }) => <AppProvider>{children}</AppProvider>,
    });

    const initialLength = result.current.tasks.length;
    const taskIdToDelete = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskIdToDelete);
    });

    expect(result.current.tasks.length).toBe(initialLength - 1);
    expect(result.current.tasks.find(t => t.id === taskIdToDelete)).toBeUndefined();
  });
});
