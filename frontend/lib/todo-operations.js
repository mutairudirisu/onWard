export const todoColumns = "id, title, plan_type, details, category, due_date, completed, archived, favorite, position";

/** Database boundary for todos. Keeping it small makes each query testable. */
export async function loadTodos(client) {
  const { data, error } = await client.from("todos").select(todoColumns).order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function saveTodo(client, todo) {
  const { data, error } = await client.from("todos").upsert(todo).select(todoColumns).single();
  if (error) throw error;
  return data;
}

export async function removeTodo(client, id) {
  const { error } = await client.from("todos").delete().eq("id", id);
  if (error) throw error;
}

export async function saveTodoOrder(client, todos) {
  const { data, error } = await client.from("todos").upsert(todos).select(todoColumns);
  if (error) throw error;
  return data ?? [];
}
