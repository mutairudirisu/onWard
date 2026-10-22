import assert from "node:assert/strict";
import test from "node:test";
import { loadTodos, removeTodo, saveTodo, saveTodoOrder, todoColumns } from "../lib/todo-operations.js";

const todo = { id: "a", title: "Plan the week", plan_type: "task", details: null, category: "Personal", due_date: "2026-10-22", completed: false, archived: false, favorite: false, position: 0 };

test("loadTodos orders and returns persisted fields", async () => {
  const calls = [];
  const client = { from: (table) => ({ select: (columns) => ({ order: (field, options) => { calls.push({ table, columns, field, options }); return Promise.resolve({ data: [todo], error: null }); } }) }) };
  assert.deepEqual(await loadTodos(client), [todo]);
  assert.deepEqual(calls[0], { table: "todos", columns: todoColumns, field: "position", options: { ascending: true } });
});

test("loadTodos returns an empty list and propagates database failures", async () => {
  const emptyClient = { from: () => ({ select: () => ({ order: () => Promise.resolve({ data: null, error: null }) }) }) };
  const failedClient = { from: () => ({ select: () => ({ order: () => Promise.resolve({ data: null, error: new Error("offline") }) }) }) };
  assert.deepEqual(await loadTodos(emptyClient), []);
  await assert.rejects(() => loadTodos(failedClient), /offline/);
});

test("saveTodo persists plan type, details, completion, archive, and favourite changes with the returned row", async () => {
  let saved;
  const client = { from: () => ({ upsert: (value) => { saved = value; return { select: () => ({ single: () => Promise.resolve({ data: { ...value, completed: true }, error: null }) }) }; } }) };
  const persisted = await saveTodo(client, { ...todo, title: "Edited", completed: true, archived: true, favorite: true });
  assert.equal(saved.title, "Edited");
  assert.equal(saved.plan_type, "task");
  assert.equal(saved.details, null);
  assert.equal(saved.archived, true);
  assert.equal(saved.favorite, true);
  assert.equal(persisted.completed, true);
});

test("saveTodo persists a note plan and its details", async () => {
  let saved;
  const note = { ...todo, id: "note-1", title: "Workshop ideas", plan_type: "note", details: "Ask the community about their goals." };
  const client = { from: () => ({ upsert: (value) => { saved = value; return { select: () => ({ single: () => Promise.resolve({ data: value, error: null }) }) }; } }) };
  assert.deepEqual(await saveTodo(client, note), note);
  assert.deepEqual(saved, note);
});

test("saveTodo persists every supported plan type", async () => {
  const planTypes = ["task", "note", "project", "community"];
  const saved = [];
  const client = { from: () => ({ upsert: (value) => { saved.push(value); return { select: () => ({ single: () => Promise.resolve({ data: value, error: null }) }) }; } }) };
  for (const plan_type of planTypes) {
    const plan = { ...todo, id: `${plan_type}-1`, plan_type, details: `${plan_type} details` };
    assert.deepEqual(await saveTodo(client, plan), plan);
  }
  assert.deepEqual(saved.map(plan => plan.plan_type), planTypes);
});

test("saveTodo, removeTodo, and saveTodoOrder surface failures", async () => {
  const failedSave = { from: () => ({ upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error("save failed") }) }) }) }) };
  const failedDelete = { from: () => ({ delete: () => ({ eq: () => Promise.resolve({ error: new Error("delete failed") }) }) }) };
  const orderClient = { from: () => ({ upsert: (value) => ({ select: () => Promise.resolve({ data: value, error: null }) }) }) };
  await assert.rejects(() => saveTodo(failedSave, todo), /save failed/);
  await assert.rejects(() => removeTodo(failedDelete, todo.id), /delete failed/);
  assert.deepEqual(await saveTodoOrder(orderClient, [{ ...todo, position: 1 }]), [{ ...todo, position: 1 }]);
});
