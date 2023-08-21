/** @format */

import { addresses } from 'app/api/address/data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const {
    nextUrl: { pathname },
  } = req

  const path = pathname.substring(pathname.lastIndexOf('/'))

  switch (path) {
    case '/provinces':
      return getProvinces()
    case '/districts':
      return getDistricts(req)
    case '/wards':
      return getWards(req)
  }

  return NextResponse.json('Not found request', {
    status: 404,
  })
}

const getProvinces = () => {
  const provinces = addresses.map((item) => ({ ...item, districts: undefined }))
  return NextResponse.json(provinces)
}

const getDistricts = (req: NextRequest) => {
  const {
    nextUrl: { searchParams },
  } = req
  const search = searchParams.get('query') ?? ''
  const districts = addresses
    .find((item) => item.code === +search)
    ?.districts.map((item) => ({ ...item, wards: item.wards?.length }))
  return NextResponse.json(districts, { status: districts?.length ? 200 : 404 })
}

const getWards = (req: NextRequest) => {
  const {
    nextUrl: { searchParams },
  } = req
  const search = searchParams.get('query') ?? ''
  const wards = addresses
    .flatMap(
      ({ districts }) => districts.find(({ code }) => code === +search)?.wards,
    )
    .filter((item) => !!item)
  return NextResponse.json(wards, {
    status: !!wards?.length ? 200 : 404,
  })
}
