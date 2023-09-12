/** @format */

'use client'
import productAPI from '@/client-api/productAPI'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IProduct } from 'types'
import SearchResult from '../../search-result'

const Page = () => {
  const [searchResults, setSearchResults] = useState<IProduct[]>([])
  const { slug } = useParams()

  useEffect(() => {
    const slugStr = slug as string
    const bid = slugStr.substring(0, slugStr.indexOf('-'))
    const fetchSearchResults = async () => {
      try {
        const responseByCid = await productAPI.searchByBrandId(bid)
        setSearchResults(responseByCid.data._embedded.products)
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
    }
    fetchSearchResults()
  }, [slug])
  return <SearchResult items={searchResults} />
}
export default Page
