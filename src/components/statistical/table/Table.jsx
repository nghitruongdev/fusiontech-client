/** @format */

import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import Image from 'next/image'

const List = () => {
  const rows = [
    {
      id: 1143155,
      product: 'Acer Nitro 5',
      img: 'https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg',
      customer: 'John Smith',
      date: '1 March',
      amount: 785,
      method: 'Cash on Delivery',
      status: 'Approved',
    },
    {
      id: 2235235,
      product: 'Playstation 5',
      img: 'https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg',
      customer: 'Michael Doe',
      date: '1 March',
      amount: 900,
      method: 'Online Payment',
      status: 'Pending',
    },
    {
      id: 2342353,
      product: 'Redragon S101',
      img: 'https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg',
      customer: 'John Smith',
      date: '1 March',
      amount: 35,
      method: 'Cash on Delivery',
      status: 'Pending',
    },
    {
      id: 2357741,
      product: 'Razer Blade 15',
      img: 'https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg',
      customer: 'Jane Smith',
      date: '1 March',
      amount: 920,
      method: 'Online',
      status: 'Approved',
    },
    {
      id: 2342355,
      product: 'ASUS ROG Strix',
      img: 'https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg',
      customer: 'Harold Carol',
      date: '1 March',
      amount: 2000,
      method: 'Online',
      status: 'Pending',
    },
  ]
  return (
    <Box
      className='table'
      boxShadow='2px 4px 10px 1px rgba(0, 0, 0, 0.47)'
      padding='10px'
      color='gray'>
      <Paper>
        <Table>
          <Thead>
            <Tr>
              <Th className='tableCell'>Tracking ID</Th>
              <Th className='tableCell'>Product</Th>
              <Th className='tableCell'>Customer</Th>
              <Th className='tableCell'>Date</Th>
              <Th className='tableCell'>Amount</Th>
              <Th className='tableCell'>Payment Method</Th>
              <Th className='tableCell'>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row) => (
              <Tr key={row.id}>
                <Td className='tableCell'>{row.id}</Td>
                <Td className='tableCell'>
                  <Box
                    display='flex'
                    alignItems='center'>
                    <Image
                      src={row.img}
                      alt=''
                      className='image'
                      boxSize='32px'
                      borderRadius='50%'
                      marginRight='10px'
                      objectFit='cover'
                    />
                    <Text>{row.product}</Text>
                  </Box>
                </Td>
                <Td className='tableCell'>{row.customer}</Td>
                <Td className='tableCell'>{row.date}</Td>
                <Td className='tableCell'>{row.amount}</Td>
                <Td className='tableCell'>{row.method}</Td>
                <Td className='tableCell'>
                  <Text
                    className={`status ${row.status}`}
                    padding='5px'
                    borderRadius='5px'>
                    {row.status}
                  </Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Paper>
    </Box>
  )
}

export default List
