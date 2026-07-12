import { auth } from "@clerk/nextjs/server";

import ChatBox from "@/app/components/ChatBox"

export interface StudyTask {
  id: string;
  schedule_id: string;
  topic_name: string;
  assigned_date: string;
  order_index: number;
  estimated_minutes: number;
}


export interface ViewTaskResponse {
  upload_id: string;
  tasks: StudyTask[]; 
}

interface PageProps {
  params: Promise<{
    id: string;
  }>
}

async function get_tasks(schedule_id: string): Promise<ViewTaskResponse> {
  try {
     const { getToken } = await auth();
    const token = await getToken();
    
    const response = await fetch(`http://localhost:8000/viewtask?schedule_id=${schedule_id}`, { 
      cache: 'no-store' ,
      headers:{
        Authorization : `Bearer ${token}`
      }

    });
    if (!response.ok) {
      throw new Error("Failed to fetch tasks from backend");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Unable to load tasks");
  }
}

export default async function TaskView({ params }: PageProps) {

  const resolved_params = await params;
  const schedule_id = resolved_params.id;
  const { upload_id, tasks }  = await get_tasks(schedule_id);

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">
      <div className="border-b border-gray-800 pb-3 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white tracking-tight">Assigned Tasks</h2>
        <span className="text-xs text-gray-400 bg-gray-800 px-2.5 py-1 rounded-md font-mono">
          {tasks.length} Total
        </span>
      </div>

      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task: StudyTask) => {
            const hours = Math.floor(task.estimated_minutes / 60);
            const minutes = task.estimated_minutes % 60;
            const executionTimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            const formattedDate = new Date(task.assigned_date).toLocaleDateString();

            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 border border-gray-800 rounded-xl bg-gray-900 shadow-sm hover:border-indigo-500/50 transition-colors"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 bg-gray-800 text-gray-300 border border-gray-700 rounded-sm font-semibold">
                      Task #{task.order_index}
                    </span>
                    <h4 className="text-sm font-medium text-gray-100">{task.topic_name}</h4>
                  </div>
                  <p className="text-xs text-gray-500">
                    Scheduled: {formattedDate}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                    {executionTimeStr}
                  </span>
                </div>
                
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-xl">
            No study tasks matched this profile query.
          </div>
        )}
      </div>
      <ChatBox uploadId={upload_id}/>
    </div>
  );
}