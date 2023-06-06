type Amount = {
  amount: Number
}
const FormatPrice = ({amount}:Amount) => {
  const formatted = new Number(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits:0
  })
  return (
  <span>{formatted}</span>
  )
}
export default FormatPrice