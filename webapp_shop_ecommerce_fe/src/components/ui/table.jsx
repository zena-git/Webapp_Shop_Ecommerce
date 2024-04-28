export default function Table(table, flexRender, columns) {
    return (
        <table className="min-w-full border border-slate-500">
            <thead className='ant-table-thead'>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className=''>
                        {headerGroup.headers.map((header) => {
                            return (
                                <th key={header.id} className="ant-table-cell py-5">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            )
                        })}
                    </tr>
                ))}
            </thead>
            <tbody className="bg-slate-50">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-6 py-4 whitespace-nowrap text-gray-500 m-0"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))
                            }
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="px-6 py-4 whitespace-nowrap text-gray-500 text-center"
                        >
                            Không có kết quả nào.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}