import TaskCard, { ScheduleProps } from '@/app/components/TaskCard';
import UploadForm from '@/app/components/UploadForm';

import { auth } from "@clerk/nextjs/server";

async function getSchedules(): Promise<ScheduleProps[]> {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      throw new Error("No token found. User is not authenticated.");
    }

    const res = await fetch("http://localhost:8000/schedules", 
      { cache: 'no-store',
        headers:{
          Authorization : `Bearer ${token}`
        }
       });

    if (!res.ok) 
      { throw new Error("Bad response from backend") }

    return res.json()
  }

  catch (e) {
    console.log(e)
    return []
  }
}

export default async function Home() {
  const schedules = await getSchedules();

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Academic Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your study schedules and upload new course syllabi.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Upload Form */}
        <div className="lg:col-span-1">
          <UploadForm />
        </div>

        {/* Right Column: Data Table */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Your Schedules</h2>
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                {schedules.length} Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-950 text-xs uppercase text-gray-400 border-b border-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">ID</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Course Title</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Uploaded</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Exam Date</th>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {schedules.length > 0 ? (
                    schedules.map((schedule,index) => (
                      <TaskCard
                        key={schedule.id}
                        id={schedule.id}
                        index={index+1}
                        title={schedule.title}
                        is_active={schedule.is_active}
                        exam_date={schedule.exam_date}
                        created_at={schedule.created_at}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No schedules found. Upload a syllabus to generate your first plan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}