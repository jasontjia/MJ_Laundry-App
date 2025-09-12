import React from "react";

interface TableProps {
  headers: string[];
  onHeaderClick?: (index: number) => void;
  children: React.ReactNode;
}


export default function Table({ headers, children }: TableProps) {
  return (
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-800 text-cyan-300">
        <tr>
          {headers.map((h) => (
            <th key={h} className="px-4 py-2 text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
