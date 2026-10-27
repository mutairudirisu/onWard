export const documentColumns = "id, workspace_id, folder_id, project_id, title, content, updated_at, owner_id, owner_name, is_shared, priority, tags, file_count, comments_count";

export async function loadFolderDocuments(client, folderId) {
  const { data, error } = await client
    .from("workspace_documents")
    .select(documentColumns)
    .eq("folder_id", folderId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function moveDocumentToFolder(client, { documentId, folderId }) {
  const { data, error } = await client
    .from("workspace_documents")
    .update({ folder_id: folderId })
    .eq("id", documentId)
    .select(documentColumns)
    .single();
  if (error) throw error;
  return data;
}

export async function loadDocumentShares(client, documentId) {
  const { data, error } = await client
    .from("document_shares")
    .select("id, document_id, email, permission, granted_at")
    .eq("document_id", documentId);
  if (error) throw error;
  return data ?? [];
}

export async function shareDocumentWithMember(client, { documentId, email, permission }) {
  const { data, error } = await client
    .from("document_shares")
    .upsert({ document_id: documentId, email, permission, granted_at: new Date().toISOString().split("T")[0] })
    .select("id, document_id, email, permission, granted_at")
    .single();
  if (error) throw error;
  return data;
}
