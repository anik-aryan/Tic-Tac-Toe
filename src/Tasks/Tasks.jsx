import React, { useState, useEffect, useCallback } from 'react';
import './tasks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar, faCheck, faChevronDown, faClock, faPencil, faPlus,
  faSearch, faTimes, faTrash, faUndo
} from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import HamburgerIcon from '../SVGs/HamburgerIcon';
import { NavLink } from 'react-router-dom';

const formatDate = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = dateString => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (formatDate(date) === formatDate(today)) {
    return 'Today';
  }

  if (formatDate(date) === formatDate(tomorrow)) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const formatTimeForDisplay = timeString => {
  if (!timeString) return '';

  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
};

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const tag = task.tag || '';
  const priority = task.priority || '';
  const dueDate = task.dueDate || '';
  const time = task.time || '';
  const completed = task.completed || false;

  return (
    <div className={`task-card p-4 priority-${priority} ${completed ? 'opacity-50' : ''} fade-in`}>
      <div className="flex items-start justify-between">
        <div className="flex-grow pr-4">
          <div className="flex items-center mb-1">
            <h3 className={`font-medium text-gray-800 ${completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
            {dueDate && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendar} className="mr-1 text-gray-400" />
                <span>{formatDateForDisplay(dueDate)}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center ml-3">
                <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-400" />
                <span>{formatTimeForDisplay(time)}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {tag && (
              <span className={`tag ${tag}`}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            )}
            {priority && (
              <span className={`priority-badge priority-${priority}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            )}
            {completed && (
              <span className="priority-badge" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                Completed
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            className="action-btn complete"
            onClick={() => onToggleComplete(task.id)}
            title={completed ? 'Mark as pending' : 'Mark as Complete'}
          >
            <FontAwesomeIcon
              icon={completed ? faUndo : faCheck}
              className="text-gray-500"
            />
          </button>
          <button
            className="action-btn edit"
            onClick={() => onEdit(task.id)}
            title="Edit Task"
          >
            <FontAwesomeIcon icon={faPencil} className="text-gray-500" />
          </button>
          <button
            className="action-btn delete"
            onClick={() => onDelete(task.id)}
            title="Delete Task"
          >
            <FontAwesomeIcon icon={faTrash} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DropdownMenu = ({
  id,
  buttonText,
  items,
  activeValue,
  onSelect,
  icon = faChevronDown
}) => {
  const handleChange = (e) => {
    onSelect(e.target.value);
  };

  return (
    <div className='filter-dropdown relative'>
      <label htmlFor={id} className='sr-only'>{buttonText}</label>
      <div className='relative'>
        <select name={id} id={id} value={activeValue} onChange={handleChange} className='filter-btn appearance-none flex items-center px-3 py-2 rounded-lg bg-white text-sm w-full pr-8 focus:outline-none'>
          {items.map((item) => (
            <option key={item.value} value={item.value} className='dropdown-item'>{item.label}</option>
          ))}
        </select>
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500'>
          <FontAwesomeIcon icon={icon} className='text-xs' />
        </div>
      </div>
    </div>
  )
};

const TaskModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  taskToEdit
}) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    dueDate: formatDate(new Date()),
    time: '',
    priority: 'medium',
    tag: 'work'
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        id: taskToEdit.id,
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        dueDate: taskToEdit.dueDate || formatDate(new Date()),
        time: taskToEdit.time || '',
        priority: taskToEdit.priority,
        tag: taskToEdit.tag
      });
    } else {
      setFormData({
        id: '',
        title: '',
        description: '',
        dueDate: formatDate(new Date()),
        time: '',
        priority: 'medium',
        tag: 'work'
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {taskToEdit ? 'Edit Task' : 'Add Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={formData.id} />

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter task title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                name="time"
                id="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                id="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <select
                name="tag"
                id="tag"
                value={formData.tag}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {taskToEdit && (
              <button
                type="button"
                onClick={() => onDelete(taskToEdit.id)}
                className="btn px-4 py-2 border border-red-500 text-red-500 rounded-lg font-medium"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 text-white rounded-lg font-medium"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Tasks = ({ onOpenSidebar }) => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    date: 'all',
    priority: 'all',
    status: 'all',
    tag: 'all'
  });
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [tasksToday, setTasksToday] = useState(0);

  useEffect(() => {
    const savedTasks = localStorage.getItem('virtualMentorTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const today = formatDate(new Date());
      const tomorrow = formatDate(new Date(new Date().setDate(new Date().getDate() + 1)));
      const nextWeek = formatDate(new Date(new Date().setDate(new Date().getDate() + 7)));

      const initialTasks = [
        {
          id: uuidv4(),
          title: 'Complete project proposal',
          description: 'Finalize the project scope and deliverables',
          dueDate: today,
          time: '14:00',
          priority: 'high',
          tag: 'work',
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null
        },
        {
          id: uuidv4(),
          title: 'Team meeting',
          description: 'Weekly sync with the development team',
          dueDate: today,
          time: '10:00',
          priority: 'medium',
          tag: 'work',
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null
        },
        {
          id: uuidv4(),
          title: 'Gym session',
          description: 'Cardio and strength training',
          dueDate: today,
          time: '18:30',
          priority: 'low',
          tag: 'health',
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null
        },
        {
          id: uuidv4(),
          title: 'Call with client',
          description: "Discuss project timeline and next steps",
          dueDate: tomorrow,
          time: '11:00',
          priority: 'high',
          tag: 'work',
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null
        },
        {
          id: uuidv4(),
          title: 'Grocery shopping',
          description: 'Buy fruits, vegetables, and other essentials',
          dueDate: tomorrow,
          time: '17:00',
          priority: 'medium',
          tag: 'personal',
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null
        },
        {
          id: uuidv4(),
          title: 'Review quarterly goals',
          description: 'Assess progress and adjust targets if needed',
          dueDate: nextWeek,
          time: '09:00',
          priority: 'high',
          tag: 'work',
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null
        },
        {
          id: uuidv4(),
          title: 'Dentist appointment',
          description: 'Regular checkup',
          dueDate: nextWeek,
          time: '14:30',
          priority: 'medium',
          tag: 'health',
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null
        }
      ];
      setTasks(initialTasks);
      localStorage.setItem('virtualMentorTasks', JSON.stringify(initialTasks));
    }
  }, []);

  useEffect(() => {
    const today = formatDate(new Date());
    const count = tasks.filter(task => task.dueDate === today && !task.completed).length;
    setTasksToday(count);
  }, [tasks]);

  const filteredTasks = useCallback(() => {
    let filtered = [...tasks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description?.toLowerCase().includes(query))
      );
    }

    if (filters.date !== 'all') {
      const today = formatDate(new Date());
      const tomorrow = formatDate(new Date(new Date().setDate(new Date().getDate() + 1)));
      const weekStart = formatDate(new Date());
      const weekEnd = formatDate(new Date(new Date().setDate(new Date().getDate() + 7)));
      const monthStart = formatDate(new Date());
      const monthEnd = formatDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));

      switch (filters.date) {
        case 'today':
          filtered = filtered.filter(task => task.dueDate === today);
          break;
        case 'tomorrow':
          filtered = filtered.filter(task => task.dueDate === tomorrow);
          break;
        case 'week':
          filtered = filtered.filter(task => task.dueDate >= weekStart && task.dueDate <= weekEnd);
          break;
        case 'month':
          filtered = filtered.filter(task => task.dueDate >= monthStart && task.dueDate <= monthEnd);
          break;
      }
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.status !== 'all') {
      const isCompleted = filters.status === 'completed';
      filtered = filtered.filter(task => task.completed === isCompleted);
    }

    if (filters.tag !== 'all') {
      filtered = filtered.filter(task => task.tag === filters.tag);
    }

    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => {
          if (a.dueDate === b.dueDate) {
            let result;
            if (a.time && b.time) {
              result = a.time.localeCompare(b.time);
            } else {
              result = a.time ? -1 : 1;
            }
            return result;
          }
          return a.dueDate.localeCompare(b.dueDate);
        });
        break;
      case 'priority': {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      }
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  }, [tasks, searchQuery, filters, sortBy]);

  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if(task.id === taskId) {
          if(!task.completed) {
            return { ...task, completed: true, completedAt: new Date().toISOString()};
          } else {
            return { ...task, completed: false, completedAt: null}
          }
        }
        return task;
      });
      localStorage.setItem('virtualMentorTasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };

  const handleAddTask = () => {
    setTaskToEdit(null);
    setModalOpen(true);
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTaskToEdit(task);
      setModalOpen(true);
    }
  };

  const handleDeleteTask = (taskId) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter(task => task.id !== taskId);
        localStorage.setItem('virtualMentorTasks', JSON.stringify(updatedTasks));
        return updatedTasks;
      });
      if (taskToEdit?.id === taskId) {
        setModalOpen(false);
      }
    }
  };

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task.id === taskData.id ? { ...task, ...taskData } : task
        );
        localStorage.setItem('virtualMentorTasks', JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    } else {
      const newTask = {
        ...taskData,
        id: uuidv4(),
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString()
      };
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks, newTask];
        localStorage.setItem('virtualMentorTasks', JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    }
    setModalOpen(false);
  };

  const dateFilterItems = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const priorityFilterItems = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const statusFilterItems = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ];

  const tagFilterItems = [
    { value: 'all', label: 'All Tags' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'health', label: 'Health' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const sortItems = [
    { value: 'date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'recent', label: 'Recently Added' }
  ];

  return (
    <div className="flex-1 tasks-bg overflow-auto">
      <div className="min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm py-3 px-4 md:px-6">
          <div className="flex justify-between items-center">
            {/* Add Task Button */}
            <button id='open-sidebar' className='md:hidden mr-4 text-[#64748b] hover:text-[#334155]' onClick={onOpenSidebar}>
                    <HamburgerIcon></HamburgerIcon>
                </button>
            <button
              onClick={handleAddTask}
              className="btn btn-primary text-white px-4 py-2 rounded-lg font-medium flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>&nbsp;Add Task</span>
            </button>

            {/* Profile */}
            <div className="flex items-center">
              <NavLink to="/profile" className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-gray-700 font-medium">JD</span>
              </NavLink>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Page Title and Summary */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
              <p className="text-gray-600 mt-1">
                You have <span className="font-medium text-purple-600">{tasksToday}</span>
                &nbsp;task{tasksToday !== 1 ? 's' : ''} due today.
              </p>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
              <div className="filters-row flex flex-wrap items-center justify-between gap-3">
                {/* Search */}
                <div className="search-container relative flex-grow w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="search-input w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                </div>
              </div>

              <div className="filter-row flex flex-wrap items-center gap-3 mt-3">
                {/* Filter Dropdowns */}
                <DropdownMenu
                  id="dateFilterMenu"
                  buttonText={dateFilterItems.find(item => item.value === filters.date)?.label || 'Date'}
                  items={dateFilterItems}
                  activeValue={filters.date}
                  onSelect={(value) => setFilters({ ...filters, date: value })}
                />

                <DropdownMenu
                  id="priorityFilterMenu"
                  buttonText={priorityFilterItems.find(item => item.value === filters.priority)?.label || 'Priority'}
                  items={priorityFilterItems}
                  activeValue={filters.priority}
                  onSelect={(value) => setFilters({ ...filters, priority: value })}
                />

                <DropdownMenu
                  id="statusFilterMenu"
                  buttonText={statusFilterItems.find(item => item.value === filters.status)?.label || 'Status'}
                  items={statusFilterItems}
                  activeValue={filters.status}
                  onSelect={(value) => setFilters({ ...filters, status: value })}
                />

                <DropdownMenu
                  id="tagFilterMenu"
                  buttonText={tagFilterItems.find(item => item.value === filters.tag)?.label || 'Tags'}
                  items={tagFilterItems}
                  activeValue={filters.tag}
                  onSelect={(value) => setFilters({ ...filters, tag: value })}
                />

                  <DropdownMenu
                    id="sortMenu"
                    buttonText={`Sort: ${sortItems.find(item => item.value === sortBy)?.label || 'Date'}`}
                    items={sortItems}
                    activeValue={sortBy}
                    onSelect={setSortBy}
                    icon={null}
                  />
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks().length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 gradient-bg rounded-full mx-auto flex items-center justify-center mb-4 opacity-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No tasks found</h3>
                  <p className="text-gray-500 mt-1">
                    Try adjusting your filters or add a new task
                  </p>
                </div>
              ) : (
                filteredTasks().map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskCompletion}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Tasks;