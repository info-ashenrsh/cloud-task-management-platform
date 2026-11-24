
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async (request) => {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const id = segments.at(-1) === "tasks" ? null : segments.at(-1);

    // GET: Retrieve all tasks or one task
    if (request.method === "GET") {
      let query = supabase.from("tasks").select("*");

      if (id) query = query.eq("id", id);

      const { data, error } = await query;

      if (error) throw error;

      if (id && data.length === 0) {
        return Response.json({ message: "Task not found" }, { status: 404 });
      }

      return Response.json(id ? data[0] : data);
    }

    // POST: Create a task
    if (request.method === "POST") {
      const body = await request.json();

      const { data, error } = await supabase
        .from("tasks")
        .insert([{
          title: body.title,
          description: body.description || "",
          status: body.status || "Pending",
          priority: body.priority || "Medium"
        }])
        .select()
        .single();

      if (error) throw error;

      return Response.json(data, { status: 201 });
    }

    // PUT: Update a task
    if (request.method === "PUT" && id) {
      const body = await request.json();

      const { data, error } = await supabase
        .from("tasks")
        .update(body)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return Response.json(data);
    }

    // DELETE: Delete a task
    if (request.method === "DELETE" && id) {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return Response.json({ message: "Task deleted successfully" });
    }

    return Response.json(
      { message: "Method not allowed" },
      { status: 405 }
    );

  } catch (error) {
    console.error("Tasks API error:", error);

    return Response.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
};
