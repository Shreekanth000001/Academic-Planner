interface TaskProps {
    id: number,
    title: string,
    status: string,
    exam_date: string
}

export default function TaskCard({ id, title, status, exam_date }: TaskProps) {
    return (

        
        <tbody>
            <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {id}
                </th>
                <td className="px-6 py-4">
                    {title}
                </td>
                <td className="px-6 py-4">
                    {status}
                </td>
                <td className={`px-6 py-4 w-48 rounded-2xl ${status == "completed" ? 'bg-green-400' : 'bg-red-400'}`}>
                    {exam_date}
                </td>
                <td className="px-6 py-4">
                    <a href="#" className="font-medium text-fg-brand hover:underline">Edit</a>
                </td>
            </tr>
        </tbody>

    );
}

