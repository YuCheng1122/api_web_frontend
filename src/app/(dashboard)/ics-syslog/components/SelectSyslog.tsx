
export default function SelectSyslog(props: any) {
    const { props: mock, filter } = props;
    //unique device
    const uniqueDevice = mock.reduce((acc: Set<string>, curr: any) => {
        acc.add(curr.device);
        return acc;
    }, new Set<string>());
    //unique severity
    const uniqueSeverity = mock.reduce((acc: Set<string>, curr: any) => {
        acc.add(curr.severity);
        return acc;
    }, new Set<string>());
    return (
        <div>
            <label htmlFor="device">選擇設備:</label>
            <select name="device" id="" onChange={(e) => filter(e.target.value, 'device')} defaultValue={'all'}>
                {
                    Array.from(uniqueDevice as Set<string>).map((item: string, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))
                }
                <option value="all" disabled>全部</option>
            </select>
            <label htmlFor="severity">選擇嚴重性:</label>
            <select name="severity" id="" onChange={(e) => filter(e.target.value, 'severity')} defaultValue={'all'}>
                {
                    Array.from(uniqueSeverity as Set<string>).map((item: string, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))
                }
                <option value="all" disabled>全部</option>
            </select>
            <button onClick={() => {
                filter('', 'all');


            }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >重置</button>
        </div>
    )
}