interface ContentSectionProps {
    title: string;
    content: string;
}

export default function ContentSection({ title, content }: ContentSectionProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-black text-sm">{title}</h4>
                <button
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                    Copy
                </button>
            </div>
            <div className="text-sm text-black whitespace-pre-wrap leading-relaxed">
                {content}
            </div>
        </div>
    );
}
