const PDFDocument = require('pdfkit')

const generateInvoice = (booking, user, tour, res) => {

  const doc = new PDFDocument({
    margin: 50
  })

  res.setHeader(
    'Content-Type',
    'application/pdf'
  )

  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice-${booking._id}.pdf`
  )

  doc.pipe(res)

  // Title
  doc
    .fontSize(26)
    .fillColor('#f97316')
    .text('TravelNest AI', {
      align: 'center'
    })

  doc.moveDown()

  doc
    .fontSize(20)
    .fillColor('black')
    .text('Booking Invoice', {
      align: 'center'
    })

  doc.moveDown(2)

  // Booking Details
  doc
    .fontSize(14)
    .text(`Invoice ID: ${booking._id}`)

  doc.text(`Customer Name: ${user.name}`)

  doc.text(`Customer Email: ${user.email}`)

  doc.text(`Tour: ${tour.title}`)

  doc.text(`Destination: ${tour.location}`)

  doc.text(`Travelers: ${booking.travelers}`)

  doc.text(`Booking Date: ${booking.bookingDate}`)

  doc.text(`Total Amount: ₹${booking.totalPrice}`)

  doc.moveDown(2)

  // Footer
  doc
    .fontSize(16)
    .fillColor('#16a34a')
    .text('Payment Status: SUCCESS')

  doc.moveDown()

  doc
    .fontSize(12)
    .fillColor('gray')
    .text('Thank you for booking with TravelNest AI ✈️', {
      align: 'center'
    })

  doc.end()
}

module.exports = generateInvoice