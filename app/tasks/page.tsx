"use client";

import { Icon } from "@/components/Icon";
import { useTasks } from "@/lib/task-context";
import { PersonalTabs } from "@/components/PersonalTabs";
import { BackButton } from "@/components/BackButton";

export default function TasksPage() {
  const { tasks, toggle, setEditingTask, setActiveReminderTask, openCreateModal } = useTasks();

  const taskList = tasks.filter((t) => t.plan_type !== "note" && !t.archived);

  return (
    <div className="clean-screen">
      <header className="clean-screen-header">
        <div className="flex items-center gap-2">
          <BackButton href="/" />
          <h1 className="clean-screen-title">Tasks</h1>
        </div>
        <div className="clean-screen-actions">
          <button
            type="button"
            className="clean-icon-button"
            onClick={() => openCreateModal("task")}
            aria-label="Create task"
          >
            <Icon name="plus" size={20} />
          </button>
        </div>
      </header>

      <div className="mb-3 px-5 sm:px-0">
        <PersonalTabs />
      </div>

      {taskList.length ? (
        <div className="clean-task-list">
          {taskList.map((task) => {
            const reminderInfo = task.details || "07:45 am Expired";
            return (
              <article
                key={task.id}
                onClick={() => setEditingTask(task)}
                className={`clean-task-card ${task.completed ? "completed" : ""}`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(task);
                  }}
                  className={`clean-task-checkbox ${task.completed ? "checked" : ""}`}
                  aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
                >
                  {task.completed && <Icon name="check" size={13} />}
                </button>

                <div className="clean-task-info">
                  <h3 className="clean-task-title">{task.title}</h3>

                  {reminderInfo && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReminderTask(task);
                      }}
                      className="clean-task-reminder-btn"
                      title="View reminder"
                    >
                      <span>{reminderInfo}</span>
                      <Icon name="alarm" size={12} />
                    </button>
                  )}
                </div>

                <span className="text-xs font-semibold text-zinc-400">
                  {task.category}
                </span>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-focus">
          <div>
            <Icon name="list" size={20} />
          </div>
          <b>No tasks yet.</b>
          <span>Add a plan to begin your journey.</span>
          <button type="button" onClick={() => openCreateModal("task")}>
            Create task <Icon name="arrow" size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
