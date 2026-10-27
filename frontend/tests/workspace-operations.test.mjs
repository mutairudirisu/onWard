import assert from "node:assert/strict";
import test from "node:test";
import {
  loadFolderDocuments,
  moveDocumentToFolder,
  loadDocumentShares,
  shareDocumentWithMember,
  documentColumns,
} from "../lib/workspace-operations.js";

const sampleDoc = {
  id: "doc-1",
  workspace_id: "ws-1",
  folder_id: "f-1",
  project_id: "wp-1",
  title: "Map Campaign User Journey",
  content: "User flow specification",
  updated_at: "Sept 23",
  owner_id: "demo-user",
  owner_name: "You",
  is_shared: true,
  priority: "high",
  tags: ["Research", "Product", "Content"],
  file_count: 2,
  comments_count: 3,
};

test("loadFolderDocuments filters by folder_id and returns persisted columns", async () => {
  let queriedTable, queriedCols, filterField, filterVal;
  const client = {
    from: (table) => {
      queriedTable = table;
      return {
        select: (cols) => {
          queriedCols = cols;
          return {
            eq: (field, val) => {
              filterField = field;
              filterVal = val;
              return {
                order: () => Promise.resolve({ data: [sampleDoc], error: null }),
              };
            },
          };
        },
      };
    },
  };

  const results = await loadFolderDocuments(client, "f-1");
  assert.deepEqual(results, [sampleDoc]);
  assert.equal(queriedTable, "workspace_documents");
  assert.equal(queriedCols, documentColumns);
  assert.equal(filterField, "folder_id");
  assert.equal(filterVal, "f-1");
});

test("loadFolderDocuments handles empty results and propagates failures", async () => {
  const emptyClient = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
  };
  const failedClient = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: null, error: new Error("network disconnect") }),
        }),
      }),
    }),
  };

  assert.deepEqual(await loadFolderDocuments(emptyClient, "f-none"), []);
  await assert.rejects(() => loadFolderDocuments(failedClient, "f-1"), /network disconnect/);
});

test("moveDocumentToFolder updates folder_id and returns updated row", async () => {
  let updatedPayload, targetId;
  const client = {
    from: () => ({
      update: (payload) => {
        updatedPayload = payload;
        return {
          eq: (field, id) => {
            targetId = id;
            return {
              select: () => ({
                single: () => Promise.resolve({ data: { ...sampleDoc, folder_id: payload.folder_id }, error: null }),
              }),
            };
          },
        };
      },
    }),
  };

  const result = await moveDocumentToFolder(client, { documentId: "doc-1", folderId: "f-2" });
  assert.equal(updatedPayload.folder_id, "f-2");
  assert.equal(targetId, "doc-1");
  assert.equal(result.folder_id, "f-2");
});

test("moveDocumentToFolder propagates database update failures", async () => {
  const failedClient = {
    from: () => ({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: new Error("RLS update policy violation") }),
          }),
        }),
      }),
    }),
  };

  await assert.rejects(
    () => moveDocumentToFolder(failedClient, { documentId: "doc-1", folderId: "f-2" }),
    /RLS update policy violation/
  );
});

test("loadDocumentShares and shareDocumentWithMember persist invited collaborators", async () => {
  const sampleShare = {
    id: "ds-1",
    document_id: "doc-1",
    email: "sara.tech@company.com",
    permission: "editor",
    granted_at: "2026-10-25",
  };

  const client = {
    from: (table) => {
      if (table === "document_shares") {
        return {
          select: () => ({
            eq: () => Promise.resolve({ data: [sampleShare], error: null }),
          }),
          upsert: (payload) => ({
            select: () => ({
              single: () => Promise.resolve({ data: { id: "ds-new", ...payload }, error: null }),
            }),
          }),
        };
      }
      throw new Error(`Unexpected table ${table}`);
    },
  };

  const shares = await loadDocumentShares(client, "doc-1");
  assert.deepEqual(shares, [sampleShare]);

  const newShare = await shareDocumentWithMember(client, {
    documentId: "doc-1",
    email: "alex.qa@company.com",
    permission: "viewer",
  });
  assert.equal(newShare.email, "alex.qa@company.com");
  assert.equal(newShare.permission, "viewer");
});
