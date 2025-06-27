import React, { useEffect } from 'react'
import './team.css'
import Icon from '../SVGs/Icon'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faSearch, faTasks, faTimes, faUser, faUserMinus, faUserPlus, faUserTag } from '@fortawesome/free-solid-svg-icons'

const Team = () => {
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(10px)';
      observer.observe(el);
    });

    const inviteBtn = document.getElementById('invite-btn');
    const inviteModal = document.getElementById('invite-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelInvite = document.getElementById('cancel-invite');
    const inviteForm = document.getElementById('invite-form');

    const openModal = () => {
      inviteModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    const closeModalFunc = () => {
      inviteModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    inviteBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalFunc);
    cancelInvite.addEventListener('click', closeModalFunc);

    inviteModal.addEventListener('click', (e) => {
      if(e.target === inviteModal) {
        closeModalFunc();
      }
    });

    inviteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('invite-email').value;
      const role = document.getElementById('invite-role').value;

    alert(`Invitation sent to ${email} for role: ${role}`)
    })
  }, [])
  
  return (
    <div className='team-bg'>
      <div className='min-h-screen flex flex-col'>
        {/* Top Navigation Bar */}
        <header className='bg-white shadow-sm py-3 px-4 md:px-6'>
          <div className='flex justify-between items-center'>
            {/* Logo and App Name */}
            <div className='flex items-center'>
              <div className='w-10 h-10 flex items-center justify-center mr-3'>
                <Icon></Icon>
              </div>
              <h1 className='text-xl font-semibold text-gray-800 hidden md:block'>Virtual Mentor</h1>
            </div>

            {/* Navigation */}
            <nav className='hidden md:flex items-center space-x-6'>
              <NavLink to="/dashboard" className='text-gray-600 hover:text-gray-900'>Dashboard</NavLink>
              <NavLink to="/calendar" className='text-gray-600 hover:text-gray-900'>Calendar</NavLink>
              <NavLink to="/tasks" className='text-gray-600 hover:text-gray-900'>Tasks</NavLink>
              <NavLink to="/insights" className='text-gray-600 hover:text-gray-900'>Insights</NavLink>
              <NavLink to="/settings" className='text-gray-600 hover:text-gray-900'>Settings</NavLink>
            </nav>

            {/* Profile */}
            <div className='flex items-center space-x-4'>
              <NavLink to="/profile" className='w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer'>
                <span className='text-gray-700 font-medium'>JD</span>
              </NavLink>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='flex-grow p-4 md:p-6'>
          <div className='max-w-6xl mx-auto team-container'>
            {/* Page Header */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 fade-in'>
              <h1 className='text-2xl font-bold text-gray-800 mb-4 md:mb-0'>Team Management</h1>
              <button id='invite-btn' className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center'>
                <FontAwesomeIcon icon={faUserPlus} className='mr-2' />
                <span>Invite New Member</span>
              </button>
            </div>

            {/* Filters and Search */}
            <div className='card p-4 mb-6 fade-in'>
              <div className='flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4'>
                {/* Search Bar */}
                <div className='relative flex-grow'>
                  <input type="text" id='search-input' placeholder='Search team members...' className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500' />
                  <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                </div>

                {/* Role Filter */}
                <div className='w-full md:w-48'>
                  <select id="role-filter" className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'>
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className='w-full md:w-48'>
                  <select id="status-filter" className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'>
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Team Members Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
              {/* Member 1 */}
              <div className='card p-5 member-card fade-in' data-role="admin" data-status="active">
                <div className='flex justify-between'>
                  <div className='flex items-start'>
                    <div className='relative'>
                      <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img src="https://i.pravatar.cc/150?img=32" alt="Jane Doe" className='w-full h-full object-cover' />
                      </div>
                      <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                    </div>

                    <div className='ml-3'>
                      <div className='flex items-center'>
                        <h3 className='font-semibold text-gray-800'>Jane Doe</h3>
                        <span className='ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full'>Admin</span>
                      </div>
                      <p className='text-gray-600 text-sm'>jane.doe@example.com</p>
                    </div>
                  </div>

                  <div className='card-actions'>
                    <div className='dropdown'>
                      <button className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      <div className='dropdown-content'>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUser} className='mr-3 text-gray-500' />
                          <span>View Profile</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faTasks} className='mr-3 text-gray-500' />
                          <span>Assign Task</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserTag} className='mr-3 text-gray-500' />
                          <span>Change Role</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserMinus} className='mr-3 text-gray-500' />
                          <span>Remove</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Summary */}
                <div className='mt-5 pt-4 border-t border-gray-100'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-gray-600'>Tasks</span>
                    <span className='text-sm font-medium text-gray-800'>18/20</span>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress-fill bg-green-500' style={{width: "90%"}}></div>
                  </div>

                  <div className='mt-4 flex justify-between text-sm'>
                    <div>
                      <span className='text-gray-500'>Assigned</span>
                      <p className='font-medium text-gray-800'>20</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Completed</span>
                      <p className='font-medium text-gray-800'>18</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Overdue</span>
                      <p className='font-medium text-gray-800'>0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member 2 */}
               <div className='card p-5 member-card fade-in' data-role="member" data-status="active">
                <div className='flex justify-between'>
                  <div className='flex items-start'>
                    <div className='relative'>
                      <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img src="https://i.pravatar.cc/150?img=12" alt="Alex Chen" className='w-full h-full object-cover' />
                      </div>
                      <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                    </div>

                    <div className='ml-3'>
                      <div className='flex items-center'>
                        <h3 className='font-semibold text-gray-800'>Alex Chen</h3>
                        <span className='ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>Member</span>
                      </div>
                      <p className='text-gray-600 text-sm'>alex.chen@example.com</p>
                    </div>
                  </div>

                  <div className='card-actions'>
                    <div className='dropdown'>
                      <button className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      <div className='dropdown-content'>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUser} className='mr-3 text-gray-500' />
                          <span>View Profile</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faTasks} className='mr-3 text-gray-500' />
                          <span>Assign Task</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserTag} className='mr-3 text-gray-500' />
                          <span>Change Role</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserMinus} className='mr-3 text-gray-500' />
                          <span>Remove</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Summary */}
                <div className='mt-5 pt-4 border-t border-gray-100'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-gray-600'>Tasks</span>
                    <span className='text-sm font-medium text-gray-800'>12/15</span>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress-fill bg-blue-500' style={{width: "80%"}}></div>
                  </div>

                  <div className='mt-4 flex justify-between text-sm'>
                    <div>
                      <span className='text-gray-500'>Assigned</span>
                      <p className='font-medium text-gray-800'>15</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Completed</span>
                      <p className='font-medium text-gray-800'>12</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Overdue</span>
                      <p className='font-medium text-gray-800'>1</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member 3 */}
               <div className='card p-5 member-card fade-in' data-role="member" data-status="offline">
                <div className='flex justify-between'>
                  <div className='flex items-start'>
                    <div className='relative'>
                      <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img src="https://i.pravatar.cc/150?img=68" alt="Michael Johnson" className='w-full h-full object-cover' />
                      </div>
                      <div className='absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-white'></div>
                    </div>

                    <div className='ml-3'>
                      <div className='flex items-center'>
                        <h3 className='font-semibold text-gray-800'>Michael Johnson</h3>
                        <span className='ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>Member</span>
                      </div>
                      <p className='text-gray-600 text-sm'>michael.j@example.com</p>
                    </div>
                  </div>

                  <div className='card-actions'>
                    <div className='dropdown'>
                      <button className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      <div className='dropdown-content'>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUser} className='mr-3 text-gray-500' />
                          <span>View Profile</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faTasks} className='mr-3 text-gray-500' />
                          <span>Assign Task</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserTag} className='mr-3 text-gray-500' />
                          <span>Change Role</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserMinus} className='mr-3 text-gray-500' />
                          <span>Remove</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Summary */}
                <div className='mt-5 pt-4 border-t border-gray-100'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-gray-600'>Tasks</span>
                    <span className='text-sm font-medium text-gray-800'>8/12</span>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress-fill bg-blue-500' style={{width: "66.67%"}}></div>
                  </div>

                  <div className='mt-4 flex justify-between text-sm'>
                    <div>
                      <span className='text-gray-500'>Assigned</span>
                      <p className='font-medium text-gray-800'>12</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Completed</span>
                      <p className='font-medium text-gray-800'>8</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Overdue</span>
                      <p className='font-medium text-gray-800'>2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member 4 */}
              <div className='card p-5 member-card fade-in' data-role="guest" data-status="active">
                <div className='flex justify-between'>
                  <div className='flex items-start'>
                    <div className='relative'>
                      <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img src="https://i.pravatar.cc/150?img=25" alt="Sarah Williams" className='w-full h-full object-cover' />
                      </div>
                      <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                    </div>

                    <div className='ml-3'>
                      <div className='flex items-center'>
                        <h3 className='font-semibold text-gray-800'>Sarah Williams</h3>
                        <span className='ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full'>Guest</span>
                      </div>
                      <p className='text-gray-600 text-sm'>sarah.w@example.com</p>
                    </div>
                  </div>

                  <div className='card-actions'>
                    <div className='dropdown'>
                      <button className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      <div className='dropdown-content'>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUser} className='mr-3 text-gray-500' />
                          <span>View Profile</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faTasks} className='mr-3 text-gray-500' />
                          <span>Assign Task</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserTag} className='mr-3 text-gray-500' />
                          <span>Change Role</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserMinus} className='mr-3 text-gray-500' />
                          <span>Remove</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Summary */}
                <div className='mt-5 pt-4 border-t border-gray-100'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-gray-600'>Tasks</span>
                    <span className='text-sm font-medium text-gray-800'>5/5</span>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress-fill bg-green-500' style={{width: "100%"}}></div>
                  </div>

                  <div className='mt-4 flex justify-between text-sm'>
                    <div>
                      <span className='text-gray-500'>Assigned</span>
                      <p className='font-medium text-gray-800'>5</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Completed</span>
                      <p className='font-medium text-gray-800'>5</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Overdue</span>
                      <p className='font-medium text-gray-800'>0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member 5 */}
              <div className='card p-5 member-card fade-in' data-role="admin" data-status="offline">
                <div className='flex justify-between'>
                  <div className='flex items-start'>
                    <div className='relative'>
                      <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img src="https://i.pravatar.cc/150?img=53" alt="Robert Taylor" className='w-full h-full object-cover' />
                      </div>
                      <div className='absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-white'></div>
                    </div>

                    <div className='ml-3'>
                      <div className='flex items-center'>
                        <h3 className='font-semibold text-gray-800'>Robert Taylor</h3>
                        <span className='ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full'>Admin</span>
                      </div>
                      <p className='text-gray-600 text-sm'>robert.t@example.com</p>
                    </div>
                  </div>

                  <div className='card-actions'>
                    <div className='dropdown'>
                      <button className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      <div className='dropdown-content'>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUser} className='mr-3 text-gray-500' />
                          <span>View Profile</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faTasks} className='mr-3 text-gray-500' />
                          <span>Assign Task</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserTag} className='mr-3 text-gray-500' />
                          <span>Change Role</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserMinus} className='mr-3 text-gray-500' />
                          <span>Remove</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Summary */}
                <div className='mt-5 pt-4 border-t border-gray-100'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-gray-600'>Tasks</span>
                    <span className='text-sm font-medium text-gray-800'>14/18</span>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress-fill bg-blue-500' style={{width: "77.78%"}}></div>
                  </div>

                  <div className='mt-4 flex justify-between text-sm'>
                    <div>
                      <span className='text-gray-500'>Assigned</span>
                      <p className='font-medium text-gray-800'>18</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Completed</span>
                      <p className='font-medium text-gray-800'>14</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Overdue</span>
                      <p className='font-medium text-gray-800'>1</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member 6 */}
              <div className='card p-5 member-card fade-in' data-role="member" data-status="active">
                <div className='flex justify-between'>
                  <div className='flex items-start'>
                    <div className='relative'>
                      <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img src="https://i.pravatar.cc/150?img=44" alt="Emily Davis" className='w-full h-full object-cover' />
                      </div>
                      <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                    </div>

                    <div className='ml-3'>
                      <div className='flex items-center'>
                        <h3 className='font-semibold text-gray-800'>Emily Davis</h3>
                        <span className='ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>Member</span>
                      </div>
                      <p className='text-gray-600 text-sm'>emily.d@example.com</p>
                    </div>
                  </div>

                  <div className='card-actions'>
                    <div className='dropdown'>
                      <button className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      <div className='dropdown-content'>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUser} className='mr-3 text-gray-500' />
                          <span>View Profile</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faTasks} className='mr-3 text-gray-500' />
                          <span>Assign Task</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserTag} className='mr-3 text-gray-500' />
                          <span>Change Role</span>
                        </a>
                        <a href="#" className='dropdown-item text-gray-700'>
                          <FontAwesomeIcon icon={faUserMinus} className='mr-3 text-gray-500' />
                          <span>Remove</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Summary */}
                <div className='mt-5 pt-4 border-t border-gray-100'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-gray-600'>Tasks</span>
                    <span className='text-sm font-medium text-gray-800'>9/14</span>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress-fill bg-blue-500' style={{width: "64.29%"}}></div>
                  </div>

                  <div className='mt-4 flex justify-between text-sm'>
                    <div>
                      <span className='text-gray-500'>Assigned</span>
                      <p className='font-medium text-gray-800'>14</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Completed</span>
                      <p className='font-medium text-gray-800'>9</p>
                    </div>
                    <div>
                      <span className='text-gray-500'>Overdue</span>
                      <p className='font-medium text-gray-800'>3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* No Results Message */}
            <div id='no-results' className='hidden text-center py-10'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center'>
                <FontAwesomeIcon icon={faSearch} className='text-gray-400 text-xl' />
              </div>
              <h3 className='text-lg font-medium text-gray-800 mb-1'>No team members found</h3>
              <p className='text-gray-600'>Try adjusting your search or filter criteria</p>
            </div>
          </div>
        </main>
      </div>

      {/* Invite Member Modal */}
      <div id="invite-modal" className='modal'>
        <div className='modal-content card p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold text-gray-800'>Invite New Member</h2>
            <button id='close-modal' className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <form id='invite-form'>
            <div className='mb-4'>
              <label htmlFor="invite-email" className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
              <input type="email" id="invite-email" placeholder='colleague@example.com' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500' />
            </div>

            <div className='mb-4'>
              <label htmlFor="invite-role" className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
              <select id="invite-role" className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            <div className='mb-6'>
              <label htmlFor="invite-message" className='block text-sm font-medium text-gray-700 mb-1'>Personal Message (Optional)</label>
              <textarea id="invite-message" rows="3" placeholder='Join our team to collaborate on projects...' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'></textarea>
            </div>

            <div className='flex justify-end space-x-3'>
              <button type='button' id='cancel-invite' className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>Cancel Invitation</button>
              <button type='submit' className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'>Send Invitation</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Team
