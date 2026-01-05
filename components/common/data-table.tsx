"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

interface DataTableProps {
  columns: {
    key: string
    label: string
    width?: string
  }[]
  data: Record<string, any>[]
  searchableFields?: string[]
  actions?: (row: Record<string, any>) => React.ReactNode
}

export function DataTable({ columns, data, searchableFields = [], actions }: DataTableProps) {
  const [search, setSearch] = useState("")

  const filteredData = useMemo(() => {
    if (!search) return data

    return data.filter((row) =>
      searchableFields.some((field) => String(row[field]).toLowerCase().includes(search.toLowerCase())),
    )
  }, [search, data, searchableFields])

  return (
    <div className="space-y-4">
      {searchableFields.length > 0 && (
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      )}

      <div className="rounded-lg border border-border overflow-hidden shadow-neumorphic">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold text-foreground" style={{ width: col.width }}>
                  {col.label}
                </TableHead>
              ))}
              {actions && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-muted/50">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-foreground">
                      {row[col.key]}
                    </TableCell>
                  ))}
                  {actions && <TableCell>{actions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
