interface TaskProps {
    subject: string,
    chapter: string,
    status: string
}

export default function TaskCard({ subject, chapter, status }: TaskProps) {
    return (

        <div className="flex flex-row w-full justify-between mt-10 text-center">
                    <p className="w-48">{subject}</p>
                    <p className="w-48">{chapter}</p>
                    <p className={`w-48 rounded-2xl ${status == "completed" ? 'bg-green-400' : 'bg-red-400'}`}>{status}</p>
        </div>
    );
}
