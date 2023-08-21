/** @format */

import { addresses } from 'app/api/address/data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { nextUrl, url, body, bodyUsed, referrer } = req
  const {
    basePath,
    password,
    pathname,
    port,
    protocol,
    search,
    searchParams,
    host,
    hostname,
  } = nextUrl

  const path = pathname.substring(pathname.lastIndexOf('/'))

  switch (path) {
    case '/provinces':
      return getProvinces(req)
    case '/districts':
      return getDistricts(req)
    case '/wards':
      return getWards(req)
  }
  //   return NextResponse.json({
  //     url,
  //     basePath,
  //     password,
  //     pathname,
  //     port,
  //     protocol,
  //     search,
  //     searchParams,
  //     host,
  //     hostname,
  //     q: searchParams.get('q'),
  //     path: pathname.substring(pathname.lastIndexOf('/') + 1),
  //   })
  return NextResponse.json('Not found request', {
    status: 404,
  })
}

const fuseOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ['title', 'author.firstName'],
}
const getProvinces = (req: NextRequest) => {
  const provinces = addresses.map((item) => ({ ...item, districts: undefined }))
  return NextResponse.json(provinces)
}

const getDistricts = (req: NextRequest) => {
  const search = req.nextUrl.searchParams.get('query') ?? ''
  const districts = addresses
    .find((item) => item.code === +search)
    ?.districts.map((item) => ({ ...item, wards: item.wards?.length }))
  return NextResponse.json(districts, { status: districts?.length ? 200 : 404 })
}

const getWards = (req: NextRequest) => {
  const search = req.nextUrl.searchParams.get('query') ?? ''
  const wards = addresses
    .flatMap(
      ({ districts }) => districts.find(({ code }) => code === +search)?.wards,
    )
    .filter((item) => !!item)
  return NextResponse.json(wards, {
    status: !!wards?.length ? 200 : 404,
  })
}
