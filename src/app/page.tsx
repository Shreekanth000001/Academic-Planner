

import TaskCard from '@/app/components/TaskCard'

export default async function Home() {
  // const response = await fetch("http:localhost:8000/schedules")
  // const mockData = await response.json()
  // console.log(mockData )



  const mockData = [
    {
      upload_id: '09759f56-67b8-43e9-81c1-b59626841c1a',
      title: 'Systems Programming Core',
      is_active: true,
      created_at: '2026-06-14T07:30:09.471000+00:00',
      user_id: '11111111-2222-3333-4444-555555555555',
      id: '318e26b6-bce1-4b7d-9168-5061d287787a',
      exam_date: '2026-06-14T00:00:00+00:00'
    },
    {
      upload_id: '3e933835-d1f8-489f-9fbf-8011142bc7bb',
      title: 'Systems Programming Core',
      is_active: true,
      created_at: '2026-06-15T06:27:10.958000+00:00',
      user_id: '11111111-2222-3333-4444-555555555555',
      id: '93ad823f-079c-4374-ac24-4dc9def60595',
      exam_date: '2026-06-14T00:00:00+00:00'
    },
    {
      upload_id: '4a1ac9c8-03b1-4236-bbb1-d653edf549f9',
      title: 'Systems Programming Core',
      is_active: true,
      created_at: '2026-06-18T03:56:54.796000+00:00',
      user_id: '11111111-2222-3333-4444-555555555555',
      id: 'e14e68d6-35cf-4a30-8c77-5eec756fcedf',
      exam_date: '2026-06-14T00:00:00+00:00'
    },
    {
      upload_id: 'cb268fcc-4be5-4107-8c39-17cc820115a8',
      title: 'Systems Programming Core',
      is_active: true,
      created_at: '2026-06-22T14:46:35.870554+00:00',
      user_id: '11111111-2222-3333-4444-555555555555',
      id: '602b0c3b-20a6-409b-9c84-6d050c927259',
      exam_date: '2026-06-14T18:30:00+00:00'
    }
  ]

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black text-black dark:text-white">
      <main className="flex w-full flex-col py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col w-full justify-center items-center">
          <p className="text-4xl font-bold">Welcome To Academic Planner!</p>
          <p className="text-3xl">System Online!</p>
        </div>

        <div className="flex flex-col w-full justify-between mt-10">
          <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
            <table className="w-full text-sm text-left rtl:text-right text-body">
              <thead className="bg-neutral-secondary-soft border-b border-default">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Index
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    exam_date
                  </th>
                </tr>
              </thead>
              {
                mockData.map((data: any) => {
                  return <TaskCard key={data.id}
                    id={data.id}
                    title={data.title}
                    status={String(data.is_active)}
                    exam_date={data.exam_date}
                  />
                })
              }
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// 




// 