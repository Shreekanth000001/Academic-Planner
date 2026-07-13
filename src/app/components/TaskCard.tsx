"use client"

import Link from "next/link"; 
import DeleteButton from "@/app/components/DeleteButton"

export interface ScheduleProps{
  id:string;
  title:string;
  exam_date:string;
  is_active:boolean;
  created_at:string;
}

export default function TaskCard({id,title,exam_date,is_active,created_at} : ScheduleProps){

  const formattedExamDate = new Date(exam_date).toLocaleDateString()
  const formattedCreatedDate = new Date(created_at).toLocaleDateString()
  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 font-mono text-xs text-gray-400 whitespace-nowrap">
        {id.split('-')[0]}
      </td>
      <td className="px-6 py-4 font-medium text-gray-200">
        {title}
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formattedCreatedDate}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          is_active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-700 text-gray-300'
        }`}>
          {is_active ? 'Active' : 'Archived'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-300">
        {formattedExamDate}
      </td>
      <td className="pr-3 py-4 text-right">
          <Link className="font-medium text-indigo-400 text-center hover:text-indigo-300 hover:underline transition-colors" href={`/view-task/${id}`}> View Tasks </Link>
      </td>
<td><DeleteButton scheduleId={id} /></td>
    </tr>
  )
}