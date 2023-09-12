import { Column } from '@tanstack/react-table'

export interface ColumnButtonProps {
  column: Column<any, any>
}

export interface FilterElementProps {
  value: any
  onChange: (value: any) => void
}
