'use client'
import React, { useEffect, useState } from 'react'
import productAPI from 'src/API/productAPI'
import { IProduct } from 'types'
import { useSearchParams } from 'next/navigation'
import InputSlider from 'react-input-slider'
import NextLinkContainer from '@components/ui/NextLinkContainer'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
const SearchResultPage = () => {
    const param = useSearchParams() // Lấy keyword từ URL
    const keyword = param.get('keyword')
    const [searchResults, setSearchResults] = useState<IProduct[]>([])
    const [filterOptions, setFilterOptions] = useState({
        price: 0,
        category: '',
        color: '',
        brand: '',
        // Add more filter options here as needed
    })

    const colorOptions = [
        { name: 'White', value: 'blue', color: '#FFFFFF' },
        { name: 'Gray', value: 'blue', color: '#808080' },
        { name: 'Black', value: 'blue', color: '#000000' },
        { name: 'Red', value: 'red', color: '#FF0000' },
        { name: 'Blue', value: 'blue', color: '#0000FF' },

        // Add more color options here
    ]

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await productAPI.searchByKeyword(keyword)
                setSearchResults(response.data._embedded.products)
                console.log(keyword)
            } catch (error) {
                console.error('Error fetching search results:', error)
            }
        }

        fetchSearchResults()
    }, [keyword])

    const handleFilter = (values: any) => {
        setFilterOptions({
            ...filterOptions,
            price: values.x,
        })
    }

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-1">
                    <div className="bg-white p-4 rounded-lg">
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Danh mục</label>
                            <select
                                value={filterOptions.category}
                                onChange={(e) =>
                                    setFilterOptions({
                                        ...filterOptions,
                                        category: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Tất cả</option>
                                <option value="category1">Laptop gaming</option>
                                <option value="category2">Laptop</option>
                                <option value="category2">CPU</option>
                                {/* Add more category options here */}
                            </select>
                        </div>

                        <div className="w-full my-5">
                            <hr />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Mức giá</label>
                            <InputSlider
                                axis="x"
                                x={filterOptions.price}
                                xmax={5000}
                                xmin={0}
                                onChange={handleFilter}
                                styles={{
                                    track: {
                                        backgroundColor: '#ccc',
                                        height: '8px',
                                    },
                                    active: {
                                        backgroundColor: '#00f',
                                    },
                                    thumb: {
                                        width: '16px',
                                        height: '16px',
                                        backgroundColor: '#fff',
                                        border: '2px solid #00f',
                                        cursor: 'grab',
                                    },
                                }}
                            />
                            <div className="">
                                <span className="flex items-center">
                                    ${filterOptions.price}
                                </span>
                            </div>
                        </div>
                        <div className="w-full my-5">
                            <hr />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Màu sắc</label>
                            <div className="flex flex-wrap gap-2">
                                {colorOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`w-6 h-6 rounded-full border border-gray-300 ${filterOptions.color === option.value
                                            ? 'border-blue-500'
                                            : ''
                                            }`}
                                        style={{
                                            backgroundColor: option.color,
                                        }}
                                        onClick={() =>
                                            setFilterOptions({
                                                ...filterOptions,
                                                color: option.value,
                                            })
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="w-full my-5">
                            <hr />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Thương hiệu:</label>
                            <select
                                value={filterOptions.brand}
                                onChange={(e) =>
                                    setFilterOptions({
                                        ...filterOptions,
                                        brand: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Tất cả</option>
                                <option value="brand1">MSI</option>
                                <option value="brand2">Lenovo</option>
                                {/* Add more brand options here */}
                            </select>
                        </div>
                        <button
                            onClick={handleFilter}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        >
                            Lọc
                        </button>
                    </div>
                </div>
                <div className="col-span-4">
                    <div className="w-full h-14 mb-2 p-4 bg-white rounded-tl-lg rounded-tr-lg flex items-center space-x-4">
                        <p className="font-semibold text-sm text-gray-600">Sắp xếp theo</p>
                        <button className="border border-gray-300 text-center text-sm rounded-md p-2 hover:bg-gray-100">
                            Khuyến mãi tốt nhất
                        </button>
                        <button className="border border-gray-300 text-center text-sm rounded-md p-2 hover:bg-gray-100">
                            Giá tăng dần
                        </button>
                        <button className="border border-gray-300 text-center text-sm rounded-md p-2 hover:bg-gray-100">
                            Giá giảm dần
                        </button>
                        <button className="border border-gray-300 text-center text-sm rounded-md p-2 hover:bg-gray-100">
                            Sản phẩm bán chạy nhất
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-x-2  gap-y-2 ">
                        {searchResults && searchResults.length > 0 ? (
                            searchResults.map((product) => (
                                <NextLinkContainer
                                    key={uuidv4()}
                                    href={`/products/${product.id}`}
                                >
                                    <div key={product.id} className="p-4 bg-white">
                                        <Image
                                            src={product.images?.[0] ?? ""}
                                            width="100"
                                            height="100"
                                            alt={product.name}
                                            className="w-full h-48 object-cover mt-2 transition-transform transform scale-100 hover:scale-105"
                                        />
                                        <h3 className="text-base font-semibold mb-2 mt-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-blue-700 font-semibold">$2000</p>
                                    </div>
                                </NextLinkContainer>
                            ))
                        ) : (
                            <p>No product found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchResultPage
