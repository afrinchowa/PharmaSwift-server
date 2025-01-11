import PDFDocument from 'pdfkit';
import { IOrder } from '../modules/order/order.interface';

/**
 * Generates a PDF invoice for an order.
 * @param {IOrder} order - The order object to generate the invoice for.
 * @returns {Promise<Buffer>} - The generated PDF as a Buffer.
 */
export const generateOrderInvoicePDF = async (order: IOrder): Promise<Buffer> => {
    return new Promise<Buffer>((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];
        //@ts-ignore
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err: Error) => reject(err));

        // Header with graphical design
        doc.fontSize(20).fillColor('#000000').text('Invoice', { align: 'center' });
        doc.fontSize(16).font('Helvetica-Bold').fillColor('#003366').text('NextMert', { align: 'center' });
        doc.moveDown(1);
        doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();  // Horizontal line under header
        doc.moveDown(2);

        // Invoice Details
        doc.fontSize(12).fillColor('#000000').text(`Invoice ID: ${order._id}`);
        doc.text(`Order Date: ${(order.createdAt as Date).toLocaleDateString()}`);
        doc.moveDown(1);
        //@ts-ignore
        doc.text(`Customer: ${order.user.name}`);
        doc.text(`Shipping Address: ${order.shippingAddress}`);
        doc.moveDown(2);

        // Payment Details with graphical design
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#003366').text('Payment Details:', { underline: true });
        doc.text(`Payment Status: ${order.paymentStatus}`);
        doc.text(`Payment Method: ${order.paymentMethod}`);
        doc.moveDown(2);
        doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();  // Horizontal line

        // Order Products in a table format
        doc.moveDown(2);
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#003366').text('Order Products:', { underline: true });
        doc.moveDown(1);

        const tableTop = doc.y;
        const tableHeight = 20;

        // Table Headers for Products (Bold and Colored)
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#003366').text('Product Name', 50, tableTop);
        doc.text('Quantity', 300, tableTop);
        doc.text('Price', 450, tableTop);

        doc.lineWidth(0.5).moveTo(50, tableTop + tableHeight).lineTo(550, tableTop + tableHeight).stroke(); // Table header line
        let currentY = tableTop + tableHeight + 5;

        // Order Products (Normal text, not bold)
        order.products.forEach((item) => {
            //@ts-ignore
            const productName = item.product?.name || 'Unknown Product';
            const quantity = item.quantity;
            //@ts-ignore
            const price = item.product?.price || 0;

            doc.fontSize(12).fillColor('#000000').text(productName, 50, currentY, { width: 130, align: 'left' });
            doc.text(quantity.toString(), 280, currentY, { width: 90, align: 'center' });
            doc.text(price.toFixed(2), 400, currentY, { width: 90, align: 'right' });
            currentY += tableHeight;
        });

        // Final Table Border
        doc.lineWidth(0.5).moveTo(50, currentY).lineTo(550, currentY).stroke();

        doc.moveDown(2);

        // Pricing Breakdown in a table format
        doc.moveDown(1);

        const pricingTableTop = doc.y;

        // Table Headers for Pricing (Bold and Colored)
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#003366').text('Description', 50, pricingTableTop);
        doc.text('Amount', 450, pricingTableTop);

        doc.lineWidth(0.5).moveTo(50, pricingTableTop + tableHeight).lineTo(550, pricingTableTop + tableHeight).stroke(); // Pricing header line
        let pricingY = pricingTableTop + tableHeight + 5;

        // Pricing Breakdown (Normal text, not bold)
        doc.fontSize(12).fillColor('#000000').text('Sub Total', 50, pricingY, { width: 200 });
        doc.text(`${order.totalAmount.toFixed(2)} /-`, 400, pricingY, { width: 90, align: 'right' });
        pricingY += tableHeight;

        doc.fontSize(12).fillColor('#000000').text('Discount', 50, pricingY, { width: 200 });
        doc.text(`-${order.discount.toFixed(2)} /-`, 400, pricingY, { width: 90, align: 'right' });
        pricingY += tableHeight;

        doc.fontSize(12).fillColor('#000000').text('Delivery Charge', 50, pricingY, { width: 200 });
        doc.text(`${order.deliveryCharge.toFixed(2)} /-`, 400, pricingY, { width: 90, align: 'right' });
        pricingY += tableHeight;

        // Final Amount (Bold and Color)
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#003366').text('Total', 50, pricingY, { width: 200 });
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#003366').text(`${order.finalAmount.toFixed(2)} /-`, 400, pricingY, { width: 90, align: 'right' });
        pricingY += tableHeight;

        // Final Pricing Table Border
        doc.lineWidth(0.5).moveTo(50, pricingY).lineTo(550, pricingY).stroke();

        doc.moveDown(4);
        doc.fontSize(12).fillColor('#003366').text('- NextMert', { align: 'center' });

        // Finalize the document
        doc.end();
    });
};
