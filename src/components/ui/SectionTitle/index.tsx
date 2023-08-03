import { cn } from 'components/lib/utils'
import React from 'react'

interface Props {
  title: string
  className?: string
}
const SectionTitle: React.FC<Props> = ({ title, className }) => {
  return (
    <h2
      className={cn(
        'font-bold my-2 md:my-4 lg:mt-10 mx-auto text-3xl',
        className,
      )}
    >{`${title}`}</h2>
  )
}

export default SectionTitle
