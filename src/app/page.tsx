import TaskCard from '@/app/TaskCard'

export default function Home() {
  const mockData = [
    { id: 1, subject: "Database Management", chapter: "CAP Theorem", status: "pending" },
    { id: 2, subject: "Operating System", chapter: "Intro To Processes", status: "completed" },
    { id: 3, subject: "Computer Networks", chapter: "Security", status: "pending" }
  ]

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black text-black dark:text-white">
      <main className="flex w-full flex-col py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col w-full justify-center items-center">
          <p className="text-4xl font-bold">Welcome To Academic Planner!</p>
          <p className="text-3xl">System Online!</p>
        </div>

        <div className="flex flex-col w-full justify-between mt-10">
          {
            mockData.map((data) => {
              return <TaskCard key={data.id}
                subject={data.subject}
                chapter={data.chapter}
                status={data.status}
              />
            })
          }
        </div>
      </main>
    </div>
  );
}
