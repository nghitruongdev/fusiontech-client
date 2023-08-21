/** @format */

'use client'
import productAPI from '@/client-api/productAPI'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IProduct } from 'types'
import SearchResult from './search-result'

export default function Page() {
  const param = useSearchParams() // Lấy keyword từ URL
  const keyword = param.get('keyword')
  const [searchResults, setSearchResults] = useState<IProduct[]>([])

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const responseByKeyword = await productAPI.searchByKeyword(keyword)
        setSearchResults(responseByKeyword.data._embedded.products)
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
    }

    fetchSearchResults()
  }, [keyword])

  return <SearchResult items={searchResults} />
}
