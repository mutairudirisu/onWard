"use client";

import { Icon } from "@/components/Icon";
import { BackButton } from "@/components/BackButton";
import { useTasks } from "@/lib/task-context";

export default function ProjectsPage() {
  const { tasks, toggle, setEditingTask, openCreateModal } = useTasks();

  const projects = tasks.filter((t) => t.plan_type === "project" && !t.archived);

  return (
    <section className="simple-screen">
      <div className="screen-heading">
        <div className="flex items-start gap-2">
          <BackButton href="/workspace" />
          <div>
            <p className="eyebrow">PROJECTS</p>
            <h1>Keep moving together.</h1>
            <span>Projects collect the work you want to move forward.</span>
          </div>
        </div>
        <button
          type="button"
          className="create-task"
          onClick={() => openCreateModal("project")}
        >
          <Icon name="plus" /> Create plan
        </button>
      </div>

      {projects.length ? (
        <div className="all-tasks cards">
          {projects.map((proj) => (
            <article
              key={proj.id}
              className={`focus-task ${proj.completed ? "completed" : ""}`}
              onClick={() => setEditingTask(proj)}
            >
              <button
                type="button"
                className="task-check"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(proj);
                }}
                aria-label={`Mark ${proj.title} as ${proj.completed ? "incomplete" : "complete"}`}
              >
                {proj.completed && <Icon name="check" size={14} />}
              </button>
              <div className="task-copy">
                <b>{proj.title}</b>
                <div>
                  <span className={`project-dot ${proj.category.toLowerCase()}`} />
                  <span>{proj.category}</span>
                  {proj.details && <span>· {proj.details}</span>}
                </div>
              </div>
              <span className="task-time">{proj.due_date}</span>
            </article>
          ))}
        </div>
      ) : (
        <div className="project-placeholder">
          <span>ONWARD</span>
          <h2>Every meaningful project starts with one focused task.</h2>
          <button
            type="button"
            className="create-task"
            style={{ marginTop: "18px" }}
            onClick={() => openCreateModal("project")}
          >
            <Icon name="plus" /> Create project
          </button>
        </div>
      )}
    </section>
  );
}
