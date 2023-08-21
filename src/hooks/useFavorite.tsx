/** @format */

'use client'
import React, { useEffect, useState } from 'react'
import useMyToast from '@/hooks/useToast'
import { IProduct } from 'types'
import { API } from 'types/constants'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useAuthUser } from './useAuth/useAuthUser'
import { springDataProvider } from '@/providers/rest-data-provider'
import { toRecord } from '@/lib/utils'
import favoriteApi from 'src/client-api/favoriteAPI'
import { useRouter } from 'next/navigation'
import { useCurrentUrl } from '../lib/utils'
import { useHeaders } from '@/hooks/useHeaders'
import { onError } from './useCrudNotification'

const useFavorite = () => {
  const router = useRouter()
  const { user, claims, userProfile } = useAuthUser() // Lấy thông tin user từ hook useAuthUser
  const { getAuthHeader } = useHeaders()

  const uid = claims?.id ?? userProfile?.id
  const toast = useMyToast()
  const [addFavorite, removeFavorite, isFavorite] = useFavoriteStore(
    ({ addFavorite, removeFavorite, isFavorite }) => [
      addFavorite,
      removeFavorite,
      isFavorite,
    ],
  )
  const url = useCurrentUrl()
  // chức năng thêm sản phẩm yêu thích
  const addFavoriteProduct = async (product: IProduct) => {
    if (!user) {
      router.push(`/auth/login?callbackUrl=${url}`)
      return
    }
    try {
      // Gọi API để thêm sản phẩm yêu thích
      await favoriteApi.create(product.id, uid, getAuthHeader())
      addFavorite(product)
      // thể hiện thông báo nhỏ khi thực thi
      toast
        .ok({
          title: 'Thành công',
          message: 'Yêu thích sản phẩm thành công',
        })
        .fire()
    } catch (error) {
      console.log('Failed to toggle favorite', error)
      toast
        .fail({
          title: 'Thất bại',
          message: 'Yêu thích sản phẩm thất bại',
        })
        .fire()
    }
  }

  // chức năng xóa sản phẩm yêu thích
  const deleteFavoriteProduct = async (
    productId: number,
    callBack?: () => void,
  ) => {
    try {
      // Gọi API để xóa sản phẩm yêu thích
      await favoriteApi.delete(productId, uid, getAuthHeader())
      removeFavorite(productId)
      // Cập nhật danh sách sản phẩm yêu thích
      toast
        .ok({
          title: 'Thành công',
          message: 'Hủy yêu thích thành công',
        })
        .fire()
      callBack?.()
    } catch (error) {
      console.log('Failed to toggle favorite', error)
      toast
        .fail({
          title: 'Thất bại',
          message: 'Hủy yêu thích thất bại',
        })
        .fire()
    }
  }
  const checkFavorite = (productId: number) => {
    return isFavorite(productId)
  }
  return {
    addFavoriteProduct,
    deleteFavoriteProduct,
    checkFavorite,
  }
}

export default useFavorite

type State = {
  favoriteProducts: Record<number, IProduct>
  addFavorite: (product: IProduct) => void
  removeFavorite: (productId: number) => void
  isFavorite: (productId: number) => boolean
}

export const useFavoriteStore = create(
  immer<State>((set, get) => ({
    favoriteProducts: {},
    addFavorite: (product) => {
      set(({ favoriteProducts }) => {
        if (!product?.id) return
        favoriteProducts[+product.id] = product
      })
    },
    removeFavorite: (productId) => {
      set(({ favoriteProducts }) => {
        delete favoriteProducts[productId]
      })
    },
    isFavorite: (productId) => {
      return !!get().favoriteProducts[productId]
    },
  })),
)

export const useIsFavoriteProduct = () =>
  useFavoriteStore(({ isFavorite }) => isFavorite)

const { getFavoriteProductsByUser, resource } = API['products']()

const updateUserFavoriteProduct = async (
  userId?: number,
  authHeader?: { Authorization: string },
) => {
  if (!userId) {
    useFavoriteStore.setState(() => ({ favoriteProducts: {} }))
    return
  }
  if (!authHeader)
    return console.warn('AuthHeader not found while fetching favorite products')
  const data = await springDataProvider.custom<IProduct[]>({
    url: getFavoriteProductsByUser(userId),
    method: 'get',
    meta: {
      resource,
    },
    headers: {
      ...authHeader,
    },
  })
  const products = data.data ?? []
  const favoriteProducts = toRecord<IProduct, 'id'>(products, 'id')
  useFavoriteStore.setState(() => ({ favoriteProducts }))
}

export const FavoriteProvider = () => {
  const { userProfile: { id } = {} } = useAuthUser()
  const { getAuthHeader } = useHeaders()
  useEffect(() => {
    updateUserFavoriteProduct(id, getAuthHeader())
  }, [id, getAuthHeader])

  return <></>
}
