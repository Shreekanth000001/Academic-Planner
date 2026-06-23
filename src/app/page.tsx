import TaskCard from '@/app/components/TaskCard'

export default async function Home() {
  const response = await fetch("http:localhost:8000/schedules")
  const mockData = await response.json()
  console.log(mockData )

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black text-black dark:text-white">
      <main className="flex w-full flex-col py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col w-full justify-center items-center">
          <p className="text-4xl font-bold">Welcome To Academic Planner!</p>
          <p className="text-3xl">System Online!</p>
        </div>

        <div className="flex flex-col w-full justify-between mt-10">
          {
            mockData.map((data : any) => {
              return <TaskCard key={data.id}
                subject={data.title}
                chapter={String(data.is_active)}
                status={data.exam_date}
              />
            })
          }
        </div>
      </main>
    </div>
  );
}
