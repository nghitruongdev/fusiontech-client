/** @format */

'use client'
import productAPI from '@/API/productAPI'
import { usePathname, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IProduct } from 'types'
import SearchResult from '../../search-result'

const Page = () => {
  const [searchResults, setSearchResults] = useState<IProduct[]>([])
  const { slug } = useParams()

  useEffect(() => {
    const slugStr = slug as string
    const cid = slugStr.substring(0, slugStr.indexOf('-'))
    const fetchSearchResults = async () => {
      try {
        const responseByCid = await productAPI.searchByCategoryId(cid)
        setSearchResults(responseByCid.data._embedded.products)
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
    }
    fetchSearchResults()
  }, [slug])
  console.log(searchResults)
  return <SearchResult items={searchResults} />
}
export default Page
