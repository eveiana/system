import { useState, FormEvent, DragEvent } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { Search, Plus, Calendar, User, Trash2, ArrowRight, ArrowLeft, Check, X, Tag, GripVertical } from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export function TasksView({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}: TasksViewProps) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  // Drag and Drop States
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // Add Task Modal Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assigneeName, setAssigneeName] = useState("Evaline Atieno");

  const assigneePool = ["Evaline Atieno", "Alex Kamau", "Zahra Hassan", "Michael Chen", "Sarah Jenkins", "David Ndwiga"];

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleDragStart = (e: DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverColumn(null);
  };

  const handleDrop = (e: DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (id) {
      onUpdateTask(id, { status: targetStatus });
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert("Task Title and Due Date are required!");
      return;
    }

    onAddTask({
      title,
      description,
      priority,
      dueDate,
      assigneeName,
      status: "Todo"
    });

    // Reset
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setAssigneeName("Evaline Atieno");
    setIsModalOpen(false);
  };

  // Helper to shift state
  const handleShiftStatus = (id: string, currentStatus: TaskStatus, direction: 'forward' | 'backward') => {
    const statuses: TaskStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];
    const idx = statuses.indexOf(currentStatus);
    let newIdx = idx;
    if (direction === 'forward' && idx < statuses.length - 1) {
      newIdx = idx + 1;
    } else if (direction === 'backward' && idx > 0) {
      newIdx = idx - 1;
    }
    if (newIdx !== idx) {
      onUpdateTask(id, { status: statuses[newIdx] });
    }
  };

  const getPriorityBadgeColor = (p: TaskPriority) => {
    switch (p) {
      case 'High': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Low': return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };

  const columns: { name: string; status: TaskStatus; bg: string; text: string }[] = [
    { name: "Backlog / Todo", status: "Todo", bg: "bg-zinc-50 border-zinc-100", text: "text-zinc-500" },
    { name: "In Progress", status: "In Progress", bg: "bg-indigo-50/20 border-indigo-100/50", text: "text-indigo-600" },
    { name: "In Review", status: "In Review", bg: "bg-amber-50/20 border-amber-100/50", text: "text-amber-600" },
    { name: "Done", status: "Done", bg: "bg-emerald-50/20 border-emerald-100/50", text: "text-emerald-700" }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Interactive Task Board</h2>
          <p className="text-xs text-zinc-500 mt-1">Assign, plan, and update tasks dynamically using Kanban cards.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Task Card
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search tasks, descriptions, or users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 shrink-0">
          <Tag className="w-3.5 h-3.5 text-zinc-400" />
          <span>Priority:</span>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Kanban Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.status);
          const isOverCol = dragOverColumn === col.status;
          return (
            <div 
              key={col.status} 
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.status)}
              className={`rounded-2xl border p-4 flex flex-col gap-4 min-h-[500px] transition-all duration-200 ${col.bg} ${
                isOverCol 
                  ? 'ring-2 ring-indigo-500 ring-offset-2 border-indigo-400 bg-indigo-50/40 shadow-md' 
                  : ''
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className={`font-extrabold text-xs uppercase tracking-wider ${col.text}`}>
                  {col.name}
                </span>
                <span className="bg-white text-zinc-500 font-extrabold px-2 py-0.5 border border-zinc-200 rounded-full text-[10px]">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Stack */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[600px]">
                {colTasks.length === 0 ? (
                  <div className={`h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center text-[11px] font-bold p-3 transition-colors ${
                    isOverCol ? 'border-indigo-400 text-indigo-600 bg-indigo-50/50' : 'border-zinc-200/70 text-zinc-400'
                  }`}>
                    <span>Drop cards here</span>
                    <span className="text-[9px] font-normal text-zinc-400 mt-0.5">Drag any card onto this column</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const isDragging = draggedTaskId === task.id;
                    return (
                      <div 
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDragOverColumn(null);
                        }}
                        className={`bg-white p-4 rounded-xl border shadow-xs hover:shadow-md transition-all group flex flex-col gap-3 relative cursor-grab active:cursor-grabbing ${
                          isDragging 
                            ? 'opacity-40 border-indigo-400 ring-2 ring-indigo-300 scale-[0.98]' 
                            : 'border-zinc-100 hover:border-indigo-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-1.5">
                              <GripVertical className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors cursor-grab" />
                              <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${getPriorityBadgeColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTask(task.id);
                              }}
                              className="text-zinc-300 hover:text-rose-500 transition-colors p-1 rounded hover:bg-rose-50 cursor-pointer"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h4 className="font-bold text-zinc-800 text-xs mt-2 group-hover:text-indigo-600 transition-colors leading-snug">
                            {task.title}
                          </h4>
                          <p className="text-zinc-400 text-[10px] mt-1 font-semibold leading-relaxed line-clamp-2">
                            {task.description}
                          </p>
                        </div>

                        {/* Card Footer info */}
                        <div className="pt-3 border-t border-zinc-50 flex items-center justify-between text-[10px] font-bold text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{task.dueDate}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100">
                            <User className="w-3 h-3 text-zinc-400" />
                            <span className="text-zinc-600 truncate max-w-[60px]">{task.assigneeName}</span>
                          </div>
                        </div>

                        {/* Moving Controls (Dynamic navigation triggers) */}
                        <div className="flex justify-between items-center bg-zinc-50 border border-zinc-100 p-1.5 rounded-lg mt-1 gap-1">
                          <button 
                            disabled={task.status === 'Todo'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShiftStatus(task.id, task.status, 'backward');
                            }}
                            className={`p-1 rounded text-zinc-400 hover:text-zinc-700 disabled:opacity-20 cursor-pointer`}
                            title="Move Back"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[9px] font-bold text-zinc-400 flex items-center gap-1">
                            <GripVertical className="w-2.5 h-2.5 text-zinc-400" />
                            DRAG / SHIFT
                          </span>
                          <button 
                            disabled={task.status === 'Done'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShiftStatus(task.id, task.status, 'forward');
                            }}
                            className={`p-1 rounded text-zinc-400 hover:text-zinc-700 disabled:opacity-20 cursor-pointer`}
                            title="Move Forward"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-extrabold text-zinc-800 text-sm">Create New Task Card</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-4 text-xs font-semibold text-zinc-600">
              <div className="space-y-1.5">
                <label className="block text-zinc-500">Task Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Design Landing Banner Assets"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-zinc-500">Brief Description</label>
                <textarea 
                  rows={3}
                  placeholder="What needs to be done? Include key details or expectations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Task Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Due Date</label>
                  <input 
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-zinc-500">Assign To Partner</label>
                <select 
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800"
                >
                  {assigneePool.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-zinc-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-indigo-600/15"
                >
                  Create Task Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
