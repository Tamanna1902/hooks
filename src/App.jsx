
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// App.js

// App.js
import React, { useState, useEffect, useReducer, useRef, useMemo, useCallback, useContext, createContext } from 'react';
import styled from 'styled-components';

// Styled Components for UI
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 20px;
`;

const Title = styled.h1`
  color: #4CAF50;
  margin-bottom: 20px;
`;

const TaskInput = styled.input`
  padding: 10px;
  margin: 10px;
  width: 300px;
  border: 2px solid #4CAF50;
  border-radius: 5px;
`;

const TaskButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  width: 350px;
`;

const TaskItem = styled.li`
  background: ${({ completed }) => (completed ? '#d4edda' : '#f8d7da')};
  color: #333;
  padding: 10px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
`;

const TaskButtonGroup = styled.div`
  display: flex;
  gap: 5px;
`;

// Context and Reducer
const TaskContext = createContext();
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, { id: Date.now(), text: action.payload, completed: false }];
    case 'TOGGLE_TASK':
      return state.map(task =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    default:
      return state;
  }
};

function App() {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const inputRef = useRef(null);

  // Focus on input when component mounts
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      dispatch({ type: 'ADD_TASK', payload: taskInput });
      setTaskInput('');
    }
  };

  const handleToggleTask = useCallback(
    (id) => {
      dispatch({ type: 'TOGGLE_TASK', payload: id });
    },
    [dispatch]
  );

  const handleDeleteTask = useCallback(
    (id) => {
      dispatch({ type: 'DELETE_TASK', payload: id });
    },
    [dispatch]
  );

  const totalTasks = useMemo(() => tasks.length, [tasks]);
  const completedTasks = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);

  return (
    <TaskContext.Provider value={{ handleToggleTask, handleDeleteTask }}>
      <Container>
        <Title>Task Manager</Title>
        <TaskInput
          ref={inputRef}
          type="text"
          placeholder="Enter a new task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <TaskButton onClick={handleAddTask}>Add Task</TaskButton>
        <TaskList>
          {tasks.map((task) => (
            <TaskItem key={task.id} completed={task.completed}>
              {task.text}
              <TaskButtonGroup>
                <TaskButton onClick={() => handleToggleTask(task.id)}>Toggle</TaskButton>
                <TaskButton onClick={() => handleDeleteTask(task.id)}>Delete</TaskButton>
              </TaskButtonGroup>
            </TaskItem>
          ))}
        </TaskList>
        <div>Total Tasks: {totalTasks}</div>
        <div>Completed Tasks: {completedTasks}</div>
      </Container>
    </TaskContext.Provider>
  );
}

export default App;
