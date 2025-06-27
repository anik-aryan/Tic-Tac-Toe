import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faPlus, faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import './calendar.css';
import HamburgerIcon from '../SVGs/HamburgerIcon';
import { NavLink } from 'react-router-dom';

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
};

const Calendar = ({ onOpenSidebar }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    // const [currentView, setCurrentView] = useState('month'); // State for future Day/Week views
    const isInitialMount = useRef(true);

    // Effect for loading tasks from localStorage on initial render
    useEffect(() => {
        try {
            const savedTasks = localStorage.getItem('virtualMentorTasks');
            if (savedTasks && savedTasks !== '[]') {
                try {
                    setTasks(JSON.parse(savedTasks));
                } catch {
                    setTasks([]);
                }
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error('Failed to load tasks from localStorage', error);
            setTasks([]);
        }
    }, []);

    // Effect for saving tasks to localStorage whenever the tasks state changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        try {
            localStorage.setItem('virtualMentorTasks', JSON.stringify(tasks));
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
        }
    }, [tasks]);

    // Memoize the calendar grid calculation to avoid re-running it on every render
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days = [];

        // Days from the previous month
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay.getDay(); i > 0; i--) {
            const day = prevMonthLastDay - i + 1;
            days.push({ date: new Date(year, month - 1, day), isDifferentMonth: true });
        }

        // Days from the current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({ date: new Date(year, month, i), isDifferentMonth: false });
        }

        // Days from the next month to fill the grid (usually up to 42 cells)
        const nextMonthDays = 42 - days.length;
        for (let i = 1; i <= nextMonthDays; i++) {
            days.push({ date: new Date(year, month + 1, i), isDifferentMonth: true });
        }
        return days;
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleGoToToday = () => {
        setCurrentDate(new Date());
    };

    const handleOpenModalForNew = (dueDate) => {
        setSelectedDate(dueDate);
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (task) => {
        setSelectedDate(null);
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
        setSelectedDate(null);
    };

    const handleSaveTask = (taskData) => {
        setTasks(prevTasks => {
            const taskExists = prevTasks.some(t => t.id === taskData.id);
            let updatedTasks;

            if (taskExists) {
                updatedTasks = prevTasks.map(t => {
                    if(t.id === taskData.id) {
                        if(t.completed !== taskData.completed) {
                            return { ...taskData, completedAt: taskData.completed ? new Date().toISOString() : null };
                        }
                        return { ...taskData, completedAt: t.completedAt };
                    }
                    return t;
                });
            } else {
                updatedTasks = [...prevTasks, {
                    ...taskData,
                    createdAt: new Date().toISOString(),
                    completedAt: taskData.completed ? new Date().toISOString() : null
                }];
            }

            localStorage.setItem('virtualMentorTasks', JSON.stringify(updatedTasks));
            return updatedTasks;
        });
        handleCloseModal();
    };

    const handleDeleteTask = (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
            handleCloseModal();
        }
    };

    const todayFormatted = formatDate(new Date());

    return (
        <div className='flex-1 calendar-body min-h-screen flex flex-col'>
            <header className='bg-white shadow-sm py-3 px-4 md:px-6 flex justify-between items-center'>
                <button id='open-sidebar' className='md:hidden mr-4 text-[#64748b] hover:text-[#334155]' onClick={onOpenSidebar}>
                    <HamburgerIcon></HamburgerIcon>
                </button>
                <button
                    className='btn btn-primary text-white px-4 py-2 rounded-lg font-medium flex items-center'
                    onClick={() => handleOpenModalForNew(formatDate(new Date()))}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span className='ml-2'>Add Task</span>
                </button>
                <NavLink to="/profile" className='w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer'>
                    <span className='text-gray-700 font-medium'>JD</span>
                </NavLink>
            </header>

            {/* --- Calendar Controls --- */}
            <div className='calendar-header p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center'>
                <div className='flex items-center mb-4 md:mb-0'>
                    <button className='p-2 rounded-lg hover:bg-gray-100' onClick={handlePrevMonth}>
                        <FontAwesomeIcon icon={faChevronLeft} className='text-gray-600' />
                    </button>
                    <h2 className='text-xl font-semibold text-gray-800 mx-4'>
                        {getMonthName(currentDate)} {currentDate.getFullYear()}
                    </h2>
                    <button className='p-2 rounded-lg hover:bg-gray-100' onClick={handleNextMonth}>
                        <FontAwesomeIcon icon={faChevronRight} className='text-gray-600' />
                    </button>
                    <button className='ml-4 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100' onClick={handleGoToToday}>
                        Today
                    </button>
                </div>
                {/* Future view toggle can be enabled here */}
            </div>

            {/* --- Calendar Grid --- */}
            <div className='flex-grow p-2 md:p-6'>
                <div className='calendar-container rounded-lg overflow-hidden'>
                    <div className='grid grid-cols-7 bg-gray-50 border-b border-gray-200'>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className='calendar-day-name py-2 text-center text-gray-600 font-medium'>
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className='grid grid-cols-7'>
                        {calendarDays.map(({ date, isDifferentMonth }) => {
                            const dateStr = formatDate(date);
                            const tasksForDay = tasks.filter(t => t.dueDate === dateStr);
                            const isToday = dateStr === todayFormatted;

                            return (
                                <div
                                    key={dateStr}
                                    className={`calendar-cell p-2 relative ${isDifferentMonth ? 'different-month' : ''} ${isToday ? 'today' : ''}`}
                                    onClick={() => !isDifferentMonth && handleOpenModalForNew(dateStr)}
                                >
                                    <div className='text-right mb-1'>{date.getDate()}</div>
                                    <div className='tasks-container text-xs space-y-1 overflow-hidden'>
                                        {tasksForDay.map(task => (
                                            <TaskChip key={task.id} task={task} onClick={() => handleOpenModalForEdit(task)} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Task Modal */}
            {isModalOpen && (
                <TaskModal
                    task={selectedTask}
                    date={selectedDate}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

const TaskChip = ({ task, onClick }) => {
    let timeDisplay = '';
    if (task.time) {
        const [hours, minutes] = task.time.split(':');
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        timeDisplay = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + ' . ';
    }

    return (
        <div
            className={`task-chip priority-${task.priority}`}
            onClick={(e) => {
                e.stopPropagation(); // Prevent opening a new task modal
                onClick();
            }}
        >
            {`${timeDisplay}${task.title}`}
        </div>
    );
};

const TaskModal = ({ task, date, onSave, onDelete, onClose }) => {
    const isEditMode = !!task;
    const initialFormData = isEditMode
        ? { ...task }
        : {
            id: uuidv4(),
            dueDate: date,
            title: '',
            description: '',
            priority: 'medium',
            time: '',
            tag: 'work',
            completed: false,
            completedAt: null,
            createdAt: new Date().toISOString()
        };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('Please enter a task title');
            return;
        }
        onSave(formData);
    };

    const handleToggle = () => {
        setFormData(prev => ({
            ...prev,
            completed: !prev.completed,
            completedAt: !prev.completed ? new Date().toISOString() : null
        }));
    }

    const modalDisplayDate = new Date(
        (formData.dueDate + 'T00:00:00') // Add time to avoid timezone issues
    ).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });


    return (
        <div className='modal flex items-center justify-center p-4'>
            <div className='modal-content p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                        {isEditMode ? 'Edit Task' : 'Add Task'} for {modalDisplayDate}
                    </h3>
                    <button className='text-gray-500 hover:text-gray-700' onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label htmlFor="taskTitle" className='block text-sm font-medium text-gray-700 mb-1'>Task Title</label>
                        <input type="text" id='taskTitle' name='title' value={formData.title} onChange={handleChange} required className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500' placeholder='Enter task title' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="taskDescription" className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                        <textarea id='taskDescription' name='description' value={formData.description} onChange={handleChange} rows={3} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500' placeholder='Enter task description'></textarea>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label htmlFor="taskPriority" className='block text-sm font-medium text-gray-700 mb-1'>Priority</label>
                            <select name="priority" id="taskPriority" value={formData.priority} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="taskTag" className='block text-sm font-medium text-gray-700 mb-1'>Tag</label>
                            <select name="tag" id="taskTag" value={formData.tag} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'>
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="health">Health</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label htmlFor="taskDueDate" className='block text-sm font-medium text-gray-700 mb-1'>Due Date</label>
                            <input type="date" name='dueDate' id='taskDueDate' value={formData.dueDate} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500' />
                        </div>
                        <div>
                            <label htmlFor="taskTime" className='block text-sm font-medium text-gray-700 mb-1'>Time</label>
                            <input type="time" name="time" id="taskTime" value={formData.time} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500' />
                        </div>
                    </div>

                    <div className='flex items-center mb-4'>
                        <input type="checkbox" id="taskCompleted" checked={formData.completed} onChange={handleToggle} className='mr-2' />
                        <label htmlFor='taskCompleted' className='text-sm font-medium text-gray-700'>Mark as completed</label>
                        {formData.completed && formData.completedAt && (
                            <span className='ml-4 text-xs text-green-500'>
                                Completed at: {new Date(formData.completedAt).toLocaleString()}
                            </span>
                        )}
                    </div>

                    <div className='flex justify-between items-center'>
                        {isEditMode && (
                            <button type='button' className='btn px-4 py-2 border border-red-500 text-red-500 rounded-lg font-medium' onClick={() => onDelete(task.id)}>
                                Delete
                            </button>
                        )}
                        <button type='submit' className='btn btn-primary px-4 py-2 text-white rounded-lg font-medium ml-auto'>
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Calendar;