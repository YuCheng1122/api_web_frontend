type Mitre = {
    name: string;
    count: number;
};
export default function MitreList(props: { mitres: Mitre[] }) {
    const { mitres } = props;
    console.log(mitres);

    return (
        <div className="max-w-sm w-full mx-auto bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">MITRE ATT&CK</h2>
                <a href="#" className="text-blue-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </a>
            </div>
            <div className="mt-4">
                <h3 className="text-md font-bold">Top Tactics</h3>
                <ul className="mt-2 space-y-2">
                    {mitres.map((mitre, index) => (
                        <li key={index} className="flex justify-between items-center">
                            <span>{mitre.name}</span>
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">
                                {mitre.count}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}