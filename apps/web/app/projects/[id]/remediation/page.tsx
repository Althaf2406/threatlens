"use client";

import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectRemediation, updateRemediationTask } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

export default function RemediationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projData, tasksData] = await Promise.all([
        getProject(projectId),
        getProjectRemediation(projectId)
      ]);
      
      setProject(projData);
      setTasks(tasksData);
    } catch (err: any) {
      setError(err.message || "Failed to load remediation tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      setUpdatingTaskId(taskId);
      await updateRemediationTask(projectId, taskId, newStatus);
      
      // Update local state instead of full reload for snappiness
      setTasks(currentTasks => 
        currentTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update task status. Please try again.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Remediation Tracker" subtitle="Loading tasks...">
        <LoadingState message="Loading remediation tasks..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Remediation Tracker" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  const groupedTasks = {
    open: tasks.filter(t => t.status === 'open'),
    inProgress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'fixed' || t.status === 'accepted_risk' || t.status === 'dismissed')
  };

  const getPriorityColor = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-500/10';
      case 'medium': return 'text-orange-400 bg-orange-500/10';
      case 'low': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const renderTaskColumn = (title: string, columnTasks: any[]) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
          {columnTasks.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-3">
        {columnTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-4 text-center">
            <p className="text-sm text-slate-500">No tasks</p>
          </div>
        ) : (
          columnTasks.map(task => (
            <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-white text-sm">{task.title}</h4>
                <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 line-clamp-2" title={task.description}>
                {task.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 truncate max-w-[120px]">
                  Finding: {task.findingId}
                </span>
                
                <select
                  disabled={updatingTaskId === task.id}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className={`text-xs rounded border border-slate-700 bg-slate-950 px-2 py-1 text-slate-300 focus:outline-none focus:border-blue-500 ${updatingTaskId === task.id ? 'opacity-50' : ''}`}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="fixed">Fixed</option>
                  <option value="accepted_risk">Risk Accepted</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Remediation Tracker"
      subtitle="Track and manage security fixes and accepted risks."
      tokenUsed={project.tokenUsed}
    >
      {tasks.length === 0 ? (
        <EmptyState 
          title="No remediation tasks" 
          message="No tasks have been generated for this project yet. Run scans to identify issues."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {renderTaskColumn("To Do", groupedTasks.open)}
          {renderTaskColumn("In Progress", groupedTasks.inProgress)}
          {renderTaskColumn("Completed", groupedTasks.completed)}
        </div>
      )}
    </ProjectShell>
  );
}